# @comity/hydration-react — Conventions

`@comity/hydration-react` is an adapter package.

## Rules

- depend on `@comity/hydration` and `@comity/primitives`
- keep React-specific runtime behavior inside the adapter boundary
- do not introduce a public domain error contract
- keep registry and runtime helpers explicit

