# @comity/core

Core runtime, patterns, and error model for building modular, type-safe applications with the Comity framework.

`@comity/core` is the foundational runtime of the Comity framework. It provides the primary abstractions (Context, Container, module system, error model) used by all Comity-based applications.

---

## Features

- **Context Runtime**: Central application runtime with lifecycle hooks, events, and dependency injection
- **Dependency Injection Container**: Lazy, singleton, and transient service management
- **Module System**: Deterministic module initialization with dependency resolution and cycle detection
- **Standard Error Model**: Typed errors with stable codes, HTTP semantics, and structured metadata
- **Validation**: Zod-based schema validation for module metadata and configuration
- **Security Utilities**: WebCrypto-based secret storage with pluggable backends
- **Lazy Instantiation Utilities**: Memoization and deferred computation helpers

---

## Installation

```sh
pnpm add @comity/core
```

---

## Quick Start

```ts
import { createContext } from "@comity/core";

const loggerModule = {
  name: "logger",
  version: "1.0.0",
  setup: async () => async (ctx) => {
    ctx.register("logger", () => console);
  },
};

const ctx = await createContext([loggerModule]);
const logger = ctx.get<Console>("logger");

logger.log("Application started");
```

`Context` is the primary runtime abstraction in Comity applications. Direct usage of `Container` is intended only for advanced or isolated scenarios.

---

## Dependency Injection

```ts
import { Container, ServiceFlags } from "@comity/core";

const container = new Container();

container.register("database", () => new Database(), ServiceFlags.SINGLETON);
container.register(
  "requestId",
  () => crypto.randomUUID(),
  ServiceFlags.TRANSIENT
);

const db = container.get<Database>("database");
const id = container.get<string>("requestId");
```

### Service Lifecycles

- `ServiceFlags.SINGLETON`: One shared instance (default)
- `ServiceFlags.TRANSIENT`: New instance per access

---

## Context and Lifecycle

```ts
import { Context } from "@comity/core";

const ctx = new Context();

ctx.onHook("app:startup", async (config) => {
  return { ...config, startedAt: Date.now() };
});

ctx.onEvent("user:login", async (user) => {
  await analytics.track("login", user);
});

await ctx.trigger("app:startup", { port: 3000 });
await ctx.emit("user:login", { id: 123 });
```

Hooks are executed sequentially and may transform payloads. Events are executed in parallel and are fire-and-forget.

---

## Module System

```ts
import { createContext } from "@comity/core";

const databaseModule = {
  name: "database",
  version: "1.0.0",
  setup: async () => async (ctx) => {
    ctx.register("db", () => new Database());
  },
};

const authModule = {
  name: "auth",
  version: "1.0.0",
  dependsOn: ["database"],
  setup: async () => async (ctx) => {
    const db = ctx.get("db");
    ctx.register("auth", () => new AuthService(db));
  },
};

const ctx = await createContext([authModule, databaseModule]);
```

Modules are automatically ordered and initialized based on their dependencies. Errors during resolution or setup are propagated as-is.

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

## Security

```ts
import { WebCrypto } from "@comity/core/security";

const crypto = new WebCrypto(storage, "master-key");
await crypto.setSecretsForConnector("github", { token: "ghp_..." });
const secrets = await crypto.getSecretsForConnector("github", {});
await crypto.deleteSecretsForConnector("github");
```

`WebCrypto` is intended for application-level secret handling, not for user-facing cryptography.

---

## API Reference (Summary)

### Core

- `createContext(modules, options?)`
- `Context`
- `Container`

### Errors

- `BadRequestError` (400)
- `UnauthorizedError` (401)
- `ForbiddenError` (403)
- `NotFoundError` (404)
- `ConflictError` (409)
- `ValidationError` (400)
- `TooManyRequestsError` (429)
- `ServiceUnavailableError` (503)
- `InternalError` (500)

---

## Contributing

See the main [Contributing Guide](../../CONTRIBUTING.md).

## License

[MIT](./LICENSE)
