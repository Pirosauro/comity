# `@comity/http-hono`

Hono HTTP adapter for the Comity framework.

## Purpose

`@comity/http-hono` is a **pure adapter** that bridges Hono's HTTP runtime with Comity's `@comity/http` module.

It maps Hono contexts to `HttpContext`, executes the Comity HTTP pipeline via `HttpFacade`, and maps `HttpResult` back to Web Standard `Response` objects.

## Status

**Experimental** – API subject to change.

## Responsibilities

### ✅ What this package does

- Maps Hono `Context` to `HttpContext`
- Executes `HttpFacade.handle(ctx)`
- Maps `HttpResult` to Web Standard `Response`
- Integrates with `@comity/kernel` lifecycle (optional)
- Emits HTTP lifecycle events when kernel is present

### ❌ What this package does NOT do

- Implement business logic
- Define middleware behavior
- Provide routing (delegated to Hono)
- Implement its own error handling strategy
- Define domain-specific HTTP behavior

## Public API

### `createHonoHandler`

Factory function that creates a Hono-compatible handler.

```typescript
import { createHonoHandler } from "@comity/http-hono";
import { Hono } from "hono";

const app = new Hono();

app.get("/api/*", createHonoHandler({ facade }));
```

### Kernel Module

```typescript
import { module } from "@comity/http-hono";
```

Module metadata for kernel-based applications.

## Installation

```bash
pnpm add @comity/http-hono hono
```

## Documentation

- [`docs/overview.md`](./docs/overview.md) – Architecture and design
- [`docs/wiring.md`](./docs/wiring.md) – Usage examples
