# @comity/graphql-client-fetch — Conventions

This document defines the conventions for the Fetch GraphQL transport.

---

## 1. Scope

The package is a transport adapter.

It MUST stay aligned with the `@comity/graphql-client` transport contract.

---

## 2. Public API

- the root entrypoint exports `FetchGraphqlTransport` and `FetchTransportOptions`
- no additional public sub-entrypoints are currently exposed

---

## 3. Transport Rules

- execution MUST be delegated through the transport contract
- the transport binds to the Fetch API (`fetch`, `globalThis.fetch`, `Response`, `RequestInit`) — Fetch is the technology being adapted
- the transport MUST NOT depend on `@comity/http`
- protocol or transport failures MUST be normalized through GraphQL client errors where the contract specifies
- application policy does not belong here