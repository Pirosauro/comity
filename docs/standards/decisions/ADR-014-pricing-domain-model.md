# ADR-014 — Pricing Domain Model

> **Note:** This is the Community-specific transitional copy. The canonical Comity-wide version is maintained in `comity-development/docs/standards/decisions/ADR-014-pricing-domain-model.md`
**Status:** Proposed

## Context

`@comity/pricing` is currently a contract-only package exposing two ambiguous
`Model` interfaces (`PriceModel`, `PriceModifierModel`) that represent money as
`number` and currency as a raw `string`. This shape violates ADR-012 and cannot
support the consumers that depend on it:

- `@comity/order` (registered in ADR-008) consumes the price contracts. ADR-013
  deferred the definitive pricing-snapshot shape to `@comity/pricing` and named
  `Money`/`Currency` as externally owned Value Objects that Order must consume.
- ADR-012 §5 tracks `*Model` naming in `@comity/pricing` as a follow-up.
- There is no money representation anywhere in the repo: no `bigint`, no
  currency type. Each consumer would otherwise invent its own.

The `Model` suffix is forbidden for aggregate read models (ADR-012 §1), and
`PriceModel` is not a read model over a foreign aggregate — it is a **value
structure** produced by a pricing calculation. Floating-point `number` cannot
represent money safely. A bare `string` currency carries no validation and
leaks raw strings into domain contracts.

This ADR gives `@comity/pricing` a real domain model: Value Objects for
`Currency`, `Money`, and `Percentage`, a `Price` Value Object, a discriminated
`PriceModifier` value structure, a `PriceSnapshot` contract, and a pure
calculation engine. It does **not** introduce persistence, entities, adapters,
generic numeric abstractions, or external dependencies.

## Decision

### 1. Object taxonomy

`@comity/pricing` contains **no Entity and no Repository**. Everything in the
package is either a Value Object or an immutable value structure:

- `Currency` — Value Object (owns monetary precision via its exponent)
- `Money` — Value Object (integer minor units)
- `Percentage` — Value Object (precise rates for percentage adjustments)
- `Price` — Value Object (result of a calculation, total computed internally)
- `PriceModifier` — immutable value structure (commercial context descriptor)
- `PriceAdjustment` — immutable value structure (pure mathematical operation)
- `PriceSnapshot` — immutable point-in-time capture (`Price` + `capturedAt`)
- `calculatePrice` — pure domain function

There is no owned aggregate, no lifecycle, and no persistence in pricing:
prices are computed, not stored. Pricing computes values; it does not project
data. This keeps the module replaceable and free of infrastructure concerns.

Value Objects in this module follow the **always-valid / no-throw** principle:
constructors are private and never throw; fallible creation is exposed as a
`static create(...): Result<X, PricingError>`, so a Value Object only ever
exists in a valid state.

**No generic numeric abstraction.** `Decimal` is deliberately NOT introduced
for pricing. A generic decimal number is not a pricing domain concept — it was
a technical detail for avoiding floating point. Money is represented correctly
with integer minor units, and percentage rates are owned by a domain-specific
`Percentage`. A generic `Quantity`/`Decimal` does not belong to pricing; if
multiple bounded contexts need a shared numeric or quantity semantics, that is
a new architectural decision in its own module (e.g. a measurement package),
not a pricing concern.

### 2. Currency Value Object

`Currency` is a Value Object in `@comity/pricing` and is the **owner of
monetary precision**:

```ts
Currency {
  code: CurrencyCode;   // e.g. "USD"
  exponent: number;     // e.g. 2
}
```

- validates against the active ISO 4217 code set, which maps every code to its
  minor-unit exponent (`USD` → 2, `EUR` → 2, `JPY` → 0, `KWD` → 3, `BHD` → 3,
  `CLF` → 4)
- accepts input case-insensitively and normalizes to uppercase
- immutable state: `#code` + `#exponent`
- `static create(code: string): Result<Currency, PricingError>` — unknown code
  yields an `invalid_currency` failure (never a throw)
- `code`, `exponent` getters, `equals()`, `toString()`
- the exponent defines the minor unit: one minor unit equals `10^-exponent` of
  one major unit (e.g. 1 cent for `USD`, 1 yen for `JPY`)

Currency does NOT convert currencies, does NOT know exchange rates, and does
NOT apply rounding policy.

Ownership rationale: currency is commerce-domain language. It lives in the
commerce layer (`@comity/pricing`), not in `@comity/primitives`, which must
remain generic and business-free. Domain contracts MUST NOT use a bare
`string` currency.

### 3. Money Value Object

`Money` is a Value Object in `@comity/pricing` using **integer minor units**:

```ts
Money {
  amount: bigint;       // minor units
  currency: Currency;
}
```

- `amount` is an integer count of the currency's minor unit: `amount` 1234
  with `USD` represents 12.34 USD; `amount` 1234 with `JPY` represents 1234
  JPY
- integer minor units keep arithmetic exact — no floating point, no generic
  Decimal type
- immutable state: `#amount: bigint` + `#currency: Currency`
- `static create(amount: bigint, currency: Currency): Result<Money,
  PricingError>` — negative amounts yield an `invalid_amount` failure (never a
  throw)
- **precision coherence** with the currency is inherent to the
  representation: any non-negative integer is a whole number of minor units
  for the currency. The `invalid_precision` reason is reserved for future
  scaled operations (e.g. fractional-quantity calculations that would need a
  rounding policy) and is unreachable with the current API.
- `equals()`, `amount`/`currency` getters, `toString()`

Arithmetic (each returns `Result<Money, PricingError>`):

- `add(other)` — different currencies → `currency_mismatch`
- `subtract(other)` — different currencies → `currency_mismatch`; negative
  result → `invalid_amount`
- `multiply(factor: bigint)` — integer factor; negative factor →
  `invalid_amount`. The product is exact (no rounding).

`Money.multiply` does NOT use `Decimal` and does NOT support fractional
quantities directly. A fractional quantity (kg, meters, consumption, time) is
not a responsibility of `Money`: it belongs to the domain module that owns the
measure, and pricing may introduce a dedicated calculation later if a real
need emerges.

#### Formatting

`toString()` is a stable technical serialization — minor-unit amount then
currency code (`1234 USD`). It is NEVER a display format. Human / localized
rendering (`$20`, `20€`, `€20`, `1000 EUR`) is the responsibility of a
dedicated formatter at the boundaries; `Intl` and locale handling MUST NOT
appear inside `Money`. A `MoneyFormatter` / `CurrencyFormatter` is future work.

### 4. Percentage Value Object

Percent modifiers use a dedicated Value Object, NOT a generic Decimal:

- represents precise percentage rates (`20%`, `12.5%`, `7.25%`)
- internal representation is a scaled integer (the rate is stored as
  `amount / 10^scale` percent, e.g. 12.5% → `amount` 125 at `scale` 1); the
  scaling is hidden from the contract
- `static create(amount: bigint, scale: number): Result<Percentage,
  PricingError>` — negative amount, negative scale, or non-finite scale yields
  an `invalid_percentage` failure (never a throw); fractional scales are
  truncated
- arbitrary non-negative scale (supports sub-basis-point rates such as
  `0.001%`)
- `equals()` is numeric (cross-multiplication): `20.0%` at `scale` 1 equals
  `20%` at `scale` 0
- `toString()` is canonical (`20%`, `12.5%`, `7.25%`), never localized

### 5. PriceModifier value structure

`PriceModifier` is a serializable value descriptor, NOT an entity and NOT a
behavior object. It describes the **commercial context** of an adjustment and
carries the **mathematical operation** in a separate `PriceAdjustment`:

```ts
interface PriceModifier {
  readonly code: string;
  readonly label?: string;
  readonly kind: PriceModifierKind; // "discount" | "charge" | "credit" | "tax" | "other"
  readonly component?: string;       // semantic label, never interpreted by pricing
  readonly adjustment: PriceAdjustment;
}

type PriceAdjustment =
  | { readonly type: "money"; readonly amount: Money; readonly operation: "add" | "subtract" }
  | { readonly type: "percentage"; readonly rate: Percentage; readonly operation: "add" | "subtract" };
```

The `adjustment` field is a **discriminated union** that makes invalid states
impossible by construction:

- a `money` adjustment cannot exist without an `amount`
- a `percentage` adjustment cannot exist without a `rate`
- the `operation` provides the sign — `Money` stays non-negative and
  `Percentage` represents a **real percentage** (e.g. `10%`, never a `90%`
  factor)

Rationale for separating `PriceModifier` from `PriceAdjustment`:

- `kind` is descriptive metadata. Deriving the sign from `kind` would make the
  calculation engine a hidden tax/discount policy. The engine must stay
  neutral: it applies arithmetic, not business meaning.
- The `operation` (`add` / `subtract`) is pure mathematics — it carries no
  business semantics about what the modifier *is*.
- Discounts and credits are `subtract`, fees and taxes are `add`; the same
  modifier kinds remain expressible for both.

Rules:

- `kind` and `component` are validated as structure (known kind, present code,
  coherent adjustment) but are NEVER consulted by the engine
- `percentage` rates are `Percentage` values; a zero rate is rejected at the
  modifier level (`invalid_modifier`); an `add` / `subtract` operation with a
  `money` amount not in the base currency yields `currency_mismatch`
- a money adjustment is always non-negative (`Money` invariant); subtraction
  is expressed via `operation: "subtract"`, never via a negative amount

Forbidden:

- `Discount`/`Tax`/`Coupon`/`Promotion` classes — they are not modeled here
- `Discount`/`Credit` sign conventions derived from `kind` — that would embed
  a checkout policy inside pricing
- a `modifier.apply(price)` behavior — calculation is centralized in the
  pricing engine, never delegated to individual modifiers

### 6. Price Value Object

`Price` is a Value Object, NOT an Entity and NOT a Projection. It lives in
`value-objects/price.ts` next to the other Value Objects; contracts import it
from there:

- it has invariants — `subtotal`, `modifiers`, and `total` must be coherent
- it has no identity and no lifecycle
- the total is computed internally, so an incoherent `Price` (e.g.
  `{ subtotal: 100, total: 500 }`) cannot exist

```ts
class Price {
  static create(subtotal: Money, modifiers: ReadonlyArray<PriceModifier>): Result<Price, PricingError>;
  readonly subtotal: Money;
  readonly modifiers: ReadonlyArray<PriceModifier>;
  readonly total: Money;
}
```

- `create()` validates every modifier, applies them in **input order**, computes
  the total, and stores the applied modifier list
- `subtotal` is the base money before modifiers; `total` is the computed result
- percentage adjustments are `total × rate` rounded half-up to the minor unit;
  the rounding policy lives in the price engine (never in `Currency`)
- `equals()` compares subtotal, modifiers (code, label, kind, component,
  adjustment), and total structurally

### 7. PriceSnapshot

`PriceSnapshot` replaces the earlier `PriceProjection` concept. Pricing does
not project data — it computes values — so a snapshot is simply a computed
price frozen in time:

```ts
interface PriceSnapshot extends Price {
  readonly capturedAt: Instant;
}
```

The snapshot **extends** the `Price` value itself (following the repo's
snapshot pattern: state + `capturedAt`) rather than wrapping it. Consumers can
store an immutable price result with the instant it was captured without
owning any lifecycle.

### 8. calculatePrice engine

```ts
calculatePrice(base: Money, modifiers: ReadonlyArray<PriceModifier>): Result<Price, PricingError>
```

- deterministic, pure, no I/O, no repositories, no adapters
- delegates to the controlled creation of `Price` (the engine logic is
  encapsulated in `Price.create`, which computes the total internally)
- validates every modifier (`invalid_modifier` for structural problems,
  `currency_mismatch` when a `money` `amount` is not in `base`'s currency)
- applies modifiers in **input order** — the engine never reorders them;
  application order is fully controlled by the consumer
- the engine interprets ONLY `adjustment.type` and `adjustment.operation`:
  `money` moves the running total by an exact amount, `percentage` moves it by
  `current × rate`; the `operation` provides the sign. `kind` and `component`
  are never consulted
- percentage adjustments are rounded half-up to the minor unit of the running
  total
- if a subtractive adjustment would drive the running total below zero →
  `calculation_failed` (a price can never be negative)
- empty `modifiers` returns a price whose total equals the base

The engine does NOT know tax rules, coupon policy, orders, or catalog. Whether
a discount applies to the subtotal or to a tax-inclusive amount, which modifiers
are legal together, and how checkout composes them is decided by the consumer /
application — never by pricing.

### 9. PricingError

One error class, one finite reason union, codes `pricing:<reason>`
(`errors.md` §3).

Allowed:

- `invalid_currency`
- `invalid_amount`
- `invalid_precision`
- `currency_mismatch`
- `invalid_percentage`
- `invalid_modifier`
- `calculation_failed`

Forbidden (aligned with ADR-012 §4):

- `not_found` — not-found is not a pricing condition
- `unknown` — no generic fallback
- `validation_failed` — replaced by the precise reasons above
- `repository_error` — pricing has no repository

`invalid_precision` is reserved for future scaled operations; it is
unreachable with the current integer-minor-unit API. `invalid_decimal` is NOT
part of the model — there is no generic decimal concept in pricing.

`PricingError` extends `BaseError` from `@comity/primitives` and is exported
from the `@comity/pricing/errors` subpath, following the `@comity/catalog`
pattern.

### 10. Naming migration

- `PriceModel` → `Price` (now a Value Object in `value-objects/price.ts`)
- `PriceModifierModel` → `PriceModifier` (commercial context descriptor)
- `PriceModifierValue` (interim) → `PriceAdjustment` (mathematical operation,
  discriminated by `type` with an explicit `add` / `subtract` `operation`)
- `number` money → `Money` with integer minor units (`amount: bigint`)
- `Decimal` (interim) → removed entirely; percentage rates now use `Percentage`
- `invalid_quantity`/`invalid_decimal` (interim) → `invalid_precision` /
  `invalid_percentage`
- `PriceProjection` → `PriceSnapshot`
- No aliases, no `*Model` suffix retained (ADR-012 §1)

This is a breaking public API change for `@comity/pricing` (MAJOR bump,
breaking-change process): constructors → `static create(): Result`, `Money`
amount → integer minor units, `PriceModifier.basis/amount?/rate?` →
`PriceModifier.adjustment` discriminated union with explicit operation, `Price`
interface → Value Object, `PriceProjection` → `PriceSnapshot`. The only
in-repo consumer (`@comity/order`, type-only) is migrated in the same change.

### 11. Cross-module dependencies

- `@comity/pricing` depends on `@comity/primitives` only.
- `pricing → order` is forbidden: pricing never knows the order.
- `order → pricing` already registered in ADR-008; stays type-only (`Price`,
  `PriceModifier`, `Money`, and transitively `Currency`).
- `catalog → pricing` is NOT added today: catalog exposes no prices yet. It
  will only be registered when a `ProductProjection` includes a
  `PriceSnapshot`.
- `tax → pricing` will only be considered when a `@comity/tax` module exists.

### 12. Currency conversion (future work)

Conversion is NOT a `Money`/`Currency` responsibility: there is no
`money.convert(Currency)` API, and `Currency` knows no rates.

A future **domain service** in `@comity/pricing` will own conversion:
`ExchangeRate`, `ExchangeRateProvider`, `CurrencyConverter`. Not implemented
now; tracked as an architectural TODO. Requires a dedicated ADR when the
requirement lands.

## Domain Model

```
packages/pricing/src/
  value-objects/
    currency.ts         Currency
    money.ts            Money
    percentage.ts       Percentage
    price.ts            Price
  contracts/
    price-modifier.ts   PriceModifier, PriceModifierKind, PriceAdjustment, AdjustmentOperation
    price-snapshot.ts   PriceSnapshot
  domain/
    calculate-price.ts  calculatePrice
  errors/
    pricing.ts          PricingError, PricingErrorReason
    index.ts
  index.ts              public API
```

No `entities/`, no `repository/`, no generic numeric abstraction, no adapter
dependencies.

## Consequences

**Positive:**

- exact money math with integer minor units instead of floating-point `number`
- typed, validated currency that owns monetary precision (exponent)
- percent modifiers use a domain-specific `Percentage` instead of a generic
  decimal
- `PriceModifier` invalid states are impossible by construction (discriminated
  `PriceAdjustment` union with explicit operation)
- the sign is expressed as a mathematical `add` / `subtract` operation, never
  derived from `kind` — no hidden checkout policy in pricing
- `Price` invariants are protected by controlled creation (total computed
  internally)
- `@comity/order` can consume `Money`/`Price` (ADR-013 open question closed by
  `PriceSnapshot`)
- pricing becomes a real domain module with pure, testable calculation
- `*Model` naming debt in `@comity/pricing` is paid (ADR-012 §5 follow-up)

**Negative / Trade-offs:**

- breaking public API change (`PriceModel` → `Price`, `PriceModifierModel` →
  `PriceModifier`, `number` money → `Money` with integer minor units, throwing
  constructors → `static create(): Result`, `PriceProjection` →
  `PriceSnapshot`) — MAJOR bump
- fractional quantities (kg, meters, consumption) are NOT supported by `Money`
  by design; they must be owned by their domain module
- percentage rounding policy (half-up) and input-order application become a
  documented contract that downstream modules must respect
- `invalid_precision` is currently unreachable (reserved for future scaled
  operations)

## Migration Plan

1. This ADR (status Proposed → Accepted after review)
2. Introduce `Currency` (with exponent), `Money` (integer minor units),
   `Percentage` Value Objects (+ tests)
3. Introduce `PriceModifier` (discriminated union) and `PriceSnapshot`
   contracts (+ tests)
4. Introduce `Price` Value Object with internal total computation (+ tests)
5. Introduce `PricingError` with the final reason union (+ tests)
6. Introduce `calculatePrice` (+ tests: fixed/percent, ordering, errors)
7. Migrate `@comity/order` to `Money`/`Price`/`PriceModifier`
8. Update docs (`docs/overview.md`, `docs/conventions.md`, README), ADR-012
   follow-up list; build, test, typecheck, coverage

## Open Questions

- **Modifier ordering** — modifiers are applied in **input order**; the engine
  never reorders them. This replaces the earlier fixed
  `discount → shipping → fee → tax → credit → other` policy and the interim
  explicit `priority` field. Pricing encodes no global application order; the
  consumer fully controls it. Revisit only if a real requirement forces an
  engine-owned policy.
- **Percentage semantics** — `operation: "add" | "subtract"` expresses the
  sign while keeping `Percentage` a real rate. A discount is `10%` +
  `subtract`, a fee is `10%` + `add`; the engine never derives the sign from
  `kind`.
- **Minor-unit scaling** — `invalid_precision` is reserved for future scaled
  operations (e.g. a fractional-quantity calculation needing a rounding
  policy). It is unreachable with the current API by design.
- **Fractional quantities** — kg, meters, consumption, time are owned by their
  domain modules. Pricing may add a dedicated calculation only when a real
  need emerges; it must not resurface a generic `Decimal`.
- **Coupon/promotion applicability** — coupon validation still belongs to
  application/domain services and `@comity/pricing` calculation consumers; this
  ADR does not define coupon rules.
- **Tax module** — `@comity/tax` is future work; when it exists it may consume
  pricing results (`tax → pricing`), never the reverse.
- **Currency conversion** — `USD → EUR` conversion is a pricing responsibility
  but NOT a `Money`/`Currency` responsibility. Future domain services in
  `@comity/pricing`: `ExchangeRate`, `ExchangeRateProvider`, `CurrencyConverter`.
  Not implemented now; architectural TODO, requires a dedicated ADR.
- **MoneyFormatter / CurrencyFormatter** — human / localized rendering
  (`10€`, `$20`) is a dedicated formatter, future work. `Money.toString()` and
  `Percentage.toString()` stay stable technical / canonical representations;
  `Intl`/locale handling never lives in the Value Objects.
- **Measurement module** — if a shared quantity semantics is needed across
  bounded contexts, extraction requires a new architectural decision in a
  dedicated module (e.g. `@comity/measurement`), not a pricing concern.

## References

- `docs/standards/decisions/ADR-012-standard-domain-modeling.md` — object
  taxonomy, error semantics, `*Model` follow-up
- `docs/standards/decisions/ADR-013-order-entity-consolidation.md` — `Money`/
  `Currency` ownership, deferred pricing-snapshot shape
- `docs/standards/decisions/ADR-008-explicit-core-module-composition-exceptions.md`
  — `order → pricing` register
- `docs/standards/domain-modeling.md` — Value Objects, value structures
- `docs/standards/errors.md` — error model
- `packages/catalog` — error subpath pattern
- `packages/customer` — canonical Value Object implementation