# ADR-005 — Validation and Formatting Are External Policies

**Status:** Accepted

## Context

An address requires multiple forms of validation:

1. **Structural validation** — city present, country code valid, postal code not empty
2. **Geographic validation** — Italian province exists, CAP consistent with zone, Chinese postal code valid
3. **Application validation** — address approved by customer, address verified by carrier, address allowed for shipping

These belong to different architectural layers. Embedding all of them in Address would create a tightly coupled module.

Formatting has the same issue: the same address is formatted differently for a letter, a parcel label, or an API response.

## Decision

`@comity/address` does not depend on any validation library. It does not perform validation internally.

The module may expose validation contracts as extension points, but never validation implementations.

Validation implementations are provided through adapters:

```
Application
    ↓
Address Validation Adapter
    ↓
@comity/address (contracts)
```

The address module defines the concept of valid address data as a contract.
The contract itself has no library dependency.

## Formatting

Formatting follows the same principle — it does not belong in Address.

Examples of the same address data formatted differently:
```
Via Roma 10
20100 Milano MI
Italy

10 Via Roma
20100 Milano (MI)
ITALY
```

Formatting belongs in a separate module: `@comity/address-formatters`.

The address entity does not format or present itself.

## Consequences

**Positive:**
- No dependency on external libraries
- Validation rules can be updated without changing the domain
- Global support via multiple validator adapters
- Multiple formatting strategies possible

**Negative:**
- Consumers must choose and configure the appropriate validator
- The base address does not guarantee geographic correctness