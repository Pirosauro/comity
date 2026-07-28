# Public API

This document defines the public contract of `@comity/customer`.

It is a proposal, not an implementation plan. It does not discuss folder structures, dependency injection, adapters, testing, or how the module is built internally.

Only concepts that are explicitly supported by the existing documentation or by the domain decisions captured in this document appear here. Undecided aspects are listed under Unresolved API Questions.

---

## Public Concepts

The module exposes the following public concepts:

- `Customer` — the aggregate root
- `CustomerId` — domain identifier for a customer
- `Customer Lifecycle` — lifecycle of a customer (states deferred)
- `Profile` — customer-facing profile information
- `Contact` — a communication channel (email, phone, etc.)
- `Preferences` — customer-specific preferences

These concepts represent the domain vocabulary of the module. Every public model, contract, use case, and error refers to them.

---

## Public Models

### `Customer`

The aggregate root of the customer domain.

A `Customer` groups the following data:

- a `CustomerId`
- a `Profile`
- zero or more `Contact` entries
- a `Preferences` object

A `Customer` may have an optional address book capability.

Address ownership and lifecycle are not part of the core Customer aggregate.

A `Customer` does not contain:

- authentication identities, sessions, or password material
- foreign keys to other Core Modules
- persistence metadata

The customer lifecycle is an explicit domain concept owned by the module. Lifecycle states are intentionally deferred and will be designed in a future iteration; when introduced they will not break the Customer model.

### `CustomerId`

An opaque value type that uniquely identifies a `Customer` within the customer domain.

It is a concept of the customer domain, not a shared identifier across modules.

### `Profile`

Value object representing customer-facing profile information.

Known fields from the documentation:

- given name
- family name
- display name

Exact field names and optionality are intentionally unspecified and pending domain consensus.

### `Contact`

A contact represents a single communication channel belonging to a customer. At the domain concept level, the module works with `Contact Information`; `Contact` is the concrete model type used throughout the public API for individual communication channels.

Fields:

- `id` — a stable identifier for this contact entry
- `type` — discriminator for the channel kind (e.g., email, phone, …)
- `value` — the actual contact value (email address, phone number, etc.)
- `verifiedAt` — optional verification timestamp
- `primary` — optional marker indicating the primary contact of its type

A `Customer` may own multiple contacts.

### `Preferences`

Customer-specific preferences.

Shape and semantics are intentionally unspecified. Preferences may be key/value, strongly-typed capabilities, or a schema defined through composition.

---

## Aggregate Boundaries

`Customer` is the aggregate root. Every other domain concept belongs to the customer aggregate.

The aggregate boundary enforces:

- Customer is loaded and persisted as a single unit, or as close to a single unit as repository contracts allow.
- Other modules must not hold direct references into the customer aggregate.
- The customer aggregate does not own authentication identities, sessions, or credentials.

The aggregate must not contain:

- fields that represent cross-module relationships (e.g., references into `@comity/auth` or `@comity/media`)
- infrastructure-specific metadata

---

## Identifiers

The only identifier exported by the module is `CustomerId`.

`CustomerId` is:

- an opaque value type
- owned by `@comity/customer`
- the only identifier the module guarantees stability for in its public contract

The module does not export identifiers for contacts, addresses, or preferences unless they become independently identifiable across aggregate roots, which is not currently documented.

---

## Value Objects

The following are identified as value objects:

- `CustomerId`
- `Contact`

Value objects are immutable, compared by value, and have no standalone identity outside their owning aggregate.

---

## Invariants

The following invariants are derived from the current documentation and approved decisions:

- A `Customer` is always loaded and persisted as a single aggregate root.
- The aggregate root identifier (`CustomerId`) is immutable after creation.
- A `Contact` value must be unique within a single customer.
- Delete semantics are deferred to the implementor (hard, soft, archive). The module only guarantees an `remove` capability.
- Structural validation of the customer aggregate must happen before persistence.
- Repositories assume validated input.

Additional invariants require decisions on lifecycle states (deferred), duplicate detection criteria (deferred), and preference invariants (deferred).

---

## Repository Contracts

The module makes public a `CustomerRepository` contract.

The repository is a persistence abstraction.

It must not expose:

- storage queries
- transaction primitives
- infrastructure concepts

It operates on customer domain models.

It returns `Result<T, RepositoryError>` (`RepositoryError` is defined in `@comity/primitives`).

### Retrive a customer

There must be a way to retrieve a customer by `CustomerId`.

The exact representation of "not found" is intentionally unspecified at this stage. It will be resolved in a future design iteration.

### Persist a customer

There must be a way to persist a customer. The exact method name, signature, and the distinction between create and update are intentionally unspecified. This will be resolved in a future design iteration.

### Remove a customer from the domain

The module supports the concept that a customer can be removed from the domain.

The repository contract does not prescribe whether this is hard delete, soft delete, or archive. That is a policy of the persistence adapter.

The contract only guarantees "the customer may be removed from the domain," and the error model reports whether the operation succeeded or failed according to the repository error model.

### Search

There must be a way to to search across customers.

The search input model is intentionally unspecified at this stage. The contract asserts that a search capability exists, while the exact search surface (filters, pagination, aggregation) is deferred.

---

## Repository Responsibilities

The repository contract must satisfy:

- Returns domain models as described in this document.
- Never exposes storage-level identifiers or query objects.
- Never mutates the `CustomerId` of an existing customer (identity is immutable).
- Returns `Result<T, RepositoryError>`.

---

## Use Case Responsibilities

The module exposes use cases as entry points for applications.

Documented use cases are:

- `CreateCustomer`
- `UpdateCustomer`
- `DeleteCustomer`
- `GetCustomer`
- `SearchCustomers`

Each use case must enforce the following constraints (aligned with the boundary decisions in DESIGN.md and ARCHITECTURE-REVIEW.md):

- Use cases never know persistence details.
- Use cases only operate on the customer aggregate.
- Use cases never call other Core Modules.
- Use cases never invoke external systems.
- Use cases never perform application-level workflow orchestration (e.g., send an email, call a CRM, add a loyalty account).

Use cases orchestrate repository calls and validation.

Use cases return `Result<T, CustomerError>` where `T` is a domain model or `void`.

---

## Domain Errors

The module exports domain errors for customer-specific failures.

Documented errors:

- `CustomerNotFound`
- `DuplicateCustomer`
- `InvalidCustomer`

Domain errors are distinct from infrastructure errors.

Infrastructure failures are normalized into `RepositoryError`, which is already defined by `@comity/primitives` and is not exported by this module.

---

## Validation Responsibilities

The module owns validation rules and invariants for the customer domain.

Whether validation contracts become part of the public API remains an open design decision.

The module guarantees that:

- Structural validation happens before persistence.
- Repository contracts assume valid input.
- Domain errors represent validation failures (e.g., `InvalidCustomer`, `InvalidAddress`).

The validation implementation is intentionally unspecified. The module must not depend on a specific validation library.

## Events

The current module documentation does not specify domain events.

No public event types are proposed at this stage.

This remains an explicit open decision.

---

## Public Exports

The module exports public concepts as:

- `Customer`
- `CustomerId`
- `Profile`
- `Contact`
- `Address`
- `Preferences`

Usage-level contracts:

- `CustomerRepository`
- `CreateCustomer`
- `UpdateCustomer`
- `DeleteCustomer`
- `GetCustomer`
- `SearchCustomers`

Domain errors:

- `CustomerNotFound`
- `DuplicateCustomer`
- `InvalidCustomer`
- `InvalidAddress`

---

## Unresolved API Questions

These decisions are pending and affect future API evolution. They cannot be resolved from the current documentation alone:

- Which lifecycle states will the module support?
- Should the module expose a `SearchCriteria` type alongside `SearchCustomers` or keep it internal?
- Should contacts support additional channels (SMS, WhatsApp, …) without changing the public API?
- Should address types (shipping, billing, delivery) be part of the domain model or belong to higher layers?
- Which fields in `Profile` are mandatory?
- Should `Preferences` be a fixed schema, an extensible schema, or simply declared key/value?
- Should the module emit domain events for customer lifecycle changes?
- Should the module expose a public `validate` method, or should validation be owned solely by validation contracts?
- Should a repository expose `save` semantics (insert vs update), or use differentiated semantics (`create`, `update`)?
- Should `not found` be represented as `null` or as a `Result` type?
- How should authenticated identities relate to customers without introducing cross-module dependencies inside the Customer aggregate?
- Should repository persistence expose separate create/update operations or a unified persistence capability?
