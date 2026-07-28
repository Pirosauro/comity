# @comity/hydration-preact — Conventions

This document defines the conventions for the Preact hydration adapter.

---

## 1. Scope

The package adapts `@comity/hydration` to Preact.

It MUST stay focused on runtime wiring and component loading.

---

## 2. Public API

- root exports are intentionally small
- adapter-specific runtime and registry types are public because they are required for composition
- `internal/` remains implementation-only

---

## 3. Hydration Rules

- hydration MUST rely on `@comity/hydration` contracts
- the adapter MUST NOT redefine hydration strategies
- the adapter MUST NOT load application data

---

## 4. Error Handling

- adapter behavior MAY raise errors from the hydration layer
- the adapter MUST NOT introduce its own public domain error contract

