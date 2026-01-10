---
id: hook-bus-contract
status: authoritative
version: 1.0.0
owner: @architecture-council
enforcement: block
last_reviewed: 2026-01-09
next_review: 2027-01-09
supersedes: []
---

# HookBus Contract

## Purpose

This document defines the **public API contract** for the HookBus system in Comity. It specifies the guaranteed interface and behavior for transformational hooks that participate in and can modify execution flow.

This is a **Level 4: Contract document**. Breaking changes require major version bump.

**Implementation Note:** This contract is based on the actual HookBus implementation in the codebase. The interface guarantees match the concrete implementation.

## Core Semantics

HookBus is a mechanism for processing **transformational hooks** - operations that participate in and can transform data during execution.

### Guaranteed Properties

1. **Transformational:** Hooks can modify data (return new value)
2. **Sequential:** Handlers execute in registration order
3. **Blocking:** Each handler must complete before next starts
4. **Value propagation:** Each handler receives current value and original
5. **Transactional:** All hooks succeed or original value is returned

## Interface Definition

### Type Definitions

```typescript
/**
 * Hook handler signature - transforms data
 * @template T - Type of the value being transformed
 */
export type HookHandler<T> = (
  value: T, // Current transformed value
  initial: Readonly<T> // Original immutable value
) => T | Promise<T>;

/**
 * HookBus contract interface
 * @template T - Type of data being processed through hooks
 */
export interface HookBusContract<T> {
  /**
   * Define a hook handler for a specific hook name
   * @param name - Hook name to register handler for
   * @param handler - Function that transforms the value
   */
  define(name: string, handler: HookHandler<T>): void;

  /**
   * Execute all handlers for a hook name sequentially
   * @param name - Hook name to execute
   * @param initial - Initial value to transform
   * @returns Promise resolving to final transformed value
   */
  execute(name: string, initial: T): Promise<T>;
}
```

### Concrete Implementation

The canonical HookBus implementation provides these guarantees:

```typescript
export class HookBus<T> implements HookBusContract<T> {
  #handlers = new Map<string, Set<HookHandler<T>>>();

  define(name: string, handler: HookHandler<T>): void {
    const list = this.#handlers.get(name) ?? new Set();

    list.add(handler);
    this.#handlers.set(name, list);
  }

  async execute(name: string, initial: T): Promise<T> {
    const handlers = this.#handlers.get(name);

    if (!handlers) return initial;

    let value = initial;

    for (const handler of handlers) {
      value = await handler(value, initial);
    }

    return value;
  }
}
```

## Behavioral Guarantees

### Definition Guarantees

**MUST:**

- Support multiple handlers per hook name
- Allow same handler to be defined multiple times (deduplicated via Set)
- Return `void` immediately (definition is synchronous)
- Preserve insertion order within Set (iteration order maintained)

**MAY:**

- Limit total number of handlers per hook (implementation specific)
- Reject invalid hook names (empty strings, etc.)

### Execution Guarantees

**MUST:**

- Execute handlers in definition order (Set iteration order)
- Pass current transformed value to each handler
- Pass original immutable value as `Readonly<T>` to each handler
- Wait for each handler to complete before starting next
- Return promise that resolves to final transformed value
- Return original value if no handlers defined for hook name

**MUST NOT:**

- Execute handlers in parallel
- Skip handlers on failure (exceptions propagate)
- Continue execution after handler failure

## Error Handling

### Error Semantics

Hook errors **propagate** to caller:

1. **Blocking:** Handler failures stop entire execution chain
2. **Propagation:** Exceptions bubble up to `execute()` caller
3. **No recovery:** No automatic retry or fallback
4. **State:** No guarantee about partial transformations

### Error Pattern

```typescript
// Handler that might fail
const validationHook: HookHandler<UserData> = async (value, initial) => {
  if (!isValidUser(value)) {
    throw new ValidationError("user:invalid_data", "Invalid user data", {
      field: "email",
      value: value.email,
    });
  }
  return value; // Only if validation passes
};

// Execution handles the error
try {
  const result = await hookBus.execute("user.validation", userData);
} catch (error) {
  // error is ValidationError from handler
  console.error("Hook execution failed:", error.message);
}
```

## Thread Safety and Concurrency

### Guarantees

1. **Definition thread-safe:** Multiple threads can define handlers concurrently
2. **Execution serialization:** Only one execution per hook name at a time (implied by async/await)
3. **Handler isolation:** No shared state between handlers (enforced by interface)
4. **Value immutability:** Original value is `Readonly<T>` preventing accidental mutation

### Implementation Details

The implementation uses:

- `Map<string, Set<HookHandler<T>>>` for O(1) handler lookup
- `for...of` loop for sequential execution
- `await` for proper async handler support
- Private field (`#handlers`) for encapsulation

## Type Safety

### Transformation Type Safety

1. **Input/Output consistency:** Handlers must return same type `T` they receive
2. **Initial value preservation:** `initial` is `Readonly<T>` preventing mutation
3. **Generic constraints:** Type `T` maintained throughout transformation chain
4. **Async support:** Handlers can be sync or async returning `Promise<T>`

### Usage Pattern

```typescript
// Define transformation pipeline
interface UserData {
  id: string;
  email: string;
  preferences: Record<string, unknown>;
}

const userHookBus = new HookBus<UserData>();

// 1. Validation hook
userHookBus.define("user.process", (value, initial) => {
  if (!value.email.includes("@")) {
    throw new Error("Invalid email");
  }
  return value; // Pass through if valid
});

// 2. Transformation hook
userHookBus.define("user.process", (value, initial) => {
  return {
    ...value,
    email: value.email.toLowerCase(), // Transform email
    processedAt: Date.now(), // Add metadata
  };
});

// 3. Enrichment hook
userHookBus.define("user.process", async (value, initial) => {
  const preferences = await fetchUserPreferences(value.id);
  return {
    ...value,
    preferences: { ...value.preferences, ...preferences },
  };
});

// Execute pipeline
const rawUser: UserData = {
  id: "123",
  email: "USER@EXAMPLE.COM",
  preferences: {},
};
const processedUser = await userHookBus.execute("user.process", rawUser);

// processedUser has lowercase email, preferences, processedAt timestamp
```

## Performance Characteristics

### Time Complexity

- **define:** O(1) average case (Map/Set operations)
- **execute:** O(n) where n = number of handlers for the hook
- **Execution:** Sequential, so total time = sum of all handler execution times

### Memory Management

1. **Handler references:** Strong references (prevent garbage collection)
2. **Value copies:** Each handler receives potentially new value (immutable patterns help)
3. **Cleanup:** HookBus instance must be dereferenced to release handlers

## Usage Patterns

### Common Use Cases

1. **Validation pipelines:** Sequential validation with early exit on failure
2. **Data transformation:** Step-by-step data enrichment and formatting
3. **Authorization chains:** Multiple permission checks in sequence
4. **Processing workflows:** Multi-stage data processing

### Prohibited Patterns

**MUST NOT:**

- Use for fire-and-forget operations (use EventBus instead)
- Depend on handler side effects (handlers should be pure transformations)
- Assume handler execution time is bounded
- Use for high-frequency, low-latency operations

### Recommended Patterns

**SHOULD:**

- Keep handlers focused on single responsibility
- Make handlers idempotent when possible
- Use TypeScript to enforce transformation types
- Provide meaningful error messages when failing
- Consider timeout wrappers for async handlers

## Testing Considerations

### Unit Testing Hooks

```typescript
describe("HookBus", () => {
  it("executes handlers sequentially", async () => {
    const hookBus = new HookBus<number>();
    const executionOrder: number[] = [];

    hookBus.define("test", async (value, initial) => {
      await delay(10);
      executionOrder.push(1);
      return value + 1;
    });

    hookBus.define("test", async (value, initial) => {
      await delay(5);
      executionOrder.push(2);
      return value * 2;
    });

    const result = await hookBus.execute("test", 5);

    // Handlers execute in definition order
    expect(executionOrder).toEqual([1, 2]);
    // First: 5 + 1 = 6, Second: 6 * 2 = 12
    expect(result).toBe(12);
  });

  it("propagates handler errors", async () => {
    const hookBus = new HookBus<string>();

    hookBus.define("test", (value, initial) => {
      throw new Error("Handler failed");
    });

    await expect(hookBus.execute("test", "data")).rejects.toThrow(
      "Handler failed"
    );
  });
});
```

### Integration Testing

1. **Error propagation:** Verify errors bubble up correctly
2. **Order preservation:** Test handler execution order consistency
3. **Immutable initial:** Ensure initial value is not mutated
4. **Async handling:** Test mixed sync/async handlers

## Comparison with EventBus

### Key Differences

| Aspect             | HookBus                    | EventBus                    |
| ------------------ | -------------------------- | --------------------------- |
| **Purpose**        | Transformational pipelines | Observational notifications |
| **Execution**      | Sequential, blocking       | Parallel, non-blocking      |
| **Error handling** | Propagates to caller       | Handled internally          |
| **Return value**   | Transformed value          | Promise<void>               |
| **Data flow**      | Value passes through chain | Fire-and-forget             |
| **Use case**       | Validation, transformation | Logging, metrics            |

### When to Use Which

**Use HookBus when:**

- You need to transform data through multiple steps
- Order of operations matters
- Failures should stop the entire process
- You need the final transformed result

**Use EventBus when:**

- You need to notify multiple observers
- Order doesn't matter
- Failures shouldn't affect the main operation
- You don't need a return value

## Versioning and Compatibility

### Breaking Changes (Major Version)

1. Changes to `HookHandler` or `HookBusContract` interface
2. Changes from sequential to parallel execution
3. Changes to error propagation semantics
4. Removal of `initial` parameter to handlers

### Non-breaking Changes (Minor Version)

1. Performance optimizations
2. Additional utility methods
3. Enhanced error metadata
4. New monitoring capabilities

## Migration Notes

### From Manual Transformation Chains

If migrating from manual transformation code:

1. **Error handling:** Previously may have been ad-hoc, now standardized
2. **Ordering:** Previously may have been implicit, now explicit via `define` order
3. **Testing:** Previously hard to test, now each handler independently testable

### From Other Hook Systems

1. **Immutability:** `initial` is `Readonly<T>` - ensure handlers don't mutate it
2. **Async support:** Both sync and async handlers supported
3. **Type safety:** Full TypeScript generics support

## References

- [Terminology §HookBus](/docs/00-constitution/terminology.md#hookbus)
- [Error Handling Standard](/docs/03-standards/error-handling.md)
- [EventBus Contract](/docs/04-contracts/event-bus.contract.md) - Complementary system
- [Type Safety Standard](/docs/03-standards/type-safety.md) - For generic type patterns

---

## Compliance Statement

This contract complies with Constitutional Axioms:

- **Axiom 1:** Defines intentional HookBus transformational behavior
- **Axiom 3:** Single authoritative source for HookBus interface
- **Axiom 8:** Enforcement via TypeScript types and sequential execution guarantee
- **Axiom 9:** Uses canonical terminology from Terminology document

**Implementation Requirement:** All HookBus implementations MUST implement `HookBusContract<T>` interface and maintain the behavioral guarantees specified in this document, particularly sequential execution and error propagation.
