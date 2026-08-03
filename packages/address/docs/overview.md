# @comity/address — Overview

`@comity/address` provides address domain abstractions as a reusable Core Module.

## Responsibility

The module owns the address domain: modeling, identity, and contracts. It does not own geography, validation implementations, formatting, lifecycle, or consumer relationships.

## Entities

- `Address` — mutable entity with identity

## Value Objects

- `AddressId` — opaque identifier, compared by value
- `AddressLine` — single printable address line

## Contracts

- `AddressRepository` — persistence contract
- `AddressValidator` — validation contract

## Types

- `AddressSnapshot` — immutable point-in-time type (not a class)
- `AddressContact` — generic contact type pair
- `AddressCreate` — data required to create an Address
- `AddressUpdate` — partial update data
- `AddressData` — core address data
- `AddressFields` — full address fields

## Boundaries

- `@comity/address-geography` — country metadata, subdivisions, postal rules
- `@comity/address-validation-*` — validation adapters
- `@comity/address-formatters` — address formatting

These modules depend on `@comity/address`, never the opposite.