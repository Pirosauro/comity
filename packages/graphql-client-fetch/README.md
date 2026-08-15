# @comity/graphql-client-fetch

Fetch transport for `@comity/graphql-client`.

---

## Purpose

Provides a GraphQL transport implementation that executes operations over HTTP using the Fetch API.

---

## Scope

This package:

- ✅ implements the GraphQL transport contract
- ✅ exposes the Fetch transport class
- ✅ binds to the Fetch API (`fetch`, `globalThis.fetch`, `Response`, `RequestInit`)

This package does NOT:

- ❌ define GraphQL client contracts
- ❌ own query building
- ❌ embed application-specific GraphQL policy
- ❌ depend on `@comity/http` — the HTTP abstraction and the GraphQL transport abstraction are different boundaries

---

## Public API

- `FetchGraphqlTransport` — Fetch API implementation of `GraphqlTransport`
- `FetchTransportOptions` — transport configuration type

---

## Usage

```ts
import { FetchGraphqlTransport } from "@comity/graphql-client-fetch";

const transport = new FetchGraphqlTransport({
  url: "https://api.example.com/graphql",
});

const client = new GraphqlClient({ transport });
```

---

## Documentation

- docs/overview.md
- docs/conventions.md

---

## Related Packages

- @comity/graphql-client — defines the `GraphqlTransport` contract this adapter implements
- @comity/graphql-client-ws — WebSocket transport adapter

---

## Status

Stable