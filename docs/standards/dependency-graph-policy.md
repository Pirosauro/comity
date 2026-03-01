# Comity Coding Standards — Dependency Graph Policy

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

## Forbidden

- contracts must never depend on adapters
- primitives must never depend on any other internal package
- no cross-adapter dependencies
- rendering must not depend on http
