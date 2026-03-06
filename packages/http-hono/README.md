# @comity/http-hono

Hono adapter for Comity HTTP.

---

## Purpose

Bridges Hono’s runtime with @comity/http’s pipeline. Maps Hono Context to HttpContext and HttpResult to Response without framework coupling.

---

## Scope

This package:

- ✅ maps Hono Context to HttpContext
- ✅ executes HttpFacade.handle(ctx)
- ✅ maps HttpResult to Web Standard Response

This package does NOT:

- ❌ implement business logic or middleware
- ❌ provide routing
- ❌ define error handling strategies

---

## Public API

- Adapter — factory to attach Comity HTTP to Hono
- Setup — kernel module metadata (optional)

---

## Documentation

- docs/overview.md
- docs/wiring.md

---

## Related Packages

- @comity/http
- @comity/kernel
- @comity/primitives

---

## Status

Experimental
