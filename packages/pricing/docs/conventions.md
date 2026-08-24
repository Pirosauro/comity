# @comity/pricing — Conventions

This document defines the conventions for `@comity/pricing`.

---

## 1. Scope

The package owns the pricing domain. It contains no Entity and no Repository:
prices are computed, never stored. It MUST NOT grow into a discount/tax policy
engine, MUST NOT introduce generic numeric abstractions, and MUST NOT depend on
any other Core Module except `@comity/primitives` (ADR-008 register, ADR-014).

---

## 2. Value Objects

All Value Objects follow the **always-valid / no-throw** principle: private
constructors, fallible creation through `static create(...): Result<X,
PricingError>`, never an exception.

- `Currency` — immutable, validates against the active ISO 4217 code set
  (case-insensitive input, uppercase storage) and owns monetary precision
  through its `exponent` (minor unit = `10^-exponent` of one major unit).
  Domain contracts MUST NOT use a bare `string` currency. Currency never
  converts, never knows exchange rates, and never applies rounding policy.
- `Money` — immutable `bigint` amount in the currency's minor unit. `amount`
  is an integer count of minor units (`1234` with `USD` = 12.34 USD, `1234`
  with `JPY` = 1234 JPY). Arithmetic returns `Result<Money, PricingError>`;
  cross-currency operations fail with `currency_mismatch`, negative results /
  negative factors with `invalid_amount`. `multiply()` takes an integer
  `bigint` factor only — fractional quantities (kg, meters, consumption,
  time) are NOT supported and belong to their domain modules. `toString()` is
  a stable technical serialization (`1234 USD`), never a display format.
  Precision coherence with the currency is inherent to integer minor units;
  `invalid_precision` is reserved for future scaled operations.
- `Percentage` — immutable rate as a scaled integer (`amount / 10^scale`
  percent), arbitrary non-negative scale, hidden from the contract. Creation
  normalizes fractional scales by truncation; negative amount/scale or
  non-finite scale fail with `invalid_percentage`. `equals()` is numeric
  (cross-multiplication). `toString()` is canonical (`20%`, `12.5%`,
  `7.25%`).
- `Price` — Value Object in `value-objects/price.ts`. The total is computed
  internally by `Price.create(subtotal, modifiers)`: an incoherent `Price`
  (total not matching the applied modifiers) cannot exist. No identity, no
  lifecycle. Modifiers are applied in input order; the engine never reorders
  them.

**No `Decimal`/`Quantity`.** A generic decimal or quantity is not a pricing
domain concept. Money uses integer minor units; rates use `Percentage`. A
shared numeric/quantity semantics belongs to a dedicated module as a new
architectural decision, not to pricing.

---

## 3. Value Structures

- `PriceModifier` — serializable commercial-context descriptor, not a
  behavior object. It describes the context (`code`, `label`, `kind`,
  `component`) and carries a `PriceAdjustment` discriminated
  union on `type` (`money` with `amount: Money`, `percentage` with
  `rate: Percentage`), each with an explicit `operation: "add" | "subtract"`,
  so invalid states (`money` without `amount`, `percentage` without `rate`)
  and hidden sign policies are impossible by construction. `kind` and
  `component` are never interpreted by pricing. No
  `Discount`/`Tax`/`Coupon`/`Promotion` classes; no `modifier.apply()`; no
  `basis`/`amount?`/`rate?` partial states.
- `PriceSnapshot` — immutable point-in-time capture: a `Price` extended with
  `capturedAt: Instant`. Pricing computes values; it does not project data.

---

## 4. Calculation

- `calculatePrice` is pure and deterministic: no I/O, no repositories, no
  adapters. It delegates to `Price.create`, which owns the computation.
- Modifiers are applied in input order — the engine never reorders them;
  application order is fully controlled by the consumer.
- The engine interprets ONLY the `PriceAdjustment`: `money` moves the running
  total by an exact amount, `percentage` moves it by `current × rate`; the
  `operation` (`add` / `subtract`) provides the sign. `kind` and `component`
  are never consulted — pricing carries no discount/tax policy.
- Percentage adjustments use `Percentage` rates, applied to the running total
  and rounded half-up to the minor unit. The rounding policy lives in the
  price engine, never in `Currency`.
- A price can never be negative: a subtractive adjustment exceeding the
  running total fails with `calculation_failed`.
- The engine does not know tax rules, coupon policy, orders, or catalog;
  whether a discount applies to the subtotal or a tax-inclusive amount and
  how modifiers compose is the consumer's responsibility.

---

## 5. Errors

- one error class (`PricingError`), one finite reason union, codes
  `pricing:<reason>`
- allowed reasons: `invalid_currency`, `invalid_amount`, `invalid_precision`,
  `currency_mismatch`, `invalid_percentage`, `invalid_modifier`,
  `calculation_failed`
- `invalid_precision` is reserved for future scaled operations; it is
  unreachable with the current integer-minor-unit API
- forbidden: `not_found`, `unknown`, `validation_failed`, `repository_error`

---

## 6. Public API

- the root entrypoint is the public surface
- errors are exposed through the `@comity/pricing/errors` subpath
- changes to `Currency`/`Money`/`Percentage`/`Price`/`PriceModifier` are
  contract changes and follow the breaking-change process
- currency conversion (`ExchangeRate`/`ExchangeRateProvider`/
  `CurrencyConverter`) is future domain service work, never a `Money`/
  `Currency` method; requires a dedicated ADR
- fractional-quantity calculation is future work, never a `Money.multiply`
  overload; requires a real need and its own design
- pricing never derives sign or ordering from `kind`/`component`; any
  discount/tax/checkout policy belongs to the consumer or a dedicated module