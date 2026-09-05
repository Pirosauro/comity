# Public API Export Policy — @comity/*

> **Note:** This is the Community-specific transitional copy. The canonical Comity-wide version is maintained in `comity-development/docs/standards/public-api.md`
This document defines **mandatory rules** for public APIs in Comity packages.

> Scope: normative rules only. Migration of non-conforming packages is tracked in `docs/migrations/public-api.md`.

---

## 1. Package Classification

Every `@comity/*` package belongs to exactly one category:

| Category                | Directory                                                                   | Characteristics                                                                                                                                                                                                                                                                                                                                                                              |
| ----------------------- | --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Kernel / Primitives** | `@comity/primitives`, `@comity/kernel`, `@comity/composition`               | Foundational building blocks, runtime engine, module lifecycle. No infrastructure-specific code.                                                                                                                                                                                                                                                                                             |
| **Core Modules**        | `@comity/address`, `@comity/auth`, `@comity/http`, etc.                     | Business abstractions. Core Modules primarily define contracts and domain abstractions. MAY expose canonical domain implementations when those implementations represent domain behavior and prevent duplication across adapters. MUST NOT expose technology-specific implementations. MAY depend on `@comity/primitives` and `@comity/kernel`. MUST NOT depend on Adapters or Applications. |
| **Adapters**            | `@comity/http-hono`, `@comity/sql-kysely`, etc.                             | Two categories: **Technology Adapters** provide ONE concrete implementation of ONE Core Module (ONE adapter = ONE technological variant); **Integration Adapters** integrate ONE external platform/system and may implement contracts from MULTIPLE Core Modules (see ADR-007).                                                                                                              |
| **Draft Core**          | Packages under development (e.g., `@comity/customer`, `@comity/validation`) | Core Modules in draft state. Same rules as Core Modules.                                                                                                                                                                                                                                                                                                                                     |

---

## 2. Root Barrel Rules

The root barrel (`src/index.ts`) represents the **public identity** of the package.

### 2.1 Core Modules

Root barrel MUST contain:

- **Entity runtime class** (e.g., `Order`, `Product`, `Category`)
- **Value Objects** (e.g., `OrderId`, `ProductId`)
- **Contract interfaces/types** (e.g., `OrderRepository`, `ProductSnapshot`)
- **Facade contract** (if needed, e.g., `AuthTokenFacade`)
- **Canonical domain implementations** (ONLY if they prevent adapter duplication)

Root barrel MUST NOT contain:

- Helper/utility functions
- Setup/wiring types
- Internal implementation details
- Adapter-specific code

### 2.2 Adapters

#### Technology Adapters

Root barrel MUST contain ONLY:

- The concrete implementation of the single Core Module contract
- OPTIONAL: Type-only exports for configuration

Root barrel MUST NOT contain:

- Multiple implementations
- Core Module contracts (import from the Core Module)
- Framework-type-specific exports beyond the adapter's purpose

#### Integration Adapters

Root barrel MUST contain ONLY:

- The concrete implementations of the Core Module contracts the integration satisfies
- OPTIONAL: Type-only exports for configuration

Root barrel MUST NOT:

- Re-export Core Module contracts (consumers MUST import contracts directly from their respective Core Modules)
- Re-export shared platform internals

Package rules:

- Platform-specific internals (schema, mapping, normalization, filters) MUST live under `src/internal/` and MUST NOT be public.
- Public configuration MUST live under `/setup` as a single unified surface.
- An Integration Adapter MAY declare multiple Core Module dependencies ONLY when it satisfies ALL the qualifying criteria defined in `ADR-007` (single named external platform/system, shared platform-specific schema/mapping/normalization, unified configuration surface, replaceable as a whole against another platform).

The dependency exemption is strictly limited to Integration Adapters. It does not weaken the one-Core-Module rule for Technology Adapters.

#### GraphQL Terminology

GraphQL spans both adapter categories; the classification depends on what the package binds:

- `@comity/graphql-client` is a **Core Module**. It defines the GraphQL contracts and the `GraphqlClient` facade/abstraction, which is transport-independent.
- The concrete transport (fetch, WebSocket, ...) is provided by **Technology Adapters**, e.g. `@comity/graphql-client-ws` (WebSocket) and a fetch-based adapter (`@comity/graphql-client-fetch`) where fetch is the underlying technology.
- An Integration Adapter may use the GraphQL client and its transport adapters to integrate an external platform without becoming a Technology Adapter itself.

### 2.3 Kernel / Primitives

Root barrel MUST contain ONLY:

- **Kernel**: `Kernel` class
- **Primitives**: `Token`, utility types actually used by consumers
- **Composition**: `load`, `resolveOrder`

Internal wiring types (e.g., `KernelEventBus`, `ModuleSetupContext`) MUST be in `/setup`.

---

## 3. Sub-Entrypoint Rules

Sub-entrypoints (`@comity/<package>/*`) are allowed ONLY if:

1. Represents a clear conceptual domain
2. Is not a technical mechanism
3. Could live as a standalone package
4. Is explicitly documented

### 3.1 Allowed Sub-Entrypoint Paths

| Path            | Purpose                    | When Required                                                |
| --------------- | -------------------------- | ------------------------------------------------------------ |
| `/errors`       | Custom error types         | When the package defines domain errors                       |
| `/observers`    | Passive subscribers        | When consumers need to subscribe to events                   |
| `/setup`        | Internal wiring            | Kernel, composition, module setup types                      |
| `/lifecycle`    | Event hooks                | When lifecycle events are part of the public API             |
| `/transports`   | Protocol implementations   | When different protocols need explicit separation            |
| `/serializers`  | Serialization logic        | When custom serialization is required                        |
| `/commands`     | Domain commands            | When ADR-002-style command ports are needed                  |
| `/policies`     | Domain policies            | When documented policies have external consumers             |
| `/repositories` | Repository implementations | For repository concrete implementations (e.g. adapters)      |
| `/stores`       | State management           | When the package manages state stores                        |
| `/streaming`    | Streaming utilities        | For streaming-specific functionality                         |
| `/client`       | Client factories           | When the package exposes a client for external communication |

### 3.2 Forbidden Sub-Entrypoint Paths

These paths MUST NOT exist:

- `/utils` — Helper functions belong in the core module or are removed
- `/helpers` — Must use proper abstractions
- `/shared` — Indicates poor modularization
- `/internal` — Internal code is not public
- `/lazy` — Lazy loading patterns are discouraged

---

## 4. Entity and Value Object Rules

### 4.1 Entity Definition

An Entity:

- MUST have a runtime class with identity semantics
- MUST be exported from the root barrel
- SHOULD have a dedicated Identity Value Object when identity is part of the public domain model (e.g., `OrderId`, `ProductId`)

### 4.2 Read Models vs Entities

A **Model** or **Projection** is NOT an Entity.

MUST use distinct naming to clarify:

- Entity: `Order`, `Product`, `Category`
- Projection: `SearchResult`, `CatalogProjection`, `PageModel`

Entities have behavior and identity. Read models are data containers.

### 4.3 Value Objects

Value Objects MUST:

- Be immutable
- Have equality semantics
- Be exported from root barrel when public domain concepts
- Use export for runtime VO classes
- Use export type for structural/value-only types

---

## 5. Observer vs Hook Rules

### 5.1 Observers

Observers are passive subscribers that:

- Implement `observe` or similar methods
- Receive notifications via consumer implementation
- Are PUBLIC APIs

Path: `/observers`

### 5.2 Hooks

Hooks are lifecycle extension points that:

- Are called by the framework/kernel
- Are INTERNAL or SETUP concerns
- Should be migrated to `/observers`

**Migration Required:**

| Old Path       | New Path           | Status  |
| -------------- | ------------------ | ------- |
| `auth/hooks`   | `auth/observers`   | Migrate |
| `html/hooks`   | `html/observers`   | Migrate |
| `http/hooks`   | `http/observers`   | Migrate |
| `kernel/hooks` | `kernel/observers` | Migrate |

---

## 6. Concrete Implementation Rules

A concrete class MAY be exported from the root barrel ONLY if:

1. It is the **canonical implementation** of the domain
2. It **prevents duplication** across adapters
3. It is **explicitly documented**
4. It does **not represent** a technological variant

### 6.1 Permitted Concrete Exports

The following MAY be public in Core Modules:

- Default implementations that are domain-agnostic
- Factory functions that create domain objects
- Canonical domain logic

### 6.2 Forbidden Exports

MUST NOT export:

- Alternative implementations
- Adapter-specific implementations
- Helper functions not part of the domain contract

---

## 7. Storefront Clarification

`@comity/storefront` is a **Core Module**, NOT an adapter.

### 7.1 Responsibilities

- Define composer contracts
- Contain default implementations to prevent adapter duplication
- Provide shared helpers for integrations

### 7.2 Allowed Public Exports

The following MAY be root exports in `@comity/storefront`:

- `DefaultCategoryPageComposer`
- `DefaultProductPageComposer`
- `DefaultContentPageComposer`
- `DefaultSearchPageComposer`

These are **canonical domain implementations**, not facades, because they are part of the storefront domain contract.

### 7.3 Adapter Scope

Storefront Integration Adapters MUST:

- Implement the storefront contracts
- Adapt to the external platform
- NOT reinvent composer logic
- NOT duplicate domain behavior

---

## 8. TypeScript Export Rules

Use explicit `export` syntax.

### 8.1 Value Exports

Export values with:

```typescript
export class Order { ... }
export function createOrder(): Order { ... }
export const CACHE_TOKEN = new Token();
```

### 8.2 Type Exports

Export types with:

```typescript
export type OrderSnapshot = { ... }
export interface OrderRepository { ... }
```

### 8.3 Forbidden Pattern

MUST NOT use:

```typescript
export { SomeInterface }; // NO
```

Even if TypeScript strips it with `verbatimModuleSyntax: false`.

**Reason:**

- API confusion
- Future incompatibility
- Inconsistent tooling

---

## 9. Examples of Conforming Packages

### 9.1 Core Module (Minimal)

`@comity/customer/src/index.ts`:

```typescript
export { Customer } from "./entity";
export type { CustomerId, CustomerSnapshot, CustomerState } from "./types";
export type { CustomerRepository } from "./contracts";
```

### 9.2 Core Module (Extended with Canonical Implementation)

`@comity/storefront/src/index.ts`:

```typescript
export { DefaultProductPageComposer } from "./composer";
export type { ProductPageComposer } from "./contracts";
// Constructors, factories, domain logic...
```

### 9.3 Adapter (Minimal)

`@comity/sql-kysely/src/index.ts`:

```typescript
export { createKyselySqlClient } from "./factory";
// Type-only exports for configuration
export type { SqlClientOptions } from "./types";
```

### 9.4 Adapter (Complete)

`@comity/http-hono/src/index.ts`:

```typescript
export { HonoHttpHandler } from "./handler";
export { HTTP_TOKEN } from "./tokens";
export type { HttpModule } from "./module";
```

---

## 10. Related Architecture Documents

This policy aligns with:

- **layering-policy.md**: Dependencies flow downward
- **domain-modeling.md**: Entity vs Projection distinction
- **ADR-001**: Entity construction and hydration
- **ADR-002**: Repository vs Domain Command port
- **Hexagonal Architecture**: Adapters implement ports, not vice versa

---

## 11. Summary

If an API needs a warning label, it should NOT be public.

Public APIs MUST be:

- Intentional and stable
- Documentable in one paragraph
- Have at least one real consumer
- Boring, predictable, and durable
