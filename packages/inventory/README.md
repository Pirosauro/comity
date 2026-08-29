# @comity/inventory

Stock and reservation domain module for Comity.

---

## Purpose

Owns the stock model, reservations, and inventory quantity for Comity domain
modules. Catalog and other domain modules do not model stock; they defer to
this package.

> Catalog owns product definition, not commercial execution. Stock and
> reservations belong to `@comity/inventory`.

---

## Scope

This package:

- ✅ defines `Stock` — a stock record for a single SKU in a single warehouse,
  owning `onHand` and `reserved` quantities
- ✅ defines `Availability` — the derived view of what stock can currently
  provide (`available = onHand - reserved`)
- ✅ defines `Reservation` — an immutable record of a quantity of stock that
  is currently reserved (no lifecycle)
- ✅ defines `Quantity` — exact non-negative quantities (bigint + scale)
- ✅ defines `Sku`, `WarehouseId`, `StockId`
- ✅ defines the `StockRepository` contract
- ✅ defines `InventorySnapshot` — point-in-time inventory facts for other modules
- ✅ supports `reserve`, `release`, and `commit` operations on stock
- ❌ tracks a warehouse catalog or supplier management
- ❌ computes availability-to-promise or fulfilment logic
- ❌ models reservation workflows or lifecycle states
- ❌ knows about products or pricing

---

## Documentation

- docs/overview.md
- docs/conventions.md

---

## Public API

- Stock and reservation contracts — entities, value objects, and repository
- Error types — inventory failure reasons and metadata (`@comity/inventory/errors`)

No exhaustive reference; see docs for constraints.

---

## Related Packages

- @comity/catalog — product definition (no stock)
- @comity/primitives — Result, errors, Instant

---

## Status

Stable

_Review Completed: 2026-08-28_
_Reviewer: Automated Audit Remediation_
_Compliance Score: 99.5% (Green)_