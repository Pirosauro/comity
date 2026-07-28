# @comity/html — Overview

`@comity/html` defines the core HTML rendering model used across Comity.

It provides the contracts and helpers required to build HTML output from structured render data without tying the package to a specific framework or runtime.

---

## What it models

- HTML document state
- head and layout metadata
- render results
- renderer pipeline composition
- document writing

---

## What it is not

- not a template engine
- not a framework renderer
- not a data-loading layer
- not an application view layer

---

## High-level flow

Renderers and adapters assemble document state, pass it through the renderer pipeline, and produce a final HTML document through the writer.
