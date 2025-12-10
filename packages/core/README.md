# @comity/core

Core utilities, patterns, and error classes for building modular, type-safe applications with the Comity framework.

## Features

- **Dependency Injection Container**: Lazy, singleton, and transient service management.
- **Context System**: Lifecycle hooks, event emitters, and DI for modules.
- **Error Classes**: Standardized HTTP error types (e.g., Forbidden, NotFound, Unauthorized, BadRequest, ServiceUnavailable, TooManyRequests).
- **Security Utilities**: WebCrypto-based secret storage and retrieval.
- **Lazy Instantiation**: Memoization and deferred computation helper.

## Installation

```sh
pnpm add @comity/core
```

## Usage

### Dependency Injection

```typescript
import { Container } from "@comity/core";

const container = new Container();

container.register("logger", () => new Logger() /* ServiceFlags.SINGLETON */);

const logger = container.get("logger");
```

### Context and Hooks

```typescript
import { Context } from "@comity/core";

const ctx = new Context();

ctx.onHook("app:init", async (payload) => {
  /* ... */
});

await ctx.trigger("app:init", {});
```

### Error Classes

```typescript
import { NotFoundError, ForbiddenError } from "@comity/core/errors";

throw new NotFoundError("User not found");
throw new ForbiddenError("Access denied");
```

### WebCrypto

```typescript
import { WebCrypto } from "@comity/core/security";

const storage = {
  /* ...implement WebCryptoStorage... */
};
const crypto = new WebCrypto(storage, "secret-key");
// await crypto.getSecretsForConnector(...)
```

## API Reference

- See source JSDoc for detailed API documentation and examples.
- Each module and class is documented with usage patterns and edge cases.

## License

See the package `LICENSE` in the repository root.
