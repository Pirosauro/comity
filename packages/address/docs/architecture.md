# @comity/address — Architecture

## Module role

`@comity/address` is a **Core Module** in the composite layering model. It owns the address domain model and contracts.

## Dependency graph

```
Application / Adapters
    ↓
@comity/address
    ↓
@comity/primitives
```

## Owned concerns

- Address entity and identity
- Value objects (AddressId, AddressLine)
- AddressSnapshot type (in contracts)
- AddressRepository contract
- AddressValidator contract
- Address types (AddressData, AddressFields, AddressCreate, AddressUpdate, AddressState, AddressContact, AddressSnapshot)

## External concerns

| Concern          | Module                     |
| ---------------- | -------------------------- |
| Country metadata   | `@comity/address-geography` |
| Validation rules   | External adapters          |
| Formatting         | `@comity/address-formatters` |
| Persistence        | Adapters                   |
| Domain errors      | `@comity/primitives`       |

## File structure

```
packages/address/src/
  contracts/           — Public contracts (address-repository, address-validator, address types)
  entities/            — Domain entities (Address)
  value-objects/       — Immutable value objects (AddressId, AddressLine)
  index.ts             — Public API barrel
```