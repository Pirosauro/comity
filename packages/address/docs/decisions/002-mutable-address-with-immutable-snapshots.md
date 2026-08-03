# ADR-002 — Mutable Address Entity with Immutable Snapshots

**Status:** Accepted

## Context

An address has two different usage patterns:

1. **Current editable information** — The customer updates their address, the company changes headquarters, the user modifies a delivery address.
2. **Historical frozen information** — An order shipping address, an invoice address, a legal document lock-in.

Using only an immutable address creates friction for editing workflows. Using only a mutable address creates data integrity problems for historical records.

## Decision

`Address` is a **mutable entity**. `AddressSnapshot` is an **immutable type** (not a class) representing a point-in-time copy, created via `address.snapshot()`.

## Model

```
Address (entity)
  ── mutable
  ── has identity (optional at construction)
  ── snapshot() → AddressSnapshot

AddressSnapshot (type)
  ── immutable
  ── historical
  ── capturedAt: Instant
```

**Address responsibilities:**

- Current state
- Identity
- Controlled mutations

**AddressSnapshot is:**
- A type in the contracts module (not a standalone value object class)
- Created via `address.snapshot()`
- Immutable after creation
- Contains `capturedAt: Instant`

## Example

Before order:

```
Customer Address
  Via Roma 10, Milano, Italy
```

Order creation — snapshot captured:

```
Order Shipping Address Snapshot
  Via Roma 10, Milano, Italy
  Captured: 2026-07-31
```

Customer updates address:

```
Customer Address
  Via Milano 20, Milano, Italy
```

The order snapshot remains unchanged.

## Consequences

**Positive:**

- Historical consistency
- Simple customer editing flows
- No accidental mutation of past business documents
- Clear separation between current and historical data

**Negative:**

- More than one representation to understand
- Persistence layers must handle snapshots explicitly