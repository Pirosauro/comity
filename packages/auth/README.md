# @comity/auth

The `@comity/auth` package provides JWT-based authentication for Comity applications. It includes middleware for request authentication, token management utilities, and a comprehensive event system for monitoring authentication flows.

This package integrates seamlessly with Hono applications and provides type-safe user context, automatic token refresh, and flexible configuration options.

## Features

- JWT token generation and verification using JOSE
- Automatic authentication middleware for Hono routes
- Flexible token extraction from headers and cookies
- Token refresh with configurable time windows
- Two-factor authentication support
- Comprehensive event system for authentication monitoring
- Type-safe user context in Hono requests
- Custom error classes for different authentication failures
- Cookie-based session management

## Quickstart

Install the monorepo (pnpm workspace):

```bash
pnpm install
```

Create a Hono app with authentication:

```ts
import { Hono } from "hono";
import { createApplication } from "@comity/application";
import authSetup from "@comity/auth/setup";

const app = new Hono();

// Configure auth options
const authOptions = {
  secret: process.env.JWT_SECRET!,
  lifetime: 3600,
  cookie: {
    name: "auth-token",
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  },
};

(async () => {
  const modules = [authSetup(authOptions)];

  await createApplication(app, modules);

  export default app;
})();
```

## API

### Module Setup

- `authSetup(options)`

  Returns a Comity module that configures JWT authentication. The options object includes:

  ```ts
  interface AuthModuleOptions {
    secret: string; // JWT signing secret (required)
    lifetime?: number; // Token lifetime in seconds
    issuer?: string; // JWT issuer claim
    audience?: string | string[]; // JWT audience claim
    algorithm?: "HS256" | "HS384" | "HS512"; // Signing algorithm
    maxRefreshWindow?: number; // Maximum age for token refresh (seconds)
    minRefreshWindow?: number; // Minimum time before refresh allowed (seconds)
    header?: {
      name?: string; // Authorization header name
      prefix?: string; // Token prefix (default: "Bearer ")
    };
    cookie?: {
      name?: string; // Cookie name for token storage
      httpOnly?: boolean; // Cookie httpOnly flag
      secure?: boolean; // Cookie secure flag
      sameSite?: "strict"; // Cookie sameSite policy
      domain?: string; // Cookie domain
      path?: string; // Cookie path
      maxAge?: number; // Cookie max age
    };
  }
  ```

### Auth Service

The auth module provides utility functions for authentication operations:

- `handleLogin(user, c, options)` - Generate JWT and set user context
- `handleLogout(c, options)` - Clear user context and delete auth cookie
- `handleRefresh(c, options)` - Refresh JWT token within allowed window
- `signToken(user, options?)` - Generate JWT token directly

### Middleware

The module automatically applies JWT middleware to all routes. The middleware:

- Extracts tokens from Authorization headers or cookies
- Verifies JWT signatures and claims
- Sets authenticated user in Hono context
- Emits authentication events
- Handles token refresh and expiration

### Types

```ts
// User object (extendable)
type AuthUser<T = {}> = { id: string } & T;

// JWT payload structure
interface JWTPayload {
  sub?: string;
  iat?: number;
  exp?: number;
  iss?: string;
  aud?: string | string[];
  verified?: number; // 2FA timestamp
  user: AuthUser;
}

// Hono context with auth variables
interface AuthModuleHonoContext {
  Variables: {
    user?: AuthUser;
  };
}
```

## Authentication Flow

### Login

```ts
app.post("/login", async (c) => {
  const credentials = await c.req.json();
  // Validate credentials (your logic)
  const user = await validateCredentials(credentials);
  // Generate token and set context
  const token = await handleLogin(user, c, authOptions);

  return c.json({ token, user });
});
```

### Protected Routes

```ts
app.get("/profile", async (c) => {
  const user = c.get("user");

  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  return c.json({ profile: await getUserProfile(user.id) });
});
```

### Token Refresh

```ts
app.post("/refresh", async (c) => {
  try {
    const token = await handleRefresh(c, authOptions);

    return c.json({ token });
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return c.json({ error: "Token too old to refresh" }, 401);
    }

    throw error;
  }
});
```

### Logout

```ts
app.post("/logout", async (c) => {
  await handleLogout(c, authOptions);

  return c.json({ message: "Logged out" });
});
```

## Events & Hooks

The auth module emits events for monitoring authentication flows:

```ts
// Listen for authentication events
ctx.onEvent("user-logged-in", ({ user, token }) => {
  console.log(`User ${user.id} logged in`);
});

ctx.onEvent("user-logged-out", ({ user }) => {
  console.log(`User ${user.id} logged out`);
});

ctx.onEvent("token-refreshed", ({ outdated, current }) => {
  console.log("Token refreshed");
});

ctx.onEvent("authentication-failed", ({ reason, ip, userAgent }) => {
  console.log(`Auth failed: ${reason} from ${ip}`);
});

ctx.onEvent("token-verified", ({ user, ip }) => {
  console.log(`Token verified for user ${user.id}`);
});
```

## Error Handling

The package provides specific error classes:

```ts
import { TokenExpiredError, TokenInvalidError } from "@comity/auth/errors";

app.use("/api/*", async (c, next) => {
  try {
    await next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return c.json({ error: "Token expired" }, 401);
    }
    if (error instanceof TokenInvalidError) {
      return c.json({ error: "Invalid token" }, 401);
    }
    throw error;
  }
});
```

## Configuration Examples

### Basic Setup

```ts
authSetup({
  secret: process.env.JWT_SECRET!,
});
```

### Advanced Configuration

```ts
authSetup({
  secret: process.env.JWT_SECRET!,
  lifetime: 3600, // 1 hour
  issuer: "my-app",
  audience: "my-app-users",
  algorithm: "HS256",
  maxRefreshWindow: 86400 * 7, // 7 days
  minRefreshWindow: 300, // 5 minutes
  header: {
    name: "authorization",
    prefix: "Bearer ",
  },
  cookie: {
    name: "auth-session",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 3600,
  },
});
```

### Two-Factor Authentication

```ts
// During 2FA verification
const token = await c.auth.signToken(user, {
  verified: Date.now(), // Mark as 2FA verified
});
```

## Development & Tests

Run the package tests (from repository root):

```bash
pnpm -w -F @comity/auth test
```

Run the full monorepo test suite:

```bash
pnpm -w test
```

Linting and type checks are provided at the workspace level; run your usual tooling as needed.

## License

See the package `LICENSE` in the repository root.
