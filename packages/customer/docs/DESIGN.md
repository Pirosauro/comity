# Purpose

`@comity/customer` defines the customer domain for Comity as a reusable Core Module.

Its purpose is to model customer information independently from persistence, transport, and presentation so that the same domain can be reused by storefronts, CRMs, customer portals, back offices, and future integrations.

This document is a design proposal, not an implementation plan. It only captures responsibilities, boundaries, and architectural direction already implied by the current project documentation.

# Responsibilities

The module is responsible for owning the customer domain abstractions and the contracts needed to operate on them.

Known responsibilities from the existing module documentation are:

- Customer identity
- Customer profile
- Contact information
- Preferences
- Customer lifecycle
- Validation boundaries and domain validation rules
- Repository contracts
- Customer use cases
- Domain errors

Within Comity's layering model, these responsibilities belong to a Core Module because they represent stable business abstractions rather than infrastructure concerns.

## Validation Strategy

The module owns validation responsibilities, not validation implementations.

The validation mechanism is intentionally unspecified.

The module must not depend on a specific validation library.

The public validation API, if any, remains an open design decision.

# Non Goals

`@comity/customer` should not implement or expose concerns that belong to other layers or modules.

Explicit non-goals are:

- Authentication
- Authorization
- Sessions
- Password management or hashing
- JWT or token handling
- HTTP APIs
- GraphQL APIs
- SQL or ORM details
- Rendering or UI concerns
- Storefront-specific orchestration
- Admin application behavior
- CRM-specific infrastructure

This module should also avoid becoming a generic "account system". It owns the customer domain, not every identity or user-management concern in the platform.

# Dependencies

## Allowed Dependencies

As a Core Module, `@comity/customer`:

- may depend on `@comity/primitives`
- may depend on `@comity/kernel` only if runtime integration becomes necessary
- must not depend on adapters
- must not depend on applications
- must not introduce framework-specific types

## Dependency Direction

The intended dependency flow is:

Applications
↓
@comity/customer
↓
@comity/primitives

Persistence adapters, transport adapters, and rendering layers must depend on `@comity/customer`, not the other way around.

# Domain Concepts

The current documentation establishes `Customer` as the aggregate root.

Concepts already identified are:

- `Customer`
- `Profile`
- `Contact Information`
- `Preferences`
- `Customer Lifecycle`

At the design level, these concepts imply the following structure:

- `Customer` is the primary domain entity / aggregate root.
- Profile, contacts, and preferences belong to the customer aggregate.
- Repository contracts operate on customer domain models rather than infrastructure records.
- Use cases orchestrate repository access and validation, without knowing persistence details.

The following aspects are intentionally still unknown and should remain undecided in this proposal:

- the canonical customer identifier format
- whether guest customers and registered customers are both in scope
- the lifecycle states a customer may have
- whether preferences are strongly typed capabilities or open-ended key/value data
- what search semantics are required for customer lookup
- whether contact information supports one or multiple emails / phone numbers as first-class concepts

These questions affect the eventual shape of contracts and should not be fixed here without explicit domain input.

# Open Questions

The current documentation is not sufficient to finalize several domain decisions. These need explicit answers before moving from design approval to API design.

1. What distinguishes a `Customer` from an authenticated identity in this ecosystem?
2. Are anonymous / guest customers part of the same model, or should they live in a separate module or subdomain?
3. What lifecycle states must the module support for a customer?
4. Is customer identity internal-only, externally assigned, or both?
5. Are email and phone unique identifiers, optional contact channels, or just profile attributes?
6. How should addresses relate to the customer module? Address ownership is explicitly out of scope for @comity/customer; addresses belong to a separate bounded context.
7. Are preferences a fixed schema, an extensible schema, or a separate composition point?
8. Which use cases belong to v1?
9. Should validation cover only structural correctness, or also business invariants that depend on repository state?
10. What error taxonomy is required beyond the examples already listed (`CustomerNotFound`, `DuplicateCustomer`, `InvalidCustomer`)?
11. Does the module need domain events, or is synchronous orchestration sufficient for the first iteration?
12. Which integrations are expected first: storefront, CRM, admin, ERP, or marketing?
    Open question:
13. Should validation be part of the public API, or remain an internal implementation detail?

# Proposed Architecture

## Module Role

`@comity/customer` should be a Core Module that exposes stable customer-domain contracts and avoids any infrastructure or transport concerns.

## Internal Responsibility Split

The internal organization should remain implementation-driven.

The initial implementation may contain:

- domain models
- repository contracts
- validation
- use cases

but folder structure is not part of the public design.

Use cases orchestrate operations inside the customer domain.

They must not:

- trigger external integrations
- orchestrate workflows across bounded contexts
- trigger external integrations
- execute workflows across bounded contexts

This keeps the module aligned with Comity's existing pattern of explicit contracts and narrow public APIs.

## Architectural Boundaries

The proposed ownership is:

- Domain models define the customer aggregate and related concepts.
- Repository contracts define persistence expectations in a storage-agnostic way.
- Use cases orchestrate repository calls and validation.
- Domain errors express customer-specific failures.
- Validation guards input and invariants before persistence-facing operations.

The following responsibilities stay outside the module:

- persistence implementations
- HTTP request/response mapping
- GraphQL schema or resolvers
- UI view models
- authentication identities
- session management
- external-system synchronization logic

## Integration Model

The intended integration model is:

- applications call customer use cases
- use cases depend on customer repository contracts
- adapters implement those repository contracts
- higher layers translate domain models into transport or presentation formats

This preserves replaceability and avoids leaking infrastructure concepts into the customer domain.

## Composition Strategy

The module documentation already suggests growth through composition rather than a monolithic aggregate.

The module should evolve through composition rather than by continuously expanding the Customer aggregate.

Concrete composition mechanisms are intentionally outside the scope of this proposal.

Extension mechanisms are intentionally undefined at this stage.

This proposal does not define those extension seams yet, because the current documentation does not specify whether they belong:

- inside the customer aggregate
- in adjacent modules
- or in adapter/application-level composition

# Alternatives Considered

## Treat Customer as an Application Concern

Rejected because the existing documentation clearly positions customer as a reusable domain shared by multiple applications and integrations.

## Treat Customer as an Adapter-Owned Model

Rejected because repository contracts and domain errors belong in a Core Module, not in infrastructure adapters.

## Merge Customer with Auth

Rejected because authentication, sessions, password handling, and token concerns are explicitly outside this module's responsibility. Merging them would create domain and layer coupling.

## Split the Module Into Multiple Packages Immediately

Not proposed at this stage. While profile and preferences may evolve independently in the future, the current documentation explicitly treats them as part of the `Customer` aggregate. Splitting too early would introduce structural complexity without approved domain boundaries.

## Define Detailed APIs in This Proposal

Rejected for now. The current information is sufficient to define architectural ownership, but not enough to finalize contract shapes, identifiers, lifecycle states, or search semantics. Those require explicit domain decisions first.
