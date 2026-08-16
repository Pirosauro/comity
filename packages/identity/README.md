# @comity/identity

Identity domain abstractions for Comity modules.

---

## Purpose

Defines the identity domain model — the `User` entity, the `UserId` value object, and the contracts modules use to store, load, and validate users. Provides a stable domain boundary so application logic depends on contracts rather than infrastructure.

---

## Scope

This package:

- ✅ defines the `User` entity and `UserId` value object
- ✅ defines the `UserRepository` contract
- ✅ defines user data, state, snapshot, create, and update types
- ✅ defines the `UserValidator` contract
- ✅ depends only on `@comity/primitives` and `@comity/validation`

This package does NOT:

- ❌ provide a repository implementation
- ❌ provide validation logic
- ❌ depend on infrastructure or adapters

---

## Public API

- `User` — user entity
- `UserId` — user identifier value object
- `UserRepository` — repository contract
- `UserSearchCriteria` / `UserSearchResult` — repository search contract
- `UserData` / `UserState` / `UserSnapshot` — user data types
- `UserCreate` / `UserUpdate` / `UserStatus` — mutation and status types
- `UserValidator` — validation contract


No exhaustive reference; see docs for constraints.
---

## Documentation

None — no package-specific documentation exists.

---

## Related Packages

- @comity/primitives — foundational types used by the domain model
- @comity/validation — validation contracts referenced by the domain

---

## Status

Experimental

_Review Completed: 2026-08-15_
_Reviewer: Hobiri MAGI (DeepSeek v4 Pro)_
_Compliance Score: 98% (Green)_