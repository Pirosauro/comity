# Wiring Guide

## Basic Usage

### Standalone (without Kernel)

```typescript
import { Hono } from "hono";
import { createHonoHandler } from "@comity/http-hono";
import { DefaultHttpFacade } from "@comity/http/internal";
import { EventBus } from "@comity/primitives/lifecycle";

// Create event bus
const events = new EventBus();

// Create HTTP facade
const facade = new DefaultHttpFacade(events);

// Register middleware
facade.use(async (ctx, next) => {
  console.log(`${ctx.request.method} ${ctx.request.url.pathname}`);
  await next();
});

// Seal the facade (optional, will auto-seal on first request)
facade.seal();

// Create Hono app
const app = new Hono();

// Wire the handler
app.all("*", createHonoHandler({ facade }));

// Start server
export default app;
```

### With Kernel

```typescript
import { Kernel } from "@comity/kernel";
import { Hono } from "hono";
import { createHonoHandler } from "@comity/http-hono";
import { module as httpModule } from "@comity/http";
import { module as honoModule } from "@comity/http-hono";
import { DefaultHttpFacade } from "@comity/http/internal";

// Create kernel
const kernel = new Kernel();

// Load modules
await kernel.load(httpModule);
await kernel.load(honoModule);

// Create facade (in real app, this would be registered in a service)
const facade = new DefaultHttpFacade(kernel.events);

// Register middleware
facade.use(async (ctx, next) => {
  // Your middleware here
  await next();
});

// Create Hono app
const app = new Hono();
app.all("*", createHonoHandler({ facade }));

// Start the kernel
await kernel.start();

// Start server
export default app;
```

## Route-Specific Handlers

You can create multiple handlers for different routes:

```typescript
import { Hono } from "hono";
import { createHonoHandler } from "@comity/http-hono";

const app = new Hono();

// API routes
app.all("/api/*", createHonoHandler({ facade: apiFacade }));

// Admin routes
app.all("/admin/*", createHonoHandler({ facade: adminFacade }));

// Public routes
app.all("/*", createHonoHandler({ facade: publicFacade }));
```

## Middleware Example

```typescript
import type { HttpMiddleware } from "@comity/http";

// Logger middleware
const logger: HttpMiddleware = async (ctx, next) => {
  const start = performance.now();

  await next();

  const duration = performance.now() - start;
  console.log(
    `${ctx.request.method} ${ctx.request.url.pathname} - ` +
      `${ctx.response?.ok ? ctx.response.response.status : "failed"} ` +
      `(${duration.toFixed(2)}ms)`
  );
};

// Error handler middleware
const errorHandler: HttpMiddleware = async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    ctx.setResponse({
      ok: false,
      error: {
        code: "http:internal",
        status: 500,
        message: "Internal server error",
      },
    });
  }
};

// JSON response middleware
const jsonResponse: HttpMiddleware = async (ctx, next) => {
  await next();

  if (!ctx.response) {
    ctx.setResponse({
      ok: true,
      response: {
        status: 200,
        body: { message: "OK" },
      },
    });
  }
};

// Register middleware
facade.use(logger);
facade.use(errorHandler);
facade.use(jsonResponse);
```

## Body Parsing

Body parsing should be implemented as middleware:

```typescript
import type { HttpMiddleware } from "@comity/http";

const jsonBodyParser: HttpMiddleware = async (ctx, next) => {
  const contentType = ctx.request.headers["content-type"];

  if (contentType?.includes("application/json")) {
    try {
      const raw = ctx.request.rawBody as Request;
      const body = await raw.json();

      // Store parsed body in state
      ctx.state.set("body", body);
    } catch (error) {
      ctx.setResponse({
        ok: false,
        error: {
          code: "http:invalid_body",
          status: 400,
          message: "Invalid JSON body",
        },
      });
      return;
    }
  }

  await next();
};

facade.use(jsonBodyParser);
```

## Authentication Example

```typescript
import type { HttpMiddleware } from "@comity/http";

const authMiddleware: HttpMiddleware = async (ctx, next) => {
  const authHeader = ctx.request.headers["authorization"];

  if (!authHeader) {
    ctx.setResponse({
      ok: false,
      error: {
        code: "auth:unauthorized",
        status: 401,
        message: "Missing authorization header",
      },
    });
    return;
  }

  // Verify token (simplified)
  const token = authHeader.replace("Bearer ", "");
  const user = await verifyToken(token);

  if (!user) {
    ctx.setResponse({
      ok: false,
      error: {
        code: "auth:invalid_token",
        status: 401,
        message: "Invalid token",
      },
    });
    return;
  }

  // Store user in state
  ctx.state.set("user", user);

  await next();
};

facade.use(authMiddleware);
```

## Testing

```typescript
import { describe, it, expect } from "vitest";
import { Hono } from "hono";
import { createHonoHandler } from "@comity/http-hono";

describe("Hono Handler", () => {
  it("should handle requests", async () => {
    const facade = createTestFacade();
    const app = new Hono();

    app.all("*", createHonoHandler({ facade }));

    const res = await app.request("/test");

    expect(res.status).toBe(200);
  });
});
```
