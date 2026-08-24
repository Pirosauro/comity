# ADR-012 — Standard Domain Modeling for Core Modules

**Status:** Accepted

## Context

Core Modules were converging on two coexisting modeling styles:

- Entity-oriented modules (`@comity/address`, `@comity/customer`, `@comity/identity`)
  follow a canonical pattern: entity class with private state, Value Object
  identifiers, and the `Data`/`State`/`Create`/`Update`/`Snapshot` contract
  family.
- Projection-oriented modules (`@comity/catalog`, `@comity/content`,
  `@comity/order`, `@comity/taxonomy`) exposed read models named with the
  ambiguous `Model` suffix (`ProductModel`, `PageModel`, `OrderModel`) and a
  mix of repository method names (`get`, `getById`).

The audit also found error-semantics drift: `@comity/catalog` and
`@comity/order` defined `unknown` fallback reasons, and `@comity/order`
defined `not_found`, contradicting the principle that **not found is not an
error** (`null`/empty `Result`).

This ADR consolidates the existing standard (`docs/standards/domain-modeling.md`,
`docs/standards/errors.md`) and the canonical implementations into a single
model. It does **not** introduce a new style: it codifies the pattern already
adopted by `@comity/address`, `@comity/customer`, and `@comity/identity`, and
applies it to the remaining Core Modules without creating local exceptions.

## Decision

### 1. Object taxonomy

Every Core Module models its aggregates with exactly one of two shapes.

**Entity** — mutable domain object with owned identity and lifecycle:

- private state (`#`), getters, explicit mutation methods
- Value Object identifier owned by the module
- `constructor(fields: XCreate, id?: XId)`, `update(changes: XUpdate)`,
  `snapshot(): XSnapshot`
- lifecycle timestamps (`Instant`) preserved during hydration (ADR-001)
- persists through `save`/`remove` repository operations

**Projection** — immutable read model over an entity whose lifecycle is owned
elsewhere (external system, another bounded context, or an application):

- `readonly` shape, no mutation methods
- named with the explicit `Projection` suffix (`ProductProjection`,
  `BrandProjection`)
- identifier MAY remain a primitive `string` when externally owned
  (Read-Projection Exception, `domain-modeling.md` §3)
- repository MAY omit `save`/`remove` (Read-Projection Exception,
  `domain-modeling.md` §6)

The ambiguous `Model` and `Data` suffixes are forbidden for aggregate read
models. Embedded value structures within an aggregate (attributes, options,
variants, contacts) use the canonical no-suffix value naming (`AddressContact`,
`ProductAttribute`, `ProductOption`).

### 2. Value Objects

Identifiers of aggregates **owned** by a Core Module MUST be Value Objects
(`AddressId`, `CustomerId`, `UserId`) with:

- immutable `#value` state
- construction validation (`InvalidIdentifierError` on empty)
- `equals()`, `toString()`, `value` getter

Primitive aliases MUST NOT replace Value Objects for owned identifiers.
Read projections over externally owned aggregates MAY keep primitive
identifiers.

### 3. Repository contract

Canonical surface (naming is MUST):

```
getById()
search()
save()
remove()
```

- `get()`, `fetch()`, `load()` are forbidden.
- Additional lookups (`getBySlug`, `getByEmail`) are allowed.
- Not found is `Result<X | null, RepositoryError>` — never an error.
- Business failures belong to domain services or entity methods, not
  repositories (`errors.md`).

### 4. Error semantics

Errors use the module error class with `namespace:reason` codes
(`errors.md` §3).

- `unknown` fallback reasons are forbidden unless a legitimate catch-all
  exists for infrastructure contracts.
- `not_found` reasons are forbidden for domain modules; not-found is a `null`
  result, not an error.
- `validation_failed` must be replaced by the domain-specific reason
  (e.g. `catalog:invalid_product`).

### 5. Migration applied

- `@comity/catalog`: `ProductModel` → `ProductProjection`,
  `BrandModel` → `BrandProjection`, embedded `Product*Model` → `Product*`;
  `CatalogErrorReason` drops `unknown`, `validation_failed` →
  `invalid_product`. `save`/`remove` and `ProductId`/`ProductState`/
  `ProductSnapshot`/`ProductUpdate` are intentionally NOT added: catalog is a
  read projection over an externally owned product lifecycle (ADR-011).
- `@comity/content`: `PageRepository`/`BlockRepository` `get` → `getById`.
- `@comity/order`: `OrderRepository` `get` → `getById`.
- ADR-008 register updated for the resulting dependency edges
  (`order → pricing`, `storefront → taxonomy`, `taxonomy → media`,
  `taxonomy → search`).

Modules NOT migrated here are tracked as follow-ups: `*Model` naming in
`@comity/content`, `@comity/inventory`, `@comity/taxonomy`, `@comity/search`,
`@comity/media`. `@comity/pricing` (`PriceModel` → `Price`,
`PriceModifierModel` → `PriceModifier`) and `@comity/order` error reasons
(`not_found`, `unknown`) were resolved by ADR-013 and ADR-014.

## Consequences

**Positive:**

- A single, documented model for all Core Modules before the package count
  grows.
- Projection vs entity is decided by ownership, not by module mood.
- Repository naming and error semantics become uniform and machine-checkable.

**Negative / Trade-offs:**

- Breaking public API changes for `@comity/catalog` (rename) and
  `@comity/content`/`@comity/order` (method rename). Follow the
  breaking-change process.
- Read-projection modules keep a reduced contract surface; adding
  lifecycle ownership later requires a new ADR.

## References

- `docs/standards/domain-modeling.md` — canonical conventions
- `docs/standards/errors.md` — error model
- `docs/standards/decisions/ADR-001-entity-creation-and-hydration.md`
- `docs/standards/decisions/ADR-002-repository-vs-domain-command.md`
- `docs/standards/decisions/ADR-011-catalog-product-definition-only.md`
- `docs/standards/decisions/ADR-008-explicit-core-module-composition-exceptions.md`
- `packages/address`, `packages/customer`, `packages/identity` — canonical implementations