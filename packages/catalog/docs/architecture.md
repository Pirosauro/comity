# Architecture - @comity/catalog

## Internal structure

- `index.ts` aggregates public exports.
- `contracts/` defines stable contracts/types (product, brand, repositories, context).
- `domain/` defines pure domain functions (`createProduct`, `transitionProductStatus`).
- `errors/` defines the `CatalogError` domain error type.
- `setup/` defines setup tokens and module metadata.

## Boundary

Catalog owns product definition, not commercial execution:

```
@comity/catalog   → product definition only
@comity/pricing   → price contracts
@comity/inventory → stock contracts
@comity/taxonomy  → category/taxonomy contracts
@comity/order     → order lifecycle (consumes pricing)
```

Dependencies flow downward; catalog depends only on `@comity/composition`,
`@comity/media`, `@comity/primitives`, and `@comity/search`.

## Main flows

- Setup flow: application composition -> module setup -> repository tokens.
- Contract flow: consumer -> module contracts -> concrete implementations in
  adapters/applications.

## Architecture decisions

- Classification: Core Module.
- Product is an immutable read-projection (ADR-002 exception); no entity class.
- Status transitions are explicit and non-regressive (pure function).
- Concrete product classes (Physical/Digital/Subscription) are forbidden;
  `type` is application-defined metadata.
- See ADR-011 — Catalog Owns Product Definition, Not Commercial Execution.