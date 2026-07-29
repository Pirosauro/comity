# @comity/i18n

Internationalization module for Comity.

---

## Purpose

Defines locale, translation, and loader contracts for Comity-based applications. Exposes a facade for consuming translations and includes setup types for module wiring.

---

## Scope

This package:

- ✅ defines locale and translator contracts
- ✅ provides an I18n facade for application consumption
- ✅ exposes the `error` and `setup` subpaths
- ✅ offers module-level hooks for configuring translations

This package does NOT:

- ❌ implement translation data storage
- ❌ provide typed translation bridges
- ❌ own application-specific localization policy

---

## Public API

- `I18nFacade` — public facade for translation consumption
- `I18nLoader`, `Translator` — translation loading and translation contracts
- `I18nLocaleResolver`, `I18nResolveContext` — locale resolution contracts
- `I18N_TOKEN` — DI token for the i18n service
- `error` subpath — error types
- `hooks` subpath — lifecycle hooks
- `setup` subpath — module wiring tokens

No exhaustive reference; see docs for constraints.

---

## Documentation

- docs/overview.md
- docs/conventions.md
- docs/architecture.md

---

## Related Packages

- @comity/i18n-typesafe — typed setup helper for i18n
- @comity/kernel — module lifecycle runtime

---

## Status

Stable

_Review Completed: July 25, 2026_
_Reviewer: Hobiri MAGI (DeepSeek v4 Pro)_
_Compliance Score: 99.5% (Green)_