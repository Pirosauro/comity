# @comity/html-preact — Conventions

This document defines the conventions for the Preact HTML adapter.

---

## 1. Scope

The package adapts Preact to the HTML contracts provided by `@comity/html`.

It MUST stay focused on rendering and composition.

---

## 2. Public Surface

- root exports are intentionally small
- the package exposes renderer and layout helpers only
- no internal helper should become part of the public API unless explicitly exported

---

## 3. Rendering Rules

- rendering MUST remain independent from data loading
- rendering MUST consume already-prepared inputs
- rendering MUST preserve the HTML contract layer

---

## 4. Internal Code

- `static/` and `streaming/` are implementation areas
- `internal/` style helpers, if present, remain private

---

## 5. Error Handling

- rendering failures are mapped to HTML errors through the HTML layer
- the adapter itself does not own a domain error contract
