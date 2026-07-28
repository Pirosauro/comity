# @comity/router — Conventions

This document defines the conventions for `@comity/router`.

---

## 1. Scope

The package defines routing contracts and orchestration primitives.

It MUST stay independent from concrete routing libraries.

---

## 2. Public API

- contracts live under `contracts/`
- pipeline and handler helpers are public when exported from the root
- `setup/` contains module wiring contracts

---

## 3. Routing Rules

- routers resolve requests into route matches
- URL rewriters only transform the URL input
- policy handlers are explicit and route-scoped

---

## 4. Error Handling

- routing errors are typed and package-scoped when defined
- matching failures should be expressed as routing outcomes, not hidden control flow
