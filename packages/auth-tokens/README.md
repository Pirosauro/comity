# @comity/auth-tokens

Token envelope and facade primitives for Comity.

---

## Purpose

Defines token-facing contracts used to structure and issue authentication tokens. Provides a default facade that transports and authentication adapters consume without coupling to a specific token implementation.

---

## Scope

This package:

- ✅ defines token envelope contracts for issued tokens
- ✅ provides a token facade contract and a default implementation
- ✅ exposes typed input structure for token issuance

This package does NOT:

- ❌ verify or sign tokens
- ❌ manage authentication sessions or assurance
- ❌ implement transport-level concerns

---

## Public API

- `AuthTokenEnvelope` — structured wrapper for issued token pairs
- `AuthTokenFacade` — domain-level contract for token operations
- `IssueTokensInput` — typed input for token issuance
- `DefaultAuthTokenFacade` — default encapsulation of token issuance

No exhaustive reference; see docs for constraints.

---

## Documentation

- docs/overview.md
- docs/conventions.md

---

## Related Packages

- @comity/auth — authentication domain contracts
- @comity/auth-jose — JOSE token adapter

---

## Status

Stable

_Review Completed: 2026-07-25_
_Reviewer: Hobiri MAGI (DeepSeek v4 Pro)_
_Compliance Score: 99.5% (Green)_