# @comity/address — Design Document

## 1. Purpose

`@comity/address` is a Core Module responsible for modeling and managing addresses as reusable domain entities.

The module provides a framework-independent representation of a physical or operational location. Consumers reference addresses by `AddressId` rather than embedding address data directly.

The module intentionally does not model:

- lifecycle (active, archived, etc.)
- business ownership (who this address belongs to)
- recipients (who lives or works there)
- orders, shipments, or billing relationships

An address represents a location, not a person or an association.

---

## 2. Architectural Position

`@comity/address` is a Core Module.

Dependency direction:

```
Applications / Adapters
      ↓
@comity/address
      ↓
@comity/primitives
```

The module:

- owns the Address entity
- owns address identity (AddressId)
- owns address snapshots (AddressSnapshot type)
- owns address repository contract
- owns address validation contract (extension point only)
- owns address-related types (AddressContact, AddressCreate, AddressUpdate, AddressData, AddressFields, AddressState)

The module does not:

- access databases
- know persistence technologies
- format addresses for printing
- validate country-specific rules
- depend on geography providers
- depend on UI or transport frameworks
- model recipients, customers, orders, or shipments
- define domain errors — all errors come from @comity/primitives

---

## 3. Design Goals

### 3.1 Universal Address Model

The address model must work globally.

The module must support different geographic realities without introducing country-specific classes.

### 3.2 Avoid Country-Specific Types

The module intentionally avoids models such as `ItalyAddress`, `ChinaAddress`. Country-specific knowledge belongs to other modules (e.g. `@comity/address-geography`).

---

## 4. Domain Model

The core concept is:

```
Address
    |
    +-- AddressId (value object to string)
    |
    +-- lines (AddressLine[])
    |
    +-- city (string)
    |
    +-- administrativeArea (string | null)
    |
    +-- postalCode (string)
    |
    +-- countryCode (string)
    |
    +-- label (string | null)
    |
    +-- metadata (Record<string, string> | null)
    |
    +-- contacts (AddressContact[])
    |
    +-- createdAt (Instant)
```

Value objects:

- `AddressId` — opaque identifier
- `AddressLine` — single printable address line

Other fields (`postalCode`, `countryCode`, `administrativeArea`) are plain values.

---

## 5. Address as Entity

Address is modeled as an Entity.

Reasons:

- addresses have identity
- addresses can change over time
- multiple contexts may reference the same address

---

## 6. Mutable Entity and Immutable Snapshot

### Address

Mutable entity class. Identity is optional at construction (id can be undefined).

Constructor signature: `new Address(fields: AddressCreate, id?: AddressId)`

Used for customer editing and administrative updates.

### AddressSnapshot

AddressSnapshot is a **type** (not a class), defined in the contracts module.

It is an immutable representation of an address at a specific point in time. It is created via `address.snapshot()`.

Key properties:
- `id: AddressId | undefined`
- `capturedAt: Instant`

---

## 7. Geography Boundary

Geographical knowledge is separated into `@comity/address-geography`.

Address stores geographic identifiers as plain strings. Geography enriches them — but does not own the base domain model.

---

## 8. CountryCode

The address module stores `countryCode` as a plain string using ISO-compatible values. The module does not own country lists, country names, subdivisions, or postal validation.

---

## 9. Validation Boundary

Validation is external. The module exposes `AddressValidator` as a contract extension point, but never depends on validation libraries.

```ts
interface AddressValidator {
  validate(address: Address): Result<void>;
}
```

---

## 10. Formatting Boundary

Formatting is external. The address module does not know how an address should be formatted. Formatting concerns belong to `@comity/address-formatters`.

---

## 11. Repository Contract

```ts
interface AddressRepository {
  get(id: AddressId): Promise<Result<Address | null, RepositoryError>>;
  save(address: Address): Promise<Result<void, RepositoryError>>;
}
```

---

## 12. Metadata

Metadata is `Record<string, string> | null` for predictable serialization and storage compatibility.

---

## 13. Contacts

Contacts are `type: string` / `value: string` pairs. The module does not enumerate valid contact types.

---

## 14. Public API Philosophy

The public API exposes:

- the Address entity
- value objects (AddressId, AddressLine)
- contracts (AddressRepository, AddressValidator)
- types (AddressSnapshot, AddressContact, AddressCreate, AddressUpdate, AddressData, AddressFields, AddressState)

The public API does not expose:

- AddressError (all errors come from @comity/primitives)
- persistence details
- validation implementations
- formatting implementations
- geography data or metadata
- DI tokens or module setup
- recipient models
- business workflow states

---

## 15. Architectural Decisions

- ADR-001 — Address as Domain Core Module
- ADR-002 — Mutable Entity with Immutable Snapshots
- ADR-003 — Geography as Independent Module
- ADR-004 — No Country-Specific Address Models
- ADR-005 — Validation and Formatting Are External
- ADR-006 — AddressRepository Owned by Address Module
- ADR-008 — Contacts Modeled Generically

---

## 16. Non Goals

This module does not provide:

- UI components
- address forms
- country dropdowns
- postal APIs
- map integration
- geocoding
- delivery optimization
- persistence implementations
- recipient models
- business workflow states
- address lifecycle management
- address errors

Those belong to other modules, adapters, or @comity/primitives.

---

## 17. Final Design Principle

`@comity/address` provides a universal address identity model. It doesn't try to understand every possible address — it provides a stable foundation for specialized modules to add knowledge without contaminating the core domain.