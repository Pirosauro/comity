# @comity/order

Order domain contracts for Comity commerce modules.

---

## Purpose

Defines order contracts and models consumed by commerce and storefront modules. Unifies cart and order into a single domain where a cart is an order in draft status. Provides repositories, item models, and structured errors without binding to a specific commerce backend.

---

## Scope

This package:

- ✅ defines order, item, and product models with status lifecycle
- ✅ defines order repository contracts
- ✅ exposes the `error` subpath for order-specific error types

This package does NOT:

- ❌ implement checkout orchestration or payment processing
- ❌ manage inventory or pricing logic
- ❌ render order UI

---

## Public API

- `OrderRepository` — repository contract for order operations
- `OrderModel`, `OrderStatus` — order model with lifecycle status
- `OrderItemModel`, `OrderItemOptionModel`, `OrderProductModel` — item and product models
- `OrderAddItemInput` — typed input for item addition
- `errors` subpath — structured error types for the order domain

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

_Review Completed: 2026-08-01_
_Compliance Score: N/A% (Green)_