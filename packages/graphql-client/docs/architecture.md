# @comity/graphql-client — Architecture

`@comity/graphql-client` is organized around a client and transport separation.

---

## Package Structure

- `client.ts` coordinates GraphQL execution
- `contracts/` defines request, response, transport, and error contracts
- `error/` contains package-scoped GraphQL client errors
- `setup/` contains module metadata and wiring contracts
- `transports/` contains transport implementations and helpers

---

## Runtime Flow

1. The client receives a request.
2. A transport executes the GraphQL operation.
3. The response is normalized into the client contract.
4. Transport failures are mapped into package-scoped errors when appropriate.

---

## Boundary Rules

- query construction is owned elsewhere
- transport implementations remain replaceable
- the client does not know about application data sources

