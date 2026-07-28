# @comity/storefront-magento — Conventions

`@comity/storefront-magento` is an adapter package.

## Rules

- depend on the storefront and related upstream packages already declared
- keep Magento-specific mapping inside the adapter boundary
- do not introduce a public domain error contract
- keep repository implementations replaceable

## Structural note

The repository snapshot is organized around `setup/`, `repositories/`,
`internal/`, and `contracts/`. The package is documented as-is without forcing a
different internal shape.

