# @comity/content — Conventions

This document defines the conventions for `@comity/content`.

---

## 1. Scope

The package defines content contracts and repository context.

It MUST remain framework-agnostic.

---

## 2. Public API

- contracts live under `contracts/`
- setup tokens are public when exported from the root
- `internal/` is not part of the contract surface

---

## 3. Repository Rules

- repositories expose content models, not renderables
- repository context MUST remain explicit
- repository implementations belong in adapters or applications

---

## 4. Error Handling

- content errors are not defined here in the current package shape
- failures are expected to be normalized by higher layers or adapters

