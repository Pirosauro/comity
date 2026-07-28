# @comity/cache-redis — Conventions

`@comity/cache-redis` is an adapter package.

## Rules

- depend on `@comity/cache`, `@comity/kernel`, `@comity/composition`, and `@comity/primitives`
- keep Redis-specific code in the adapter layer
- do not expose a public domain error contract
- keep the package replaceable by other cache adapters

## Structural note

The current source tree is setup-centric and does not expose a top-level
`src/index.ts` file in the repository snapshot. That shape is documented as-is
for now.

