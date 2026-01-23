# @comity/kernel

Orchestration runtime for Comity applications.

---

## Purpose

Provides a minimal orchestration layer for Comity-based systems.
It coordinates **module lifecycle**, **service registration**, and **event flow**, without imposing a framework or runtime model.

The kernel is **optional**: Comity modules can be used with or without it.

---

## Responsibilities
- ✅ Manages application lifecycle and initialization.
- ❌ Does not handle user interface rendering.
- ❌ Does not manage external HTTP requests.

(Only bullet points. No paragraphs.)

---

## Architecture

Based on a modular design pattern to facilitate scalability and maintainability.

---

## Documentation
- `docs/overview.md`
- `docs/conventions.md`

(Only relative paths. No external links.)

---

## Status

Stable