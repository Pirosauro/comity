# @comity/address

Address domain abstractions for Comity.

---

## Purpose

Owns the address domain: the mutable `Address` entity, immutable snapshots, value objects, the repository contract, and the validator contract. Provides the canonical address representation reused across bounded contexts.

---

## Scope

This package:

- ✅ defines the `Address` entity and `AddressSnapshot` value model
- ✅ defines address value objects (`AddressId`, `AddressLine`, `AddressContact`)
- ✅ defines `AddressRepository` and `AddressValidator` contracts
- ✅ exposes creation and hydration types (`AddressCreate`, `AddressUpdate`, `AddressState`)

This package does NOT:

- ❌ implement country-specific address models
- ❌ handle geography enrichment or formatting
- ❌ import validation libraries directly
- ❌ own persistence or lifecycle of other modules' entities

---

## Public API

- `Address` — mutable address entity
- `AddressSnapshot` — immutable point-in-time address type
- `AddressId`, `AddressLine`, `AddressContact` — value objects
- `AddressCreate`, `AddressUpdate`, `AddressData`, `AddressState` — creation and hydration types
- `AddressRepository` — repository contract
- `AddressValidator` — validation contract

No exhaustive reference; see docs for constraints.

---

## Documentation

- docs/overview.md
- docs/conventions.md
- docs/architecture.md

---

## Related Packages

- @comity/primitives — foundational building blocks
- @comity/validation — shared validation contracts

---

## Status

Stable

_Review Completed: 2026-08-15_
_Reviewer: Hobiri MAGI (DeepSeek v4 Pro)_
_Compliance Score: 95% (Green)_
