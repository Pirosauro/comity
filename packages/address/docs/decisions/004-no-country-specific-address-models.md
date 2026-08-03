# ADR-004 — No Country-Specific Address Models

**Status:** Accepted

## Context

Addresses vary significantly across countries. A natural temptation is to model country-specific structures:

- `ItalyAddress`
- `ChinaAddress`
- `USAddress`

Or using inheritance:

- `class ChinaAddress extends Address`
- `class ItalyAddress extends Address`

This approach causes:

- Class proliferation
- Hard-to-maintain hierarchies
- Business logic coupled to geography
- Difficult expansion to new markets

Additionally, an address's characteristics are independent of geography context: a business address may differ from a personal address regardless of country.

## Decision

`@comity/address` introduces no country-specific types. There are no `ItalyAddress`, `ChinaAddress`, or `USAddress` types, and no geography-based hierarchies.

The address uses a universal model:

```typescript
interface AddressFields {
  lines: AddressLine[];
  city: string;
  administrativeArea: string | null;
  postalCode: string;
  countryCode: string;
  label: string | null;
  metadata: Record<string, string> | null;
  contacts: AddressContact[];
}
```

Country differences are handled by `@comity/address-geography`, not by the base module.

## Example

A Chinese address:

```json
{
  "lines": ["123 Nanjing Road"],
  "city": "Shanghai",
  "administrativeArea": "Shanghai",
  "postalCode": "200000",
  "countryCode": "CN"
}
```

An Italian address:

```json
{
  "lines": ["Via Roma 10"],
  "city": "Milano",
  "administrativeArea": "MI",
  "postalCode": "20100",
  "countryCode": "IT"
}
```

Both are the same concept: `Address`.

## Consequences

**Positive:**

- Global model
- New countries require no new types
- No class explosion
- Clean separation between domain and geography

**Negative:**

- Some country-specific semantics require external services
- The universal model must be sufficiently flexible
