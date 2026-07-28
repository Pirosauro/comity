# @comity/storefront-magento — Architecture

`@comity/storefront-magento` is organized as a Magento GraphQL adapter that
wires storefront contracts to Magento-backed repository implementations.

## Main areas

- `setup/` — module metadata, constants, and adapter wiring
- `repositories/` — storefront repository implementations
- `internal/` — GraphQL schema, mapping, normalization, and filter helpers
- `contracts/` — adapter-specific context contracts

## Architectural note

The adapter composes cached and uncached repository paths and uses GraphQL as
an internal integration detail.

