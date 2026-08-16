# @comity/i18n-typesafe

Typesafe i18n integration for Comity.

---

## Purpose

Provides typed setup support for the Comity i18n module. Ensures that i18n module wiring benefits from compile-time type safety when consuming locale and translation data through contracts.

---

## Scope

This package:

- ✅ exposes typed setup interfaces for i18n module
- ✅ provides the `setup` subpath for module wiring

This package does NOT:

- ❌ define i18n contracts
- ❌ persist translation data
- ❌ manage locale resolution

---

## Public API

- Typed setup interfaces — module context, events, hooks, options, and services
- `setup` subpath — typed module metadata and setup

No exhaustive reference; see docs for constraints.

---

## Documentation

- docs/overview.md
- docs/conventions.md

---

## Related Packages

- @comity/i18n — core internationalization contracts
- @comity/kernel — module lifecycle runtime

---

## Status

Stable

_Review Completed: 2026-07-25_
_Reviewer: Hobiri MAGI (DeepSeek v4 Pro)_
_Compliance Score: 99.5% (Green)_