# @comity/acl-casl

CASL adapter for @comity/acl authorization contracts.

---

## Purpose

Provides a concrete implementation of the `@comity/acl` `Authorizer` contract using the CASL authorization library. Enables CASL-based policy evaluation within Comity applications.

---

## Scope

This package:

- ✅ implements the `Authorizer` contract using CASL abilities
- ✅ exposes the `CaslAuthorizer` class for direct usage
- ✅ integrates CASL ability definitions with Comity authorization context

This package does NOT:

- ❌ define authorization contracts (see @comity/acl)
- ❌ manage CASL ability persistence or loading
- ❌ provide policy authoring tools

---

## Public API

- `CaslAuthorizer` — CASL-backed authorizer implementation

No exhaustive reference; see docs for constraints.

---

## Documentation

- docs/overview.md
- docs/conventions.md

---

## Related Packages

- @comity/acl — authorization contracts
- @comity/primitives — foundational primitives

---

## Status

Stable

_Review Completed: 2026-08-28_
_Reviewer: Automated Audit Remediation_
_Compliance Score: 100% (Green)_