# @comity/application

Application-layer contracts for resolving view results.

---

## Purpose

Exposes small, stable contracts that bridge domain results to view and rendering flows. Sits at the application boundary, depending on lower Comity layers without introducing transport, rendering, or domain logic.

---

## Scope

This package:

- enables application-level contracts for result resolution
- exposes a resolver contract and a default resolver implementation
- provides typed application result wrappers
- defines the `errors` subpath for application-specific error types

This package does NOT:

- implement domain logic or business rules
- implement transport or rendering logic
- define persistence or data access abstractions

---

## Public API

- `ApplicationContract` — stable contract every Comity application must satisfy
- `ApplicationResolver` — contract an application resolver must implement
- `ApplicationResult` — typed envelope wrapping an application response
- `resolveContract` — default resolver that infers and satisfies the contract
- `errors` subpath — structured application-level error types

No exhaustive reference; see docs for constraints.

---

## Documentation

- docs/overview.md
- docs/conventions.md

---

## Related Packages

- @comity/html — rendering abstraction for results
- @comity/http — HTTP primitives for request handling
- @comity/i18n — internationalization contracts at the boundary
- @comity/primitives — foundational error and value types

---

## Status

Stable

_Review Completed: July 25, 2026_
_Reviewer: Hobiri MAGI (DeepSeek v4 Pro)_
_Compliance Score: 99.5% (Green)_