# @comity/http-hono — Overview

`@comity/http-hono` adapts Hono to the Comity HTTP model.

It provides a pure adapter function, a kernel module descriptor, and the adapter token used to register the Hono instance inside the kernel.

---

## What it includes

- `httpHonoAdapter`
- `module`
- `HTTP_HONO_TOKEN`
- adapter-specific setup types

---

## What it does not include

- business logic
- routing policy
- application data loading
- a public domain error contract

---

## Ecosystem Role

The package sits between Hono and `@comity/http`.

It maps Hono context into Comity HTTP context, invokes the HTTP facade, and maps the result back into a response.
