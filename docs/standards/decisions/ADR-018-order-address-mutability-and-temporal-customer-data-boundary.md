# ADR-018 — Shipping Destination Mutability and Application-Owned Temporal History

**Status:** Proposed

> This ADR supersedes the previous Proposed draft of ADR-018 ("Order Address
> Mutability and Temporal Customer Data Boundary"). That draft was never
> Accepted. Its aggregate-owned-history design — `previousShippingDestinations`,
> `OrderShippingDestinationHistoryEntry`, and history persistence inside the
> Order aggregate — is **not carried forward**.

## Context

ADR-013 consolidated `@comity/order` as a lifecycle Entity whose address facts
are immutable after creation: "The order stores the buyer and addresses at
creation (`OrderCreate`). They are immutable after creation and MUST NOT be
mutated through the generic `update()` path." The only sanctioned
post-creation recording is `attachPayment()`, justified because a payment fact
arrives after creation and "recording a historical fact is not a generic
mutation".

Business reality introduces one bounded requirement: the **shipping
destination** may need to change **before shipment begins**, while billing,
customer, product, and payment facts remain immutable purchase-time facts.
ADR-017 flagged exactly this tension as an open question requiring a dedicated
ADR (Future Evolution #1) without resolving it.

Already settled and not re-litigated here:

- Aggregates are pure: they hold state, enforce invariants, never emit events,
  never depend on buses (ADR-013, ADR-015 R3).
- Aggregate State, Aggregate History, Domain Events, Audit Trail, and Snapshot
  Diff are distinct concepts (ADR-017).
- Event Sourcing is not a framework capability (ADR-013, ADR-015 R6).
- Domain events require a real consumer (ADR-013, ADR-015 R7); publication
  reliability is a declared policy, never implicit (ADR-016).
- `HistoryService` / `AuditService` / `EventStore` / generic `ChangeSet` must
  not enter primitives or kernel (ADR-013, ADR-015, ADR-017).
- Core-to-Core dependencies are forbidden by default (Layering Policy §2.2,
  ADR-008); the Kernel provides mechanisms, not policies (Layering Policy §2.1).
- Adding an error reason is an additive public change with MINOR impact
  (`errors.md` §10).

## Problem Statement

Two distinct concerns are conflated and must be separated:

1. **Domain mutability.** The Order has no lawful way to replace its shipping
   destination before shipment. This is a missing domain rule and belongs to
   the aggregate.

2. **Temporal evolution.** Someone may need to remember what persisted state
   was before a significant change. Embedding that memory into every aggregate
   (the superseded draft's approach) turns one application need into permanent
   per-entity domain structure, misplacing a responsibility that the Layering
   Policy assigns above the Core Modules.

The principle established by this ADR:

> **The aggregate decides what may change.
> The Application decides what state evolution is worth remembering.**

This ADR amends and partially supersedes ADR-013 only for the shipping destination in `draft | pending`; ADR-013 remains authoritative for billing, customer, product, and payment snapshots.

## Decision

### 1. Domain mutability (`@comity/order`)

The Order aggregate owns current state, domain invariants, and domain
behavior, including a dedicated aggregate-owned operation for changing the
shipping destination:

- allowed only in `draft | pending`;
- rejected in `confirmed | fulfilled | cancelled`;
- identical input is a successful no-op;
- never reachable through the generic `update()` path (ADR-013);
- returns the canonical `Result` shape with an Order-owned failure reason;
- emits nothing;
- stores **no temporal history** and does not depend on any history mechanism.

| Order status | Shipping destination |
| ------------ | -------------------- |
| `draft`      | Mutable              |
| `pending`    | Mutable              |
| `confirmed`  | Immutable            |
| `fulfilled`  | Immutable            |
| `cancelled`  | Immutable            |

The exact shape of the operation belongs to the implementation step, not this
ADR. Billing, customer, product, and payment facts remain governed by ADR-013
and remain immutable. The prohibition on `@comity/order` → `@comity/address`
dependencies is unchanged.

### 2. Temporal evolution (Application Layer)

Temporal history is **not** an Order domain concept. The Application Layer owns
the decision to record it. Conceptually, a use case may:

```text
Application use case
        │
        ├── load entity
        ├── capture relevant previous state
        ├── invoke aggregate domain operation
        ├── persist new state
        └── optionally record temporal history
```

A temporal record is application-owned. It is NOT aggregate state, aggregate
history, a domain event, an audit trail, event sourcing, or the source of
truth. The persisted entity state remains the source of truth.

No `HistoryService`, `TemporalHistoryService`, `HistoryRepository`,
`EntityHistory<T>`, `HistoryEntry<T>`, `ChangeSet`, `TemporalHistory<T>`,
kernel history mechanism, generic persistence API, mandatory middleware,
automatic repository capture, or universal temporal-history package is
introduced by this ADR. Ownership and boundaries are the decision; concrete
mechanics are not designed here.

If a first real use case needs temporal history, its representation may remain
local to that Application/use case. Only when a second real consumer exists
may extraction into a reusable Extension be considered, via a separate ADR.

## Ownership / Layering

Per the official dependency direction:

```text
Application → Extensions → Adapters → Core Modules → Kernel
```

| Concern                                        | Owner                          |
| ---------------------------------------------- | ------------------------------ |
| Shipping-destination mutability rule            | `@comity/order` (Core Module)  |
| Decision to record temporal evolution           | Application                    |
| Temporal-history representation and storage     | Decision to record temporal history; concrete representation local to the use case until second consumer |
| Reusable cross-cutting temporal-history mechanics | Not placed now; Extension candidate only after demonstrated reuse, via separate ADR |

Reusability alone is not sufficient justification for placing a policy in the
Kernel or in a Core Module. Kernel stays policy-free; a shared Core Module
would force Core-to-Core coupling on every consumer (ADR-008).

## Relation to ADR-017

ADR-017 remains authoritative for the distinction between Aggregate State,
Aggregate History, Domain Events, Audit Trail, and Snapshot Diff; this ADR
modifies none of its content. ADR-017 contains no numbered alternatives, and
none are attributed to it here.

This ADR resolves ADR-017's open shipping-address question differently from
the superseded draft: for this use case, temporal recording is
Application-owned. This does **not** prohibit a future aggregate from holding
domain-internal historical evidence if a real domain requirement demands that
the aggregate itself reason about its own past; such a future mechanism would
be a distinct, dedicated decision and is different from Application-owned
temporal recording.

Application-owned temporal recording and a future ADR-017 aggregate-owned
history mechanism are distinct concepts serving different purposes; both may
coexist, with the former recording use-case-level state evolution and the
latter preserving aggregate-internal evidence at domain-significant boundaries.

## Temporal History Semantics

Intentionally minimal. A temporal history record represents:

```text
entity identifier(s)
before
after
recordedAt
```

- `before` — the relevant persisted state before the successful operation;
- `after` — the resulting persisted state;
- `recordedAt` — when the temporal record was recorded.

No TypeScript interfaces or field names beyond these conceptual roles are
prescribed. Existing entity timestamps keep their existing meanings:
`OrderAddressSnapshot.capturedAt` remains "when the address fact was
captured"; `OrderSnapshot.capturedAt` remains "when the snapshot was
captured". Temporal records never repurpose entity-owned timestamps.

**Granularity.** Temporal history is recorded at an Application use-case
boundary when that use case explicitly declares that the state transition is
significant enough to retain. There is no capture-on-every-write, no
capture-on-every-save, no hidden persistence instrumentation. The absence of a
history record MUST NOT imply that no state change occurred; it only means the
relevant use case did not record temporal history.

**Before / after payload.** Prefer the persisted entity representation already
used by the Application/repository; no new serialization format is introduced.
Payload granularity is deliberately left open: a full persisted representation
may be appropriate, or a selective representation for a concrete use case.
That choice belongs to the consuming Application/use case.

**Privacy.** Temporal history may contain persisted business data that includes
PII. Retention, minimization, access, and erasure remain
Application/persistence policies and are not modeled by the aggregate or the
Kernel.

## Persistence / Reliability Boundary

The following steps remain formally distinct and are never assumed atomic:

```text
domain mutation ≠ entity persistence ≠ history recording
                ≠ domain-event publication ≠ audit persistence
```

This ADR does not solve transactional history persistence. ADR-016 remains
authoritative for publication reliability. If a future real requirement
demands guaranteed coupling between entity persistence and temporal history
persistence, that is handled by a separate persistence/reliability decision.

**Concurrency boundary.** Temporal history must not become a second source of
truth. Correctness of concurrent entity updates remains a persistence/domain
concern independent of history. Any stronger history consistency guarantee
(ordering, idempotent recording under retries, coupled transactions) requires
a future persistence decision based on a real requirement. No locking,
versioning, sequence, or isolation mechanism is prescribed here.

Until guaranteed coupling exists, temporal history is best-effort by
construction and consumers must treat it as incomplete evidence rather than a
complete record.

## Alternatives Considered

**Aggregate-owned history (superseded draft).** Each aggregate stores its own
superseded values. Rejected: converts one application need into permanent
per-entity domain structure; duplicates recording responsibility across every
aggregate needing it; blurs the Entity shape of ADR-012/ADR-013 (current
state, invariants, behavior).

**Derive history from domain events.** Publish events like
"shipping address changed" and project them into history. Rejected: no real
consumer exists today (ADR-015 R7); completeness would depend on publication
reliability policy (ADR-016); drifts toward rejected event-sourcing semantics
(ADR-015 R6).

**Treat temporal history as Audit Trail.** Record who/why/context together
with before/after. Rejected: mixes business-state evolution with operational
provenance, which ADR-017 §4 assigns to the consumer-side audit projection.

**Repository-triggered automatic capture.** Adapters record every save.
Rejected: hidden capture-on-every-write contradicts the declared-granularity
rule, removes use-case context from the decision, and embeds policy in
adapters.

## Rejected Designs

- `previousShippingDestinations` or any history member inside `Order`.
- `OrderShippingDestinationHistoryEntry` or equivalent per-entity history types.
- History persistence inside the aggregate.
- Generic temporal semantics inside the domain model.
- `HistoryService` / `TemporalHistoryService` / `HistoryRepository` /
  `EntityHistory<T>` / `ChangeSet` / kernel history mechanisms.
- Automatic capture on every write; universal temporal-history packages.
- Retroactive backfill of history for entities persisted before adoption.
- A new `fulfillmentStatus` field or shipping state machine in `OrderStatus`.

## Consequences

**Positive:**

- Order remains simple: current state, invariants, and one lifecycle-gated
  mutation.
- Temporal evolution can serve Order, Customer, Product, or any other entity
  without per-entity history structures.
- No premature framework abstraction; extraction waits for demonstrated reuse.
- Domain state, temporal history, domain events, and audit remain distinct.

**Negative:**

- Application code must explicitly decide when history matters.
- History is not automatically complete; absence of records proves nothing.
- Different applications may initially represent temporal records differently.
- A reusable abstraction may eventually be desirable, but that decision is
  deferred until real reuse exists.

## Migration / Adoption Path

1. Accept this ADR; it supersedes the previous Proposed draft.
2. **Reconcile prior implementation separately.** An implementation
   belonging to the superseded draft exists (aggregate-owned history
   fields/types/tests and a changeset). Any such implementation must be
   reconciled in a dedicated implementation step before implementing this
   decision; this ADR neither blesses nor preserves it.
3. Implement the Order mutability rule: aggregate-owned operation, status
   gate, no-op semantics, dedicated error reason (additive; HTTP mapping and
   MINOR version impact per `errors.md`; final identifier aligned with
   `errors/order.ts`), and tests. No history code ships with this step.
4. When the first real use case needs temporal history, implement recording
   locally in that Application/use case.
5. Future decisions (each separate): second-consumer Extension extraction;
   persistence/reliability contract if guaranteed coupling becomes a real
   requirement; post-confirmation changes requiring explicit fulfillment/
   shipping state outside `OrderStatus`.

## Future Evolution

1. First real temporal-history consumer (representation local to its use case).
2. Second real consumer — evaluate shared semantics and possible Extension
   extraction via a dedicated ADR.
3. Persistence/reliability contract for guaranteed entity+history coupling,
   driven by a real requirement (with ADR-016 remaining authoritative for
   publication).
4. Post-confirmation shipping changes requiring explicit fulfillment/shipping
   state (dedicated decision, consistent with ADR-013's separation of payment/
   shipping contexts).

## Open Questions

- Exact representation of the first Application-owned temporal record.
- Whether the first consumer needs full or selective before/after payloads.
- Whether the first consumer needs a use-case identifier in its records.
- When a second consumer exists: do shared semantics justify an Extension?

## References

- `docs/standards/layering-policy.md` — layer definitions, Extensions,
  dependency direction, mechanisms-not-policies.
- `docs/standards/errors.md` — additive reasons, HTTP hints, version bumps.
- `docs/standards/decisions/ADR-012-standard-domain-modeling.md` — object
  taxonomy, error semantics.
- `docs/standards/decisions/ADR-013-order-entity-consolidation.md` — address
  immutability, `attachPayment()` precedent, lifecycle, deferred events.
- `docs/standards/decisions/ADR-014-pricing-domain-model.md` — pricing
  ownership outside the Order.
- `docs/standards/decisions/ADR-015-domain-events-boundary.md` — event
  ownership/publication, R3/R6/R7.
- `docs/standards/decisions/ADR-016-event-publication-reliability-policy.md` —
  non-assumed atomicity, declared reliability.
- `docs/standards/decisions/ADR-017-aggregate-history-and-audit-boundary.md` —
  five-concept boundary; Future Evolution #1 resolved by this ADR.
- `packages/order/src/entities/order.ts`,
  `packages/order/src/contracts/order.ts`,
  `packages/order/src/contracts/address-snapshot.ts`,
  `packages/order/src/errors/order.ts` — current implementation evidence.
