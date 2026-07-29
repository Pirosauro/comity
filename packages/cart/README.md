# @comity/cart

Cart abstractions for Comity domain modules.

---

## Purpose

Defines cart contracts and cart-related models consumed by higher-level commerce modules. Provides repositories, models, and separation from catalog to prevent coupling.

---

## Scope

This package:

- defines cart repository contracts
- defines cart, item, and pass-through product models
- exposes the `error` subpath for cart-specific error types

This package does NOT:

- manage checkout or payment
- implement pricing or inventory logic
- render cart UI specifically

---

## Public API

- `CartRepository` — repository contract for cart operations
- `CartModel` — structured cart representation
- `CartItemModel`, `CartItemOptionModel` — cart item typing
- `CartAddItemInput` — typed item addition input
- `errors` subpath — structured error types for cart domain

No exhaustive reference; see docs for constraints.

---

## Documentation

- docs/overview.md
- docs/conventions.md

---

## Related Packages

- @comity/catalog — product pricing models and repositories
- @comity/kernel — module lifecycle runtime
- @comity/search — generic search abstractions

---

## Status

Stable

_Review Completed: July 25, 2026_
_Reviewer: Hobiri MAGI (DeepSeek v4 Pro)_
_Compliance Score: 99.5% (Green)_