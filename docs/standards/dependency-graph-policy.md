# Comity Coding Standards — Dependency Graph Policy

> **Note:** This is the Community-specific transitional copy. The canonical Comity-wide version is maintained in `comity-development/docs/standards/dependency-graph-policy.md`
Comity follows a strict layered architecture.

## Layers

1. primitives
2. kernel
3. transport (http, etc.)
4. infrastructure adapters (sql-kysely, http-hono, etc.)
5. rendering (html, hydration)

## Allowed dependencies

- primitives → (no internal deps)
- kernel → primitives
- http → primitives, kernel
- sql → primitives
- adapters → corresponding contract module + primitives
- rendering modules → primitives

Rendering modules MAY reference HTTP contract types only when:

- the dependency is type-only
- no HTTP runtime dependency exists
- the edge is registered as an Infrastructure Contract Exception in ADR-008

## Core-to-Core dependencies (closed register)

- Core Modules MUST NOT depend on other Core Modules unless explicitly registered as an approved exception.
- The exhaustive exception register is maintained in `docs/standards/decisions/ADR-008-explicit-core-module-composition-exceptions.md`.
- Any Core-to-Core dependency not registered in ADR-008 is an architectural violation.

## Forbidden

- contracts must never depend on adapters
- primitives must never depend on any other internal package
- no cross-adapter dependencies
- rendering modules must never depend on HTTP runtime implementations or transport behavior

## Rendering modules and HTTP contract types

Rendering Core Modules MUST NOT depend on HTTP runtime implementations or transport behavior.

A Rendering Core Module MAY reference HTTP contract types only when:

- the import is type-only;
- the dependency is registered as an Infrastructure Contract Exception in ADR-008;
- no HTTP execution logic is introduced.
