# ADR-003 — Geography as Independent Module

**Status:** Accepted

## Context

Countries have different address structures:

- **Italy:** Street, Postal Code, City, Province
- **China:** Province, City, District, Street
- **United States:** Street, City, State, ZIP Code

Embedding country-specific logic inside Address would lead to subclasses like `ItalyAddress`, `ChinaAddress`, `USAddress`. This does not scale globally and violates the single-responsibility principle.

## Decision

Geography is separated into a dedicated module: `@comity/address-geography`.

`@comity/address` stores only universal geographic references as plain values.

**Address owns:**

- `countryCode` (ISO 3166-1 alpha-2 string)
- `administrativeArea` (free-text)
- `city` (free-text)
- `lines` (address lines)
- `postalCode` (free-text)

**Geography owns:**

- Country metadata
- Subdivision hierarchy
- Administrative area codes
- Postal rules
- Geographic normalization

## Dependency

`@comity/address` and `@comity/address-geography` are independent modules:

```
@comity/address                @comity/address-geography
        ↓                              ↓
@comity/primitives              @comity/primitives
```

Address stores geographic identifiers as plain strings.
Geography enriches them — but does not own the base domain model.

`@comity/address` does not depend on `@comity/address-geography`.
`@comity/address-geography` does not depend on `@comity/address`.
Geography is an optional enrichment layer.

## Consequences

**Positive:**

- Address remains globally applicable
- Geography can evolve independently
- No coupling to external data sources
- Third-party geography providers can be adapted

**Negative:**

- Consumers must use a separate module for geography-aware operations
- Base address model does not guarantee geographic correctness
