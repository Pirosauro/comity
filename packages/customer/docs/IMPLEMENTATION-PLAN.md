# Implementation Plan

This document is the execution roadmap for `@comity/customer`. It defines implementation order, dependencies between steps, and verification strategy.

It does not redesign the module, introduce new public API decisions, or resolve open domain decisions.

Sources of truth: [AGENTS.md](../../../AGENTS.md), [PACKAGE-DESIGN.md](./PACKAGE-DESIGN.md), [API.md](./API.md), [DESIGN.md](./DESIGN.md).

---

## 1. Implementation Principles

Every implementation step in this plan respects:

- **Core Module constraints** — The package depends only on `@comity/primitives`. No adapter, application, or other Core Module dependencies unless explicitly justified.
- **Dependency restrictions** — `@comity/kernel` is permitted only if runtime integration becomes necessary and is explicitly approved. For this implementation phase, it is not required.
- **Public API stability** — `index.ts` exports only what is defined in [API.md](./API.md). Internal files never become public by accident.
- **No infrastructure coupling** — Repository contracts remain storage-agnostic. No SQL, ORM, HTTP, or GraphQL types appear in the package.
- **Deferred decisions stay open** — Lifecycle states, delete semantics, repository persistence semantics, search criteria shape, validation public API, and auth/customer linkage are not resolved by this plan.

---

## 2. Implementation Order

The recommended sequence follows the dependency chain: identifiers first, then aggregate components, then repository contract, then use cases. Each step produces a verifiable artifact.

### 2.1 Package Setup

Artifacts: `package.json`, `tsconfig.json` verification, `/src/index.ts` initial skeleton.

Dependencies: none.

Verification: package.json declares only `@comity/primitives` as a runtime dependency. `tsconfig.json` extends the root config. `src/` folder structure matches [PACKAGE-DESIGN.md](./PACKAGE-DESIGN.md) recommended structure.

Blocked by: nothing. This step always runs first.

### 2.2 Domain Foundation

Artifacts: `CustomerId`, value objects (`Contact`, `Address`, `Profile`, `Preferences`), domain errors (`CustomerNotFound`, `DuplicateCustomer`, `InvalidCustomer`, `InvalidAddress`), and `Customer` aggregate.

Dependencies: depends on package setup being complete.

Implementation:

- **CustomerId** — opaque value type. Implemented standalone because it is referenced by every other domain artifact.
- **Value Objects** — `Contact`, `Address`, `Profile`, `Preferences`. Use the field definitions from API.md. `Contact` follows the approved model: `id`, `type`, `value`, `verifiedAt?`, `primary?`. `Profile` contains given name, family name, display name (field optionality deferred). `Address` and `Preferences` are intentionally left with unspecified field structures.
- **Domain Errors** — Extend `BaseError` from `@comity/primitives`. Four types: `CustomerNotFound`, `DuplicateCustomer`, `InvalidCustomer`, `InvalidAddress`.
- **Customer aggregate** — Groups `CustomerId` + `Profile` + `Contact[]` + `Address[]` + `Preferences`. Lifecycle is acknowledged as a domain concept (states deferred); the aggregate definition acknowledges lifecycle as a concept but does not implement concrete states.

Verification: identifiers can be created without circular dependencies. Value objects reject invalid data according to documented invariants. Aggregate definition loads all associated types without compilation errors.

Blocked by: no domain decisions. All deferred fields are marked as deferred.

### 2.3 Repository Contract

Artifact: `CustomerRepository` contract in `contracts/`.

Dependencies: depends on `Customer`, `CustomerId`, `CustomerNotFound` being defined. The contract references domain models without depending on any infrastructure.

The contract defines:

- a retrieval capability (method deferred)
- a persistence capability (method deferred)
- a removal capability (method deferred, hard/soft/archive deferred to adapter policy)
- a search capability (criteria model deferred)

It returns `Result<T, RepositoryError>`.

This plan does not define method names, signatures, or create/update semantics.

Verification: contract is importable from domain models without circular dependencies. Adapter interface shape is clear but no behavior is assumed.

Blocked: nothing. The contract is capability-level only.

### 2.4 Use Cases

Artifacts: `CreateCustomer`, `UpdateCustomer`, `DeleteCustomer`, `GetCustomer`, `SearchCustomers` in `use-cases/`.

Dependencies: depends on repository contract being defined and domain models being available.

Implementation:

- Each use case is a single-purpose unit.
- Use cases call repository capabilities and validation before any operation.
- Use cases must not call other Core Modules, external systems, or perform workflow orchestration.

This plan does not encode whether `CreateCustomer` and `UpdateCustomer` call a unified persistence capability or separate create/update operations.

Verification: use cases can be instantiated with a repository contract. Validation calls happen before any persistence operation.

Blocked: no additional decisions required.

### 2.5 Validation Implementation

Artifact: validation internal implementation in `validation/` or co-located within `domain/` (implementation choice, not forced by this plan).

Dependencies: depends on domain models being defined. Validation consumes customer aggregate types.

Validation is internal only. It does not appear in `index.ts`.

Validation must:

- validate structural correctness before persistence
- produce domain errors representing validation failures

Implementation may use any internal mechanism but must not depend on a specific validation library in the public contract.

Verification: validation called by use cases before repository operations. Validation root domain models only.

Blocked: nothing. Implementation is internal.

### 2.6 Public Exports

Artifact: `index.ts` with public surface.

Dependencies: depends on all public artifacts being defined.

Exported are only what appears in [API.md](./API.md) Public Exports section:

- Domain models: `Customer`, `CustomerId`, `Profile`, `Contact`, `Address`, `Preferences`
- Contracts: `CustomerRepository`
- Use cases: `CreateCustomer`, `UpdateCustomer`, `DeleteCustomer`, `GetCustomer`, `SearchCustomers`
- Errors: `CustomerNotFound`, `DuplicateCustomer`, `InvalidCustomer`, `InvalidAddress`

Validation implementations are NOT exported.

Verification:`index.ts` exports only these symbols. No internal files leak.

### 2.7 Tests

Artifacts: test files within `src/` (colocated with source units, per team convention).

**Domain tests** covering:

- `CustomerId` immutability
- `Contact` field validation and aggregate constraints
- `Address` structural invariants
- Aggregate-level invariants
- All domain errors have correct types

**Contract tests** covering:

- `CustomerRepository` contract structure return types
- Contract does not expose infrastructure

**Use case tests** covering:

- Validation called before persistence
- Use cases never call external systems

All tests reference [API.md](./API.md) for invariant sources.

### 2.8 Documentation Synchronization

The final step is synchronizing the documentation tree:

- Ensure all public exports match [API.md](./API.md)
- Ensure open decisions match DESIGN.md Open Questions
- If any decision has changed implementation orientation, flag it as a docsync task

---

## 8. Implementation Milestones

### Milestone 1 — Domain Foundation Complete

Artifacts: `CustomerId`, all value objects, domain errors, Customer aggregate, `CustomerRepository` contract.

Acceptance: Customer aggregate loads all sub models without circular imports. Domain errors extend BaseError.

### Milestone 2 — Use Cases Complete

Artifacts: All five use cases defined and operational against a repository contract.

Acceptance: Use cases can be called with a validated aggregate.

### Milestone 3 — Public API Complete

Artifacts: `index.ts` frozen with public exports. Validation remains internal.

Acceptance: Exports surface matches [API.md](./API.md). No validation library in dependency tree.

### Milestone 4 — Test Coverage Complete

Artifacts: domain, contract, and use case tests.

Acceptance: All invariants described in [API.md](./API.md) have corresponding test. Contract tests correctly test repository contract.

---

## 9. Deferred Decisions (No Implementation Resolution)

The following decisions must remain open. Implementations must not accidentally decide them:

| Decision                                                       | Why Deferred                      | Implementer Action                                                       |
| -------------------------------------------------------------- | --------------------------------- | ------------------------------------------------------------------------ |
| Lifecycle states                                               | Open domain decision              | Do not implement concrete lifecycle states; leave as concept             |
| Delete semantics                                               | Moves to adapter policy           | Repository contract exposes removal capability without hard/soft/archive |
| Repository persistence method names (save, create, update)     | Reserved for API/contract design  | Do not name methods in structure or contracts                            |
| Search criteria shape (`Criteria` vs `CustomerSearchCriteria`) | Search semantics deferred         | Repository contract handles criteria as placeholder                      |
| Validation public API                                          | Decision open                     | Validation lives in `src/validation/` but is not exported                |
| Auth/customer linkage                                          | Architectural boundary unresolved | Aggregate does not contain foreign module identifiers                    |

If any of these become mandatory for implementation, they must be approved as explicit ADR decisions before being implemented.
