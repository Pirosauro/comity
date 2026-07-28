# @comity/graphql-client — Conventions

This document defines the conventions for `@comity/graphql-client`.

---

## 1. Scope

The package defines GraphQL client contracts and transports.

It MUST stay transport-agnostic at the contract layer.

---

## 2. Public API

- client and transport types are public
- error contracts are public
- setup metadata is public when exported from the root

---

## 3. Transport Rules

- transports implement the client contract
- transports MUST remain replaceable
- transport-specific details MUST NOT leak into the public contract layer

---

## 4. Error Handling

- GraphQL client errors are typed and finite
- errors represent client and transport failure modes
- internal transport exceptions should be normalized through the client layer when possible
