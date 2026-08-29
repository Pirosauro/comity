# @comity/pricing

Pricing domain for Comity commerce modules.

---

## Purpose

Owns the commercial pricing domain: the `Currency` Value Object (which owns
monetary precision via its ISO 4217 minor-unit exponent), the `Money` Value
Object (integer minor units), the `Percentage` Value Object for rates, the
`Price` Value Object with the `PriceModifier` value structure, the
`PriceSnapshot` point-in-time capture, and the pure `calculatePrice` engine.

> Catalog owns product definition, not commercial execution. Price belongs to
> `@comity/pricing`.

---

## Scope

This package:

- ✅ validates ISO 4217 currency codes and exposes their minor-unit precision
  (`Currency` with `exponent`)
- ✅ represents money as an integer count of the currency's minor unit
  (`Money`), with exact `add`/`subtract`/`multiply(bigint)` arithmetic
- ✅ represents precise percentage rates for percent modifiers (`Percentage`)
- ✅ computes a `Price` from a base amount and modifiers (`calculatePrice`),
  applied in input order with the total computed internally by
  `Price.create`
- ✅ models `PriceModifier` as a commercial-context descriptor carrying a
  `PriceAdjustment` discriminated union (`money`/`percentage` with an explicit
  `add`/`subtract` operation) that makes invalid states and hidden sign
  policies impossible
- ✅ models `PriceSnapshot` as a `Price` extended with the capture instant
- ❌ formats money for humans — display (`$20`, `20€`) belongs to a dedicated
  formatter, out of scope
- ❌ converts currencies — future `ExchangeRate`/`ExchangeRateProvider`/
  `CurrencyConverter` domain services
- ❌ multiplies money by fractional quantities (kg, meters, consumption, time)
  — those are owned by their domain modules
- ❌ persists prices — there is no repository and no entity
- ❌ knows about products, inventory, or orders

---

## Documentation

- docs/overview.md
- docs/conventions.md

---

## Public API

- Currency contracts — ISO 4217 currency codes with minor-unit precision
- Money contracts — integer minor-unit monetary values with exact arithmetic
- Percentage contracts — precise percentage rates for modifiers
- Price contracts — base amounts with modifiers and point-in-time snapshots
- Price calculation engine — pure `calculatePrice` function
- Error types — pricing failure reasons and metadata (`@comity/pricing/errors`)

No exhaustive reference; see docs for constraints.

---

## Related Packages

- @comity/catalog — product definition (no pricing); will reference
  `PriceSnapshot` only when `ProductProjection` includes it
- @comity/order — order domain consumes `Money`/`Price`/`PriceModifier`
  contracts (ADR-008 register, type-only)

---

## Status

Stable

_Review Completed: 2026-08-28_
_Reviewer: Automated Audit Remediation_
_Compliance Score: 99.5% (Green)_