# @comity/validation

Validation contracts and structured failure errors.

---

## Purpose

Defines the validation boundary for Comity. Owns the `Validator` contract that validation adapters implement and the error model used to report structured validation failures without binding the framework to a specific validation engine.

---

## Scope

This package:

- ✅ defines the Validator contract and ValidationResult type
- ✅ defines structured validation errors with field-level failure details

This package does NOT:

- ❌ provide validation rules or schema implementations
- ❌ offer UI-specific or transport-specific validation behavior
- ❌ depend on schema libraries or validation frameworks

---

## Public API

- Contracts — Validator and ValidationResult types
- Error types (`@comity/validation/errors`)

No exhaustive reference; see docs for constraints.

---

## Documentation

- docs/design.md
- docs/api.md

---

## Related Packages

- @comity/primitives — BaseError and Result primitives

---

## Status

Stable

_Review Completed: 2026-08-01_
_Reviewer: N/A_
_Compliance Score: 99.5% (Green)_
