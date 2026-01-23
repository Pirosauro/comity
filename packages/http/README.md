# @comity/http

Core HTTP execution model for the Comity platform.

---

## Purpose

`@comity/http` provides a **framework-agnostic HTTP execution kernel** based on
a pipeline and middleware model.

It defines how HTTP requests are processed, observed, and terminated,
without binding to any specific server, framework, or runtime.

---

## Scope

This package:

- ✅ defines `HttpContext`, `HttpPipeline`, and middleware contracts
- ✅ provides a structured result and error model
- ✅ supports event-driven observability
- ✅ acts as a stable integration point for HTTP adapters

This package does NOT:

- ❌ implement an HTTP server
- ❌ provide routing or controllers
- ❌ perform rendering (HTML, JSON, React, etc.)
- ❌ depend on any HTTP framework (Hono, Express, Fetch, …)

---

## Public API

The public API includes:

- `HttpContext`
- `HttpPipeline`
- `HttpMiddleware`
- `HttpResult`, `HttpResponse`, `HttpError`
- `HttpErrorMapper`
- `HttpFacade`

Adapters are expected to consume the facade and render results.

---

## Documentation

- docs/overview.md
- docs/conventions.md
- docs/http-context.md
- docs/events.md
- docs/pipeline.md
- docs/result-and-errors.md

---

## Related Packages

- @comity/http-hono
- @comity/kernel

---

## Status

Stable
