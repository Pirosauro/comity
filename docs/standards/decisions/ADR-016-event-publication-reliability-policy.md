# ADR-016 — Event Publication Reliability Policy

**Status:** Proposed

## Context

ADR-015 established the **Domain Events Boundary**: domain events are immutable
business facts owned by their Core Module, published by the Application Layer
through a `DomainEventPublisher`, and never emitted by aggregates. It also
asserted that `@comity/primitives` provides **mechanisms**, not policy.

This ADR addresses the *reliability* gap that ADR-015 left open: the current
`EventBus` is deliberately best-effort, and that best-effort nature is correct
for one category of event and insufficient for another.

The `DefaultEventBus` (`packages/primitives/src/lifecycle/events/bus.ts`) today:

- is **asynchronous** (`emit` returns `Promise<void>`);
- dispatches handlers via **`Promise.all`** — independent, parallel handlers;
- has **no persistence**, **no retry**, **no ordering guarantee**, **no
  idempotency**, **no duplicate handling**;
- treats handler failure as **best-effort**: a failure is routed to an
  *optional* `errorHandler` as an `EventBusError` (`handler_failed`) and the
  emit resolves normally — the emitting caller is not notified of failure.

The Kernel lifecycle gates emission through `canEmitEvents()` (only in `sealed`
or `running` states), but it adds **no delivery guarantees**; it only prevents
emission before the kernel is ready.

This behavior is the correct and intended contract for **runtime notifications**
— observability, metrics, instrumentation, lifecycle coordination:

- `http.request.completed`
- `auth.session.created`

It is **insufficient** for **business event publication** — facts that trigger
side effects in other systems, whose loss has business consequences:

- `OrderConfirmed`
- `PaymentCaptured`
- `RefundCreated`

The problem this ADR formalizes: a single best-effort broadcast mechanism must
not be implicitly treated as a reliable transport for business facts. Reliability
is a **policy** — and policy is not a primitives concern.

## Decision

### 1. `EventBus` is NOT automatically a Domain Event Transport

The primitives `EventBus` is a **best-effort notification mechanism**. Using it
for a domain event does not, by itself, confer any reliability. A domain event
published through a bare `EventBus` has the same guarantees as a runtime
notification: fire-and-forget, non-durable, unordered, possibly duplicated,
possibly lost.

The presence of the word "event" in both `EventBus` and "domain event" must not
be read as equivalence. Reliability is an explicit, declared property that a
transport must earn — it is never implicit.

### 2. Two distinct categories

The framework recognizes two distinct concepts with different reliability
contracts:

| Aspect            | Notification Transport                          | Business Event Publication                       |
| ----------------- | ----------------------------------------------- | ------------------------------------------------ |
| Component         | `EventBus` (primitives)                         | `DomainEventPublisher` (Application boundary)    |
| Delivery contract | **best effort**                                 | **declared reliability contract**                |
| Category          | runtime / observability / coordination          | business facts (`order.confirmed`, …)            |
| Durability        | **non-durable**                                 | **configurable** (in-memory → durable)           |
| Ordering          | **none** (parallel `Promise.all`)               | **declared** per use case                        |
| Failure           | routed to optional `errorHandler`, caller unaffected | **surfaced to the caller** / declared policy |
| Controller        | module runtime, facades, Kernel orchestrators   | **Application Layer**                            |

- **Notification Transport** — `EventBus`. Best effort by design. Loss of a
  notification never breaks correctness. Correct for observability, metrics,
  and runtime notifications.
- **Business Event Publication** — `DomainEventPublisher`. Has an explicit
  reliability contract, is controlled by the Application, and is backed by an
  Adapter that realizes the declared guarantees.

The Application decides, per publication, which category a given fact belongs
to. The same fact could be published through the notification path (harmless,
best-effort) or through the business path (reliability contract), but the two
must never be conflated.

### 3. Future publication space

The intended structure for reliable business event publication:

```
Application
    ↓
DomainEventPublisher      ← reliability contract, Application-controlled
    ↓
Adapter                   ← infrastructure realizing the contract
    ↓
[ In-memory | Transactional Outbox | Message Broker ]
```

- **Application** decides *what* and *when* to publish (ADR-015 ownership).
- **`DomainEventPublisher`** is the Application-boundary contract that declares
  the reliability contract (delivery, ordering, idempotency). Its concrete shape
  is future work; it is not added now.
- **Adapter** realizes the contract against a concrete technology. Possible
  implementations, each with distinct reliability properties:
  - **In-memory** — non-durable, best-effort; acceptable where loss is tolerable.
  - **Transactional Outbox** — durable: event is persisted in the same
    transaction as the aggregate mutation, then published by a relay. Provides
    at-least-once and crash safety.
  - **Message Broker** — durable, ordered, partitioned delivery via an external
    broker (e.g. a queue/topic).

The publisher contract and the adapter implementations are **not created in this
ADR**. They are described as the space in which future, dedicated decisions will
operate, each governed by the Adapter rules (ADR-007).

### 4. The transactional boundary

`Aggregate mutation + Repository persistence + Event publication` must **not** be
treated as atomic without an explicit strategy.

Why they cannot be assumed atomic:

1. **Separate systems.** The aggregate lives in memory; the repository persists
   to a store; the event goes to a transport. Each is an independent
   transaction domain with its own failure modes.
2. **Two-phase inconsistency.** If the aggregate is mutated and persisted but
   publication fails, the system is consistent in state but the fact is never
   communicated. If publication happens before persistence, a crash can leave an
   event for a change that never persisted — a phantom fact.
3. **No implicit distributed transaction.** Comity provides no transaction
   manager spanning memory, repository, and transport. Pretending these three
   steps are one atomic unit is an architectural defect; it hides the real
   failure points.
4. **Ordering of steps is a policy.** Publishing before vs. after persistence
   yields different failure semantics. Which is correct is a business decision
   the Application must make explicitly, per use case.

Consequence: achieving atomicity requires an **explicit strategy** at the
Application boundary — e.g. the **Transactional Outbox** pattern, where the event
is written in the same repository transaction as the aggregate state and only
then relayed. Atomicity is never assumed and never smuggled into the Kernel or
primitives. If no explicit strategy exists, the publication is best-effort and
must be treated as such.

### 5. Reliability policy (defined, not implemented)

This ADR defines the *policy dimensions* each reliable publication must address.
It does **not** implement them; each requires an explicit decision and an
adapter capable of honoring it.

- **Ordering**
  - Is per-aggregate/per-source ordering required, or is per-topic ordering
    sufficient?
  - Ordering of `order.confirmed` relative to `order.payment_captured` may be
    semantically significant.
  - If ordering is required, the transport must guarantee it; best-effort
    parallel dispatch does not.

- **Retry**
  - Does publication retry on transient failure, and with what backoff?
  - A retry policy interacts with idempotency: a retried publication may
    duplicate an event.

- **Idempotency**
  - Is a consumer safe against receiving the same event more than once?
  - A stable event identity (e.g. an aggregate-id + fact-type + sequence) is
    required to make consumers idempotent. The framework does not provide a
    generic `DomainEvent` base class (ADR-015); identity is a per-module
    contract.

- **Duplicate handling**
  - At-least-once delivery implies duplicates. The consumer (or the transport)
    must detect and discard them.
  - Deduplication strategy is a policy owned by the Application/consumer, not by
    primitives.

- **Failure handling**
  - What happens when publication fails after the state is persisted?
  - The caller must be able to observe failure (via `Result`), unlike the
    best-effort `errorHandler` of `EventBus`.
  - Recovery (outbox relay, dead-letter, compensation) is a policy the
    Application selects; the Kernel must not impose one.

These policies are **declared at the publication site** and **honored by the
adapter**. They are never baked into `@comity/primitives` or the Kernel.

### 6. Preserved principle

- **Primitives provide mechanisms.** `EventBus`/`HookBus` remain generic,
  best-effort, business-free broadcast/composition mechanisms.
- **Application decides policy.** The reliability contract (ordering, retry,
  idempotency, duplicates, failure) is declared by the Application at the
  publication site.
- **Adapters provide infrastructure.** Durable, ordered, idempotent delivery is
  realized by an Adapter behind the publisher, per ADR-007.

## Reliability Model

The reliability model is expressed as a **spectrum from best-effort to durable**,
with the property chosen explicitly per publication:

```
Best-effort                                 Durable
EventBus ───────────────┬────────────────────→ Outbox / Broker
(non-durable,           │
 unordered, no retry)   │
                        │
          In-memory Publisher
          (Application-managed,
           still non-durable)
```

At each point on the spectrum, the **guarantees are explicit and declared**:

| Guarantee | Best-effort (`EventBus`) | Reliable Publisher |
| --------- | ------------------------ | ------------------ |
| Delivery  | At-most-once, may drop   | At-least-once (declared) |
| Durability | None (memory)           | Depends on adapter (outbox/broker = durable) |
| Ordering  | None (parallel)          | Declared (per-topic or per-source) |
| Duplicate | Possible                 | Detected/handled by policy |
| Failure   | Silent (`errorHandler`)  | Surfaced via `Result` / recovery policy |

The model does not mandate the durable end. A use case whose fact loss is
tolerable may legitimately stay at the best-effort end. The requirement is that
the **contract be explicit**, not that every event be durable.

## Failure Scenarios

The following scenarios define the failure envelope the policy must address. Each
is resolved at the Application boundary; none is resolved by the Kernel.

1. **Publication after persistence fails.**
   The aggregate is mutated and the repository save succeeds, but the event is
   never published. State is consistent, fact is lost.
   → Policy: is the fact loss acceptable? If not, an outbox (persist + relay)
   is required. The caller must observe the failure.

2. **Publication before persistence crashes.**
   The event is published but the repository save fails or the process dies.
   A fact exists for a change that never committed — a phantom.
   → Policy: order of persistence vs. publication must be chosen explicitly;
   publishing-before-persisting is only valid if consumers tolerate phantom
   facts or compensate.

3. **Duplicate delivery.**
   A retry, relay, or at-least-once transport delivers the same event twice.
   → Policy: idempotency + deduplication must be declared. Consumers must be
   safe against repeats.

4. **Out-of-order delivery.**
   `order.payment_captured` arrives before `order.confirmed`.
   → Policy: if sequence matters, ordering must be declared and honored by the
   transport; otherwise consumers must tolerate reordering.

5. **Handler failure on a business event.**
   A subscriber throws while processing a business event. Under `EventBus`
   semantics this is swallowed into `errorHandler`. For a business fact, a
   swallowed failure may leave downstream state inconsistent.
   → Policy: reliable publication surfaces subscriber failure (e.g. via
   `Result` or a dead-letter / retry), unlike the best-effort notification path.

6. **Transport outage.**
   A broker or relay is unavailable at publication time.
   → Policy: retry/backoff and durability (outbox) determine whether the fact
   survives the outage. A non-durable publisher loses it.

## Alternatives Considered

**A. Add reliability to `EventBus` itself.**
Make the primitives bus durable, ordered, retrying. This would give every event
— including harmless runtime notifications — heavyweight guarantees, violating
the "mechanism, not policy" principle and the business-free rule. It would also
couple primitives to persistence. Rejected: reliability is a policy, not a
mechanism.

**B. A single "MessageBus" replacing `EventBus`.**
Unify notifications and business events into one generic bus. This conflates two
categories with different reliability contracts and forces the best-effort path
to inherit the durable path's cost (or vice versa). Rejected: the categories are
distinct and must remain so (ADR-015 §4).

**C. Automatic transactional boundary in the Kernel.**
Have the Kernel wrap mutation + persistence + publication atomically. This would
make the Kernel a transaction manager, which is out of its scope, and would hide
the real failure points behind an illusion of atomicity. Rejected: atomicity
requires an explicit strategy at the Application boundary, not a Kernel feature.

**D. Prescribe the Transactional Outbox as the only path.**
Mandate durability for every business event. This over-engineers use cases whose
fact loss is tolerable and forces infrastructure where none is needed. Rejected:
reliability is a spectrum; the requirement is explicit declaration, not maximum
durability.

## Consequences

**Positive:**

- The best-effort `EventBus` contract is kept honest and cheap for runtime
  notifications.
- Business event publication is given an explicit reliability contract, removing
  the silent assumption that "event = reliable."
- Reliability policy (ordering, retry, idempotency, duplicates, failure) is
  localized to the Application boundary and honored by adapters, keeping
  primitives and Kernel generic and business-free.
- The transactional boundary is made explicit, surfacing real failure modes
  instead of hiding them behind an assumed atomicity.
- The future space (publisher contract + in-memory/outbox/broker adapters) is
  bounded and governed by existing adapter rules (ADR-007).

**Negative / Trade-offs:**

- Application code must explicitly declare and manage reliability per
  publication — more wiring than a transparently "reliable" bus.
- Achieving durability (e.g. outbox) requires additional Application/
  infrastructure components; none exist yet.
- The reliability spectrum means teams must consciously choose guarantees;
  there is no single default that "just works" for all business events.

## Future Evolution

The following are explicitly **not implemented** here and require dedicated
decisions when a real need lands:

1. **`DomainEventPublisher` contract** — the Application-boundary interface
   declaring the reliability contract. Introduced when the first business event
   gains a real consumer (ADR-015 §6).
2. **Transactional Outbox implementation** — durable publication tied to the
   repository transaction, with a relay. Requires its own ADR; never a
   primitives/kernel change.
3. **Broker adapter** — a concrete queue/topic transport behind the publisher.
   Governed by ADR-007; requires an ADR when a specific broker is chosen.
4. **Ordering / idempotency keys** — stable event identity (e.g.
   aggregate-id + fact-type + sequence) per module contract. A per-module
   decision, not a shared base class (ADR-015).

The principle this ADR preserves throughout all future evolution:

> **Reliability is a declaration, not a property of the bus.**

## Architectural Rule

> **A fact is not reliable because it traveled on a bus; it is reliable only
> when the Application says so and the Adapter delivers on that promise.**
> Primitives provide mechanisms, Application decides policy, Adapters provide
> infrastructure — and the gap between them is never filled by silently assuming
> atomicity.

## References

- `docs/standards/decisions/ADR-015-domain-events-boundary.md` — domain event
  definition, ownership, publication pattern, mechanism-vs-policy principle.
- `docs/standards/layering-policy.md` — Kernel/primitives "mechanism, not
  policy"; Application as orchestrator (§2.5); Adapter rules (§2.3).
- `docs/standards/events.md` — event philosophy; fire-and-forget signals;
  §7 (entities must not emit).
- `docs/standards/errors.md` — `EventBusError` canonical shape; Result-based
  error handling (`handler_failed`).
- `packages/primitives/src/lifecycle/events/bus.ts` — `DefaultEventBus`:
  async, `Promise.all`, best-effort `errorHandler`, no persistence/retry/order.
- `packages/primitives/src/lifecycle/events/types.ts` — `EventBus` contract
  (best-effort by design).
- `packages/kernel/src/internal/lifecycle.ts` — `canEmitEvents()` gating
  (`sealed`/`running`); no delivery guarantees.
- `packages/kernel/src/kernel.ts` — Kernel `events.emit` gate via
  `canEmitEvents()`.
- `docs/standards/decisions/ADR-007-multi-context-adapter-architecture.md` —
  Adapter categories governing future publisher adapters.
- `docs/standards/decisions/ADR-013-order-entity-consolidation.md` — aggregate
  purity; deferred domain events; explicit strategy over assumed behavior.