# @comity/core

Core utilities, patterns, and error model for building modular, type-safe applications with the Comity framework.

`@comity/core` provides foundational utilities for dependency injection, event handling, hooks, lazy instantiation, and a standardized error model. It serves as the building blocks for higher-level Comity abstractions.

---

## Features

- **Dependency Injection Container**: Singleton and transient service management with error handling
- **Hook System**: Sequential execution of middleware-like handlers that can transform payloads
- **Event System**: Parallel, fire-and-forget event emission with optional error handling
- **Lazy Instantiation**: Memoization and deferred computation helpers
- **Result Types**: Type-safe success/failure patterns with utility functions
- **Standard Error Model**: Typed errors with stable codes, HTTP semantics, and structured metadata

---

## Installation

```sh
pnpm add @comity/core
```

---

## Quick Start

```ts
import { DiContainer } from "@comity/core";
import { HookBus } from "@comity/core";
import { EventBus } from "@comity/core";

const container = new DiContainer();
container.define("logger", () => console);
const logger = container.resolve<Console>("logger");

const hooks = new HookBus<{ beforeSave: string }>();
hooks.define("beforeSave", (value) => value.toUpperCase());
const result = await hooks.execute("beforeSave", "hello");

const events = new EventBus<{ userLogin: { id: number } }>();
events.subscribe("userLogin", async (payload) => {
  logger.log("User logged in:", payload.id);
});
await events.emit("userLogin", { id: 123 });
```

---

## Dependency Injection

```ts
import { DiContainer } from "@comity/core";

const container = new DiContainer();

container.define("database", () => new Database());
container.define("requestId", () => crypto.randomUUID());

const db = container.resolve<Database>("database");
const id = container.resolve<string>("requestId");
```

Services are singletons by default. Attempting to redefine a service throws `ConflictError`. Resolving an undefined service throws `NotFoundError`.

---

## Hooks

```ts
import { HookBus } from "@comity/core";

interface MyHooks {
  beforeSave: string;
  validate: object;
}

const hooks = new HookBus<MyHooks>();

hooks.define("beforeSave", async (value) => {
  // Transform the value
  return value.trim();
});

hooks.define("beforeSave", (value) => {
  return value.toUpperCase();
});

const result = await hooks.execute("beforeSave", "  hello  ");
// Result: "HELLO" (handlers executed sequentially)
```

Hooks are executed in registration order and can be synchronous or asynchronous. Each handler receives the result of the previous handler.

---

## Events

```ts
import { EventBus } from "@comity/core";

interface MyEvents {
  userCreated: { id: number; name: string };
  dataUpdated: { key: string; value: unknown };
}

const events = new EventBus<MyEvents>({
  errorHandler: (error) => console.error("Event error:", error),
});

events.subscribe("userCreated", async (payload) => {
  await sendWelcomeEmail(payload.name);
});

events.subscribe("userCreated", (payload) => {
  console.log(`User ${payload.id} created`);
});

await events.emit("userCreated", { id: 123, name: "Alice" });
```

Events are executed in parallel. If an error handler is provided, handler failures are caught and passed to it; otherwise, errors are silently ignored.

---

## Lazy Instantiation

```ts
import { Lazy } from "@comity/core";

const lazyDb = new Lazy(() => {
  console.log("Connecting to database...");
  return new Database();
});

// Database connection happens here
const db = lazyDb.value;

// Subsequent accesses return the cached instance
const sameDb = lazyDb.value;
```

The factory function is called only once, on first access. Useful for expensive computations or resource initialization.

---

## Result Types

```ts
import { success, failure, isSuccess, isFailure } from "@comity/core";

function divide(a: number, b: number) {
  if (b === 0) {
    return failure(new Error("Division by zero"));
  }
  return success(a / b);
}

const result = divide(10, 2);
if (isSuccess(result)) {
  console.log("Result:", result.value);
} else {
  console.error("Error:", result.error);
}
```

Use `success` and `failure` to create result objects, and `isSuccess`/`isFailure` for type-safe checking.

---

## Error Handling

All framework errors extend `BaseError` and follow a consistent error model:

- Stable, machine-readable `code`
- Human-readable `message`
- HTTP semantics via `meta.httpStatus`
- Structured metadata (`meta`)
- Optional cause chaining

```ts
import {
  NotFoundError,
  ForbiddenError,
  ValidationError,
  InternalError,
} from "@comity/core/errors";

throw new NotFoundError("User not found", {
  resource: "user",
  id: 123,
});

throw new ForbiddenError("Insufficient permissions");

throw new ValidationError("Invalid email format", {
  field: "email",
});

throw new InternalError("Database connection failed", {
  cause: err,
});
```

### Error Philosophy

- **Domain errors** SHOULD be explicit and expected
- **`InternalError`** represents unexpected failures and infrastructure-level issues
- `InternalError` SHOULD NOT be used for business or validation errors

Consumers are expected to handle `BaseError` subclasses at the application boundary.

---

## API Reference (Summary)

### Core

- `DiContainer`
- `HookBus<Hooks>`
- `EventBus<Events>`
- `Lazy<T>`

### Result

- `success<T>(value, meta?)`
- `failure<E>(error)`
- `isSuccess<T>(result)`
- `isFailure<E>(result)`

### Errors

- `BadRequestError` (400)
- `UnauthorizedError` (401)
- `ForbiddenError` (403)
- `NotFoundError` (404)
- `ConflictError` (409)
- `ValidationError` (400)
- `TooManyRequestsError` (429)
- `UnprocessableEntityError` (422)
- `ServiceUnavailableError` (503)
- `InternalError` (500)

---

## Contributing

See the main [Contributing Guide](../../CONTRIBUTING.md).

## License

[MIT](./LICENSE)
