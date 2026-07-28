# @comity/html — Conventions

This document defines the normative conventions for `@comity/html`.

---

## 1. Scope

The package defines HTML contracts and rendering infrastructure.

It MUST NOT load data, query repositories, or embed application behavior.

---

## 2. Public API

- Public contracts live under `contracts/`
- Renderer pipeline and writer helpers are public when exported from the package root
- Internal helpers must remain unexported

---

## 3. Rendering Rules

- rendering consumes structured inputs
- rendering MUST NOT access repositories
- rendering MUST stay deterministic for the same input

---

## 4. Layout and Document State

- layout metadata is part of the HTML contract
- document state is request/render scoped
- document composition MUST remain explicit

---

## 5. Error Handling

- HTML errors are typed and package-scoped
- errors represent rendering and availability failures, not business logic
