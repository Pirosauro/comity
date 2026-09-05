# ADR-011 — Catalog Owns Product Definition, Not Commercial Execution

> **Note:** This is the Community-specific transitional copy. The canonical Comity-wide version is maintained in `comity-development/docs/standards/decisions/ADR-011-catalog-product-definition-only.md`
**Status:** Accepted

## Context

`@comity/catalog` currently bundles product and category repository contracts
with commercial execution models: `PriceModel`/`PriceModifierModel` and
`InventoryModel`. `ProductVariantModel` embeds optional `price` and `inventory`.

This conflates responsibilities. A catalog product that represents a physical
item, a digital download, a SaaS, or a future product type should be modeled
once, in a domain-neutral way, without knowing whether it has stock, a price, a
shipment, or a recurring payment. Those concerns belong to dedicated modules:

- `@comity/pricing` — price models
- `@comity/inventory` — stock models
- `@comity/order`, `@comity/payment`, `@comity/shipping`, `@comity/subscription` — downstream lifecycle

Additionally, the category concept is shared across domains (catalog, blog,
content). Owning it inside catalog prevents other modules from reusing it.

This ADR is required because the change moves public contracts across package
boundaries and introduces new packages (`Architectural change` per the change
policy).

## Decision

### 1. Catalog boundary

`@comity/catalog` owns **product definition only**.

- `ProductProjection` — immutable read-projection: `id`, `slug?`, `url?`, `name`,
  `description?`, `status`, `type?`, `categoryId?`, `tags?`, `brand?`,
  `attributes?`, `options?`, `variants?`, `media?`, timestamps
- `ProductStatus` — `"draft" | "active" | "inactive" | "archived"`, with an
  explicit, non-regressive transition function (`transitionProductStatus`)
- `ProductAttribute`, `ProductOption`, `ProductOptionSelection`,
  `ProductVariant` — definition-only; variants carry no price and no stock
- `BrandProjection` + `BrandRepository` — brand is product-definition metadata
- `ProductRepository` — read-projection contract (`getById`, `getBySlug`, `search`),
  `Result<T, RepositoryError>`, `null` for not-found (ADR-002)
- `createProduct` — pure validation/construction helper returning
  `Result<ProductProjection, CatalogError>`
- `CatalogError` (`@comity/catalog/errors`) — `invalid_product`,
  `invalid_status_transition`

The catalog defines **no** concrete product classes (`PhysicalProduct`,
`DigitalProduct`, `SubscriptionProduct`). `type` is an opaque,
application-defined metadata string, so future product types are representable
without contract changes.

### 2. Extraction

New contract-only packages:

| Package             | Owns                                               | Moved from        |
| ------------------- | -------------------------------------------------- | ----------------- |
| `@comity/pricing`   | `PriceModel`, `PriceModifierModel`                 | `@comity/catalog` |
| `@comity/inventory` | `InventoryModel`                                   | `@comity/catalog` |
| `@comity/taxonomy`  | `CategoryModel`, `TaxonomyModel`, `TaxonomyRepository`, `TAXONOMY_REPOSITORY_TOKEN` | `@comity/catalog` |

- `CatalogRepositoryContext` no longer carries `currency` (a pricing concern).
  It keeps `fields?`, `locale?`, `tenant?`.
- `@comity/order` is re-wired to `@comity/pricing`.
- `@comity/storefront` is re-wired to `@comity/taxonomy` for category pages and
  keeps `@comity/catalog` for products.
- Products reference a **single** category via `categoryId` (a product belongs
  to one category; tags provide free-form classification).

### 3. Composition

`@comity/catalog` and `@comity/taxonomy` export a `ModuleMeta` with a no-op
setup. This makes `dependsOn` references (e.g. storefront declaring
`"@comity/catalog"` and `"@comity/taxonomy"`) resolvable in the composition
loader without coupling contract-only modules to runtime behavior.

### 4. No adapters

Only contracts are provided. No repository adapter, no persistence, no
transport. Implementations belong to adapters/applications.

## Consequences

**Positive:**

- Catalog is domain-neutral and future-proof: physical, digital, and
  subscription products share one contract.
- Commercial execution concepts are owned by their modules.
- Category/taxonomy is reusable by catalog, blog, and content.
- Read-projection discipline (ADR-002) is preserved.

**Negative / Trade-offs:**

- Breaking public API changes for `@comity/catalog` (price/inventory removed,
  `ProductProjection` gains `status`) and `@comity/order`/`@comity/storefront`
  dependency moves. The PR description documents the migration.
- `categoryId` supports a single category per product; multi-category products
  require an application-level design change.

## References

- `docs/standards/domain-modeling.md` — repository and read-projection rules
- `docs/standards/decisions/ADR-002-repository-vs-domain-command.md` —
  read-projection exception
- `docs/standards/layering-policy.md` — dependency direction
- `packages/catalog/src/index.ts` — new public surface
- `packages/pricing/src/index.ts`, `packages/inventory/src/index.ts`,
  `packages/taxonomy/src/index.ts` — new contract packages