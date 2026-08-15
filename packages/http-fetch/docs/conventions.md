# @comity/http-fetch — Conventions

This document defines mandatory conventions for the `@comity/http-fetch` module.

These conventions are normative. Any deviation must be considered a design error.

---

## 1. Module Scope

`@comity/http-fetch` is an **adapter**.

It provides:

- `FetchHttpClient`, an implementation of the `HttpTransport` contract
- `client`, a standalone fetch helper
- `HttpOptions`, the client options type

It does NOT provide:

- HTTP contracts or pipeline semantics (owned by `@comity/http`)
- business logic
- rendering, routing, or persistence

---

## 2. Dependency Direction

This package depends on `@comity/http` and MUST NOT be depended on by it.

The core module defines HTTP semantics; the adapter defines the transport.

---

## 3. Transport Behavior

- `FetchHttpClient.request` MUST delegate to the fetch API.
- `client` MUST resolve to the native fetch `Response`.
- Timeout MUST abort the underlying request signal.
- Delay MUST throttle the start of the request, not the response handling.

---

## 4. Error Handling

This adapter performs no error normalization. Fetch rejects on network failures;
HTTP status handling is left to callers. This adapter MUST NOT introduce a public
domain error contract.