# @comity/graphql-client — Overview

`@comity/graphql-client` provides the GraphQL execution model used by Comity.

It separates the client contract from the underlying transport so that different transport implementations can be swapped without changing the client-facing shape.

`GraphqlClient` is the canonical, transport-independent client facade. It composes a `GraphqlTransport` and exposes `execute`, `query`, `mutation`, and `subscribe`. Because it contains no technology-specific implementation, it lives in the Core Module alongside its contracts. Technology-bound transports (WebSocket, fetch, HTTP-specific) belong to adapter packages; `GraphqlTransport` is the replaceable boundary.
