# @comity/address — Conventions

## Core Module boundaries

Address is a Core Module. It must not depend on adapters, applications, validation libraries, or geography data providers.

## Mutable entity

`Address` is the only mutable entity. Value objects (`AddressId`, `AddressLine`) are immutable.

## Snapshot for history

Consumers that require historical consistency must use `AddressSnapshot` via `address.snapshot()`. `AddressSnapshot` is a type, not a class.

## Value object API

`AddressId` and `AddressLine` expose:
- `equals(other)` for value comparison
- `toString()` for string representation

## Address constructor

Constructor signature: `new Address(fields, id?)`. `id` is optional.

## Update

`update()` is `void`-returning. It mutates the address in place.

## Country code

Stored as a plain ISO 3166-1 alpha-2 string. Validation and enrichment belong to `@comity/address-geography`.

## Region

Free-text string field `administrativeArea`. Can represent a state, province, or district.

## Lines

Ordered array of `AddressLine` value objects.

## Metadata

`Record<string, string> | null`. Complex metadata belongs in an enrichment layer.

## Contacts

Generic `type`/`value` pairs. The module does not interpret contact semantics.

## Defensive copies

All entity getters return defensive copies of mutable structures (lines, metadata, contacts).