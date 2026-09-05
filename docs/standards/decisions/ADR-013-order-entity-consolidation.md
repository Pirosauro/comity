# ADR-013 — Order Entity Consolidation

> **Note:** This is the Community-specific transitional copy. The canonical Comity-wide version is maintained in `comity-development/docs/standards/decisions/ADR-013-order-entity-consolidation.md`
**Status:** Accepted

## Context

`@comity/order` currently exposes three contracts:

- `OrderModel` — an immutable, `readonly` interface
- `OrderCommands` — a port with `addItem`, `removeItem`, `updateItemQuantity`, `applyCoupon`, `removeCoupon`, `clear`
- `OrderRepository` — `getById(id: string)`, `save(order: OrderModel)`

The module models an aggregate that owns a full lifecycle: identity, state
(`OrderStatus`), explicit non-regressive transitions, invariants (item
quantity, non-empty cart, price aggregation), and domain behavior (currently
hosted on `OrderCommands`). Structurally, however, the aggregate is expressed
as a read-only interface — the shape of a projection — with the domain logic
living outside it in a command port.

This is the "Entity incompleta" drift identified by ADR-012 and the
preceding audits: the technical structure resembles a projection, but the
semantics are those of a lifecycle aggregate.

### Why Order cannot be a Projection

Under ADR-012, a **Projection** is an immutable read model over an entity
whose lifecycle is owned elsewhere — an external system, another bounded
context, or the application layer. `ProductProjection` in `@comity/catalog`
is the canonical example: the catalog does not own the product lifecycle, has
no persistence adapter, and exposes a repository without `save`/`remove`.

`@comity/order` is the opposite:

- `Order` owns its lifecycle: transitions (`draft → pending → confirmed →
fulfilled`, `cancelled`) are Order semantics, not a foreign system's.
- `Order` owns its invariants: quantities, empty-cart, status-transition
  legality.
- `Order` owns its persistence: `OrderRepository.save` exists.
- `OrderStatus` is not an opaque external value; it is a closed union that
  only Order may transition.

There is no external owner to point to. Declaring Order a projection would
attribute its lifecycle to a system that does not exist.

### Difference from ProductProjection

| Aspect          | `ProductProjection`                                              | `Order`                               |
| --------------- | ---------------------------------------------------------------- | ------------------------------------- |
| Lifecycle owner | External commerce backend                                        | `@comity/order` itself                |
| Transitions     | `transitionProductStatus` (pure helper)                          | Order domain methods on the aggregate |
| Persistence     | None (`getById`/`getBySlug`/`search` only)                       | `save` exists                         |
| Identifier      | Primitive `string` (externally owned, Read-Projection Exception) | Owned → `OrderId` Value Object        |
| Mutability      | Read-only by design                                              | Mutable, invariants must be protected |

### Why the current model creates ambiguity

The `OrderModel` + `OrderCommands` split gives developers two homes for the
same concept:

- New developers infer from `OrderModel` that orders are read-only snapshots,
  and from `OrderRepository.save` that they are persisted.
- Invariants are enforceable only if every caller remembers to go through
  `OrderCommands`; nothing prevents mutating or constructing `OrderModel`
  directly.
- The error surface mixes domain conditions with infrastructure and
  not-found reasons (`not_found`, `unknown`, `validation_failed`), so it is
  unclear what an `OrderError` actually represents.
- `OrderRepository` returns `string` ids and `OrderModel`, prefiguring an
  entity it does not model.

Before implementing checkout/payment, the domain must have one coherent shape.

## Decision

### Order è una Entity

`@comity/order` models `Order` as an **Entity** following the canonical
Address/Customer/Identity pattern (ADR-012 §1, `domain-modeling.md` §2, ADR-001):

- `OrderId` — Value Object owned by the module
- `OrderState` — complete persisted state
- `OrderCreate` — explicit construction contract
- `OrderUpdate` — partial modifications
- `OrderSnapshot` — immutable exported representation (`State` + `capturedAt`)
- `Order` — entity class with private state, getters, mutation methods,
  `snapshot()`

## Domain Model

### Order Entity

Responsibilities:

- maintain internal state (`#id`, `#status`, `#items`, `#price`, `#meta`,
  `#createdAt`, `#updatedAt`)
- protect its own invariants
- manage its own transitions

MUST NOT:

- know about Payment
- know about Shipping
- know about Inventory
- validate coupons or know promotion rules
- orchestrate external services

The entity enforces Order-owned invariants only. It does not validate coupons
and knows no promotion rules: coupon validity and the decision to apply a
coupon depend on external context (customer, date, campaigns, usage limits,
segments), so validation and applicability belong to `@comity/pricing` and to
application/domain services. The Order owns only the **applied result**,
stored as an immutable `Price` value: `price.modifiers`, `price.subtotal`,
`price.total`. The Order does not store modifiers separately — `Price` is the
single owner of price composition data.

Cross-aggregate concerns (pricing recomputation, coupon/promotion validation,
stock reservation, payment authorization) are orchestrated outside the entity
by application/domain services that load, mutate via entity methods, and
persist.

### Lifecycle

Initial state:

```
draft
 ↓
pending
 ↓
confirmed
 ↓
fulfilled
```

Terminal:

```
cancelled
fulfilled
```

Transitions:

```
draft     → pending | cancelled
pending   → confirmed | cancelled
confirmed → fulfilled | cancelled
fulfilled → (terminal)
cancelled → (terminal)
```

Each transition is an explicit entity method (`confirm()`, `cancel()`,
`transition()`) returning `Result`; self-transitions and backwards movement
are rejected.

**Why `fulfilled` and not `completed`:**

`fulfilled` represents the **commercial fulfilment** of the order — the order
has been executed and delivered on the merchant side. `completed` is
ambiguous: it could mean payment, delivery, or administrative closure, each a
different process owned by a different context. The lifecycle vocabulary
therefore uses `fulfilled` as the final forward state.

A future distinction between `fulfilled` and a separate `completed` state is
left open, but only if a real requirement emerges (e.g. administrative
closure distinct from commercial fulfilment). It will not be anticipated.

**Why payment/shipping are not part of `OrderStatus`:**

`OrderStatus` describes the commercial lifecycle of the Order aggregate
itself: drafting, submission, confirmation, fulfilment, cancellation. Payment
and shipping are separate bounded contexts (`@comity/payment`,
`@comity/shipping`) that observe or act on the order; folding their states
into `OrderStatus` would couple the aggregate's own lifecycle to foreign
processes and force `@comity/order` to depend on modules that do not exist
yet. Payment/shipping progress is recorded through their own modules'
contracts (and possibly events), not through Order transitions. If a
`paid`/`shipped` signal is ever required inside the aggregate, it will be
added deliberately together with those modules — as a dedicated decision, not
by leaking their state machines into `OrderStatus`.

### OrderItem Model

Decision: `OrderItem` is **NOT an Entity**. It is an **embedded value
structure** of the Order aggregate.

Motivation:

- no independent identity (the line `id` is an intra-aggregate key for
  targeting mutations, not a domain aggregate identifier)
- no lifecycle of its own
- no standalone behavior or invariants outside the aggregate
- no repository
- ownership and mutation semantics belong to Order

This matches how `AddressContact`/`CustomerContact` are modeled inside
`Address`/`Customer` and how `ProductAttribute`/`ProductOption` are embedded
in `ProductProjection`.

### OrderProductSnapshot — Product Snapshot Boundary

Decision: the product saved in the order is an **owned, immutable snapshot**
(`OrderProductSnapshot`). It is NOT `ProductProjection` from
`@comity/catalog` and it is NOT a reference to the catalog: it is a
self-contained representation of the product at purchase time, stored and
owned by the order. Once the order is created it MUST NOT depend on the
catalog for its content.

```
OrderProductSnapshot:
  - productId?  (catalog reference, when still known)
  - sku         (commercial identity)
  - name        (display name)
  - variant?    (OrderVariantSnapshot: id, sku?, name?, attributes?, options?)
  - attributes? (frozen ProductAttribute values)
  - options?    (frozen ProductOptionSelection values)
  - metadata?   (free-form, e.g. image URL, page URL)
```

The shape mirrors `ProductProjection`, `ProductVariant`, `ProductAttribute`,
and `ProductOption` from `@comity/catalog` **without importing catalog
types**. `@comity/order` MUST NOT `import type { ProductProjection } from
"@comity/catalog"` — that would create an `order → catalog` dependency and
tie the order to the catalog read model.

Boundary rules:

- `@comity/catalog` owns product definition, discovery, merchandising data,
  categories, media references, and the catalog lifecycle. Its contract is
  `ProductProjection`. It MUST NOT know about order, checkout, purchase
  history, or pricing snapshots.
- `@comity/order` owns the historical purchase record, commercial item
  identity, and the purchased-product representation. `OrderProductSnapshot`
  MUST be immutable, self-contained, and independent from the catalog after
  order creation.

Composition flow:

```
Catalog (ProductProjection)
      |
      v
Application / Checkout (maps ProductProjection → OrderProductSnapshot)
      |
      v
Order (stores owned snapshot)
```

The application/checkout maps catalog data into the owned snapshot at
creation time; the order never queries the catalog afterwards.

Pricing follows the same principle: the application/checkout maps `Price`
from `@comity/pricing` into the order, and the order stores the applied
result without requiring the pricing engine, inventory, or tax services after
creation. `@comity/pricing` is the single owner of price composition data:
`Price` carries `subtotal`, `modifiers`, and `total` together, and the order
stores the full immutable `Price` value (line item and order level). Order
contracts do NOT duplicate pricing concepts — there is no separate
`modifiers` storage; modifiers are accessed exclusively through
`price.modifiers`. The line item is conceptually `{ product:
OrderProductSnapshot; price: Price; quantity }`; `quantity` remains the
existing `number` field until a dedicated decision introduces a `Quantity`
value object. `PriceSnapshot` (`Price` + `capturedAt`, ADR-014 §7) is the
persistence/rendering form applied at the boundary when a capture instant is
needed.

Guiding principle (see `domain-modeling.md` §11):

> An aggregate may consume another module's data during creation, but it must
> not retain a dependency on that module's read model. Historical aggregates
> store owned snapshots.

Rationale: the order must remain stable and renderable for historical order
rendering, customer support, invoice generation, and returns workflows
regardless of later catalog edits, deletions, or price changes.

The dependency register (ADR-008) lists `order → pricing` (type-only);
`order → catalog` is **not** registered and MUST NOT be added.

### Historical Snapshot Boundary — Customer, Address, Payment

The product snapshot rule extends to every purchase fact: the order is the
historical aggregate and must not retain a dependency on any external
aggregate. The same principle stated above (`domain-modeling.md` §11 —
historical aggregates store owned snapshots) applies to the buyer, the
addresses, and the payment.

Order owns three additional **local, immutable snapshots** — plain data that
mirrors the external modules' shapes **without importing their types**:

```
OrderCustomerSnapshot:
  - customerId?  (customer reference, when still known)
  - displayName
  - contacts?    (OrderContact: type, value)
  - capturedAt

OrderAddressSnapshot:
  - addressId?           (address reference, when still known)
  - role                 ("shipping" | "billing")
  - lines                (plain string[] lines)
  - city, administrativeArea?, postalCode, countryCode
  - capturedAt

OrderPaymentSnapshot:
  - paymentId?   (payment reference, when still known)
  - amount       (Money, from @comity/pricing)
  - status       ("authorized" | "captured" | "failed" | "cancelled")
  - provider?, reference?
  - authorizedAt?, capturedAt?
```

Boundary rules:

- `@comity/order` MUST NOT `import type { Customer } from
  "@comity/customer"`, nor `import type { Address } from "@comity/address"`,
  nor any type from `@comity/payment` (which does not yet exist). Each of
  `customer → order`, `address → order`, `payment → order` (in the reverse
  direction) is forbidden; the order owns only these local copies.
- `displayName`/`contacts`/address fields are **display and reconciling
  facts**, not operational state: preferences, lifecycle metadata, and
  payment processing capabilities are deliberately not copied.
- The order stores the buyer and addresses **at creation** (`OrderCreate`).
  They are immutable after creation and MUST NOT be mutated through the
  generic `update()` path.
- The payment fact may arrive **after** order creation (a payment is
  processed by the Application layer while the order may still be `pending`).
  It is attached through a dedicated entity method (`attachPayment`), not
  through generic `update()` — recording a historical fact is not a generic
  mutation, and payment snapshots may be accumulated.
- Attaching a payment snapshot creates **no** `order → payment` dependency
  and grants the order **no** payment behavior: it stores the outcomes only.

Composition flow:

```
Customer → Application maps → OrderCustomerSnapshot → Order
Address  → Application maps → OrderAddressSnapshot  → Order
Payment  → Application maps → OrderPaymentSnapshot   → Order (attach after)
```

The Application Layer performs all mapping; the order never queries the
customer, address, or payment modules afterwards.

### Repository Contract

```
interface OrderRepository {
  getById(id: OrderId): Promise<Result<Order | null, RepositoryError>>
  search(criteria?: OrderSearchCriteria): Promise<Result<OrderSearchResult, RepositoryError>>
  save(order: Order): Promise<Result<void, RepositoryError>>
}
```

Rules:

- **not found → `null`** — never an error, never a `not_found` reason
- **no `remove`/`delete`** — the terminal states are `cancelled` and
  `fulfilled`; physical deletion is not a domain operation
- **no repository/domain error inside the repository contract** — the
  repository returns `Result<T, RepositoryError>`; domain failures belong to
  entity methods and domain services, never to the repository
- `OrderSearchCriteria` / `OrderSearchResult` are defined inside the module
  (pattern `CustomerSearchCriteria`) and do not reuse `@comity/search` types

### Error Semantics

Aligned with ADR-012 §4 and `errors.md`. One error class (`OrderError`), one
finite reason union, codes `order:<reason>`.

Forbidden:

- `not_found` — replaced by `null` from the repository
- `unknown` — generic fallback
- `validation_failed` — replaced by the precise domain reason

`OrderError` contains **only domain conditions** of the Order aggregate:

- `invalid_quantity`
- `invalid_status_transition`
- `invalid_item`

Explicitly NOT included:

- `repository_error` — belongs to the infrastructure layer
  (`RepositoryError` from `@comity/primitives`)
- `insufficient_stock` — belongs to `@comity/inventory`
- `product_not_available` — a catalog/inventory condition, not Order-owned
- `coupon_invalid` — coupon validation is not an Order-owned invariant; it
  belongs to `@comity/pricing` and application/domain services

Domain services that orchestrate external modules translate those modules'
failures into the appropriate module error or `RepositoryError`; they do not
invent Order reasons for foreign invariants.

### OrderCommands

Analysis: `OrderCommands` currently mixes two responsibilities:

1. **Order-owned invariants** — quantity bounds, item validity, status
   transitions on the aggregate. These belong **on the Entity** as methods.
2. **Orchestration** — pricing recomputation, coupon/promotion validation,
   inventory checks, (future) payment coordination. These belong **outside
   the Entity**, in application or domain services.

Decision: `OrderCommands` is **no longer a public domain boundary** of
`@comity/order`. It is not a public API of the module. The behavior that
protects the Order's own invariants moves **onto the Entity** (`confirm()`,
`cancel()`, `transition()`).

Future command objects (`CreateOrderCommand`, `ConfirmOrderCommand`,
`CancelOrderCommand`) **belong to the application layer**, not to
`@comity/order/domain`. They are application concerns that orchestrate
external modules and call entity methods before persisting via
`OrderRepository`. ADR-002 remains valid: the repository stays a pure
persistence port, and domain behavior does not live on it.

### Deferred Decisions — Domain Events

Decision: `Order` does **not** depend on an `EventBus`.

The possible domain events `OrderConfirmed`, `OrderCancelled`,
`OrderFulfilled` will be introduced **only when real consumers exist**
(payment, inventory, notification). They are not emitted speculatively.

The Entity must not emit infrastructure events directly: any future event
publication is handled outside the entity (application/domain services),
keeping the domain free of infrastructure coupling.

### Value Objects

#### Necessari ora

- **OrderId** — owned aggregate identity, canonical Value Object
  (validation, `equals()`, `toString()`), per ADR-012 §2.

#### Futuri

- **OrderNumber** — human-readable order reference assigned by checkout; not
  needed until checkout exists. Introduced with the checkout feature.

#### Esterni

- **Money**
- **Currency**

belong to `@comity/pricing`. `Order` consumes them; it does not own or
redefine them.

#### Non necessari

- **SKU** — a primitive reference inside `OrderProductSnapshot.sku`; no
  Order-owned validation semantics. SKU ownership is not assigned to this
  module.
- **Status** — `OrderStatus` is a closed union literal; membership is already
  enforced by the type system, and a VO would add no validation.

## Consequences

**Benefici:**

- uniform model with `Customer`/`Address`/`User` — one pattern to learn
- invariants enforced at the aggregate boundary instead of by convention
- unambiguous naming (`OrderState`/`Create`/`Update`/`Snapshot`, `OrderId`,
  `OrderSnapshot`)
- error surface expresses only Order domain conditions
- correct foundation for checkout/payment without a mid-stream redesign

**Costi:**

- breaking public API change for `@comity/order` (rename `OrderModel`,
  `OrderRepository` signature, `OrderStatus` with `fulfilled` retained as
  final state, `OrderErrorReason` union) — MAJOR bump, follows the
  breaking-change process
- migration of the error tests and introduction of entity tests
- new entity implementation (`Order`, `OrderId`, transitions)
- `OrderCommands` consumers (none in-repo today) must move to entity methods
  - services

## Migration Plan

1. This ADR (status Proposed → Accepted after review)
2. Introduce `OrderId` Value Object (+ tests)
3. Introduce `Order` entity, `OrderState`/`Create`/`Update`/`Snapshot`,
   `domain/order-transitions.ts` (+ tests, canonical pattern)
4. Migrate `OrderRepository` to `OrderId`/`Order`, add `search` with local
   criteria, keep `null` for not-found, no `remove`
5. Migrate `OrderError` to the domain-only union; rewrite error tests
6. Remove `OrderModel` (and dissolve `OrderCommands`; keep input contracts
   on entity methods/services)
7. Update consumers/tests; align docs (`docs/architecture/repository.md`,
   ADR-012 follow-up list); build, test, typecheck, coverage

## Open Questions

- **OrderNumber** — introduce with the checkout feature (recommended), not
  before
- **Money/Currency** — ownership confirmed in `@comity/pricing`; introduced
  there (ADR-014) so Order consumes them. The order stores the full immutable
  `Price` value; `PriceSnapshot` (`price` + `capturedAt`, ADR-014 §7) is the
  persistence/rendering form applied at the boundary when a capture instant is
  needed.
- **payment lifecycle** — `attachPayment` appends historical payment facts;
  multiple payment facts are allowed. A `paid` signal (if ever needed inside
  the aggregate) is a dedicated decision with `@comity/payment`, not a leak
  into `OrderStatus`
- **inventory reservation** — coordination and stock invariants belong to
  `@comity/inventory`; Order exposes product `sku` references only

## References

- `docs/standards/domain-modeling.md` — entity, lifecycle, snapshot,
  repository, read-projection rules
- `docs/standards/decisions/ADR-012-standard-domain-modeling.md` — object
  taxonomy, error semantics
- `docs/standards/decisions/ADR-001-entity-creation-and-hydration.md` —
  constructor/hydration pattern
- `docs/standards/decisions/ADR-002-repository-vs-domain-command.md` —
  repository as persistence port
- `docs/standards/decisions/ADR-008-explicit-core-module-composition-exceptions.md`
  — `order → pricing` register
- `packages/address`, `packages/customer`, `packages/identity` — canonical
  entity implementations
- `packages/catalog` — `ProductProjection` (contrast case)
