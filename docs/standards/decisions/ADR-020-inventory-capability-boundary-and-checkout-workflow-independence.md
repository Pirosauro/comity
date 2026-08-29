# ADR-020 — Inventory Capability Boundary and Checkout Workflow Independence

**Status:** Accepted

## Context

`@comity/inventory` is an established Core Module providing stock primitives:

- `Stock` — stateful aggregate owning quantities and the invariants
  `onHand >= 0`, `reserved >= 0`, `reserved <= onHand`
- `Availability` — derived view (`available = onHand - reserved`), never
  persisted, never a source of truth (ADR-017)
- `Quantity`, `Sku`, `WarehouseId`, `StockId` — Value Objects
- `Reservation` — value object recording *what was reserved* ("It has no
  lifecycle and no states: a reservation exists or it does not")
- `StockRepository` — persistence boundary (`getById`, `save`, `search`)
- `Stock.reserve()` / `Stock.release()` / `Stock.commit()` — quantity
  mutations guarded by the aggregate's own invariants
- `InventorySnapshot` — immutable fact (`sku`, `warehouseId`, `quantity`)
  intended so *other* modules can persist the inventory state that was valid
  when a business event happened (ADR-017)
- `InventoryError` — domain reasons `invalid_quantity` | `insufficient_stock`

The module's contracts already declare its scope precisely:

> "It does not validate products, does not know pricing, and does not
> orchestrate reservations — releasing a reservation is a quantity mutation on
> the stock; orchestration between stock and the parties that reserved it
> belongs to application/domain services."
> — `packages/inventory/src/entities/stock.ts`

> "carries no commercial policy (preorder, backorder, sellable, low stock —
> those belong to higher layers)."
> — `packages/inventory/src/value-objects/availability.ts`

Separately, ADR-019 established `PurchasePolicy` as an **Application-owned**
contract answering commercial eligibility ("The Catalog describes what a
product is. The Application decides whether it can be purchased."), evaluated
against a `PurchaseContext` of country, currency, and channel. Its MVP
implementation checks product status only. `@comity/storefront` contains the
`PlaceOrder` use case orchestrating Customer → Address → Catalog →
PurchasePolicy → Pricing → Order → Payment → persistence. It currently has no
dependency on `@comity/inventory`: no availability check, reservation,
release, or commit exists anywhere in checkout today.

A customer survey introduced new evidence: checkout workflows vary materially
across applications. The most common shape is approximately
*eligibility → reservation → payment → confirmation*, but another validated
workflow creates the order as draft first, takes payment, reserves
afterwards, and compensates by cancelling/refunding the payment transaction
and returning to cart while the order remains draft when reservation fails.
Further sequencing variants are expected. This is intentional evidence that
Comity must not encode one universal checkout workflow: it must provide the
capabilities and boundaries required to compose checkout workflows while the
Application decides the actual orchestration.

Already settled and not re-litigated here:

- Dependency direction: `Application → Extensions → Adapters → Core Modules →
  Kernel`; reverse dependencies are architectural defects (Layering Policy §3).
- Core-to-Core dependencies are forbidden by default; exceptions live in
  ADR-008.
- Core Modules define capabilities, not business policies (ADR-012).
- Aggregates are pure: they hold state, enforce invariants, never orchestrate
  external services (ADR-013); cross-aggregate concerns such as stock
  reservation are orchestrated by application/domain services that load,
  mutate via entity methods, and persist (ADR-013).
- `@comity/order` exposes product SKU references only; coordination and stock
  invariants belong to `@comity/inventory` (ADR-013 open question on inventory
  reservation).
- Aggregate State, Owned Historical Facts, Domain Events, Audit Trail, and
  Snapshot Diff are distinct concepts (ADR-017); `InventorySnapshot` is an
  owned fact *for other modules*, not a mechanism.
- Application Layer owns configuration, routing, presenters, and business
  orchestration (Layering Policy §2.5).

## Problem Statement

Four distinct concerns are currently at risk of being conflated as checkout
gains inventory awareness:

1. **Commercial eligibility** — may this product be sold to this buyer in this
   context? (status, geography, channel, licensing)
2. **Inventory availability** — what quantity does current stock state
   actually provide?
3. **Inventory disposition** — given insufficient availability, is the
   purchase still acceptable (e.g. future preorder/backorder semantics)?
4. **Orchestration** — in which order are eligibility, availability,
   reservation, payment, order transitions, and persistence sequenced, and who
   compensates when one capability succeeds and another fails?

Embedding any later concern into an earlier one converts an application
decision into permanent Core Module structure. The boundary must be drawn
before the first inventory-aware checkout workflow ships.

## Decision

### 1. Inventory is a capability provider

`@comity/inventory` owns and exposes exactly:

| Capability                          | Contract                                  |
| ----------------------------------- | ----------------------------------------- |
| Stock state                         | `Stock` aggregate + `StockRepository`     |
| Availability calculation            | `Availability` (derived, never persisted) |
| Quantity invariants                 | enforced inside every `Stock` mutation    |
| Reservation primitive               | `Stock.reserve(quantity)`                 |
| Release primitive                   | `Stock.release(quantity)`                 |
| Commit primitive                    | `Stock.commit(quantity)`                  |
| Inventory errors                    | `InventoryError` (`inventory:*` codes)    |
| Owned facts for other modules       | `InventorySnapshot`                       |

`@comity/inventory` MUST NOT know about Orders, Payments, `PurchasePolicy`,
checkout workflows, or any Application type. Its dependency set remains
`@comity/primitives` plus nothing else without an ADR-008 entry. The module
answers *"here is the current inventory state and the primitives to manipulate
it"* — nothing more.

### 2. Application owns inventory orchestration

Application code owns:

- whether inventory availability participates in a purchase flow at all;
- whether and when to reserve;
- whether and when to release;
- whether and when to commit;
- ordering of inventory operations relative to payment and to Order lifecycle
  transitions;
- compensation when one capability succeeds and another fails;
- mapping inventory outcomes into application-level outcomes
  (`InventoryError` → application error);
- any customer/business-specific inventory disposition rules, including what
  `insufficient_stock` means for a particular product, channel, or workflow.

### 3. PurchasePolicy remains commercial eligibility

`PurchasePolicy` answers:

> "May this product be commercially sold in this context?"

Its domain stays: product status, geography, channel authorization, customer
segment, licensing/regulatory constraints. ADR-019 is unchanged.

Inventory is **not** implicitly part of `PurchasePolicy`. Two questions are
formally distinct:

```text
"May this product be sold?"                     → commercial policy (Application)
"Can this quantity currently be reserved?"      → inventory capability (@comity/inventory)
```

No second policy type is introduced by this ADR, and no inventory fields are
added to `PurchaseContext`. If a real requirement later demands an explicit
inventory-disposition decision point, that will be a dedicated decision — not
an extension smuggled into `PurchasePolicy`.

### 4. Workflow independence

Comity does **not** mandate a universal checkout sequence. All of the
following are valid Application workflows, among others:

```text
Workflow A (reserve-first)

    PurchasePolicy → Reserve → Payment → Confirm

Workflow B (draft-first with compensation)

    Order draft → Payment → Reserve
        reserve OK   → Confirm
        reserve KO   → cancel/refund payment → return to cart → remain draft
```

Sequencing payment before reservation, reserving before payment, skipping
reservation for some products/channels, or compensating in different orders
are **Application orchestration decisions**, not Core Module responsibilities.
Core Modules must expose primitives that remain correct under any of these
sequencings; none of them may assume or encode a canonical order. Comity does
not provide one canonical checkout workflow, and none will be introduced
without a dedicated decision driven by demonstrated framework-level need.

### 5. Reservation semantics

A successful `Stock.reserve()` means exactly one thing:

> the inventory capability has successfully committed the requested quantity
> against current availability.

It does NOT mean:

- the order is confirmed or transitioned;
- payment succeeded or was even attempted;
- the product passed commercial approval;
- fulfillment is guaranteed;
- the customer has been charged;
- any Order or Payment state changed.

Likewise `Stock.commit()` and `Stock.release()` are inventory operations only:
they reduce/consume or give back reserved quantity. They do not own, trigger,
or imply Order lifecycle transitions or Payment state changes. Conversely,
Order transitions (`submit()`, `confirm()`, `cancel()`) and Payment outcomes
never mutate inventory by themselves — only the orchestrating Application
workflow connects them.

### 6. `insufficient_stock` is an outcome, not a verdict

`InventoryError("insufficient_stock")` reports an inventory fact: the
requested quantity cannot currently be reserved. It does not, by itself,
define whether the overall purchase must fail.

Whether insufficient availability makes a purchase unacceptable — versus
triggering a future preorder/backorder path, a split fulfillment, a waitlist,
or any other disposition — is a business rule. This ADR deliberately does not
define that rule, does not add preorder/backorder fields or APIs, and does not
design those mechanics. The module boundary guarantees only that such rules
can be added later at the Application layer **without changing inventory's
basic semantics**: the capability keeps answering "can I reserve?" and the
Application keeps deciding "what does the answer mean for this sale?"

### 7. Order relationship — deferred

`InventorySnapshot` already exists as an inventory-owned fact that other
modules *may* persist at business-event time (ADR-017). Whether
`@comity/order` should hold inventory facts alongside its existing customer,
address, product, and payment snapshots is **not decided here**.

This ADR distinguishes the two halves explicitly:

- `InventorySnapshot` as an inventory capability/fact — exists today,
  unchanged;
- whether Order chooses to persist such a fact — deferred.

No inventory field is added to Order merely for symmetry with
`OrderPaymentSnapshot`. Not every inventory operation becomes an Order
historical fact. The decision requires real consumers (historical rendering,
support tooling, dispute resolution) demonstrating that the inventory state at
purchase time is part of the commercial record; symmetry alone does not
justify growing the aggregate.

### 8. Compensation ownership

When multiple independent capabilities participate in a workflow, compensation
belongs to the Application workflow that composed them. Both directions are
Application decisions:

```text
payment succeeds → reservation fails → Application decides whether/how to compensate
reservation succeeds → payment fails → Application decides whether/how to release
```

No Saga, transaction manager, workflow engine, event bus, retry framework, or
reservation service is introduced. Such mechanisms are future architectural
decisions only if a real requirement emerges, per the same standard applied by
ADR-015–ADR-018.

## Ownership / Layering

Per the official dependency direction:

```text
Application → Extensions → Adapters → Core Modules → Kernel
```

| Concern                                              | Owner                        |
| ---------------------------------------------------- | ---------------------------- |
| Stock state, availability math, quantity invariants  | `@comity/inventory`          |
| Reserve / release / commit primitives                | `@comity/inventory`          |
| `insufficient_stock` reporting                       | `@comity/inventory`          |
| Whether availability gates a purchase                | Application                  |
| Whether/when to reserve, release, commit             | Application                  |
| Sequencing vs. payment and Order transitions         | Application                  |
| Compensation across capabilities                     | Application                  |
| Meaning of `insufficient_stock` for a sale           | Application                  |
| Commercial eligibility                               | `PurchasePolicy` (Application) |
| Inventory disposition policy (future)                | Deferred                     |
| Persisting inventory facts inside Order              | Deferred                     |

Forbidden dependency edges (none exist today; none may be added):

```text
@comity/inventory ↛ @comity/storefront
@comity/inventory ↛ PurchasePolicy
@comity/inventory ↛ PlaceOrder
@comity/inventory ↛ @comity/order
@comity/inventory ↛ @comity/payment
```

## Relationship with Existing ADRs

- **ADR-012** — inventory remains a pure Core Module exposing capabilities,
  not policies; error semantics unchanged.
- **ADR-013** — unchanged and reinforced: Order owns snapshots of purchase
  facts, exposes SKU references only, and never coordinates stock; the
  reservation open question is resolved *in favor of the status quo* (no
  Order-side reservation lifecycle), with Order-persisted inventory facts
  explicitly deferred (§7).
- **ADR-014** — pricing stays pure calculation receiving already-eligible
  data; inventory primitives are likewise consumed, never invoked from within
  pricing.
- **ADR-017** — `InventorySnapshot` remains an owned fact for other modules;
  this ADR adds no history mechanism and defers any Order-side persistence of
  that fact.
- **ADR-018 / ADR-019** — same principle extended one step further: the
  aggregate decides what may change; the Catalog describes what a product is;
  the Application decides whether it can be purchased, when stock moves, and
  how failures compensate.
- **Layering Policy** — no new dependency edges; Core-to-Core register
  (ADR-008) unchanged.

## Alternatives Considered

**Inventory owns the checkout workflow.** Rejected: would make
`@comity/inventory` depend on Order/Payment concepts, violating layering and
the module's own declared scope; survey evidence shows workflows differ, so a
workflow embedded in inventory could not serve more than one of them.

**`PurchasePolicy` absorbs inventory.** Rejected: collapses two formally
distinct questions ("may this be sold?" vs. "can this be reserved?") into one
contract; forces every commercial-policy implementation to also implement
stock mechanics; contradicts the module boundary already documented inside
`Availability` itself. Preorder/backorder would then silently become a
commercial-eligibility concern even though it is a stock-disposition concern.

**Order owns the reservation lifecycle.** Rejected: contradicts ADR-013 (the
aggregate holds purchase facts, coordinates nothing) and would require
`order → inventory` coupling with no registered exception; reservations have
no Order-owned invariants.

**Mandate a single universal sequence (e.g. always reserve-before-payment).**
Rejected: directly contradicted by surveyed customer workflows that pay first
and reserve afterwards; a framework-level canonical order would force
applications to fight the framework instead of composing their own flows.

**Introduce a generic workflow/orchestration engine now.** Rejected: no
second-consumer evidence exists; ADR-018's standard applies — extraction
waits for demonstrated reuse via separate ADR.

## Consequences

### Positive

- Inventory remains minimal and independently replaceable.
- Payment, Order, and Inventory stay independently composable in any sequence
  the business requires.
- The Application owns business orchestration, where enterprise behavior
  emerges (Layering Policy §2.5).
- No premature workflow abstraction; new sequencing variants require zero
  Core Module changes.
- `insufficient_stock` gains a precise, stable meaning (an outcome) that
  future disposition rules can build upon without breaking changes.
- Surveyed Workflow A and Workflow B are both expressible today with the
  existing primitive set.

### Negative / Trade-offs

- Applications must explicitly orchestrate inventory; Comity provides no
  ready-made checkout pipeline.
- Compensation across capabilities is entirely the composing Application's
  responsibility; Comity guarantees nothing about cross-capability atomicity.
- Different applications will implement materially different checkout flows —
  intended, but it means shared tooling and documentation cannot assume one
  shape.
- Until an inventory adapter exists, applications wiring inventory into
  checkout must provide their own repository implementation, as they already
  do for other MVP repositories.

## Deferred Decisions

1. **Preorder/backorder semantics** — which layer expresses them (extended
   `PurchasePolicy`, a distinct Application decision point, product/channel
   configuration) and what they mean mechanically.
2. **Reservation timing per application** — before payment, after
   authorization, after capture; deliberately unsolved.
3. **Compensation strategy** — refund-vs-release ordering, idempotency,
   failure-of-compensation handling.
4. **Order persistence of inventory facts** — whether `InventorySnapshot`
   enters the Order aggregate, and in what form.
5. **Reservation expiry / TTL** — whether reservations ever expire and who
   detects it.
6. **Production inventory adapters** — technology bindings behind
   `StockRepository`.
7. **Any future orchestration abstraction** — only upon demonstrated
   second-consumer reuse, via dedicated ADR.

None of these may be resolved implicitly by implementation drift; each
requires an explicit decision when a real requirement arrives.

## Migration / Adoption Path

1. Accept this ADR.
2. Applications wanting inventory-aware checkout add `@comity/inventory` as a
   dependency of their Application package and compose
   `availability → reserve → … → commit/release` inside their own use cases.
3. No changes to `@comity/inventory`, `@comity/order`, `@comity/payment`,
   `@comity/catalog`, or `@comity/storefront` are required by this ADR.
4. Deferred decisions are reopened only by dedicated ADRs backed by real
   requirements.

## References

- `docs/standards/layering-policy.md` — layer definitions, dependency
  direction, mechanisms-not-policies, Application ownership of orchestration.
- `docs/standards/errors.md` — error model; `insufficient_stock` as an
  additive, semantic reason.
- `docs/standards/decisions/ADR-008-explicit-core-module-composition-exceptions.md`
  — Core-to-Core dependency register (unchanged by this ADR).
- `docs/standards/decisions/ADR-012-standard-domain-modeling.md` — Core Module
  purity, error semantics.
- `docs/standards/decisions/ADR-013-order-entity-consolidation.md` — aggregate
  purity; SKU-reference-only rule; inventory reservation open question.
- `docs/standards/decisions/ADR-014-pricing-domain-model.md` — pure
  calculation modules consume, never orchestrate.
- `docs/standards/decisions/ADR-017-aggregate-history-and-audit-boundary.md` —
  state / derived value / owned snapshot separation; `InventorySnapshot` as a
  fact for other modules.
- `docs/standards/decisions/ADR-018-order-address-mutability-and-temporal-customer-data-boundary.md`
  — "the aggregate decides what may change; the Application decides what is
  worth remembering."
- `docs/standards/decisions/ADR-019-product-purchasability-policy-boundary.md`
  — `PurchasePolicy` as Application-owned commercial eligibility.
- `docs/standards/decisions/ADR-021-capability-vs-workflow.md` — general
  capability-vs-workflow principle; this ADR is a specific instance.
- `packages/inventory/src/entities/stock.ts`,
  `packages/inventory/src/value-objects/reservation.ts`,
  `packages/inventory/src/value-objects/availability.ts`,
  `packages/inventory/src/contracts/stock-repository.ts`,
  `packages/inventory/src/contracts/inventory-snapshot.ts`,
  `packages/inventory/src/errors/inventory.ts` — capability surface formalized
  in §1.
