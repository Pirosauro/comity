# @comity/organization

Shared organization identifiers for Comity modules.

---

## Purpose

Provides stable value objects for tenant and channel identification used across Comity packages. Ensures consistent identity handling in multi-tenant and multi-channel scenarios.

---

## Scope

This package:

- ✅ defines `TenantId` value object with equality semantics
- ✅ defines `ChannelId` value object with equality semantics
- ✅ provides immutable, serializable identifiers

This package does NOT:

- ❌ implement tenant or channel resolution logic
- ❌ manage organization hierarchy or relationships
- ❌ provide persistence or repository contracts

---

## Public API

- Identity value objects — `TenantId`, `ChannelId`

No exhaustive reference; see docs for constraints.

---

## Documentation

- docs/overview.md
- docs/conventions.md

---

## Related Packages

- @comity/primitives — foundational value object patterns
- @comity/customer — customer domain (consumes TenantId/ChannelId)
- @comity/storefront — storefront context (consumes TenantId/ChannelId)

---

## Status

Stable

_Review Completed: 2026-08-28_
_Reviewer: Automated Audit Remediation_
_Compliance Score: 100% (Green)_