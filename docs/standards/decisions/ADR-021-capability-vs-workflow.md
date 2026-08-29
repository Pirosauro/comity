# ADR-021 — Capability vs Workflow Boundary

**Status:** Accepted

## Context

Comity's layering model distinguishes Kernel, Core Modules, Adapters, Extensions,
and the Application layer. Core Modules provide reusable, transport-independent
capabilities and contracts. Applications and Integration Adapters compose those
capabilities into workflows.

The `@comity/storefront` refactor exposed the need to make this distinction
explicit. Storefront previously contained both page-composition capabilities
(Core) and checkout orchestration (Application workflows). ADR-008 states that
checkout is an Application-layer workflow, not a Core Module. ADR-020 establishes
that the Application owns orchestration, sequencing, and compensation, and that
no workflow engine exists.

This ADR formalizes the general principle that those decisions instantiate:

> **Comity provides capabilities; Applications and Integration Adapters compose
> capabilities into workflows.**

## Decision

### 1. Capability vs Workflow

- A **Capability** is a reusable, transport-independent contract or service
  representing one coherent responsibility (e.g. pricing, inventory, payment,
  order, customer, address, catalog, storefront page composition).
- A **Workflow** is a sequence/orchestration of multiple capabilities that
  reflects application- or platform-specific business decisions (e.g.
  reserve → authorize payment → create order → commit inventory; a Magento
  checkout; a Shopify checkout; a custom checkout lifecycle).

The architectural rule:

> **Capabilities belong to Core Modules. Workflow composition belongs to
> Applications and Integration Adapters.**

A Core Module MUST NOT prescribe cross-Core workflow orchestration. A Core
Module must not become a workflow owner merely because it consumes multiple
capabilities.

### 2. Workflow Ownership

- **Consuming Application** — owns application-specific or custom workflows by
  composing Core capabilities.
- **Integration Adapter** — owns platform-specific workflows (e.g. future
  `@comity/storefront-magento`, `@comity/storefront-shopify`) by composing Core
  capabilities and binding the external platform.

A custom integration may implement an entirely different workflow. Comity does
not define a canonical commerce checkout lifecycle.

### 3. `@comity/storefront` final status

`@comity/storefront` is a **Core Module providing reusable storefront
page-composition capabilities**. It owns:

- page models
- page composer/enricher contracts
- default page composers
- `StorefrontContext` and related page-composition context
- page-composition setup/wiring
- storefront-specific capability errors

It does **not** own:

- checkout workflows
- payment sequencing
- inventory reservation orchestration
- order creation workflows
- pricing orchestration
- customer/address loading workflows
- purchase policies
- application security composition
- compensation policies
- workflow engines

### 4. No workflow abstraction

No `CheckoutEngine`, `WorkflowEngine`, `CheckoutPipeline`, `Step<I,O>`,
`compose()` orchestration, or equivalent generic workflow abstraction is
introduced. ADR-020's bias against workflow engines is reaffirmed.

### 5. Deferred

The `StorefrontContext → HttpRequest` transport coupling remains a separate,
deferred improvement (extract a transport-neutral storefront context). It is
independent of this decision.

## Consequences

- Storefront remains a pure capability module; checkout is owned by
  Applications and Integration Adapters.
- Future platform integrations are free to implement different checkout
  lifecycles.
- The dependency register (ADR-008) reflects only page-composition capabilities
  for storefront.
- No new packages and no workflow engines are introduced.

## References

- `docs/standards/decisions/ADR-007-multi-context-adapter-architecture.md` —
  Integration Adapter category; platform-specific orchestration boundary.
- `docs/standards/decisions/ADR-008-explicit-core-module-composition-exceptions.md`
  — Core-to-Core dependency register; checkout is Application-layer.
- `docs/standards/decisions/ADR-020-inventory-capability-boundary-and-checkout-workflow-independence.md`
  — Application owns orchestration; no workflow engine.
- `docs/standards/architecture-principles.md` — principle 11 (Capability vs
  Workflow).
- `docs/standards/layering-policy.md` — layer responsibilities and dependency
  direction.
