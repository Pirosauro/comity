# @comity/geography Design

## Purpose

@comity/geography provides geographic metadata and rules
independent from address storage.

An address stores geographic identifiers.
Geography enriches and interprets them.

---

## Architectural Position

@comity/geography is a core module.

Dependency direction:

```
@comity/geography
    ↓
@comity/primitives
```

It MUST NOT depend on:

- @comity/address
- @comity/customer
- commerce modules

---

## Owns

Geography owns:

- country metadata
- subdivision hierarchy
- geographic identifiers
- normalization contracts
- postal rule contracts

---

## Does Not Own

Geography does NOT own:

- Address entity
- Address lifecycle
- Customer
- Shipping logic
- Tax calculation
- Order logic

---

## Relationship With Address

Address stores geographic values:

- countryCode
- region
- city
- postalCode

Geography provides interpretation and enrichment.

Example:

Address:

countryCode = "IT"
region = "LOM"

Geography:

country = Italy
subdivision = Lombardia
