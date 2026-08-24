# @comity/catalog — Overview

`@comity/catalog` owns the product catalog domain.

> Catalog owns product definition, not commercial execution.

## What it includes

- `ProductProjection`, `ProductStatus`, `ProductType` — product definition contracts
- `ProductAttribute`, `ProductOption`, `ProductOptionSelection`,
  `ProductVariant` — definitional concepts (no price, no stock)
- `BrandProjection`, `BrandRepository` — brand metadata
- `ProductRepository` — read-projection repository contract
- `createProduct`, `transitionProductStatus` — pure domain functions
- `CatalogError` — domain error type
- setup tokens and `ModuleMeta` for composition

## What it does not include

- pricing (`@comity/pricing`)
- inventory / stock (`@comity/inventory`)
- taxonomy / categories (`@comity/taxonomy`)
- order, payment, shipping, or subscription flows
- persistence implementations
- UI composition or rendering