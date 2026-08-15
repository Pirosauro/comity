# @comity/graphql-client — Architecture

`@comity/graphql-client` is organized around a client and transport separation.

---

## Package Structure

- `client.ts` provides the canonical `GraphqlClient` facade — a transport-independent composition of `execute`, `query`, `mutation`, and `subscribe`
- `contracts/` defines request, response, transport, and error contracts
- `errors/` contains package-scoped GraphQL client errors
- `setup/` contains module metadata and wiring contracts
- `transports/` contains transport composition helpers (`CombinedGraphqlTransport`)

Technology-bound transport implementations (WebSocket, fetch, HTTP-specific) belong in adapter packages (`@comity/graphql-client-ws`, `@comity/graphql-client-fetch`).

---

## Runtime Flow

1. The client receives a request.
2. A transport executes the GraphQL operation.
3. The response is normalized into the client contract.
4. Transport failures are mapped into package-scoped errors when appropriate.

---

## Boundary Rules

- query construction is owned elsewhere
- `GraphqlTransport` is the replaceable boundary; transport implementations remain replaceable
- the client does not know about application data sources
- the client facade is transport-independent and stays in the Core Module

