# @comity/graphql-client-ws — Conventions

This document defines the conventions for the WebSocket GraphQL transport.

---

## 1. Scope

The package is a transport adapter.

It MUST stay aligned with the `@comity/graphql-client` transport contract.

---

## 2. Public API

- the root entrypoint exports `WsGraphqlTransport`
- no additional public sub-entrypoints are currently exposed

---

## 3. Transport Rules

- execution MUST be delegated through the transport contract
- protocol or transport failures MUST be normalized through GraphQL client errors
- application policy does not belong here
