# @comity/inventory — Overview

`@comity/inventory` is the stock and reservation domain module for Comity.

It owns how stock is modeled, mutated, and reserved. Other modules reference
stock through its value objects and repositories without coupling stock
decisions to product definition.

## What it includes

- `Stock` — a stock record for a single SKU in a single warehouse, owning
  the `onHand` and `reserved` quantities
- `Availability` — the derived view of what stock can currently provide:
  `onHand`, `reserved`, and `available = onHand - reserved`. Computed, never
  persisted, no repository.
- `Reservation` — an immutable value object representing a quantity of stock
  that is currently reserved (`sku`, `warehouseId`, `quantity`). It has no
  lifecycle and no states: it exists or it does not; releasing it returns
  the quantity to available stock.
- `Quantity` — exact non-negative quantities as `bigint` + `scale`
  (no floating-point arithmetic)
- `Sku`, `WarehouseId`, `StockId` value objects
- `StockRepository` contract (upsert, `null` not-found, no physical delete)
- `InventorySnapshot` — immutable point-in-time inventory facts for other
  modules
- `InventoryError` — typed domain reasons (`invalid_quantity`,
  `insufficient_stock`)

## What it does not include

- warehouse catalog / supplier management
- availability-to-promise or fulfilment logic
- reservation workflows, lifecycle states, or expiry handling
- product or pricing models
- business policies on search (discontinued, clearance, preorders)