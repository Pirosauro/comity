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

## Usage

```ts
import { Currency, Money, Percentage, Price, calculatePrice } from "@comity/pricing";

const eur = Currency.create("EUR"); // Result<Currency, PricingError>
const base = Money.create(10000n, eur.value); // 100.00 EUR in minor units

const result = calculatePrice(base.value, [
  { code: "discount-10", kind: "discount", adjustment: { type: "percentage", rate: Percentage.create(10n, 0).value, operation: "subtract" } },
]);

// result.value.total.amount === 9000n

const line = Money.create(125n, eur.value).value.multiply(3n); // 3 × 1.25 EUR
// line.value.amount === 375n
```

Value Objects are always created in a valid state. Fallible creation returns a
`Result` (`Currency.create`, `Money.create`, `Percentage.create`,
`Price.create`) instead of throwing; arithmetic operations return a `Result`
as well.

Errors are available from the `@comity/pricing/errors` subpath.

---

## Documentation

- docs/overview.md
- docs/conventions.md

---

## Related Packages

- @comity/catalog — product definition (no pricing); will reference
  `PriceSnapshot` only when `ProductProjection` includes it
- @comity/order — order domain consumes `Money`/`Price`/`PriceModifier`
  contracts (ADR-008 register, type-only)