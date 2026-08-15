# @comity/graphql-client

GraphQL client contracts and transports for Comity.

---

## Purpose

Defines the client-side GraphQL contracts, error model, transport abstractions, and module setup used to execute GraphQL operations. `GraphqlClient` is the canonical, transport-independent client facade; `GraphqlTransport` is the replaceable boundary.

---

## Scope

This package:

- ✅ defines GraphQL request, response, and transport contracts
- ✅ provides the `GraphqlClient` facade and module setup
- ✅ exposes package-scoped GraphQL error types

This package does NOT:

- ❌ define query-building syntax
- ❌ own a technology-bound transport implementation
- ❌ embed application-specific GraphQL policy

---

## Public API

- `GraphqlClient` — canonical, transport-independent client facade (root)
- `GraphqlClientOptions` — client construction options (root)
- Request, response, and transport contracts
- GraphQL error contract
- Module setup contracts

The client is a composition facade: it depends only on `GraphqlTransport`, `GraphqlRequest`, and `GraphqlResponse`. Technology-bound transport implementations (WebSocket, fetch, HTTP-specific) live in adapter packages; `GraphqlTransport` is the replaceable boundary.

---

## Documentation

- docs/overview.md
- docs/conventions.md
- docs/architecture.md

---

## Related Packages

- @comity/graphql-builder
- @comity/graphql-client-fetch — Fetch API transport adapter
- @comity/graphql-client-ws — WebSocket transport adapter

---

## Status

Stable

_Review Completed: July 25, 2026_
_Reviewer: Hobiri MAGI (DeepSeek v4 Pro)_
_Compliance Score: 99.5% (Green)_
