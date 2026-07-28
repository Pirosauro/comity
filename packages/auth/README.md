# @comity/auth

Authentication and session domain core for the Comity platform.

---

## Purpose

`@comity/auth` provides the **domain and application logic** for authentication,
session lifecycle management, and assurance evaluation.

It is designed as a pure, framework-independent module that can be integrated
with different transport mechanisms (HTTP, tokens, RPC).

---

## Scope

This package:

- ✅ defines the authentication domain (sessions, assurance, refresh, step-up)
- ✅ provides use cases for session lifecycle management
- ✅ exposes a unified `AuthFacade`
- ✅ emits domain events for observability and integration

This package does NOT:

- ❌ parse or validate HTTP requests
- ❌ issue or verify tokens directly
- ❌ manage persistence details
- ❌ depend on any transport or framework

---

## Public API

The public API includes:

- `AuthFacade`
- session-related contracts
- assurance, refresh, and revocation policy interfaces
- domain event interfaces
- `error` subpath
- `hooks` subpath
- `policies` subpath
- `repositories` subpath
- `setup` subpath
- `use-cases` subpath

Adapters and infrastructure modules are expected to orchestrate the domain
through the facade.

---

## Documentation

- docs/overview.md
- docs/conventions.md
- docs/architecture.md
- docs/events.md
- docs/decisions.md

---

## Related Packages

- @comity/auth-jose
- @comity/http
- @comity/kernel

---

## Status

Stable
