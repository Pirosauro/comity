# Comity Coding Standards — Configuration Model

> **Note:** This is the Community-specific transitional copy. The canonical Comity-wide version is maintained in `comity-development/docs/standards/configuration.md`
This document defines the official configuration strategy for Comity applications.

Configuration is an application concern.

It must not leak into the Kernel.

---

# 1. Configuration Principles

Configuration must be:

- Explicit
- Typed
- Deterministic
- Environment-agnostic
- Injectable

Configuration must not:

- Be read implicitly from global state
- Be scattered across modules
- Be resolved lazily at arbitrary layers

---

# 2. Configuration Lives in the Application Layer

The Application Layer owns configuration.

Core modules and adapters may accept configuration objects, but they must never read from:

- process.env
- global variables
- framework configuration

Only the Application Layer resolves environment variables.

---

# 3. Typed Configuration Objects

Configuration must be represented as typed objects.

Example:

```ts
export interface AppConfig {
  readonly databaseUrl: string;
  readonly enableTracing: boolean;
  readonly rateLimit: number;
}
```

Configuration must be validated at bootstrap.

Invalid configuration must fail fast.

---

# 4. Injection Pattern

Configuration is injected through composition.

Example:

```ts
const sqlClient = createKyselyClient({
  url: config.databaseUrl,
});
```

Modules must not store configuration globally.

---

# 5. Immutable Configuration

Configuration objects must be immutable.

They represent deployment state.

Mutating configuration at runtime is forbidden.

---

# 6. Environment Resolution Boundary

Environment resolution happens once.

Example:

```ts
const config: AppConfig = {
  databaseUrl: process.env.DATABASE_URL!,
  enableTracing: process.env.TRACING === "true",
  rateLimit: Number(process.env.RATE_LIMIT ?? 100),
};
```

After this point, the system must rely only on the typed object.

---

# 7. Configuration vs Policy

Configuration provides values.

Extensions implement policy.

Example:

- Config: `rateLimit = 100`
- Extension: rate limiter implementation

---

# Final Principle

Configuration is data.

Policy is behavior.

They must never be conflated.
