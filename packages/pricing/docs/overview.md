# @comity/pricing — Overview

`@comity/pricing` is the pricing domain module for Comity commerce.

It exists so higher-level packages (catalog, order) can share a precise money
and price model without coupling pricing decisions to product definition or
order processing.

## What it includes

- `Currency` — ISO 4217 currency Value Object, always created valid via
  `Currency.create(code): Result<Currency, PricingError>`; owns monetary
  precision through its `exponent` (the number of decimal places of a
  monetary amount: `USD`/`EUR` → 2, `JPY` → 0, `KWD` → 3)
- `Money` — immutable `bigint` amount in the currency's minor unit, always
  created valid via `Money.create(amount: bigint, currency)`, with exact
  arithmetic (`add()`, `subtract()`, `multiply(bigint)`) and safe
  cross-currency checks (`currency_mismatch`)
- `Percentage` — Value Object for precise percentage rates
  (`20%`, `12.5%`, `7.25%`), internal scaled integer hidden from the contract,
  arbitrary non-negative scale
- `Price` — Value Object whose `total` is computed internally by
  `Price.create(subtotal, modifiers)`, so subtotal/modifiers/total are always
  coherent; no identity, no lifecycle
- `PriceModifier` — serializable commercial-context descriptor (`code`,
  `label`, `kind`, `component`) carrying a `PriceAdjustment`
  discriminated union:
  `{ type: "money", amount: Money, operation } | { type: "percentage", rate: Percentage, operation }`
  where `operation: "add" | "subtract"`. Invalid states are impossible by
  construction, and the sign is a mathematical operation — never derived from
  `kind`
- `PriceSnapshot` — a `Price` extended with the capture instant
  (`capturedAt: Instant`)
- `calculatePrice` — pure, deterministic calculation engine
- `PricingError` — typed error with `pricing:<reason>` codes, from the
  `@comity/pricing/errors` subpath

## What it does not include

- no repository, no entity, no persistence
- no generic `Decimal`/`Quantity` abstraction — money uses integer minor
  units, rates use the domain-specific `Percentage`
- no currency conversion (`ExchangeRate`/`ExchangeRateProvider`/
  `CurrencyConverter` are future domain services)
- no human/localized formatting (`Intl` and locale handling never live in the
  Value Objects; `Money.toString()`/`Percentage.toString()` are stable
  technical / canonical serializations)
- no fractional-quantity multiplication (kg, meters, consumption, time) — those
  are owned by their domain modules
- no coupon/promotion rules
- no tax module (future `@comity/tax` may consume pricing results)
- no product or order models