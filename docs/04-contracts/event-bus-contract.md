---
id: event-bus-contract
status: authoritative
version: 1.1.0
owner: @architecture-council
enforcement: block
last_reviewed: 2026-01-09
next_review: 2027-01-09
supersedes: []
---

# EventBus Contract

## Purpose

This document defines the **public API contract** for the EventBus system in Comity. It specifies the guaranteed interface and behavior that all EventBus implementations must provide.

This is a **Level 4: Contract document**. Breaking changes require major version bump.

**Implementation Note:** This contract is based on the actual EventBus implementation in the codebase. The interface guarantees match the concrete implementation.

## Core Semantics

EventBus is a mechanism for publishing **observational events** - facts that have already occurred.

### Guaranteed Properties

1. **Observational:** Events represent facts that already happened
2. **Non-blocking:** Handlers MUST NOT affect the originating operation
3. **Fire-and-forget:** Handler failures are logged but do not propagate to caller
4. **Parallel execution:** All handlers for an event execute in parallel
5. **Readonly payload:** Handlers receive payload as `Readonly<T>`

## Interface Definition

### Type Definitions

```typescript
import { InternalError } from "../errors/internal.js";

/**
 * Event handler signature
 * @template T - Type of the event payload
 */
export type EventHandler<T> = (payload: Readonly<T>) => void | Promise<void>;

/**
 * EventBus contract interface
 * @template T - Default payload type (unknown for base implementation)
 */
export interface EventBusContract<T> {
  /**
   * Subscribe to an event
   * @param event - Event name to subscribe to
   * @param handler - Function to call when event is emitted
   */
  subscribe(event: string, handler: EventHandler<T>): void;

  /**
   * Emit an event to all subscribers
   * @param event - Event name to emit
   * @param payload - Data to pass to handlers
   * @returns Promise that resolves when all handlers complete
   */
  emit(event: string, payload: T): Promise<void>;
}
```

### Concrete Implementation

The canonical EventBus implementation provides these guarantees:

```typescript
export class EventBus implements EventBusContract<unknown> {
  #handlers = new Map<string, Set<EventHandler<unknown>>>();
  #onError?: (error: InternalError) => void;

  constructor(
    private readonly options: {
      errorHandler?: (error: BaseError) => void;
    } = {}
  ) {
    if (options.errorHandler) {
      this.#onError = options.errorHandler;
    }
  }

  subscribe<T>(event: string, handler: EventHandler<T>): void {
    const set = this.#handlers.get(event) ?? new Set();

    set.add(handler as EventHandler<unknown>);
    this.#handlers.set(event, set);
  }

  async emit<T>(event: string, payload: T): Promise<void> {
    const handlers = this.#handlers.get(event);

    if (!handlers) return;

    await Promise.all(
      [...handlers].map(async (h) => {
        try {
          await h(payload as Readonly<T>);
        } catch (cause) {
          this.#onError?.(
            new InternalError("Event handler failed", {
              event,
              cause,
            })
          );
        }
      })
    );
  }
}
```

## Behavioral Guarantees

### Subscription Guarantees

**MUST:**

- Support multiple handlers per event
- Allow same handler to subscribe multiple times (deduplicated internally)
- Return `void` immediately (subscription is synchronous)

**MAY:**

- Limit total number of subscriptions (implementation specific)
- Reject invalid event names (empty strings, etc.)

### Emission Guarantees

**MUST:**

- Execute all handlers in parallel via `Promise.all`
- Wrap each handler execution in try/catch
- Log handler failures via error handler if configured
- Never propagate handler errors to emitter
- Return promise that resolves when all handlers complete

**MAY:**

- Execute with zero subscribers (no-op)
- Implement delivery ordering (not guaranteed by contract)
- Provide delivery guarantees (at-least-once, at-most-once, exactly-once)

## Error Handling

### Error Semantics

Handler errors are **always** handled internally:

1. **Non-blocking:** Handler failures do not stop other handlers
2. **Logged:** Failures are passed to error handler if configured
3. **InternalError:** Handler failures are wrapped in `InternalError`
4. **Metadata:** Error includes event name and original cause

### Error Handler Configuration

```typescript
// Example error handler usage
const eventBus = new EventBus({
  errorHandler: (error: InternalError) => {
    console.error("Event handler failed:", error.message, error.meta);
    // Log to monitoring system
    // metrics.increment("event.handler.failure");
  },
});
```

## Thread Safety and Concurrency

### Guarantees

1. **Subscription thread-safe:** Multiple threads can subscribe concurrently
2. **Emission thread-safe:** Multiple threads can emit concurrently
3. **Handler isolation:** Each handler runs independently
4. **No guaranteed ordering:** Handlers may complete in any order

### Implementation Details

The implementation uses:

- `Map<string, Set<EventHandler>>` for O(1) subscription lookup
- `Promise.all` for parallel handler execution
- Private fields (`#handlers`, `#onError`) for encapsulation

## Type Safety

### Payload Type Safety

1. **Subscriber type matching:** TypeScript enforces handler payload type
2. **Emission type checking:** Compile-time check of payload type
3. **Readonly guarantee:** Handlers receive `Readonly<T>` payload
4. **Unknown default:** Base implementation uses `unknown` for maximum flexibility

### Generic Usage Pattern

```typescript
// Type-safe event definition
interface UserRegisteredEvent {
  userId: string;
  email: string;
  timestamp: number;
}

// Create typed event bus
const userEventBus: EventBusContract<UserRegisteredEvent> = new EventBus();

// Type-safe subscription
userEventBus.subscribe("user.registered", (payload) => {
  // payload is Readonly<UserRegisteredEvent>
  console.log(`User ${payload.userId} registered with email ${payload.email}`);
});

// Type-safe emission
await userEventBus.emit("user.registered", {
  userId: "123",
  email: "user@example.com",
  timestamp: Date.now(),
});
```

## Configuration Options

### Constructor Options

```typescript
interface EventBusOptions {
  /**
   * Optional error handler for logging handler failures
   */
  errorHandler?: (error: InternalError) => void;
}
```

### Default Behavior

If no `errorHandler` provided:

- Handler failures are silently ignored
- No logging or monitoring of failures
- System continues operation unaffected

## Performance Characteristics

### Time Complexity

- **subscribe:** O(1) average case
- **emit:** O(n) where n = number of handlers for the event
- **Memory:** O(m + n) where m = unique events, n = total subscriptions

### Memory Management

1. **Handler references:** Strong references (may prevent garbage collection)
2. **Unsubscription:** No explicit unsubscription API (handlers persist)
3. **Cleanup:** EventBus instance must be dereferenced to release handlers

## Usage Constraints

### Prohibited Patterns

**MUST NOT:**

- Use EventBus for transactional operations (use HookBus instead)
- Depend on handler execution order
- Assume handler completion time
- Use for critical path error handling

### Recommended Patterns

**SHOULD:**

- Use for logging, metrics, notifications, side effects
- Configure error handler for production monitoring
- Use typed event buses for domain events
- Keep handlers idempotent when possible

## Testing Considerations

### Unit Testing

```typescript
// Example test
describe("EventBus", () => {
  it("executes all handlers in parallel", async () => {
    const eventBus = new EventBus();
    const results: number[] = [];

    eventBus.subscribe("test", async () => {
      await delay(10);
      results.push(1);
    });

    eventBus.subscribe("test", async () => {
      await delay(5);
      results.push(2);
    });

    await eventBus.emit("test", {});

    // Order not guaranteed, but both should complete
    expect(results).toHaveLength(2);
    expect(results).toContain(1);
    expect(results).toContain(2);
  });
});
```

### Integration Testing

1. **Error handling:** Verify errors are captured by error handler
2. **Concurrency:** Test multiple concurrent emissions
3. **Memory:** Ensure no memory leaks with many subscriptions

## Versioning and Compatibility

### Breaking Changes (Major Version)

1. Changes to `EventHandler` or `EventBusContract` interface
2. Changes to error handling semantics (blocking vs non-blocking)
3. Removal of parallel execution guarantee
4. Changes to thread safety guarantees

### Non-breaking Changes (Minor Version)

1. Performance optimizations
2. Additional configuration options
3. New monitoring capabilities
4. Additional error metadata

## Migration Notes

### From Previous Versions

If migrating from a different event system:

1. **Handler errors:** Previously may have been propagated, now always caught
2. **Execution order:** Previously may have been sequential, now parallel
3. **Payload mutability:** Previously may have been mutable, now `Readonly<T>`

## References

- [Terminology §EventBus](/docs/00-constitution/terminology.md#eventbus)
- [Error Handling Standard](/docs/03-standards/error-handling.md)
- [HookBus Contract](/docs/04-contracts/hook-bus.contract.md) - For transactional operations
- [Emergency Standards](/docs/03-standards/emergency-standards.md) - For emergency EventBus usage

---

## Compliance Statement

This contract complies with Constitutional Axioms:

- **Axiom 1:** Defines intentional EventBus behavior
- **Axiom 3:** Single authoritative source for EventBus interface
- **Axiom 8:** Enforcement via TypeScript types and runtime checks
- **Axiom 9:** Uses canonical terminology from Terminology document

**Implementation Requirement:** All EventBus implementations MUST implement `EventBusContract<T>` interface and maintain the behavioral guarantees specified in this document.
