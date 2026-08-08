# Comity Standard — Domain Modeling & Repository Conventions

## Status

**Draft**

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

Identifiers MUST be represented by Value Objects.

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

Primitive aliases SHOULD NOT replace Value Objects for domain identifiers.

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

Represents persisted state.

```
Data
+ id
+ createdAt
+ updatedAt
+ deletedAt?
```

Persistence metadata belongs here.

---

### Create

Represents required input for creation.

Normally:

```
type EntityCreate = EntityData
```

---

### Update

Represents partial modifications.

```
type EntityUpdate = Partial<EntityData>
```

---

### Snapshot

Immutable exported representation.

```
State
+ capturedAt
```

---

# 5. Entity Lifecycle Metadata

Every persisted aggregate SHOULD expose lifecycle timestamps.

Canonical fields:

```
createdAt
updatedAt
deletedAt?
```

These belong to `State`.

They MUST NOT belong to `Data`.

Entities loaded from repositories MUST receive these values from persistence.

Entities MUST NOT generate timestamps internally except when explicitly created by factory methods.

---

# 6. Repository Contracts

Repository contracts are part of the Core Module.

Every repository SHOULD expose the same minimal API.

Canonical methods:

```
getById()

search()

save()

remove()
```

This naming is the preferred convention across Comity.

Modules MAY expose additional methods when required by the domain.

Example:

```
getByEmail()
getBySlug()
getByCode()
```

---

# 7. Repository Return Types

Repository operations return:

```
Result<T, RepositoryError>
```

RepositoryError is the canonical persistence abstraction.

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

instead of:

```
list()
find()
query()
```

Search criteria remain domain-specific.

Core Modules SHOULD NOT depend on a shared SearchCriteria abstraction unless a proven cross-domain need emerges.

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

Core Modules SHOULD remain independent.

Business relationships are composed by the Application Layer.

Example:

```
Identity
    ↓
Application mapping
    ↓
Customer
    ↓
Application mapping
    ↓
Access
```

Core Modules SHOULD avoid storing references to entities owned by other Core Modules unless the dependency is explicitly justified.

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

```
type
value
```

Examples:

- email
- phone
- telegram
- whatsapp
- fax

Modules SHOULD avoid introducing specialized contact subclasses unless domain behavior requires them.

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
