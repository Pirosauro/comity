# @comity/geography

Geographic metadata and rules independent from address storage.

---

## Purpose

Provides geographic knowledge — country and subdivision metadata — that enriches and interprets geographic identifiers stored elsewhere. An address stores identifiers; geography interprets them.

---

## Scope

This package:

- ✅ defines the `GeographyProvider` contract
- ✅ defines `CountryMetadata` and `SubdivisionMetadata` types
- ✅ defines geographic context and input types
- ✅ depends only on `@comity/primitives`

This package does NOT:

- ❌ store addresses or geographic identifiers
- ❌ provide a provider implementation
- ❌ validate postal codes or other address fields

---

## Public API

- `GeographyProvider` — provider contract for resolving geographic metadata
- `CountryMetadata` / `SubdivisionMetadata` — resolved metadata types
- `GeographicInput` / `GeographicContext` — resolution input and context types
- `errors` subpath — `GeographyError` and error reasons


No exhaustive reference; see docs for constraints.
---

## Documentation

- docs/design.md
- docs/decisions/001.md

---

## Related Packages

- @comity/primitives — foundational types used by the contracts
- @comity/address — stores geographic identifiers that this package interprets

---

## Status

Draft

_Review Completed: 2026-08-15_
_Reviewer: Hobiri MAGI (DeepSeek v4 Pro)_
_Compliance Score: 98% (Green)_