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

- `httpHonoAdapter`
- `module`
- `HTTP_HONO_TOKEN`
- adapter setup types

---

## Documentation

- docs/overview.md
- docs/wiring.md
- docs/conventions.md

---

## Related Packages

- @comity/http
- @comity/kernel
- @comity/primitives

---

## Status

Experimental
