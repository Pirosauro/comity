# ADR-003 — HTTP Client Extraction from @comity/http

> **Note:** This is the Community-specific transitional copy. The canonical Comity-wide version is maintained in `comity-development/docs/standards/decisions/ADR-003-http-client-extraction.md`
**Status:** Accepted

## Context

`@comity/http` is a Core Module: it "defines contracts — not concrete infrastructure" (layering-policy.md §2.2). Its inbound model (pipeline, middleware, `HttpRequest`, `HttpResponse`, `HttpHandler`) is transport-agnostic, but it also contains an outbound fetch implementation in `src/client.ts` with `HttpOptions`.

The fetch client is concrete infrastructure:

- it binds to the global `fetch` API;
- it implements timeout, delay, and abort-signal combining logic;
- it has no reason to live in a contract-only Core Module.

This violates the layering boundary: the Core Module owns a concrete transport while claiming to be implementation-agnostic.

The `@comity/graphql-client` package already demonstrates the correct shape: it defines a `GraphqlTransport` contract in `contracts/transport.ts`, and the adapter implementation ships separately as `FetchGraphqlTransport` in `@comity/graphql-client-fetch` (`fetch-transport.ts`). `@comity/http` should follow the same pattern.

## Decision

Extract the concrete fetch implementation from `@comity/http` into a new Adapter package `@comity/http-fetch`.

### Core: `@comity/http` keeps semantics

`@comity/http` retains:

- `HttpRequest`
- `HttpResponse`
- `HttpHandler`
- a new `HttpTransport` contract

`HttpTransport` is the outbound counterpart of the inbound HTTP model. It defines the semantics of executing an HTTP request:

```ts
export interface HttpTransport {
  request(input: Request | URL, init?: RequestInit): Promise<Response>;
}
```

It uses standard Web types (`Request`, `URL`, `RequestInit`, `Response`) so the Core remains runtime-agnostic.

### Adapter: `@comity/http-fetch` provides transport

`@comity/http-fetch` is a new Adapter that:

- implements `HttpTransport` via `FetchHttpClient`;
- owns the moved `client` helper and `HttpOptions`;
- depends on `@comity/http` (one Core Module) and nothing else.

Consumers migrate:

```ts
// before
import { client } from "@comity/http";

// after
import { FetchHttpClient } from "@comity/http-fetch";
```

`@comity/http` removes `client.ts`, `HttpOptions`, and the `client` export.

## Consequences

**Positive:**

- `@comity/http` becomes transport-agnostic in both directions (inbound and outbound).
- Any transport (fetch, undici, node http, etc.) can implement `HttpTransport`, keeping the Core replaceable.
- The Core/Adapter boundary is consistent with `@comity/graphql-client`.
- The fetch client gains its own lifecycle, versioning, and test surface.

**Negative / Trade-offs:**

- `@comity/http` public API loses `client` and `HttpOptions` — a breaking change for consumers of the outbound client.
- The extraction moves code across package boundaries; git history for `client.ts` is preserved by a move, not a rewrite.
- `HttpTransport` uses Web standard types; a transport targeting a runtime without Web `fetch` types must still satisfy the structural contract.

## Scope

This ADR concerns:

- the extraction of `client.ts` and `HttpOptions` from `@comity/http` to `@comity/http-fetch`;
- the `HttpTransport` contract;
- consumer migration from `client` to `FetchHttpClient`.

This ADR does NOT concern:

- the inbound HTTP pipeline model;
- `HttpContext`, `HttpFacade`, middleware, or lifecycle events;
- the internal implementation of `client` timeout/delay/abort behavior;
- generic framework transport abstractions;
- whether `HttpTransport` also models streaming or server-sent events (future work).

## References

- `docs/standards/layering-policy.md` §2.2 — Core Modules define contracts, not concrete infrastructure.
- `docs/standards/layering-policy.md` §2.3 — Adapters bind Core Modules to concrete technologies.
- `packages/graphql-client/src/contracts/transport.ts` — `GraphqlTransport` contract precedent.
- `packages/graphql-client-fetch/src/fetch-transport.ts` — `FetchGraphqlTransport` adapter precedent.
- `packages/http/src/contracts/transport.ts` — new `HttpTransport` contract.
- `packages/http-fetch/src/adapter.ts` — `FetchHttpClient` implementation (`FetchHttpClient` currently lives in `adapter.ts`).
- `packages/http-fetch/src/client.ts` — moved `client` helper and `HttpOptions`.
