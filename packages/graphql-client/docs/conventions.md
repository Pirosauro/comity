# @comity/graphql-client — Conventions

This document defines the conventions for `@comity/graphql-client`.

---

## 1. Scope

The package defines GraphQL client contracts and transports.

It MUST stay transport-agnostic at the contract layer.

---

## 2. Public API

- the canonical `GraphqlClient` facade and its options are public from the root
- client and transport types are public
- error contracts are public
- setup metadata is public when exported from the root

The `GraphqlClient` facade MUST remain in the Core Module. It is transport-independent: it depends only on `GraphqlTransport`, `GraphqlRequest`, and `GraphqlResponse` and contains no technology-specific implementation.

---

## 3. Transport Rules

- transports implement the `GraphqlTransport` contract, which is the replaceable boundary
- transports MUST remain replaceable
- technology-bound transport implementations (WebSocket, fetch, HTTP-specific) belong in adapter packages (`@comity/graphql-client-ws`, `@comity/graphql-client-fetch`), not in the Core Module
- transport-specific details MUST NOT leak into the public contract layer

---

## 4. Error Handling

- GraphQL client errors are typed and finite
- errors represent client and transport failure modes
- internal transport exceptions should be normalized through the client layer when possible
