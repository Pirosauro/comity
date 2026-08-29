# @comity/order

Order domain contracts for Comity commerce modules.

---

## Purpose

Defines order contracts and models consumed by commerce and storefront modules. Unifies cart and order into a single domain where a cart is an order in draft status. Provides repositories, item models, and structured errors without binding to a specific commerce backend.

---

## Scope

This package:

- ✅ defines the order entity with lifecycle and item mutations
- ✅ defines order, item, and product contracts with status lifecycle
- ✅ defines order repository contracts
- ✅ exposes the `error` subpath for order-specific error types

This package does NOT:

- ❌ implement checkout orchestration or payment processing
- ❌ manage inventory or pricing logic
- ❌ validate coupons or apply promotion rules
- ❌ render order UI

---

## Public API

- `Order` — order entity with lifecycle and item mutations (`addItem`, `removeItem`, `updateItemQuantity`, `submit`, `confirm`, `fulfill`, `cancel`)
- `OrderId` — order identifier value object
- `OrderRepository` — persistence-boundary contract (`getById`, `search`, `save`)
- `OrderState`, `OrderCreate`, `OrderUpdate`, `OrderSnapshot`, `OrderData`, `OrderStatus` — domain contracts
- `OrderItem`, `OrderProductSnapshot` (with `OrderVariantSnapshot`, `OrderProductAttribute`, `OrderProductOption`) — embedded item value structures
- Error types (`@comity/order/errors`)

The product data in an order is an **owned, immutable snapshot**
(`OrderProductSnapshot`): it is self-contained and never references the
catalog after order creation. The application/checkout maps
`ProductProjection` into the snapshot at creation time.

Price composition is owned by `@comity/pricing`: orders store the immutable
`Price` value (line item and order level) and do not store modifiers
separately — modifiers are accessed only through `price.modifiers`.

No exhaustive reference; see docs for constraints.

---

## Documentation

- docs/overview.md
- docs/conventions.md

---

## Related Packages

- @comity/pricing — price and money models (`order → pricing`, registered in ADR-008)
- @comity/catalog — source of `ProductProjection`, mapped by the application into owned `OrderProductSnapshot` (no direct dependency)
- @comity/kernel — module lifecycle runtime

---

## Status

Stable

_Review Completed: 2026-08-01_
_Compliance Score: N/A% (Green)_