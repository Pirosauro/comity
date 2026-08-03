# Package Design — @comity/address

## Purpose

`@comity/address` is a Core Module responsible for the address domain model.

## Architectural Layer

`@comity/address` is a **Core Module**.

```
Consumers / Adapters
    ↓
@comity/address
    ↓
@comity/primitives
```

Allowed dependencies: `@comity/primitives`

Forbidden dependencies: customer modules, order modules, geography implementations, validation libraries, persistence libraries, HTTP/UI frameworks.

## Package Structure

```
packages/address/src/
├── contracts/
│   ├── address.ts
│   ├── address-repository.ts
│   └── address-validator.ts
├── entities/
│   └── address.ts
├── value-objects/
│   ├── address-id.ts
│   └── address-line.ts
└── index.ts
```

## Directory Responsibilities

### contracts/

Public contracts: interfaces and types.

Contains:
- `address.ts` — AddressData, AddressFields, AddressSnapshot, AddressContact, AddressCreate, AddressUpdate, AddressState
- `address-repository.ts` — AddressRepository
- `address-validator.ts` — AddressValidator

### entities/

Domain entities: `Address` class — mutable entity with identity, update(), snapshot().

### value-objects/

Immutable value objects: `AddressId`, `AddressLine`. Both expose `equals()` and `toString()`.

## Public API Boundary

Defined by `src/index.ts`. Only explicitly exported symbols are public.

No `errors/`, `setup/`, or `internal/` directories exist. Address errors come from `@comity/primitives`. Module composition belongs to the application layer.

## Design Constraints

The package must not introduce:
- Country-specific address classes
- ShippingAddress / BillingAddress
- CustomerAddress
- Persistence models
- UI models
- AddressError
- DI tokens or setup code

## Growth Rules

Only introduce directories when needed. The current structure has exactly what's required and nothing more.