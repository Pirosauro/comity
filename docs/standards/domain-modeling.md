# Comity Standard — Domain Modeling & Repository Conventions

## Status

**Approved**

This document defines the canonical conventions for modeling domain modules inside Comity.

The rules in this document apply to every Core Module unless explicitly overridden by a future decision.

---

# 1. Domain Model

A Core Module models a bounded context.

A bounded context owns:

- Entities
- Value Objects
- Repository contracts
- Data models
- Domain contracts

A Core Module MUST NOT own infrastructure.

---

# 2. Entities

Entities represent mutable domain objects with identity.

An Entity MUST:

- have an identifier represented by a Value Object
- encapsulate mutable state
- expose getters
- expose explicit mutation methods
- provide `snapshot()`

Entities SHOULD use private fields (`#`).

Example:

```
Customer
Address
User
Order
```

Entities are never serialized directly.

---

# 3. Value Objects

Identifiers of domain aggregates owned by the Core Module MUST be represented by Value Objects.

Example:

```
CustomerId
AddressId
UserId
OrderId
```

Value Objects:

- are immutable
- implement equality
- expose `toString()`
- validate construction invariants

### Read-Projection Exception

Read-only projections of externally-owned entities MAY represent external identifiers using primitive types such as `string`.

For example:

```ts
interface ProductModel {
  readonly id: string;
}
```

is valid when `ProductModel` is a read projection over an external system and the Core Module does not own the Product lifecycle.

Primitive aliases SHOULD NOT replace Value Objects for identifiers of Comity-owned domain aggregates.

---

# 4. Data Models

Each aggregate exposes a minimal set of structural types.

Canonical pattern:

```
<Entity>Data
<Entity>State
<Entity>Create
<Entity>Update
<Entity>Snapshot
```

Responsibilities:

### Data

Represents the business information.

Contains no identifiers.

Contains no timestamps.

---

### State

Represents the complete persisted state of an entity.

For entities that track lifecycle timestamps:

```ts
interface EntityState extends EntityData {
  readonly id: EntityId;
  readonly createdAt: Instant;
  readonly updatedAt: Instant;
}
```

Persistence metadata belongs here.

`deletedAt` is OPTIONAL and MUST only be present when the bounded context actually supports soft deletion. The absence of soft-delete support MUST NOT be inferred from the omission of `deletedAt`.

`updatedAt` MUST NOT be made nullable merely to represent "never updated". At creation `createdAt === updatedAt`.

---

### Create

Represents an explicit construction contract for an entity.

`Create` is defined according to domain creation semantics. It MUST NOT be mechanically derived from `State`.

Lifecycle metadata MAY appear in `Create` as optional fields so that the same constructor can support both normal creation and hydration from persistence:

```ts
type UserCreate = UserData & {
  readonly createdAt?: Instant;
  readonly updatedAt?: Instant;
  readonly status?: UserStatus;
};
```

The exact fields depend on the domain. The presence and optionality of each lifecycle field reflect the bounded context's creation and hydration semantics.

`Partial` MUST NOT be applied to the entire `Create` contract.

---

### Update

Represents partial modifications.

```ts
type EntityUpdate = Partial<Omit<EntityState, "createdAt" | "updatedAt">>;
```

`Partial` is appropriate for update contracts where partial modification is explicitly intended.

Lifecycle metadata MAY be excluded from `Update` when transitions are governed by dedicated domain operations rather than free-form mutation.

---

### Snapshot

Immutable exported representation.

```
State
+ capturedAt
```

---

# 5. Entity Lifecycle & Hydration

### Creation vs Hydration

A clear distinction MUST be maintained between creating a new entity and restoring an existing one from persistence:

- **Entity creation** initializes creation-time state.
- **Entity hydration** restores persisted State.

The implementation mechanism for hydration is left to the module. A constructor, a factory, a static `fromState()` method, or an equivalent mechanism may be used. The canonical implementation is constructor-based hydration.

### Creation

When a new entity is created, lifecycle timestamps that are not supplied are initialized automatically.

For example:

```ts
this.#createdAt = fields.createdAt ?? Instant.now();
this.#updatedAt = fields.updatedAt ?? this.#createdAt;
```

At creation, when the caller does not supply lifecycle timestamps:

```
createdAt = Instant.now()
updatedAt = createdAt
```

### Hydration

When an entity is restored from persistence, persisted lifecycle metadata MUST be restored.

The entity MUST NOT silently regenerate persisted timestamps.

Hydration MAY be performed through any module-appropriate mechanism as long as persisted lifecycle metadata is preserved. The same constructor used for creation typically supports hydration when `Create` accepts optional lifecycle metadata.

The architectural invariant is:

> Persisted lifecycle metadata MUST be preserved during hydration.

`Instant.now()` is a creation-time fallback only. The entity MUST NOT overwrite supplied persistence values.

### Timestamp Integrity

- Every persisted aggregate SHOULD expose lifecycle timestamps (`createdAt`, `updatedAt`, `deletedAt?`) in its `State`.
- These timestamps MUST NOT belong to `Data`.
- Entities loaded from repositories MUST receive these values from persistence.
- **Hydration MUST NOT regenerate or alter persisted timestamps.**
- Entities MUST NOT generate timestamps internally except when explicitly created by factory methods.
- `createdAt` and `updatedAt` MUST NOT be nullable merely to represent "never updated". At creation they MUST be equal.

### Separation of Responsibilities

```text
Type system
    → structural shape and required/optional fields

Validator
    → semantic validity and domain constraints

Entity
    → lifecycle and invariant-preserving behavior
```

The standard does not redefine validation architecture. The separation above exists to clarify that lifecycle invariants belong to the entity, structural optionality belongs to the type system, and domain validity belongs to the validator.

---

# 6. Repository Contracts

Repository contracts are part of the Core Module.

### Canonical API

Every repository SHOULD expose the same minimal API. Repository operations are optional when not semantically applicable.

Canonical methods:

```
getById()
search()
save()
remove()
```

This naming is the MUST convention across Comity.

Modules MAY expose additional methods when required by the domain.

Example:

```
getByEmail()
getBySlug()
getByCode()
```

### Read-Projection Exception

Read-only projection repositories are valid Core Module contracts when the underlying aggregate is owned by another system or bounded context.

Such repositories:

- MAY expose only the operations they semantically own;
- MUST NOT be forced to expose `save()` or `remove()` when the Core Module does not own persistence or lifecycle;
- SHOULD expose stable, immutable projection models rather than mutable entities.

For example, a catalog repository that exposes a read projection over an external commerce backend is valid without `save` or `remove`.

---

# 7. Repository Return Types

Repository operations return:

```
Result<T, RepositoryError>
```

Repository-specific result aliases are discouraged.

Do not introduce:

```
RepositoryResult<T>
```

unless a future architectural need justifies it.

---

# 8. Repository Errors

Repository contracts use:

```
RepositoryError
```

from `@comity/primitives`.

Required metadata:

```
repository
operation
```

Both fields are mandatory.

Repository errors describe infrastructure failures.

They do not represent business validation failures.

Business rules belong to domain services or entity methods.

---

# 9. Search

Repositories SHOULD expose:

```
search(criteria)
```

instead of `list()`, `find()`, or `query()`.

A `search()` criteria object MAY omit a textual query. For example:

```ts
search({
  filters: [...]
})
```

is valid and may represent filtered collection retrieval. A separate `list()` method MUST NOT be introduced merely because no textual query is present.

### Search Criteria

- Generic search criteria from another Core Module MUST NOT replace a module-specific search criteria type when the bounded context requires domain-specific semantics.
- A Core Module MAY use shared search primitives only when doing so does not introduce an inappropriate dependency or weaken its domain contract.

---

# 10. Validation

Core Modules define validation contracts.

Example:

```
CustomerValidator
AddressValidator
UserValidator
```

Validation implementations belong to adapters.

Core Modules MUST NOT import validation libraries.

---

# 11. Cross-Module Relationships

Core Modules MUST preserve clear ownership boundaries.

A Core Module MUST NOT depend on the **lifecycle, persistence, or mutable state management** of an entity owned by another Core Module.

This does **not** mean that Core Modules can never reference types from other Core Modules.

### Allowed Cross-Module Dependencies

A Core Module MAY depend on stable contracts or immutable models from another Core Module when the dependency represents a legitimate domain relationship and does not transfer ownership.

Examples include:

- immutable snapshots
- point-in-time models
- shared value models
- stable domain contracts

For example, `@comity/order` MAY use a product model from `@comity/catalog` when the model represents the product information required by an order at the time the order is created.

The Order does not own the Product and MUST NOT manage its lifecycle or persistence.

### Forbidden Dependencies

A Core Module MUST NOT:

- depend on another module's repository
- persist or mutate another module's entity
- manage another module's entity lifecycle
- require another module's infrastructure
- use another module's mutable entity as part of its own persistence lifecycle when a stable model or snapshot is sufficient

For example:

```text
@comity/order
    └── @comity/catalog
          └── ProductRepository
```

is an architectural violation.

Whereas:

```text
@comity/order
    └── ProductModel / ProductSnapshot
```

may be valid when the dependency represents a point-in-time domain model rather than ownership.

### Application Layer Composition

Relationships that connect independent business aggregates or bounded contexts MAY be composed by the Application Layer.

For example:

```text
Identity ──┐
           ├── Application ── Customer
Access  ───┘
```

The Application Layer is responsible for orchestration when no direct domain-model dependency is required.

### Guiding Principle

The architectural constraint is **ownership independence**, not zero imports.

A dependency is acceptable when it expresses a stable domain contract without transferring lifecycle or persistence ownership.

A dependency is not acceptable when one Core Module becomes responsible for the mutable lifecycle, persistence, or infrastructure of another Core Module.

---

# 12. Preferences

Preferences represent application-specific settings.

Canonical representation:

```
Readonly<Record<string, unknown>>
```

Core Modules define no preference schema.

Applications own preference semantics.

---

# 13. Contacts

Contacts are modeled as generic communication channels.

Canonical shape:

```ts
{
  readonly type: string;
  readonly value: string;
}
```

Examples:

- email
- phone
- telegram
- whatsapp
- fax

Modules SHOULD avoid introducing specialized contact subclasses unless domain behavior requires them.

Modules MAY share a contact contract when there is a demonstrated architectural need. Identical structure alone is not sufficient justification for introducing a shared abstraction.

---

# 14. Naming

Preferred names:

```
<Entity>Data
<Entity>State
<Entity>Create
<Entity>Update
<Entity>Snapshot
```

Repository methods:

```
getById
search
save
remove
```

Identifier Value Objects:

```
CustomerId
OrderId
AddressId
UserId
```

---

# 15. Future Work

The following topics require a dedicated standard:

- Lifecycle modeling
- Aggregate roots
- Domain services
- Commands
- Specifications
- Repository search criteria
- Event publication
- Factory conventions
- Entity creation factories

---

# 16. Guiding Principle

Comity standards define architectural constraints and preferred conventions.

They MUST NOT require structural uniformity when the underlying domain semantics are different.

In particular:

- domain aggregates are not the same as read projections;
- repositories are not the same as domain services;
- external identifiers are not necessarily domain Value Objects;
- shared structures do not automatically require shared types;
- similar APIs do not necessarily imply identical ownership.

The purpose of this standard is to preserve architectural boundaries and predictable conventions while allowing legitimate domain-specific variation.
