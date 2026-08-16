# Comity Coding Standards — Adapters

This document defines what **adapters** are in Comity, what they are responsible for,
and how they must interact with the kernel and modules.

Adapters are intentionally **not** modules.

---

## 1. What Is an Adapter?

An adapter is a **bridge** between Comity and the outside world.

Examples:

- HTTP servers (Hono, Fastify, Fetch, Bun, Node)
- Runtimes
- Platform integrations

Adapters translate **external stimuli** into Comity primitives and back.

---

## 2. Core Principle

> Adapters adapt. They do not decide.

Adapters MUST:

- Be thin
- Be replaceable
- Be framework-specific

Adapters MUST NOT:

- Contain business logic
- Contain domain logic
- Contain module logic

---

## 3. Adapters vs Modules

| Concern            | Modules    | Adapters             |
| ------------------ | ---------- | -------------------- |
| Reusability        | High       | Low / platform-bound |
| Domain knowledge   | Yes        | No                   |
| Framework-specific | No         | Yes                  |
| Lifecycle control  | Hook-based | External             |
| Kernel dependency  | Yes        | Yes                  |

Adapters are consumers of modules, not participants.

---

## 4. Adapter Responsibilities

An adapter MAY:

- Instantiate the kernel
- Configure the kernel
- Register modules
- Translate incoming requests
- Translate outgoing results

An adapter MUST:

- Respect kernel lifecycle
- Respect module contracts
- Handle I/O and side effects

---

## 5. Adapter Boundaries

Adapters MUST NOT:

- Register kernel hooks
- Emit domain events
- Mutate module state
- Depend on internal module APIs

Adapters interact only through:

- Public facades
- Kernel APIs
- Explicit entrypoints

---

## 6. HTTP Adapters (Example)

An HTTP adapter:

- Receives a framework request
- Creates an `HttpContext`
- Invokes the HTTP facade
- Translates `HttpResult` into a framework response

Example flow:

```
Framework Request
  ↓
HttpAdapter
  ↓
HttpFacade.handle(ctx)
  ↓
HttpResult
  ↓
Framework Response
```

---

## 7. Error Handling

Adapters MUST:

- Catch errors thrown by facades
- Translate them to framework-specific responses
- Never swallow errors silently

Adapters MUST NOT:

- Invent new domain errors
- Modify error semantics
- Leak internal error details

---

## 8. Events & Observability

Adapters MAY:

- Listen to kernel events
- Listen to module events
- Emit transport-level events

Adapters MUST:

- Treat events as optional
- Avoid coupling logic to event delivery

Adapters MUST NOT:

- Rely on events for correctness

---

## 9. Adapter Packaging

Adapters SHOULD:

- Live in separate packages
- Be named explicitly

Examples:

- `@comity/http-hono`
- `@comity/graphql-client-ws`
- `@comity/router-path-to-regexp`

Adapters MUST NOT:

- Be bundled into core modules
- Be required dependencies of modules

---

## 10. Stability & Compatibility

Adapters:

- Are allowed to evolve faster than modules
- May introduce breaking changes more frequently
- MUST track compatibility with module versions

---

## 11. Integration Adapters

### Definition

An **Integration Adapter** integrates a **single external platform/system** and MAY implement contracts belonging to **multiple Core Modules**. It is distinct from a **Technology Adapter**, which binds ONE Core Module to one interchangeable technology.

### Integration Adapter vs Technology Adapter

| Concern                | Technology Adapter                                                     | Integration Adapter                                  |
| ---------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------- |
| Binds                  | One Core Module                                                        | One external platform/system                         |
| Core Module contracts  | Exactly one                                                            | One or more                                          |
| Technology             | Interchangeable                                                        | Fixed by the platform                                |
| Shared platform layers | None                                                                   | Schema, mapping, normalization, filters (in-package) |
| Configuration surface  | Per contract                                                           | Unified single surface                               |
| Replaceability         | Piece-by-piece (swap technology)                                       | As a whole (swap platform)                           |
| Example                | `@comity/http-hono`, `@comity/sql-kysely`, `@comity/graphql-client-ws` | —                                                    |

The "one adapter = one Core Module" rule applies to **Technology Adapters only**.

### Qualifying Criteria

A package qualifies as an Integration Adapter ONLY when it satisfies ALL of the following criteria:

1. **Single named external platform/system** — it binds to one named platform with one primary API surface.
2. **Shared platform-specific schema/mapping/normalization** — the contracts it implements genuinely share platform-specific schema, mapping, and normalization that would otherwise be duplicated or forced into a shared package.
3. **Unified configuration surface** — one client, one endpoint, one setup module.
4. **Replaceable as a whole against another platform** — it can be replaced by another platform integration, not piece-by-piece.

If ANY criterion is not satisfied, the package MUST be modeled as one or more Technology Adapters.

### Dependency Rules

An Integration Adapter:

- MAY depend on the Core Modules whose contracts it implements;
- MAY depend on the Technology Adapters that provide the underlying technology (e.g., a GraphQL transport adapter), keeping those dependencies replaceable;
- MAY depend on `@comity/primitives` and `@comity/kernel`;
- MUST NOT depend on other Integration Adapters;
- MUST NOT depend on Application-layer code;
- MUST NOT import Core Modules beyond those whose contracts it implements and the shared helpers needed to implement them.

Example: an Integration Adapter declares `zod` as a regular dependency because the adapter validates integration runtime configuration. This is intentional and is not a peer-dependency violation.

### Public API Rules

- The root barrel exposes the concrete implementations of the Core Module contracts it satisfies.
- The root barrel MUST NOT re-export Core Module contracts — consumers import contracts from their respective Core Modules.
- Platform-specific internals (schema, mappers, normalization, filters) MUST live under `src/internal/` and MUST NOT be public.
- Public configuration MUST live under `/setup` as a single unified surface.

### Ownership

- Core Modules retain ownership of their contracts and do not know about the integration.
- The Integration Adapter owns the platform → domain mapping, the platform-specific schema/query/mapper layers, and the normalization of platform errors into Core Module error surfaces.
- The Application layer decides how to compose the integration's repositories and services.

### Lifecycle

- The Integration Adapter is initialized through the standard module setup lifecycle (`composition/setup` `module` metadata).
- Its `module` declares the Core Modules it depends on (`dependsOn`) so the kernel wires them in order.
- Its setup registers the repositories and services it owns and defines the integration's configuration hooks (`*:configuring`, `*:initialized`).

### Replaceability

Replacing a platform means replacing the Integration Adapter package and its setup, without modifying Core Modules or Application orchestration.

### GraphQL Terminology

GraphQL spans both adapter categories; the classification depends on what the package binds:

- `@comity/graphql-client` is a **Core Module**. It defines the GraphQL contracts and the `GraphqlClient` facade/abstraction, which is transport-independent.
- The concrete transport (fetch, WebSocket, ...) is provided by **Technology Adapters**, e.g. `@comity/graphql-client-ws` (WebSocket) and a fetch-based adapter (`@comity/graphql-client-fetch`) where fetch is the underlying technology.
- An Integration Adapter may use the GraphQL client and its transport adapters to integrate an external platform without becoming a Technology Adapter itself.

```text
Integration Adapter
    storefront platform integration
            │
            ├── @comity/storefront
            ├── @comity/catalog
            ├── @comity/router
            ├── @comity/cache
            └── @comity/graphql-client
                         │
                         ▼
                Technology Adapter
                (fetch / WebSocket / ...)
```

The external platform is the system being integrated; GraphQL is the protocol/API used to integrate it.

---

## 12. Technology Binding Dependency Policy

Technology bindings are the third-party libraries an adapter binds to (e.g. Hono, `path-to-regexp`, `kysely`, `jose`, `graphql-ws`).

Technology bindings SHOULD be declared as `peerDependencies` when:

- the consumer application controls the technology version
- duplicate runtime instances must be avoided
- the adapter only binds to the technology

Dependencies may remain regular dependencies when:

- the adapter owns the dependency lifecycle
- the dependency is an internal implementation detail

The bound technology version used for development and testing MUST also be declared as a `devDependency` so the adapter builds and its tests run in isolation.

---

## Summary

Adapters are **edges**, not **centers**.

If a piece of code:

- Knows about frameworks → adapter
- Knows about domains → module
- Knows about execution → kernel

Keeping adapters thin is what keeps Comity portable.
