# HTML Error Contract

## Purpose

The **HTML Error Contract** defines a stable, framework-agnostic interface for
rendering user-facing HTML error pages in @comity-based applications.

It separates:

- **Error semantics** (kernel / domain)
- **HTTP mapping** (http layer)
- **Presentation & branding** (HTML renderer)

This ensures consistent, branded error pages without coupling the kernel to
HTML, templates, or UI concerns.

---

## Design Principles

1. **Kernel-agnostic**
   - The kernel never knows about HTML, templates, or layouts.

2. **Intent-driven**
   - HTML rendering is triggered by `HttpIntent = "html"`.

3. **Renderer-based**
   - Error presentation is handled by a dedicated `HttpErrorRenderer`.

4. **Deterministic**
   - Same error + same intent → same rendered output.

5. **Safe by default**
   - No stack traces or sensitive data unless explicitly enabled.

---

## Terminology

- **BaseError**  
  Domain or infrastructure error raised by the kernel.

- **HttpResponse**  
  Transport-agnostic HTTP representation.

- **Intent**  
  Desired representation for the client (`html`, `json`, `text`, `redirect`).

- **HTML Error Renderer**  
  Component responsible for producing branded HTML error pages.

---

## Contract Inputs

### 1. BaseError

```ts
interface BaseError {
  code: string;
  message: string;
  meta: {
    httpStatus?: number;
    [key: string]: unknown;
  };
}
```

### 2. HttpResponse (error case)

```ts
interface HttpResponse {
  kind: "html" | "json" | "text" | "redirect";
  status: number;
  headers?: Record<string, string>;
  body?: unknown;
  intent?: "html" | "json" | "text";
}
```

---

## HtmlErrorContext

The renderer receives a normalized context object.

```ts
interface HtmlErrorContext {
  error: BaseError;
  status: number;
  intent: "html";
  request: {
    path: string;
    method: string;
  };
  env?: "development" | "production";
}
```

> The request object is optional but recommended for analytics and diagnostics.

---

## HtmlErrorRenderer Interface

```ts
export interface HttpErrorRenderer {
  supports(intent: "html"): boolean;

  render(context: HtmlErrorContext): HttpResponse;
}
```

---

## Required Output

The renderer **MUST** return a valid `HttpResponse`:

```ts
{
  kind: "html",
  status: number,
  headers?: {
    "content-type": "text/html; charset=utf-8";
  },
  body: string;
}
```

---

## Required Guarantees

An HTML error page MUST:

- Match the application's visual identity
- Include a human-readable message
- Respect the HTTP status code
- Avoid leaking internal details by default

---

## Optional Enhancements

The renderer MAY include:

- Error code display (e.g. `core:internal`)
- Request ID / correlation ID
- Retry or navigation links
- Environment-specific diagnostics (dev only)

---

## Example: Basic HTML Error Renderer

```ts
export class DefaultHtmlErrorRenderer implements HttpErrorRenderer {
  supports(intent: "html") {
    return intent === "html";
  }

  render(ctx: HtmlErrorContext): HttpResponse {
    return {
      kind: "html",
      status: ctx.status,
      headers: {
        "content-type": "text/html; charset=utf-8",
      },
      body: `
<!doctype html>
<html>
  <head>
    <title>Error ${ctx.status}</title>
  </head>
  <body>
    <h1>Something went wrong</h1>
    <p>${ctx.error.message}</p>
    <small>Error code: ${ctx.error.code}</small>
  </body>
</html>
      `,
    };
  }
}
```

---

## Boundary Integration

The HTTP boundary MUST:

1. Convert `BaseError` → `HttpResponse` using `errorToHttp`
2. Detect `intent === "html"`
3. Delegate rendering to `HttpErrorRenderer`
4. Send the resulting `HttpResponse` via the adapter

```ts
if (response.intent === "html") {
  response = htmlErrorRenderer.render({
    error,
    status: response.status,
    intent: "html",
    request,
  });
}
```

---

## Non-Goals

The HTML Error Contract does NOT:

- Define a template engine
- Define a CSS or design system
- Handle localization
- Replace frontend frameworks

These concerns belong to higher-level packages or applications.

---

## Summary

The HTML Error Contract enables:

- Branded, user-friendly error pages
- Clean separation of concerns
- Multi-channel output (HTML, JSON, text)
- Future extensibility (SSR, streaming, CMS-driven templates)

Without contaminating the kernel or adapters.
