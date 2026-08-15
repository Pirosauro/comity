# @comity/http-fetch — Overview

`@comity/http-fetch` implements the `HttpTransport` contract defined by `@comity/http` using the global fetch API.

---

## Role

`@comity/http` defines HTTP semantics: `HttpRequest`, `HttpResponse`, `HttpHandler`, and the `HttpTransport` contract. `@comity/http-fetch` is the concrete transport: it performs outbound HTTP requests with the fetch API.

```
@comity/http          defines HttpTransport contract
        ↓ implements
@comity/http-fetch    FetchHttpClient, client
```

---

## What it includes

- `FetchHttpClient` — a class implementing `HttpTransport.request`
- `client` — a standalone fetch helper
- `HttpOptions` — client options extending `RequestInit` with `method`, `timeout`, `delay`, and `headers`

## What it does not include

- HTTP contracts or pipeline semantics (see `@comity/http`)
- business logic
- a public domain error contract
- routing

---

## Client features

- **timeout** — aborts the request after the given number of milliseconds
- **delay** — throttles request start by the given number of milliseconds
- **abort-signal combining** — combines a caller signal with the internal timeout signal, preserving the caller's abort reason

## Usage

```ts
import { FetchHttpClient } from "@comity/http-fetch";

const transport = new FetchHttpClient();

const response = await transport.request(new URL("https://api.example.com/data"));
```

## Ecosystem Role

`@comity/http` remains transport-agnostic; any transport (fetch, undici, node http, etc.) can implement `HttpTransport`. `@comity/http-fetch` is the default fetch-based implementation.
