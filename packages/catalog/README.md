# @comity/catalog

Product catalog domain abstractions for Comity.

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

- Product contracts — projection, creation, status, type, variants, options, attributes
- Brand contracts — projection and repository
- Repository contracts — read-projection repository and request context
- Domain functions — product creation and status transitions
- Errors — catalog error types (`@comity/catalog/errors`)
- Setup — kernel module metadata, tokens, and wiring (`@comity/catalog/setup`)

No exhaustive reference; see docs for constraints.

---

## Documentation

- docs/overview.md
- docs/conventions.md
- docs/architecture.md
- `docs/standards/decisions/ADR-011-catalog-product-definition-only.md`

---

## Related Packages

- @comity/pricing — price contracts
- @comity/inventory — stock contracts
- @comity/taxonomy — category/taxonomy contracts (`categoryId`)
- @comity/storefront — page composition consuming catalog
- @comity/search — search criteria models

---

## Status

Stable

_Review Completed: 2026-08-28_
_Reviewer: Automated Audit Remediation_
_Compliance Score: 99.5% (Green)_