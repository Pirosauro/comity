# @comity/graphql-builder — Conventions

This document defines the conventions for `@comity/graphql-builder`.

---

## 1. Scope

The package defines GraphQL query building contracts.

It MUST stay transport-agnostic.

---

## 2. Public API

- the root entrypoint is the primary public surface
- serializer helpers remain part of the documented surface

---

## 3. Query Building Rules

- query construction MUST remain explicit
- value serialization MUST be deterministic
- implementation helpers belong in `internal/` when needed

