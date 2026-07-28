# @comity/router-path-to-regexp — Conventions

This document defines the conventions for the path-to-regexp router implementation.

---

## 1. Scope

The package is an adapter-style router implementation.

It MUST stay aligned with `@comity/router` contracts.

---

## 2. Public API

- the root entrypoint exports `PathRouter`
- no additional public sub-entrypoints are currently exposed

---

## 3. Routing Rules

- matching behavior belongs to the implementation
- route contracts belong to `@comity/router`
- application policy must not be embedded here

