# @comity/http-hono — Wiring

## Purpose

Use `httpHonoAdapter` to connect a Hono application to a Comity HTTP facade.

The adapter maps:

- Hono `Context` → Comity `HttpContext`
- Comity `HttpResponse` / `HttpResult` → Hono response output

---

## Kernel Integration

The module export (`module`) exists so the adapter can be registered in kernel-based compositions.

The adapter itself can also be used directly without the kernel.

---

## Public Tokens

- `HTTP_HONO_TOKEN` identifies the registered Hono instance inside kernel wiring.

---

## Boundary Rule

The adapter does not define request policy, routing policy, or a public adapter-specific error contract.
