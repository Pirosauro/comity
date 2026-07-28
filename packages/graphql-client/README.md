# @comity/graphql-client

GraphQL client contracts and transports for Comity.

---

## Purpose

Defines the client-side GraphQL contracts, error model, transport abstractions, and module setup used to execute GraphQL operations.

---

## Scope

This package:

- ✅ defines GraphQL request, response, and transport contracts
- ✅ provides the GraphQL client and module setup
- ✅ exposes package-scoped GraphQL error types

This package does NOT:

- ❌ define query-building syntax
- ❌ own a specific transport implementation
- ❌ embed application-specific GraphQL policy

---

## Public API

- GraphQL client
- Request, response, and transport contracts
- GraphQL error contract
- Module setup contracts

---

## Documentation

- docs/overview.md
- docs/conventions.md
- docs/architecture.md

---

## Related Packages

- @comity/graphql-builder
- @comity/graphql-client-ws

---

## Status

Stable
