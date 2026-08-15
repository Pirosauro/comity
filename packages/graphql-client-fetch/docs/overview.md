# @comity/graphql-client-fetch — Overview

`@comity/graphql-client-fetch` adapts the Fetch API to the `@comity/graphql-client` transport contract.

It exists as a concrete transport option for GraphQL operations that are executed over HTTP POST.

---

## Role

`@comity/graphql-client` defines GraphQL semantics: `GraphqlClient`, `GraphqlRequest`, `GraphqlResponse`, and the `GraphqlTransport` contract. `@comity/graphql-client-fetch` is the concrete transport: it executes GraphQL requests with the Fetch API.

```
@comity/graphql-client       defines GraphqlTransport contract
        ↓ implements
@comity/graphql-client-fetch FetchGraphqlTransport
```

---

## What it includes

- `FetchGraphqlTransport` — a class implementing `GraphqlTransport.execute`
- `FetchTransportOptions` — configuration type (`url`, optional `fetch` function, optional `headers`)

## What it does not include

- GraphQL client contracts or the client facade (see `@comity/graphql-client`)
- query building
- application policy
- a dependency on `@comity/http` — the HTTP abstraction and the GraphQL transport abstraction are different boundaries

---

## Transport behavior

- POST requests with `content-type: application/json`
- body shape: `{ query, variables, operationName }`
- configured headers merged with per-request headers
- non-2xx responses normalized into `GraphqlClientError("transport_error")` with `httpStatus` and optional `operationName` details
- responses parsed into `GraphqlResponse` with `data`, `errors`, `extensions`, response headers, and status
- network failures propagate raw (not wrapped)

## Usage

```ts
import { FetchGraphqlTransport } from "@comity/graphql-client-fetch";

const transport = new FetchGraphqlTransport({
  url: "https://api.example.com/graphql",
});
```

## Ecosystem Role

`@comity/graphql-client` remains transport-agnostic; any transport (fetch, WebSocket, etc.) can implement `GraphqlTransport`. `@comity/graphql-client-fetch` is the Fetch-based implementation.