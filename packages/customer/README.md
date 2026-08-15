# @comity/customer

Customer domain abstractions for Comity modules.

---

## Purpose

Defines the customer domain model — the `Customer` entity, the `CustomerId` value object, and the contracts modules use to store, load, and validate customers. Provides a stable domain boundary so application logic depends on contracts rather than infrastructure.

---

## Scope

This package:

- ✅ defines the `Customer` entity and `CustomerId` value object
- ✅ defines the `CustomerRepository` contract
- ✅ defines customer data, state, snapshot, create, and update types
- ✅ depends only on `@comity/primitives` and `@comity/validation`

This package does NOT:

- ❌ provide a repository implementation
- ❌ provide validation logic
- ❌ depend on infrastructure or adapters

---

## Public API

- `Customer` — customer entity
- `CustomerId` — customer identifier value object
- `CustomerRepository` — repository contract
- `CustomerSearchCriteria` / `CustomerSearchResult` — repository search contract
- `CustomerData` / `CustomerState` / `CustomerSnapshot` — customer data types
- `CustomerCreate` / `CustomerUpdate` — mutation input types
- `CustomerContact` / `CustomerPreferences` — customer detail types

---

## Documentation

None — no package-specific documentation exists.

---

## Related Packages

- @comity/primitives — foundational types used by the domain model
- @comity/validation — validation contracts referenced by the domain

---

## Status

Experimental/Draft

_Review Completed: 2026-08-15_
_Reviewer: Hobiri MAGI (DeepSeek v4 Pro)_
_Compliance Score: 98% (Green)_