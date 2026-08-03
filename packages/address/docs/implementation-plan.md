# Implementation Plan — @comity/address

## Current Implementation State

### Completed
- [x] Phase 0 — Package foundation (package.json, tsconfig.json, vitest.config.ts)
- [x] Phase 1 — Public Contracts (address-repository.ts, address-validator.ts, address.ts)
- [x] Phase 3 — Value Objects (AddressId, AddressLine)
- [x] Phase 4 — Address Entity (Address class with snapshot())
- [x] Phase 6 — Public API (index.ts with all public exports)
- [x] Phase 7 — Tests (33 tests, 100% statement coverage)
- [x] Phase 8 — Documentation (overview, conventions, architecture, design, api, ADRs)

### Not Implemented (by design)
- [ ] Phase 2 — Error Model: Address does not own domain errors; all errors come from @comity/primitives
- [ ] Phase 5 — Module Composition (setup/): No setup directory exists; composition belongs to application layer not Core Module

## Current File Structure

```
packages/address/src/
  contracts/
    address.ts              — AddressData, AddressFields, AddressCreate, AddressUpdate, AddressState, AddressContact, AddressSnapshot
    address-repository.ts   — AddressRepository contract
    address-validator.ts    — AddressValidator contract
  entities/
    __tests__/
      address.test.ts
    address.ts              — Address class
  value-objects/
    __tests__/
      address-id.test.ts
      address-line.test.ts
    address-id.ts           — AddressId
    address-line.ts         — AddressLine
  index.ts                  — Public API barrel
```

## Dependencies

- `@comity/primitives` (Result, RepositoryError, Instant)

## Test Status

- 33 tests, all passing
- 100% statement coverage, 95.83% branch coverage