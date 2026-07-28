# Package Design

This document describes the internal architecture of `@comity/customer`.

It is an implementation proposal, not a public contract. The folder structure recommended here may evolve without changing the public API defined in [API.md](./API.md).

Source of truth: [AGENTS.md](../../../AGENTS.md), [README.md](../README.md), [SKILL.md](../SKILL.md), [DESIGN.md](./DESIGN.md), [API.md](./API.md).

---

## 1. Package Role

`@comity/customer` is a Core Module within the Comity architecture.

### Core Module Responsibilities

From the architecture documents, the module owns:

- customer identity, profile, and lifecycle concepts
- customer contacts and contact information
- addresses
- preferences
- repository contracts for customer persistence
- customer use cases as entry points for applications
- validation ownership for the customer domain
- domain errors specific to customer failures

### Dependency Boundaries

The allowed dependencies are:

- runtime dependency on `@comity/primitives` (required)
- runtime dependency on `@comity/kernel` only if runtime integration (hooks, services, lifecycle, events) becomes necessary and is explicitly justified
- no dependency on other Core Modules
- no dependency on adapters
- no dependency on applications
- no framework-specific types

The package must not leak infrastructure concerns into its public API.

---

## 2. Internal Architecture

The recommended source folder structure is an implementation proposal. It reflects the public API surface while keeping internal organization flexible.

### Recommended Source Folders

```
packages/customer/src/
  contracts/         # public contracts (repository)
  domain/            # customer aggregate, value objects, domain errors
  validation/        # validation rules and invariants
  use-cases/         # public use cases
  setup/             # package-level configuration (if needed)
  index.ts           # public exports only
```

### Responsibility of Each Folder

**`contracts/`** — repository contracts that adapters will implement. This folder contains the public `CustomerRepository` contract as described in the public API. It never exposes storage-level types or infrastructure concepts.

**`domain/`** — domain models, aggregate definitions, value objects, and domain errors. This is the home for the `Customer` aggregate root, `CustomerId`, `Profile`, `Contact`, `Address`, `Preferences`, lifecycle concepts with deferred states, and all customer-specific domain errors (`CustomerNotFound`, `DuplicateCustomer`, `InvalidCustomer`, `InvalidAddress`).

**`error/`** — domain error types. May be a separate folder from `domain/` if errors grow sufficiently, or may stay co-located with the domain as collocated files.

**`use-cases/`** — public entry points exposed to applications. Contains `CreateCustomer`, `UpdateCustomer`, `DeleteCustomer`, `GetCustomer`, `SearchCustomers`. Each is a file or small module that orchestrates repository calls and validation.

**`setup/`** — package-level constants, types, or default configuration if the module requires initialization or module-level config. If not needed in v1, this folder should remain empty or excluded.

**`index.ts`** — re-exports only the public API surface defined in API.md.

### Public vs Internal files

- `index.ts` exports only public contracts visible to applications and adapters.
- All domain models, errors, repository contracts, use cases, and value objects that are public are re-exported.
- Validation implementation files are internal unless the design decides they become public (currently open).
- Test files, test helpers, and build configuration remain internal.

---

## 3. Domain Organization

### Customer Aggregate

The `Customer` aggregate root belongs to `domain/`. It groups:

- `CustomerId`
- `Profile`
- contacts (represented as `Contact[]`)
- addresses (`Address[]`)
- preferences (`Preferences`)
- lifecycle concept (states and transitions deferred)

The aggregate definition is the central domain model. Lifecycle is acknowledged at the domain concept level; concrete lifecycle states and transitions are deferred and will not break the aggregate definition.

### Value Objects

Value objects live with their owning aggregate in `domain/`.

- `CustomerId` — identity value object
- `Contact` — single communication channel
- `Address` — physical or postal location

Value objects are immutable, comparable by value, and have no standalone identity outside the customer aggregate.

### Domain Errors

Domain errors belong to `domain/` (or `error/` if the team decides to separate them). Types defined from the public API:

- `CustomerNotFound`
- `DuplicateCustomer`
- `InvalidCustomer`
- `InvalidAddress`

Domain errors follow the existing error model from `@comity/primitives` (extending `BaseError`). Infrastructure failures return `RepositoryError` which is not defined here.

---

## 4. Repository Organization

### Repository Contracts

The only repository contract is `CustomerRepository`, defined in `contracts/`.

The contract specifies that the repository must expose:

- a way to retrieve a customer by `CustomerId` (exact representation of "not-found" deferred)
- a way to persist a customer (create/update/insert semantics deferred)
- a way to remove a customer from the domain (hard/soft/archive deferred to adapter policy)
- a way to search across customers (criteria model deferred)

The repository operates on domain models and returns `Result<T, RepositoryError>`.

### Persistence Adapter Boundary

The repository contract is the public boundary that persistence adapters implement. Adapters live outside this package (typically in separate `@comity/sql-kysely` or custom adapter packages). The contract never mentions infrastructure, SQL, ORM, or HTTP.

Repository implementations must return domain models, never view models or framework-specific objects.

---

## 5. Use Case Organization

### Scope of Customer Use Cases

Public use cases (from API.md) are:

- `CreateCustomer`
- `UpdateCustomer`
- `DeleteCustomer`
- `GetCustomer`
- `SearchCustomers`

Implemented in `use-cases/`, each use case is a single-purpose unit.

### Relationship with Repository

Use cases depend on `CustomerRepository`. They do not depend on persistence specifics or repository method names.

- Whether a use case calls a unified persistence capability or separate create/update operations is deferred.
- The package structure does not encode method names, signatures, or create/update semantics.

### Explicit Limitations

From the approved API constraints, use cases must:

- never know persistence details
- only operate on the customer aggregate
- never call other Core Modules
- never invoke external systems
- never perform application-level workflow orchestration (e.g., send emails, call CRM, add loyalty accounts)

Use cases orchestrate repository calls and validation. They return `Result<T, CustomerError>`.

---

## 6. Validation Organization

From [API.md](./API.md), validation is owned by the module but its public exposure remains an open design decision.

Constraints for the package structure:

- **Internal implementation only** — validation rules and invariants live in the package but do not appear in `index.ts` unless an API decision makes them public.
- **No library dependency** — validation implementation may use an internal mechanism. The implementation must not become part of the public package contract.
- **Integration with use cases** — use cases call validation before any repository operation. Validation is designed to work with the customer aggregate model only.
- **Validation files** live in a dedicated internal folder (if needed) or directly within `domain/`.

---

## 7. Export Strategy

What gets exported from `index.ts` has been previously resolved as the public API:

- `Customer`, `CustomerId`, `Profile`, `Contact`, `Address`, `Preferences` (domain models)
- `CustomerRepository` (repository contract)
- `CreateCustomer`, `UpdateCustomer`, `DeleteCustomer`, `GetCustomer`, `SearchCustomers` (use cases)
- `CustomerNotFound`, `DuplicateCustomer`, `InvalidCustomer`, `InvalidAddress` (domain errors)

Everything else is internal only. This includes:

- validation implementations
- internal helpers
- adapter contracts for validation (if any)
- type mappings for the repository `Criteria` placeholder (deferred)

---

## 8. Testing Organization

### Unit Tests

Domain model tests validate invariants: `CustomerId` immutability, `Contact` value object validation and aggregate constraints.

### Domain Tests

Domain-level tests verify the invariants and error behavior defined by API.md.

Tests should validate:

- aggregate invariants
- value object rules
- domain error behavior
- repository contract assumptions

### Contract Tests

Repository contract tests validate that adapters:

- return domain models, not infrastructure types
- respect `Result<T, RepositoryError>` return type
- do not mutate `CustomerId` of an existing customer

These are contract compliance tests, not integration tests.

---

## 9. Open Implementation Decisions

The following decisions are not yet resolved and remain open:

- Should create and update use cases share a unified repository persistence capability or call separate operations, pending repository contract design?
- Should the search contract be defined in `contracts/` with a generic `Criteria` placeholder, or a specific `SearchCriteria` type?
- Should the `error/` folder exist as separate from `domain/` or should domain errors stay co-located with the aggregate folder?
- Where should deferred lifecycle information be represented, and is a deferred concept on the Customer aggregate sufficient until lifecycle finalization?
- Should `setup/` exist or should the module remain zero-config for v1?
