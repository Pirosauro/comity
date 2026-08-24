# ADR-015 — Domain Events Boundary

**Status:** Proposed

## Context

Comity owns two broadcast mechanisms in `@comity/primitives/lifecycle`:

- `EventBus` (`events/types.ts`) — an asynchronous broadcast bus. Subscribers
  register handlers for named events; `emit` dispatches a payload and awaits
  handlers, routing any handler failure to an `errorHandler` as an
  `EventBusError` (`handler_failed`). It is a **mechanism**, not a policy.
- `HookBus` (`hooks/types.ts`) — a sequential transformation pipeline. Handlers
  receive a value and return a new value; it is a **composition** mechanism, not
  a notification mechanism.

Per the primitives philosophy (`docs/conventions.md`), both buses are
mechanism-only: they carry no business semantics, no orchestration, and no
policy. `docs/standards/events.md` already establishes that events are
fire-and-forget signals, owned per-module, and **MUST NOT be emitted by domain
entities, value objects, or pure functions** (events.md §7).

The Kernel gates lifecycle (module registration, sealing) and provides the
runtime emitter. Core Modules (`@comity/order`, `@comity/catalog`, …) define
and own their aggregates. The Application Layer is the orchestrator.

Several decisions are already settled:

- **Aggregate History ≠ Domain Events ≠ Audit Trail.** These are distinct
  concepts with distinct responsibilities.
- **Event Sourcing is not a framework capability.** The framework does not
  provide an event store or rebuild state from events.
- **`HistoryService` / `AuditService` / `EventStore` must not enter
  primitives or kernel.** They are higher-level concerns.
- **Aggregates remain pure.** They hold state and enforce invariants; they do
  not know about buses, dispatch, or publishing (ADR-013 "Deferred Decisions —
  Domain Events").

The gap this ADR closes: `EventBus` today is a generic, business-free broadcast
mechanism used for runtime/observability events (e.g. `http.request.completed`).
Nothing defines **domain events** — the business facts an aggregate produces
(e.g. `order.confirmed`) — nor draws the boundary between the two, nor
establishes who owns, publishes, and subscribes to them.

## Decision

### 1. Definition of a Domain Event

A **Domain Event** is an immutable business fact that something of business
value happened, expressed in the vocabulary of its owning Core Module.

- It is **immutable after publication** — once published, it cannot change.
  Before publication, the Application Layer may enrich the fact with the
  technical metadata required for delivery; the Core Module remains the owner
  of the fact's meaning.
- It is a **fact**, not a command: it describes what happened, never what
  should happen next.
- It carries the identifiers and facts a consumer needs, not behavior.
- It is **type-owned by its Core Module** and is part of that module's public
  contract.

The ownership of a domain event is split by responsibility:

- **business meaning** → the Core Module that owns the fact;
- **publication metadata** → the Application Layer that publishes it.

Examples:

- `OrderConfirmedEvent`
- `PaymentCapturedEvent`
- `OrderCancelledEvent`

#### Naming: type name vs. wire event name

Comity distinguishes the **type name** from the **wire event name**:

- **TypeScript type name** — PascalCase with an `Event` suffix:
  `OrderConfirmedEvent`, `PaymentCapturedEvent`, `OrderCancelledEvent`.
- **Transport / wire event name** — dotted, lowercase, past tense:
  `order.confirmed`, `payment.captured`, `order.cancelled`.

The two are never used interchangeably. A bare `OrderConfirmed`, `order.confirmed`,
or `order_confirmed` is not used as an alternative to this convention. The type
name is the API contract; the wire name is the transport identifier for the same
fact.

Domain events are emitted only when a real consumer exists. They are never
emitted speculatively (see ADR-013 "Deferred Decisions — Domain Events").

#### Business rationale is not audit metadata

Not everything an audit needs is audit metadata. If a motivation is part of the
**meaning of the business fact**, it belongs to the Domain Event. Audit
metadata — actor, request id, IP, correlation id — belongs to the
consumer/audit layer.

Example: `OrderConfirmedEvent` may carry a `confirmationReason` that is domain:

```ts
{
  orderId: OrderId;
  confirmedAt: Instant;
  confirmationReason: "free_shipping_threshold_reached" | "manual_customer_service_confirmation";
}
```

`confirmationReason` describes *why* the business fact occurred and is therefore
part of the fact's meaning. Audit metadata (actor, request id, IP, correlation
id) describes the operational context of the change and belongs to the
consumer/audit projection, not to the Domain Event.

### 2. Ownership

- The **Core Module that owns the aggregate defines the event type.** Only the
  module that owns the lifecycle may declare the facts its aggregate produces.
  No other module may define or redefine those types.
- The **Application decides when to publish** the event. The Application is the
  orchestrator: it invokes aggregate methods, observes the resulting fact, and
  decides whether and when that fact is published as a domain event.

This separates *what a fact is* (module-owned type) from *whether it is
communicated* (application-owned decision).

#### Cross-module ownership: the lifecycle owner owns the event

The module that owns the lifecycle owns the Domain Event. A module only ever
declares the facts its own aggregate produces; it never declares or publishes
facts owned by another module's lifecycle.

Example (payment vs. order):

- `@comity/payment` owns the payment lifecycle and declares
  `PaymentCapturedEvent`, `PaymentRefundedEvent`, `ChargebackReceivedEvent`.
- `@comity/order` owns the order lifecycle and declares `PaymentAttachedToOrderEvent`.

`Order` does **not** publish `PaymentCapturedEvent`. When a payment is captured,
the Application observes the payment fact and notifies the order of a fact
relevant to the order's own internal consistency (`PaymentAttachedToOrderEvent`).
Each module owns only its own events; cross-module facts are orchestrated by the
Application.

### 3. Publication Pattern

The aggregate **records pending domain facts** — the consequences of its own
internal decisions. It does **not** produce events. Recording a fact is part of
the aggregate's domain behavior; publishing that fact as an event is a
subsequent, separate responsibility of the Application Layer.

```
Aggregate
    │
    │ pending domain facts (no emission)
    ↓
Application  ── publication decision
    │
    ↓
Domain Event Publisher
```

The aggregate:

- does not know `EventBus`;
- does not know the publisher;
- does not emit;
- does not decide who should react.

- The aggregate **never** calls `EventBus` or any publisher directly.
- The aggregate method that changes state may record/return a domain fact, but
  publishing it as an event is always the Application's responsibility.
- The Application reads the recorded facts, decides what to publish and when,
  composes the domain event, and hands it to the publisher.

### 4. Distinction: Runtime Event / Domain Event / Audit

| Kind         | Owned by                    | Published by      | Purpose                                             |
| ------------ | --------------------------- | ----------------- | --------------------------------------------------- |
| Runtime Event | Core Module runtime / Kernel | Module runtime, facades, Kernel orchestrators | Observability, instrumentation, lifecycle coordination |
| Domain Event | Aggregate-owning Core Module | Application       | Business facts for decoupled coordination           |
| Audit        | Consumer side               | Consumer          | Projection / record of what happened (consumer-side) |

Examples:

- Runtime: `http.request.completed`, `auth.session.created`
- Domain: `order.confirmed`, `payment.captured`
- Audit: a **consumer-side projection** — the consumer records the facts it
  needs. Audit is not a framework concern and is not owned by the producer.

### 5. What is NOT allowed

The following are architectural violations:

- **Aggregate → EventBus.** An aggregate must never depend on or call a bus.
  Aggregates remain pure and infrastructure-free.
- **Core Module → Core Module subscription.** No Core Module may subscribe
  directly to another Core Module's domain events. This would create an
  unregistered Core-to-Core coupling, forbidden by default under
  `layering-policy.md` §2.2 and ADR-008. Cross-module reaction is an
  Application responsibility.
- **Business semantics inside primitives.** `@comity/primitives` must remain
  generic and business-free. It provides the `EventBus` mechanism, never domain
  event types or policy (`docs/conventions.md`, primitives decisions).
- **EventBus used as an event database.** The bus is a broadcast mechanism, not
  a store. It provides no persistence, no replay, no history. Treating it as an
  event store conflates broadcasting with persistence and is forbidden.

#### Composite / Application Modules

The rule **"a Core Module cannot subscribe to a Core Module"** remains
unchanged. It forbids *hidden* coupling: one Core Module reaching into another's
events without a declared relationship.

It does not forbid **explicit composition**. Application Modules or Composite
Modules may orchestrate multiple Core Modules through **declared dependencies**.
For example, a `checkout` application module may declare:

```
dependsOn:
  - order
  - payment
```

and subscribe to the events of both to orchestrate a workflow. This is explicit
composition at the Application Layer, not the hidden Core-to-Core coupling the
rule prohibits. The prohibition targets undocumented, implicit coupling between
Core Modules, never deliberate, declared composition.

### 6. Future roles (not implemented in this ADR)

- **`DomainEventPublisher`** — a thin boundary that publishes domain events. It
  may be an Application-layer component that wraps an `EventBus`, or a contract
  defined at the Application boundary and backed by an adapter. Its exact shape
  is future work.
- **Outbox pattern** — a durable publication mechanism (persist event + publish
  transactionally) is a possible future Application/infrastructure concern when
  reliable delivery is required. It is an implementation detail behind the
  publisher, never a primitives/kernel concept. Requires a dedicated ADR.
- **Adapter implementation** — a concrete transport (e.g. broker, queue) behind
  the publisher is an Adapter concern governed by the adapter rules (ADR-007),
  not a Core Module or primitives concern.

This ADR **does not** introduce, now:

- `EventStore`
- Event Sourcing
- a generic `DomainEvent` base class

These remain explicitly out of scope. Domain event types are per-module and
explicit, not derived from a shared base.

## Consequences

**Positive:**

- Aggregates stay pure and infrastructure-free; their correctness never depends
  on a bus.
- Domain event types are owned by the module that understands them, giving an
  honest, single source of truth for business facts.
- The Application owns the *decision* to publish, keeping policy where policy
  belongs.
- Runtime, domain, and audit concerns are separated, preventing the bus from
  becoming a grab-bag.
- Primitives/kernel stay business-free and generic; `EventBus` remains a
  replaceable mechanism.
- Cross-module reaction is forced through the Application, preserving Core-to-Core
  isolation (ADR-008).

**Negative / Trade-offs:**

- The Application must explicitly read facts and publish them — more wiring than
  having aggregates emit directly.
- No built-in durability/replay: consumers that need history must build their
  own consumer-side audit.
- Enforcing the rules relies on review and the architecture validator, not on
  compile-time guarantees alone.

## Alternatives Considered

**Pattern A — Aggregate emits directly.** The aggregate holds an `EventBus`
reference and emits its own domain events. This couples the aggregate to
infrastructure, violates events.md §7 (entities must not emit), and makes
testing the aggregate harder. Rejected in favor of Pattern B (Application-driven
publication).

**Cross-module subscription via Core Modules.** Let a Core Module subscribe to
another's events for automatic reaction. This introduces unregistered Core-to-Core
dependencies, contradicting `layering-policy.md` §2.2 and ADR-008. Rejected;
reaction belongs to the Application.

**Shared `DomainEvent` base class.** A generic base for all domain events.
Rejected as speculative abstraction: each module's events are distinct facts
with distinct shapes; a base class would be an abstraction without a unifying
behavior, and its types would not be owned by a single module.

## Rejected Designs

- **Event sourcing of aggregates.** Rebuilding aggregate state from an event
  stream is rejected. Event Sourcing is not a framework capability; aggregates
  persist their state through repositories (`ADR-002`) and domain events are
  decoupled coordination, not a source of truth.
- **`HistoryService` / `AuditService` / `EventStore` in primitives or kernel.**
  These are higher-level concerns with persistence and policy; they violate the
  "mechanism, not policy" and business-free rules of the Kernel/primitives.
- **`EventBus` as an event database.** Rejected: the bus provides no persistence
  or replay; using it as a store would conflate broadcast with durable storage.

## Migration Path

This ADR is a **boundary definition** and introduces no new code. It therefore
requires no migration of existing packages.

Future work that builds on this boundary (each requiring its own decision when a
real need lands):

1. Define `DomainEventPublisher` at the Application boundary when the first
   concrete consumer appears.
2. Introduce per-module domain event types (e.g. `order.confirmed`) only when
   the owning aggregate gains a real consumer, per ADR-013's deferred-events
   rule.
3. Evaluate an Outbox pattern / durable publication when reliable delivery is a
   real requirement; this is a dedicated ADR, not a primitives change.
4. Add an adapter-backed transport behind the publisher when a concrete broker
   is chosen; governed by ADR-007.

## Architectural Rules

The following rules are asserted and enforced as architecture:

- **R1 (Ownership):** A domain event type is owned and declared exclusively by
  the Core Module that owns the producing aggregate.
- **R2 (Publication):** Domain events are published only by the Application
  Layer, via a Domain Event Publisher; aggregates never emit.
- **R3 (Purity):** Aggregates must not depend on or call `EventBus`, `HookBus`,
  or any infrastructure bus.
- **R4 (Isolation):** No Core Module may subscribe to another Core Module's
  domain events. Cross-module reaction is Application responsibility.
- **R5 (Mechanism vs Policy):** `@comity/primitives` and the Kernel must remain
  business-free. They provide broadcast *mechanisms* (`EventBus`, `HookBus`);
  domain event types and publication *policy* live above them.
- **R6 (No event store):** `EventBus` is a broadcast mechanism, not an event
  database. No persistence, replay, or history through the bus.
- **R7 (No speculation):** Domain events are introduced only when a real
  consumer exists, never speculatively.

---

> **Principle:** A bus is a mechanism; a fact is a decision. The aggregate
> records what happened, the Application decides what is said — and nothing in
> `@comity/primitives` ever decides what matters.

## References

- `docs/standards/layering-policy.md` — Kernel/primitives "mechanism, not
  policy"; Core Module isolation (§2.2); Application as orchestrator (§2.5).
- `docs/standards/events.md` — event philosophy, per-module ownership, §7
  (entities must not emit).
- `docs/standards/errors.md` — `EventBusError` canonical shape; Result-based
  error handling.
- `docs/standards/decisions/ADR-008` — Core-to-Core dependency isolation;
  closed exception register.
- `docs/standards/decisions/ADR-013` — Order aggregate purity; "Deferred
  Decisions — Domain Events" (no speculative emission).
- `docs/standards/decisions/ADR-014` — Value Object / business-free-primitives
  alignment.
- `packages/primitives/docs/conventions.md` and `docs/overview.md` — primitives
  must be stable, generic, business-free.
- `packages/primitives/src/lifecycle/events/types.ts` — `EventBus` contract.
- `packages/primitives/src/lifecycle/hooks/types.ts` — `HookBus` contract.