# @comity/router — Architecture

`@comity/router` is organized around a pipeline that separates rewriting, matching, and policy execution.

---

## Package Structure

- `contracts/` defines routes, routers, and URL rewriters
- `routers/` contains router implementations
- `pipeline.ts` coordinates matching and policy application
- `create-route-handler.ts` adapts routing output into HTTP handling
- `setup/` contains module wiring contracts

---

## Runtime Flow

1. A request URL is optionally rewritten.
2. Routers are queried for a match.
3. Route policy handlers are applied when a match exists.
4. The resulting route is passed to the request handler layer.

---

## Boundary Rules

- the package does not perform rendering
- the package does not own business logic
- the package does not bind to a specific routing backend

