# ADR-017 — Aggregate History and Audit Boundary

> **Note:** This is the Community-specific transitional copy. The canonical Comity-wide version is maintained in `comity-development/docs/standards/decisions/ADR-017-aggregate-history-and-audit-boundary.md`
**Status:** Proposed

## Context

ADR-013 consolidated `@comity/order` into a lifecycle aggregate. The entity
(`packages/order/src/entities/order.ts`) holds **current state** (`#status`,
`#items`, `#price`) alongside **owned historical facts** it captures at purchase time
(`#customer`, `#addresses`, `#payments`) as owned, immutable snapshots. ADR-015
and ADR-016 then separated **domain events** and **event publication
reliability** from the primitive `EventBus`.

The result is that several related but distinct concepts now coexist around an
aggregate, and the boundary between them is not formally drawn:

- **Aggregate State** — what the aggregate is right now (mutable, validates transitions).
- **Owned Historical Facts** — immutable snapshots captured at business-significant moments (purchase time, payment attachment), stored as part of current state.
- **Aggregate History** — a *future* per-aggregate mechanism for recording a sequence of significant snapshots over time. Does not exist today.
- **Domain Events** — facts broadcast so *other* components can react.
- **Audit Trail** — who/when/why/from-what-context a change happened.
- **Snapshot Diff** — the derived difference between two points in time.

The current `Order` entity stores owned historical facts as part of its current
state (e.g. `#payments` is appended through `attachPayment`), and there is no
mechanism to answer "what changed between `t1` and `t2`?" without external
tooling. Meanwhile `@comity/inventory` already demonstrates the correct
separation of **state**, **derived value**, and **owned snapshot for others**:
`Stock` is a stateful aggregate, `Availability` is a derived value, and
`InventorySnapshot` is an owned fact other modules (e.g. order) persist at
business-event time.

Without an explicit boundary, future work tends to produce a **global
`HistoryService`**, an **`AuditService`**, an **`EventStore`**, or a **generic
`ChangeSet` framework** — abstractions that ADR-013/015/016 already implicitly
forbid. This ADR draws the boundary explicitly so that these concepts are never
silently merged.

The following are already settled:

- Aggregates are **pure** (ADR-013): they hold state, enforce invariants, and do
  not emit events or depend on a bus.
- Domain events are **Application-published** and only exist when a real consumer
  exists (ADR-013 deferred, ADR-015).
- `EventBus` is a **best-effort notification mechanism**, not a reliable
  business transport and never a store (ADR-015, ADR-016).
- `HistoryService` / `AuditService` / `EventStore` must **not** enter
  primitives or kernel (ADR-013, ADR-015).
- Event Sourcing is **not** a framework capability (ADR-013, ADR-015).

## Decision

Comity treats five concepts as **distinct** and draws an explicit boundary
between them. An aggregate owns its **state** and its **owned historical facts**;
it neither publishes **domain events** nor produces **audit trails**. A
per-aggregate **history mechanism** is a future concern, not a current
capability. **Snapshot diff** is a derived function, never a source of truth.

### The five concepts

| Concept                    | Definition                                                        | Owned by                          | Persistence                     |
| -------------------------- | ----------------------------------------------------------------- | --------------------------------- | ------------------------------- |
| Aggregate State            | Current, mutable truth of the aggregate                           | Aggregate                         | Aggregate repository            |
| Owned Historical Facts     | Immutable snapshots captured at business moments, stored in state | Aggregate                         | Aggregate repository (embedded) |
| Aggregate History Mechanism | *Future:* per-aggregate sequence of significant snapshots         | Aggregate (when introduced)       | Aggregate-owned (when introduced) |
| Domain Events              | Broadcast facts so other components react                         | Core Module (type) / Application (publication) | Transport-dependent (ADR-016) |
| Audit Trail                | Who/when/why/context projection of a change                       | Application / observer            | Consumer-side projection        |
| Snapshot Diff              | Derived difference between two snapshots                          | Derived, stateless                | Never persisted as truth        |

Each is elaborated in **Domain Concepts**.

## Domain Concepts

### 1. Aggregate State and Owned Historical Facts

The **current state** of an aggregate: the values that make up its identity,
its invariants, and its lifecycle position at this instant.

**Owned Historical Facts** are immutable snapshots captured at business-significant
moments (e.g. purchase time, payment attachment) and stored as part of the
aggregate's current state. They are **not** a separate history mechanism — they
are embedded facts that travel with the aggregate.

For `Order`, the aggregate owns two distinct kinds of data:

```
Order

Current State:
  - id, status
  - items (embedded value structures)
  - price
  - meta
  - createdAt, updatedAt

Owned Historical Facts (embedded in current state):
  - customer snapshot         (captured at creation, immutable)
  - address snapshots         (captured at creation; shipping address mutability pre-shipment is open — see ADR-018)
  - payment snapshots         (appended via attachPayment, immutable once recorded)
```

Both are **owned by the aggregate**, but they have **different meanings**.
**Current State** is what the aggregate is right now: it is **mutable** through
protected entity methods and is persisted by the aggregate's repository
(`OrderRepository.save`). It is the entity's truth for reading and for
validating transitions. **Owned Historical Facts** are the immutable
historical evidence captured at business moments (ADR-013): they are **not**
current operational state — they record what the customer, addresses, and
payments were at the moment the order consumed them. Presenting them as if
they were ordinary state conflates "what the aggregate is now" with "what the
aggregate observed in the past."

### 2. Aggregate History Mechanism (Future)

**Aggregate History** is a *future* per-aggregate mechanism for recording a
sequence of significant snapshots over time. It does not exist today.

Its intended purpose, when introduced for a specific aggregate that needs it:

- preserve relevant historical evidence that must outlive current state;
- explain the significant state transitions an aggregate passed through (what
  the aggregate observed at a prior point, not merely what it is now);
- support domain-level debugging (understanding how a state was reached).

**Aggregate History does NOT exist to rebuild aggregate state from history.**
It preserves evidence; it is never a process by which the aggregate's current
state is reconstructed. Current state is maintained and persisted by the
aggregate and its repository (ADR-013), and the historical record is evidence
of what happened, not an input stream from which state is regenerated.

When introduced, a history mechanism is:

- **aggregate-owned and aggregate-scoped** — lives close to the aggregate, bounded by its own concerns;
- **never a global `HistoryService`** with cross-aggregate scope;
- **never a generic repository** (`HistoryRepository`) for all aggregates;
- **a historical record**, never an event log or an event-sourced stream.

The snapshot pattern already present in `@comity/order` (`OrderSnapshot` = `State` + `capturedAt`)
captures a point in time. What is missing today is a formal notion of "a
sequence of significant snapshots over time" — and that notion, when introduced,
belongs to the aggregate, not to a global service.

### 3. Domain Events

Facts that exist so **other** components can react. They are:

- **Application-published** (ADR-015): the aggregate never emits.
- introduced only when a **real consumer** exists (ADR-013).
- carried on a transport whose reliability is **declared** (ADR-016).

Examples:

- `OrderConfirmed` — a notification consumer or downstream module reacts.
- `PaymentCaptured` — inventory or accounting reacts.

A domain event is a **broadcast** of a fact, distinct from the aggregate's
**internal** historical facts. Historical facts answer "what happened to this
aggregate?"; a domain event answers "what must the rest of the system know?"

### 4. Audit Trail

A **projection** recording the operational provenance of a change:

- **who** initiated it;
- **when** it happened;
- **why** (the reason/trigger);
- **from what context** (request, actor, session, correlation id).

The Audit Trail is a **consumer-side projection** built from facts (including,
optionally, domain events). It is:

- **not** owned by the aggregate (the aggregate knows neither actors nor
  operational context);
- **not** in the kernel or primitive layer;
- **not** an aggregate's internal historical facts (historical facts are domain
  facts; audit is operational provenance).

Because it is a projection, the audit trail is produced by an **Application or
observer** layer that has access to actor/context metadata the aggregate does
not carry.

**Business reason vs. audit metadata.** A clear distinction is drawn between two
kinds of "why":

- **Business rationale** — part of the *meaning* of the domain. It is carried by
  the Domain Event itself, because it changes the domain's semantics. It is owned
  by the Core Module.

  Example:

  ```
  OrderConfirmed {
    orderId,
    confirmationReason
  }
  ```

- **Audit metadata** — part of the *operational context* in which a change
  happened. It belongs to the Audit Trail, not to the domain fact. It is owned by
  the Application/observer that records the projection.

  Example:

  ```
  {
    actorId,
    requestId,
    correlationId,
    sessionId
  }
  ```

Rule:

- If the reason **changes business meaning**, it belongs to the **Domain Event**.
- If it **describes execution context**, it belongs to the **Audit**.

`confirmationReason` that alters what the confirmed order means is domain
semantics and travels on `OrderConfirmed`. `actorId`/`requestId`/
`correlationId`/`sessionId` describe *who and from where* the confirmation was
issued; they are operational provenance recorded as an audit projection, never
smuggled into the domain event's meaning.

### 5. Snapshot Diff

`diff(snapshotA, snapshotB)` is a **derived function**: a stateless comparison
that computes what changed between two points in time.

A Snapshot Diff:

- **is a stateless derived calculation** — computed on demand, it holds no state
  and owns nothing;
- **is not persisted truth** — it is a view computed from two snapshots; it
  persists nothing and never becomes the source of truth;
- **is not an aggregate command** — it does not mutate the aggregate and is not
  a way to apply changes;
- **does not become a generic `ChangeSet` framework** — no generic
  mutation-descriptor types, no change model that aggregates carry or that
  becomes part of their contract.

For the same reason, `aggregate.apply(ChangeSet)` (or any equivalent) is
**forbidden**: a diff is a read-only observation, never an input that a command
applies to re-fashion aggregate state. Applying a change set would make a derived
view the driver of mutation, inverting the boundary between "what happened" and
"what the aggregate is."

A diff is useful for display ("what changed in this order?"), debugging, and
derived reporting. It never replaces the source snapshots and never becomes a
persisted model.

## Ownership Rules

- **Aggregate State** is owned by the aggregate and its repository.
- **Owned Historical Facts** are owned by the aggregate, embedded in its state,
  and persisted by the aggregate repository.
- **Aggregate History Mechanism** (when introduced) is owned by the aggregate
  and is aggregate-scoped. It is never a global service or a generic repository.
- **Domain Events** types are owned by the Core Module that owns the aggregate
  (ADR-015 R1); their **publication** is owned by the Application (ADR-015 R2).
- **Audit Trail** is owned by the Application/observer as a projection; it is
  not owned by the aggregate, kernel, or primitives.
- **Snapshot Diff** is owned by no one: it is a derived, stateless function
  applied to snapshots.

Dependency direction follows layering, and ownership stays flat within each
layer — nothing here makes Audit or Domain Events the owner of the aggregate:

```
Core Module Aggregate
    |
    +--> Aggregate State (includes Owned Historical Facts)

Application Layer
    |
    +--> Domain Event Publication   (Application publishes; aggregate state/facts supply facts)
    |
    +--> Audit Projection           (Application/observer records provenance)

Adapter
    |
    +--> Persistence                (infrastructure; realizes state repository & any declared transport)
```

An aggregate must never reach up to an audit service, a global history service,
or an event bus. External modules must never reach into an aggregate's owned
facts as if they were their own. Audit and Domain Events are **consumers/producers at
the Application layer**, downstream of the aggregate's state and facts; they do
not own the aggregate, and the aggregate does not depend on them.

## Examples

### Order: state vs. historical facts vs. events vs. audit

A customer confirms an order:

1. **State** — `Order.confirm()` transitions `pending → confirmed`; `#status`
   changes; `OrderRepository.save` persists it.
2. **Owned Historical Facts** — the order already holds customer/address/payment
   snapshots captured at creation and payment attachment. No separate history
   recording occurs today. When a history mechanism is introduced (Future
   Evolution #2), a significant snapshot at this transition would be recorded
   aggregate-scoped to preserve the relevant historical evidence.
3. **Domain Event** — the Application observes the confirmed fact and, because a
   notification consumer exists, publishes `OrderConfirmed` through a
   `DomainEventPublisher` (ADR-015, ADR-016). The aggregate emits nothing.
4. **Audit Trail** — the Application/observer records "customer `X` confirmed
   order `Y` at `t`, from context `C`" as a projection. The aggregate has no
   actor knowledge.

### Payment: snapshot vs. ledger

`OrderPaymentSnapshot` (`packages/order/src/contracts/payment-snapshot.ts`) is a
fact the order owns for its own historical record:

```
OrderPaymentSnapshot:
  - paymentId?      (reference to payment module)
  - amount          (Money)
  - status          ("authorized" | "captured" | "failed" | "cancelled")
  - provider?, reference?
  - authorizedAt?, capturedAt?
```

`OrderPaymentSnapshot` is **NOT a Payment Ledger**. A ledger is the operational
record of money movement owned by the (future) `@comity/payment` module, which
will own:

- **authorization**
- **capture**
- **refund**
- **chargeback**
- **ledger**

**`OrderPaymentSnapshot` MUST NOT become a mirror of the Payment lifecycle.**
The future `@comity/payment` module owns the full payment lifecycle —
authorization, capture, refund, chargeback, and the ledger — as its operational
truth. The order owns **only the facts relevant to Order consistency** (did a
payment get authorized/captured/failed/cancelled for this order, at what amount,
via which provider). It does not own, reproduce, mirror, or depend on the
ledger. Ledger operations live in the payment module; the order records outcomes
only (ADR-013 historical snapshot boundary). The `OrderPaymentStatus` union
intentionally captures the limited subset of the payment lifecycle the order
needs to reason about consistency, **without importing** payment types and
**without becoming** a payment ledger. If the payment module's lifecycle grows,
`OrderPaymentSnapshot` does not grow with it; it stays a thin, order-scoped
fact.

### Inventory: state / derived / owned snapshot separation

`@comity/inventory` models a correct separation of **state**, **derived value**,
and **owned snapshot for other modules**:

- `Stock` — stateful aggregate (owns `onHand`, `reserved`).
- `Availability` — derived value (`onHand - reserved`), never persisted.
- `Reservation` — immutable value, no lifecycle.
- `InventorySnapshot` — owned fact (sku, warehouse, quantity) other modules
  (e.g. order) persist at business-event time; never a live `Stock` or
  availability logic.

This demonstrates the pattern ADR-017 generalizes: state (Stock), derived view
(Availability), and owned snapshot for others (InventorySnapshot) are separated,
and nothing is a global history or audit service. Inventory does not have a
history mechanism either — `InventorySnapshot` is a fact for *other* modules.

### Snapshot Diff

Given two `OrderSnapshot` values, `diff(before, after)` returns a read-only
description such as:

- status `pending → confirmed`;
- quantity changed for item `id`;
- payment appended.

The result is computed on demand, persisted nowhere, and never treated as the
source of truth for the order.

## Alternatives Considered

**A global `HistoryService`.** A cross-aggregate service that records and
queries every aggregate's history. Rejected: it centralizes knowledge that
belongs to each aggregate, couples unrelated aggregates, and contradicts
"who owns this responsibility?" — history is aggregate-scoped.

**A generic `HistoryRepository`.** One repository that persists snapshots or
change records for all aggregates. Rejected: it inverts ownership (a repository
should serve one aggregate's persistence), and it is a form of the generic
`EventStore`/`ChangeSet` the framework forbids.

**Aggregate emits domain events directly.** The aggregate publishes its own
events when it transitions. Rejected by ADR-013/015: aggregates must stay pure
and Application decides publication.

**Aggregate produces the audit trail.** The aggregate records who/when/why.
Rejected: the aggregate does not know actors or operational context; audit is a
projection built by the Application/observer.

**Treat Aggregate History as Event Sourcing.** Rebuild aggregate state from a
sequence of historical snapshots (Event Sourcing). Rejected: Event Sourcing is
not a framework capability (ADR-013, ADR-015); aggregates persist state through
repositories and history is a map of significant transitions, never a source
from which current state is regenerated.

## Rejected Abstractions

The following are **not introduced** and are considered architectural defects if
added:

- **`HistoryRepository`** — a generic repository for aggregate history.
- **`AuditService`** — a cross-cutting service owned by a Core Module or placed
  in primitives/kernel.
- **`EventStore`** — an event store; the `EventBus` is a broadcast mechanism,
  never a database (ADR-015 R6, ADR-016).
- **Event Sourcing framework** — state is not derived from the history record;
  history preserves evidence, it is not a stream from which state is regenerated.
- **Generic `ChangeSet`** — a framework of mutation-descriptor types that
  aggregates carry or that becomes part of contracts. `diff` is a derived
  function, not a persisted model.

Each of these merges two or more of the five distinct concepts above (or places
an ownership where it does not belong), violating layering and the aggregate
boundary.

## Future Evolution

The following require dedicated decisions when a real need lands; none is
implemented here.

1. **Address mutability (open problem, dedicated ADR required — ADR-018).**
   ADR-013 declares `OrderAddressSnapshot` **immutable**, captured at creation.
   Business reality: a **shipping** address may change **before shipment**
   (customer updates the delivery destination after ordering). These two
   requirements are in tension. This ADR does **not** resolve the conflict — it
   flags it. A dedicated ADR must decide:
   - whether the shipping address is replaceable before shipment while the
     historical record is preserved;
   - whether a changed address is a new fact appended to history or a mutation
     of current state;
   - how a snapshot diff reflects the change.
   The billing address and the historical product/customer facts remain
   immutable (ADR-013); only the pre-shipment shipping address is in question.

2. **Per-aggregate history mechanism.** A concrete, aggregate-scoped way to
   record significant snapshots over time (e.g. versioned snapshots) when
   preserving the historical record is actually required. Introduced only
   for the aggregate that needs it, never as a global service. When introduced,
   capture should happen at **aggregate-defined significant boundaries** (not
   every mutation). Significant boundaries are determined by the Core Module
   that owns the aggregate. Examples of likely significant boundaries:
   - order confirmed
   - payment attached
   - fulfillment started
   Not automatically recorded:
   - every quantity increment
   - every internal technical mutation
   A generic rule like "capture on every write" is explicitly rejected: it
   conflates persistence with historical evidence and would turn every technical
   mutation into historical noise.

3. **Audit projection.** A concrete Application/observer audit trail that builds
   who/when/why/context projections from facts and events. An Application
   concern, never primitives/kernel.

4. **Domain event types.** `OrderConfirmed`, `PaymentCaptured`, `OrderCancelled`
   etc. only when real consumers exist (ADR-013 deferred, ADR-015).

5. **Payment module.** The future `@comity/payment` module owns authorization,
   capture, refund, chargeback — the ledger. The order continues to own only
   `OrderPaymentSnapshot` facts.

> **Principle:** A snapshot is a fact, not a mechanism; a diff is a view, not a
> store; and an aggregate's history is the aggregate's own memory, never a
> global ledger.

## References

- `docs/standards/decisions/ADR-013-order-entity-consolidation.md` — aggregate
  purity, snapshot boundary, deferred domain events, immutable address fact.
- `docs/standards/decisions/ADR-015-domain-events-boundary.md` — domain event
  ownership, Application publication, `EventBus` as mechanism, no event store.
- `docs/standards/decisions/ADR-016-event-publication-reliability-policy.md` —
  `EventBus` not a business transport; reliability declared at Application.
- `docs/standards/decisions/ADR-012-standard-domain-modeling.md` — object
  taxonomy, projection vs. entity, error semantics.
- `packages/order/src/entities/order.ts` — aggregate state + owned historical facts.
- `packages/order/src/contracts/payment-snapshot.ts` — `OrderPaymentSnapshot` vs.
  payment ledger.
- `packages/order/src/contracts/address-snapshot.ts` — address snapshot
  (open question for pre-shipment shipping address — ADR-018).
- `packages/order/src/contracts/order.ts` — `OrderState` / `OrderSnapshot`
  (`State` + `capturedAt`).
- `packages/inventory/docs/overview.md` and `docs/conventions.md` —
  `Stock`/`Availability`/`Reservation`/`InventorySnapshot` separation.
- `packages/inventory/src/contracts/inventory-snapshot.ts` — owned snapshot for
  other modules.