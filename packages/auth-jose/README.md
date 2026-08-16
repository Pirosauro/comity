# @comity/auth-jose

JOSE token service and setup for Comity authentication.

---

## Purpose

Provides a JOSE-backed token service that implements the auth token contracts defined by `@comity/auth`. Wires the token service into the Comity module system through setup types and module hooks.

---

## Scope

This package:

- ✅ provides JOSE token creation and verification
- ✅ exposes setup types for module wiring
- ✅ offers module-level hooks for configuring authentication

This package does NOT:

- ❌ define authentication domain logic
- ❌ manage session lifecycle or assurance evaluation
- ❌ implement transport-level token handling

---

## Public API

- `JoseAuthTokenService` — JOSE-backed token creation and verification
- `JoseAuthTokenServiceOptions` — configuration for the token service
- `AUTH_JOSE_TOKEN` — service token for dependency injection
- Setup types — module context, events, hooks, and service types

No exhaustive reference; see docs for constraints.

---

## Documentation

- docs/overview.md
- docs/conventions.md

---

## Related Packages

- @comity/auth — authentication domain contracts
- @comity/auth-tokens — token facade and envelope primitives
- @comity/kernel — module lifecycle runtime

---

## Status

Stable

_Review Completed: 2026-07-25_
_Reviewer: Hobiri MAGI (DeepSeek v4 Pro)_
_Compliance Score: 99.5% (Green)_