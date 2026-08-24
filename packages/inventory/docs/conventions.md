# @comity/inventory — Conventions

This document defines the conventions for `@comity/inventory`.

---

## 1. Scope

The package is a domain module, not a contract-only placeholder. It owns the
`Stock` aggregate, the `Availability` view, and the `Reservation` value
object.

It MUST NOT grow into a warehouse catalog, an availability-to-promise engine,
or a fulfilment module.

---

## 2. Layering

`@comity/inventory` MAY depend on `@comity/primitives` only.

It MUST NOT depend on `@comity/catalog`, `@comity/pricing`, or
`@comity/order`. Catalog keeps a loose `sku` string reference and does not
model stock.

---

## 3. Quantity

- Quantities are `bigint` counts with a `scale` (fractional digits).
- Arithmetic is exact — floating-point `number` is never used for quantities.
- Quantities are non-negative and created through `Quantity.create`, which
  returns a `Result`.
- Each Stock keeps its own scale; operations normalize to the largest scale.

---

## 4. Stock

- Stock is multi-warehouse native: identity is the `(Sku, WarehouseId)` pair.
- A Stock owns its quantities and preserves the invariants `onHand >= 0`,
  `reserved >= 0`, and `reserved <= onHand` through every mutation.
- Mutations (`increase`, `decrease`, `reserve`, `release`) return a `Result`
  and never throw.
- `decrease` and `reserve` fail with `insufficient_stock`; `release` fails
  with `invalid_quantity` when the quantity exceeds the reserved amount.

---

## 5. Availability

- `Availability` is a derived value object: `available = onHand - reserved`.
- It is computed from the stock amounts and NEVER persisted; it has no
  repository and no state of its own.
- It carries no commercial policy (preorder, backorder, sellable, low stock):
  those belong to higher layers.

---

## 6. Reservation

- A Reservation is an immutable value object: `sku`, `warehouseId`,
  `quantity`. It represents a quantity of stock that is currently reserved.
- It has NO lifecycle and NO states — no pending/confirmed/released/
  expired/cancelled, no transitions, no expiry. It exists or it does not.
- `Stock.reserve(quantity)` returns a Reservation that is already effective;
  there is no confirmation step.
- Releasing happens on the Stock (`Stock.release(quantity)`): the reserved
  quantity becomes available again.
- Persisting reservation records, when needed, is the responsibility of the
  orchestrating layer (e.g. checkout) — not of `@comity/inventory`. There is
  no ReservationRepository.

---

## 7. Repositories

- Contracts are the persistence boundary only; domain behavior lives on the
  entities.
- Not found is `null`, never an error.
- `save` is an upsert. No `remove` operation is exposed.
- Only `StockRepository` exists. There is no repository for `Availability`
  (derived) or `Reservation` (orchestration-owned).

---

## 8. Search Criteria

`StockSearchCriteria` is structural only: `sku`, `warehouseId`,
`availableAtLeast`.

Business policies (discontinued products, clearance, preorders, order
fulfilment) are NOT modeled in search criteria.

---

## 9. InventorySnapshot

- `InventorySnapshot` carries historical facts (`sku`, `warehouseId`,
  `quantity`) for other modules to persist at business-event time.
- It NEVER carries a live `Stock`, a reservation, or availability logic.
- Consumers (e.g. `@comity/order`) store the snapshot; they do not reach back
  into inventory at read time.

---

## 10. Errors

- Domain failures use `InventoryError` with the reasons owned by this module:
  `invalid_quantity` and `insufficient_stock`.
- Generic reasons (`not_found`, `unknown`, `validation_failed`,
  `repository_error`) are forbidden (ADR-012, ADR-013).