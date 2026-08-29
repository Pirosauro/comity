# @comity/acl

Authorization contracts for Comity modules.

---

## Purpose

Defines the core authorization abstractions used across Comity packages. Provides contracts for authorization decisions, contexts, and authorizers without binding to any specific authorization library or policy engine.

---

## Scope

This package:

- ✅ defines authorization context and decision contracts
- ✅ exposes the `Authorizer` contract for policy evaluation
- ✅ provides domain error types for authorization failures

This package does NOT:

- ❌ implement specific authorization logic (CASL, RBAC, ABAC)
- ❌ manage policy storage or retrieval
- ❌ integrate with transport or framework layers

---

## Public API

- Authorization contracts — context, decision, and authorizer interfaces
- Error types — authorization failure reasons and metadata (`@comity/acl/errors`)

No exhaustive reference; see docs for constraints.
---

## Documentation

- docs/overview.md
- docs/conventions.md

---

## Related Packages

- @comity/acl-casl — CASL adapter for @comity/acl
- @comity/primitives — foundational error and result primitives

---

## Status

Stable

_Review Completed: 2026-08-28_
_Reviewer: Automated Audit Remediation_
_Compliance Score: 100% (Green)_