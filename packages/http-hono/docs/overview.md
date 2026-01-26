# Overview

## Purpose

`@comity/http-hono` is a **pure HTTP adapter** for the Comity framework.

It bridges Hono's HTTP runtime with Comity's `@comity/http` module, enabling Hono applications to use Comity's HTTP pipeline and middleware system.

## Role in the Comity Ecosystem

The adapter sits at the boundary between:

- **Hono** (HTTP server runtime)
- **Comity HTTP** (framework-agnostic HTTP pipeline)

```
┌─────────┐
│  Hono   │
└────┬────┘
     │
┌────▼────────────┐
│  http-hono      │  ← This package
│  (Adapter)      │
└────┬────────────┘
     │
┌────▼────────────┐
│  @comity/http   │
│  (Pipeline)     │
└─────────────────┘
```

## Adapter Responsibilities

### ✅ What the adapter does

1. **Request Mapping**
   - Converts Hono `Context` to `HttpContext`
   - Extracts URL, headers, query parameters, path parameters
   - Creates mutable state per request
   - Provides abort signal from Hono request

2. **Pipeline Execution**
   - Invokes `HttpFacade.handle(ctx)`
   - No business logic
   - No middleware implementation
   - Pure delegation

3. **Response Mapping**
   - Converts `HttpResult` to Web Standard `Response`
   - Handles success results (`ok: true`)
   - Handles error results (`ok: false`)
   - Serializes JSON bodies
   - Sets appropriate content-type headers

4. **Error Handling**
   - Catches unhandled exceptions from `facade.handle`
   - Returns HTTP 500 for unexpected errors
   - Does NOT implement custom error logic

5. **Kernel Integration (Optional)**
   - Provides `ModuleMeta` for kernel-based apps
   - Does NOT require kernel to function
   - Does NOT perform any service registration by default

### ❌ What the adapter does NOT do

- Implement business logic
- Define middleware behavior
- Provide routing (delegated to Hono)
- Implement custom error handling strategies
- Define domain-specific HTTP behavior
- Parse request bodies (delegated to middleware)
- Validate requests (delegated to middleware)
- Implement authentication/authorization (delegated to middleware)

## Architecture Principles

### Pure Adapter

The adapter is **stateless** and **side-effect free**. It performs pure mappings between Hono and Comity types.

### Framework Agnostic

While designed for Hono, the adapter does not depend on Hono-specific features beyond the minimal `Context` interface.

### Minimal API Surface

The public API consists of:

1. `createHonoHandler(options)` – Factory function
2. `module` – Kernel module metadata
3. Type exports (where necessary)

No helpers, utilities, or convenience functions are exposed.

### Explicit Over Implicit

All behavior is explicit:

- No magic
- No global state
- No hidden middleware
- No implicit conversions

## Non-Goals

- **Not a framework**: This is an adapter, not a web framework
- **Not a router**: Routing is handled by Hono
- **Not a middleware system**: Middleware is handled by `@comity/http`
- **Not a body parser**: Body parsing is middleware responsibility
- **Not an error handler**: Error handling is pipeline responsibility
