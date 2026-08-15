# Comity Coding Standards — Official Layering Policy

This document formalizes the **official layering model** of Comity.

Layering is not optional. It is a structural constraint that guarantees:

- Long-term maintainability
- Transport independence
- Observability extensibility
- Enterprise scalability
- Minimal cognitive load

Violating layering rules is considered an architectural defect.

---

# 1. Architectural Overview

Comity is built on a strict separation of concerns across five conceptual layers:

```
1. Kernel
2. Core Modules
3. Adapters
4. Extensions (Cross-Cutting Policies)
5. Application Layer
```

Each layer has explicit responsibilities and dependency rules.

---

# 2. Layer Definitions

## 2.1 Kernel

**Purpose:**
Provide minimal, transport-agnostic primitives.

Examples:

- Result
- BaseError
- DI container
- Lifecycle primitives

The Kernel:

- MUST NOT depend on HTTP, SQL, Auth, HTML, or any infrastructure
- MUST remain environment-agnostic (Node, Edge, Browser)
- MUST not implement policy
- MUST not implement business logic

The Kernel is foundational and intentionally minimal.

---

## 2.2 Core Modules (`@comity/*`)

**Purpose:**
Provide domain-neutral infrastructure abstractions.

Examples:

- `@comity/http`
- `@comity/sql`
- `@comity/auth`
- `@comity/html`

Core Modules:

- MAY depend on Kernel
- MUST NOT depend on other Core Modules unless explicitly allowed
- MUST NOT depend on specific frameworks
- MUST remain implementation-agnostic

Core Modules define contracts — not concrete infrastructure.

---

## 2.3 Adapters

**Purpose:**
Bind Core Modules to concrete technologies and integrate external platforms.

Adapters come in two distinct categories:

### Technology Adapters

**Purpose:**
Bind ONE Core Module to one interchangeable technology.

Examples:

- `@comity/http-hono`
- `@comity/sql-kysely`
- `@comity/graphql-client-ws`
- `@comity/html-react`

Technology Adapters:

- implement/bind exactly **one** Core Module
- represent an interchangeable technology
- MAY depend on the Core Module they implement
- MAY depend on third-party libraries
- MUST NOT introduce business logic
- MUST normalize external errors into module errors

The rule **"one adapter = one Core Module"** applies to Technology Adapters.

A Technology Adapter MAY consume technology-agnostic composition infrastructure
(e.g. a canonical facade, factory, or wiring helper) from another Core Module
without thereby becoming an adapter for that Core Module. The one-Core-Module
rule governs which Core Module contract the adapter *implements*, not every
package it consumes during composition. Such infrastructure consumption does not
create a second implemented contract and does not weaken the rule.

### Integration Adapters

**Purpose:**
Integrate a single external platform/system with one or more Core Module contracts.

Example:

- `@comity/storefront-magento`

Integration Adapters:

- integrate a **single** external platform/system;
- MAY implement contracts belonging to **multiple** Core Modules (the "one adapter = one Core Module" rule does NOT apply to them);
- keep shared platform-specific schema, mapping, normalization, and logic inside the package;
- have a unified configuration surface and lifecycle;
- are replaceable as a platform in its entirety;
- MAY depend on the Core Modules whose contracts they implement and on the Technology Adapters that provide the underlying technology;
- MUST NOT depend on Application-layer code;
- MUST NOT depend on other Integration Adapters;
- MUST NOT become a masked Application Layer (no business orchestration, no application logic).

An Integration Adapter MUST satisfy the qualifying criteria defined in `ADR-007` (single named platform, shared platform-specific schema/mapping/normalization, unified configuration surface, replaceable as a whole). If it does not, it MUST be modeled as one or more Technology Adapters.

### GraphQL Terminology

GraphQL spans both adapter categories; the classification depends on what the package binds:

- `@comity/graphql-client` is a **Core Module**. It defines the GraphQL contracts and the `GraphqlClient` facade/abstraction, which is transport-independent.
- The concrete transport (fetch, WebSocket, ...) is provided by **Technology Adapters**, e.g. `@comity/graphql-client-ws` (WebSocket) and a fetch-based adapter (`@comity/graphql-client-fetch`) where fetch is the underlying technology.
- `@comity/storefront-magento` is an **Integration Adapter**. It may use the GraphQL client and its transport adapters to integrate the Magento platform without becoming a Technology Adapter itself.

```text
Integration Adapter
    @comity/storefront-magento
            │
            ├── @comity/storefront
            ├── @comity/catalog
            ├── @comity/content
            ├── @comity/router
            └── @comity/graphql-client
                         │
                         ▼
                Technology Adapter
                (fetch / WebSocket / ...)
```

Magento is the external platform; GraphQL is the protocol/API used to integrate it.

Adapters are replaceable implementation details.

---

## 2.4 Extensions (Cross-Cutting Policies)

**Purpose:**
Provide optional enterprise-grade policies and operational concerns.

Examples:

- Rate limiting
- Circuit breakers
- Retry strategies
- Request tracing
- Instrumentation hooks
- Timeout policies

Extensions:

- MAY depend on Core Modules
- MUST remain optional
- MUST NOT be required by Kernel
- MUST compose via wrappers or middleware

Extensions implement policy — not abstraction.

---

## 2.5 Application Layer

**Purpose:**
Define business logic and composition.

Examples:

- Use cases
- Presenters
- Controllers
- Route definitions
- Policy wiring

The Application Layer:

- May depend on everything below
- Defines orchestration
- Owns configuration
- Registers middleware and extensions

The Application Layer is where enterprise behavior emerges.

---

# 3. Dependency Rules

The dependency graph MUST follow this direction:

```
Application
    ↓
Extensions
    ↓
Adapters
    ↓
Core Modules
    ↓
Kernel
```

Reverse dependencies are forbidden.

Forbidden examples:

- Kernel importing HTTP
- Core module importing Adapter
- Adapter importing Application logic
- Extensions modifying Kernel behavior

---

# 4. Where Enterprise Concerns Live

The following table defines official placement:

| Concern                | Layer                |
| ---------------------- | -------------------- |
| Rate limiting          | Extensions           |
| Circuit breaker        | Extensions / Adapter |
| Distributed tracing    | Extensions           |
| Request validation     | Application / HTTP   |
| Content negotiation    | HTTP module          |
| CORS                   | Framework middleware |
| Compression            | Framework / Proxy    |
| Route-specific timeout | Extensions / HTTP    |

Core principle:

> Kernel provides mechanisms, not policies.

---

# 5. Observability Policy

Observability MUST NOT be embedded in the Kernel.

Modules MAY expose lifecycle or instrumentation hooks.

Instrumentation MUST be opt-in and composable.

Tracing, metrics, and logging are integration concerns — not core semantics.

---

# 6. Replacement Principle

Every Adapter MUST be replaceable without modifying:

- Core Modules
- Kernel
- Business logic

If replacing a database or HTTP framework requires changing business logic, layering has been violated.

---

# 7. Minimal Surface Principle

Each layer MUST expose only what is necessary.

- Do not leak internal types
- Do not re-export adapter internals
- Do not collapse layers for convenience

Layer boundaries are architectural contracts.

---

# 8. Design Intent

Comity is designed to be:

- Enterprise-grade in structure
- Minimal in abstraction
- Explicit in boundaries
- Replaceable in infrastructure
- Observable without coupling

The layering policy is what prevents Comity from becoming a framework monolith.

---

# Final Statement

Comity is not a framework that does everything.

It is a system that knows exactly where everything belongs.

Layering is the enforcement mechanism of that discipline.
