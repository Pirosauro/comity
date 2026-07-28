# @comity/hydration — Conventions

This document defines the mandatory conventions for `@comity/hydration`.

---

## 1. Scope

The package defines hydration contracts and orchestration primitives.

It MUST NOT contain framework-specific rendering logic.

---

## 2. Public API

- contracts live under `contracts/`
- controller and serializer exports are public
- `internal/` remains implementation-only

---

## 3. Hydration Rules

- hydration MUST operate on already serialized island contracts
- strategies MUST be explicit
- discovery and hydration SHOULD remain separate concerns

---

## 4. Error Handling

- hydration errors are typed and package-scoped
- serialized payload validation MAY throw native errors when input is structurally invalid

---

## 5. Lifecycle

- lifecycle support is optional but public when exported
- lifecycle signaling MUST remain composable
