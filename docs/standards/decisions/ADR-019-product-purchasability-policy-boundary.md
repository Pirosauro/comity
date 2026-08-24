# ADR-019 — Product Purchasability Policy Boundary

**Status:** Proposed

## Context

ADR-012 established that Core Modules define domain abstractions, not business
policies. ADR-013 consolidated `@comity/order` as a lifecycle Entity whose
invariants are domain-owned; it does not enforce commercial eligibility.
ADR-014 confirmed that `@comity/pricing` owns pure price calculation and
receives already-eligible product data. ADR-018 established that Application
Layer owns commercial decisions while Core Modules remain domain/infrastructure
abstractions.

`@comity/catalog` exposes `ProductProjection` — an immutable read model
containing product definition (name, variants, options, attributes, status).
`ProductStatus` is defined as `draft | active | inactive | archived`.

Business reality introduces a bounded requirement: **not every active product
is purchasable in every commercial context**. Purchasability depends on factors
external to the product definition:

- geographic restrictions (country, region)
- trademark/licensing constraints
- channel authorization (web, mobile, POS, marketplace)
- customer segment eligibility
- regulatory compliance
- marketplace-specific rules

These rules are **commercial policies**, not product definition facts. They
belong above the Core Modules.

Already settled and not re-litigated here:

- Core Modules define contracts, not business policies (ADR-012, Layering
  Policy §2.2).
- Catalog owns product definition only; pricing, stock, shipping, and payment
  concerns are absent by design (`ProductProjection` docs).
- Order owns lifecycle and invariants; it does not enforce commercial
  eligibility (ADR-013).
- Pricing owns pure price calculation; it receives already-eligible data
  (ADR-014).
- Application Layer owns configuration, routing, presenters, business
  orchestration (Layering Policy §2.3).
- Core-to-Core dependencies are forbidden by default (Layering Policy §2.2,
  ADR-008).
- Adding an error reason is an additive public change with MINOR impact
  (`errors.md` §10).

## Problem Statement

Two distinct concerns are conflated and must be separated:

1. **Product definition.** The catalog describes what a product is — its
   identity, variants, options, attributes, status. This is a Core Module
   responsibility.

2. **Commercial eligibility.** The business decides whether a specific product
   can be purchased in a given commercial context (country, channel, customer,
   license, regulation). This is an Application Layer responsibility.

Embedding purchasability into `ProductProjection` (e.g., `isPurchasable`
field/method) or into `@comity/catalog` contracts converts one application
need into permanent per-entity domain structure, misplacing a responsibility
that the Layering Policy assigns above the Core Modules.

The principle established by this ADR:

> **The Catalog describes what a product is.
> The Application decides whether it can be purchased.**

## Decision

### 1. Application-Owned Purchasability Policy

The Application Layer owns the decision of whether a product may be purchased
in a given commercial context. This decision is expressed through an
Application-level contract called **`PurchasePolicy`**.

`PurchasePolicy` is an Application-level contract (not a Core Module
contract). It is:

- a stable, replaceable interface;
- implemented by the Application (or a dedicated Application package);
- injected into the checkout orchestration use case;
- **never** imported by Core Modules.

The `PurchasePolicy` contract:

```typescript
interface PurchasePolicy {
  canPurchase(
    product: ProductProjection,
    context: PurchaseContext
  ): Result<void, PurchaseError>;
}
```

- Returns `Result<void, PurchaseError>` — success means eligible, failure
  carries the reason.
- `PurchaseError` is an Application-level error (not a Core Module error).
- The exact shape of `PurchaseError` follows `errors.md` conventions
  (additive reason, HTTP hint, MINOR version impact).

### 2. PurchaseContext

The context required to evaluate purchasability is explicit and minimal:

```typescript
interface PurchaseContext {
  /** ISO 3166-1 alpha-2 country code — required for MVP. */
  readonly countryCode: string;

  /** Currency for the transaction — required for MVP. */
  readonly currency: Currency;

  /** Sales channel identifier — required for MVP (e.g., "web", "mobile", "pos"). */
  readonly channel: string;

  // DEFERRED (not in MVP):
  // readonly customerId?: CustomerId;
  // readonly customerSegment?: string;
  // readonly permissions?: readonly string[];
  // readonly evaluatedAt?: Instant;
}
```

- Fields are **required** for MVP; optional/extensible fields are explicitly
  deferred.
- `Currency` comes from `@comity/pricing` (already a shared value object).
- `CustomerId` comes from `@comity/customer` (already a shared value object).
- No `Record<string, unknown>` grab-bag — explicit fields only.

### 3. Default MVP Implementation

A `DefaultPurchasePolicy` implementation exists for MVP with the rule:

```typescript
if (product.status !== "active") {
  return failure(new PurchaseError("not_purchasable", {
    details: { productId: product.id, status: product.status }
  }));
}
return success(undefined);
```

This implementation is **replaceable** — the Application may substitute it
with a policy that evaluates geography, licensing, channel rules, etc. The
contract does not prescribe implementation mechanics.

## Ownership / Layering

Per the official dependency direction:

```text
Application → Extensions → Adapters → Core Modules → Kernel
```

| Concern                                      | Owner                          |
| -------------------------------------------- | ------------------------------ |
| Product definition (ProductProjection)       | `@comity/catalog` (Core)       |
| Product status enum                          | `@comity/catalog` (Core)       |
| Purchasability evaluation (PurchasePolicy)   | Application Layer              |
| PurchaseContext definition                   | Application Layer              |
| PurchaseError definition                     | Application Layer              |
| PurchasePolicy implementation                | Application (replaceable)      |
| PurchasePolicy injection into checkout flow  | Application composition root   |
| Price calculation (after eligibility)        | `@comity/pricing` (Core)       |
| Order creation with validated data           | `@comity/order` (Core)         |

**The `PurchasePolicy` contract lives in the Application Layer.** It is
**not** in `@comity/catalog`, `@comity/order`, `@comity/pricing`, or any
Core Module. Core Modules never import it.

## API Boundary

### PurchasePolicy Contract

```typescript
// Application Layer contract (not in any Core Module package)

import type { Result } from "@comity/primitives/result";
import type { ProductProjection } from "@comity/catalog";
import type { Currency } from "@comity/pricing";

export interface PurchaseContext {
  readonly countryCode: string;
  readonly currency: Currency;
  readonly channel: string;
}

export interface PurchasePolicy {
  canPurchase(
    product: ProductProjection,
    context: PurchaseContext
  ): Result<void, PurchaseError>;
}

export class PurchaseError extends BaseError<PurchaseErrorMeta> {
  readonly code: `purchase:${PurchaseErrorReason}`;
}

export type PurchaseErrorReason = "not_purchasable" | "internal_error";

export interface PurchaseErrorMeta extends ErrorMeta {
  readonly reason: PurchaseErrorReason;
  readonly details?: Readonly<{
    productId?: string;
    status?: string;
    context?: Partial<PurchaseContext>;
  }>;
}
```

- **No** `ProductProjection.isPurchasable` property or method.
- **No** `isPurchasable` field in `ProductProjection`.
- **No** purchase logic in `@comity/catalog` contracts or services.
- **No** purchase logic in `@comity/order` entity or repository.
- **No** purchase logic in `@comity/pricing`.

### Checkout Flow Integration

```text
PlaceOrder Use Case
    │
    ├── ProductRepository.getById(productId) → ProductProjection
    │
    ├── PurchasePolicy.canPurchase(product, context)
    │       │
    │       ├── success → proceed to pricing
    │       └── failure → return PurchaseError
    │
    ├── calculatePrice(base, modifiers) → Price
    │
    └── Order.create(OrderCreate) → Order
```

The policy sits **between** catalog read and pricing; it does not modify
catalog data, does not invoke pricing, and does not mutate Order.

## Relationship with Existing ADRs

### ADR-012 (Standard Domain Modeling)
ADR-012 establishes that Core Modules define domain abstractions, not
business policies. `PurchasePolicy` is explicitly an Application-level
contract, not a Core Module abstraction. Core Modules remain pure domain
abstractions.

### ADR-013 (Order Entity Consolidation)
ADR-013 consolidates Order as a lifecycle Entity whose invariants are
domain-owned. Order does not enforce commercial eligibility; it receives
validated data via `OrderCreate`. This ADR confirms that Order remains
unaware of purchasability rules.

### ADR-014 (Pricing Domain Model)
ADR-014 confirms pricing owns pure price calculation. Pricing receives
already-eligible product data. This ADR places the eligibility gate **before**
pricing — ineligible products never reach pricing calculation.

### ADR-018 (Shipping Destination Mutability)
ADR-018 established the principle: "The aggregate decides what may change.
The Application decides what state evolution is worth remembering." This ADR
extends that principle: **The Catalog describes what a product is. The
Application decides whether it can be purchased.** The same Application-owns-
policy pattern applies.

### Layering Policy
Layering Policy §2.2: "Core Modules MUST NOT depend on Adapters."
Layering Policy §2.3: "Application owns configuration, routing, presenters,
business orchestration."
This ADR places `PurchasePolicy` squarely in Application Layer, respecting
the dependency direction.

## Rejected Alternatives

### ProductProjection.isPurchasable field/method
**Rejected:** Embeds commercial policy into Core Module product definition.
Violates ADR-012 (Core Modules define domain abstractions, not business
policies) and Layering Policy (Core Modules must not contain commercial
policy). Makes `ProductProjection` non-portable across applications with
different eligibility rules.

### Catalog-side purchase rules (e.g., ProductRepository returns purchasability)
**Rejected:** Leaks commercial logic into Core Module. `ProductRepository`
is a Core Module contract; it must remain a read-projection port. Adding
purchasability to it forces all consumers to share the same commercial
policy, violating Core Module reusability.

### Order-owned purchase validation
**Rejected:** Order is a domain aggregate (ADR-013). Its invariants are
domain-owned (lifecycle, item consistency, price integrity). Commercial
eligibility is not a domain invariant — it is an Application policy.
Order would need to depend on Catalog context (country, channel, etc.),
creating inappropriate Core-to-Core coupling.

### RuleEngine / PolicyEngine / DSL / dynamic configuration
**Rejected:** Over-engineering for MVP and beyond. ADR-018 explicitly
rejects "universal temporal-history packages" for the same reason:
premature framework abstraction. A single `canPurchase(product, context)`
method with explicit context is sufficient. Extraction to a reusable
policy framework waits for demonstrated reuse (second real consumer).

### Generic PolicyEngine / generic evaluator framework
**Rejected:** Same as above. No framework abstraction is introduced.
`PurchasePolicy` is a single-purpose contract with a single method.
Framework extraction waits for real reuse via separate ADR.

### ProductStatus extension (e.g., adding `purchasable` status)
**Rejected:** `ProductStatus` is a Core Module enum (`draft | active |
inactive | archived`). Extending it with commercial semantics leaks
commercial policy into Core Module. Different applications may have
different purchasability rules for the same `ProductStatus`.

## Consequences

### Positive
- Catalog remains pure product definition; no commercial logic.
- Order remains pure lifecycle entity; no commercial logic.
- Pricing remains pure calculation; receives pre-validated data.
- Application owns commercial policy; replaceable per application/brand.
- No premature framework abstraction; single method, explicit context.
- Clear ownership boundary; Core Modules stay pure.

### Negative
- Application code must explicitly invoke `PurchasePolicy` in checkout flow.
- Different applications may implement different purchasability rules
  (intended — no forced uniformity).
- First implementation is a simple `status === "active"` check; richer
  rules (geography, licensing) require Application-level implementation.

## Deferred Decisions

1. **Customer-specific eligibility** (segments, permissions, entitlements) —
   `PurchaseContext` is extensible; not in MVP.

2. **License/trademark/compliance rule evaluation** — same as above;
   implemented in Application policy when real requirement exists.

3. **Dynamic pricing based on purchasability** — pricing stays pure;
   policy only gates eligibility.

4. **Catalog-side purchasability flag** — rejected; not deferred.

5. **Webhook/event for purchasability changes** — no event infrastructure
   in scope; deferred per ADR-015/016.

6. **Second-consumer Extension extraction** — per ADR-018, only when a
   second real consumer exists, via separate ADR.

7. **PurchasePolicy serialization/configuration** — not in MVP; hard-coded
   `DefaultPurchasePolicy` is sufficient.

## Migration / Adoption Path

1. Accept this ADR; it establishes the Application-owned purchasability
   boundary.

2. Add `PurchasePolicy` contract and `PurchaseError` to the Application
   package (e.g., `@comity/checkout` or dedicated Application package).

3. Implement `DefaultPurchasePolicy` with `status === "active"` rule.

4. Update `PlaceOrder` use case to invoke `PurchasePolicy.canPurchase()`
   before pricing calculation.

5. No Core Module changes required.

## Future Evolution

1. First real purchasability rule beyond `status === "active"` (geography,
   licensing, channel) — implemented in Application policy.

2. Second real consumer of `PurchasePolicy` (e.g., another Application
   package, different brand) — evaluate shared semantics, possible
   Extension extraction via dedicated ADR.

3. Customer-specific eligibility (segments, permissions) — add to
   `PurchaseContext` when real requirement exists.

4. Dynamic purchasability rules (feature flags, A/B testing) — only if
   real requirement demands; not a framework concern.

## Open Questions

- Exact representation of `PurchasePolicy` in the Application package
  structure (dedicated `policies/` directory? alongside use-cases?).

- Whether `PurchaseContext` should include `evaluatedAt: Instant` for
  audit/reproducibility (deferred to when needed).

- Whether `PurchaseError` needs additional reasons beyond
  `not_purchasable` / `internal_error` (additive per `errors.md`).

## References

- `docs/standards/layering-policy.md` — layer definitions, Extensions,
  dependency direction, mechanisms-not-policies.
- `docs/standards/errors.md` — additive reasons, HTTP hints, version bumps.
- `docs/standards/decisions/ADR-012-standard-domain-modeling.md` — object
  taxonomy, error semantics, Core Module purity.
- `docs/standards/decisions/ADR-013-order-entity-consolidation.md` —
  Order entity invariants, deferred commercial logic.
- `docs/standards/decisions/ADR-014-pricing-domain-model.md` — pricing
  ownership outside Order, pure calculation.
- `docs/standards/decisions/ADR-018-order-address-mutability-and-temporal-customer-data-boundary.md` —
  Application-owns-policy principle.
- `packages/catalog/src/contracts/product.ts` — ProductProjection,
  ProductStatus, ProductVariant, ProductOption, ProductAttribute.
- `packages/order/src/contracts/order.ts` — OrderCreate, OrderData,
  OrderStatus.
- `packages/pricing/src/index.ts` — calculatePrice, Price, Money, Currency.