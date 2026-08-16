# @comity/http-fetch

Fetch HTTP client adapter for Comity.

---

## Purpose

Implements the `HttpTransport` contract from `@comity/http` using the global fetch API. Moves the concrete transport out of the core so the core only defines HTTP semantics.

---

## Scope

This package:

- ✅ implements `HttpTransport` via `FetchHttpClient`
- ✅ provides `client` with timeout, delay, and abort-signal combining
- ✅ exposes `HttpOptions` for typed client configuration

This package does NOT:

- ❌ define HTTP contracts or pipeline semantics
- ❌ implement business logic
- ❌ bind to a specific runtime

---

## Public API

- `FetchHttpClient` — fetch implementation of `HttpTransport`
- `client` — standalone fetch helper with timeout and delay
- `HttpOptions` — client options type


No exhaustive reference; see docs for constraints.
---

## Documentation

- docs/overview.md
- docs/conventions.md

---

## Related Packages

- @comity/http — defines the `HttpTransport` contract this adapter implements

---

## Status

Experimental

_Review Completed: 2026-08-14_
_Reviewer: DeepSeek v4 Flash_
_Compliance Score: N/A_