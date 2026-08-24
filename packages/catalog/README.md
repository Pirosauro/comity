# @comity/catalog

Product catalog domain abstractions for Comity.

> **Catalog owns product definition, not commercial execution.**

---

## Purpose

Defines the product catalog domain: `ProductProjection` and its definitional
concepts (status, attributes, options, variants, brand), plus read-projection
repository contracts and setup tokens. The catalog is domain-neutral — physical
products, digital products, and future product types share one contract, with
`type` as application-defined metadata.

---

## Scope

This package:

- ✅ defines the `ProductProjection` read-projection and `ProductRepository` contract
- ✅ defines `ProductStatus` and its explicit transitions
- ✅ defines `ProductVariant`, `ProductOption`, `ProductAttribute`, `BrandProjection`
- ✅ exposes `createProduct`, `CatalogError`, setup tokens, and module metadata
- ❌ knows about price, stock, shipping, or payments — those belong to
  `@comity/pricing`, `@comity/inventory`, `@comity/order`, and friends
- ❌ implements adapters, persistence, or GraphQL backends
- ❌ renders catalog UI

---

## Public API

- `ProductProjection`, `ProductCreate`, `ProductStatus`, `ProductType` — product contracts
- `ProductAttribute`, `ProductOption`, `ProductOptionSelection`, `ProductVariant`
- `BrandProjection`, `BrandRepository`
- `ProductRepository` — read-projection contract
- `CatalogRepositoryContext` — request context (locale, fields, tenant)
- `createProduct`, `transitionProductStatus` — pure domain functions
- `CatalogError` (`@comity/catalog/errors`) — domain error type
- `PRODUCT_REPOSITORY_TOKEN`, `BRAND_REPOSITORY_TOKEN`, `module` (`@comity/catalog/setup`)

---

## Related Packages

- @comity/pricing — price contracts
- @comity/inventory — stock contracts
- @comity/taxonomy — category/taxonomy contracts (`categoryId`)
- @comity/storefront — page composition consuming catalog
- @comity/search — search criteria models

---

## Documentation

- docs/overview.md
- docs/conventions.md
- docs/architecture.md
- `docs/standards/decisions/ADR-011-catalog-product-definition-only.md`

---

## Status

Stable