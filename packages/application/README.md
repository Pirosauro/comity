# @comity/application

The `@comity/application` package provides the application bootstrap primitives for Comity-based projects: module metadata, dependency resolution, a shared application context (hooks/events/DI), and a Vite helper for local package overrides.

This package is intended to be consumed by other Comity modules (logger, auth, database, etc.) and by applications that compose modules together.

## Features

- create and bootstrap a Hono application with Comity modules (`createApplication`)
- Module metadata types and validation helpers
- Topological dependency resolution for deterministic module initialization
- Shared `ApplicationContext` based on the core `Context` (hooks, events, DI)
- Vite `withComity` helper to prefer `src/overrides/*` local files for packages when present

## Quickstart

Install the monorepo (pnpm workspace):

```bash
pnpm install
```

Create a Hono app and bootstrap modules:

```ts
import { Hono } from "hono";
import { createApplication } from "@comity/application";
import { authModule } from "@comity/auth";
import { databaseModule } from "@comity/database";

const app = new Hono();

(async () => {
  const modules = [databaseModule, authModule];

  // Optional module-specific options keyed by module name
  const options = {
    "@comity/auth": { secret: process.env.JWT_SECRET },
  };

  await createApplication(app, modules, options);

  // app is now bootstrapped and can be exported or started
  export default app;
})();
```

## API

- `createApplication(app, modules, options?)`

  - Bootstraps the provided `Hono` instance with the given module metadata array.
  - Validates module metadata and orders modules by dependencies before calling each module's `setup` function.

- `ApplicationContext`

  - Extends the core `Context` and provides `onHook`, `onEvent`, `trigger`, and `emit` methods used by modules to register lifecycle hooks and events.

- `withComity(options?)`
  - Returns a Vite `UserConfig` (or Promise<UserConfig>) containing a `resolve.alias` entry that points package imports to `src/overrides/*` when a local override file exists.

## Module authoring

Define a module using the `ApplicationModuleMeta` shape:

```ts
import type { ApplicationModuleMeta } from "@comity/application";

export const myModule: ApplicationModuleMeta = {
  name: "@example/health-check",
  version: "1.0.0",
  dependsOn: ["@comity/application"],
  setup: (options) => async (ctx) => {
    // Register hooks or events
    ctx.onHook("@comity/application:initialized", async (app) => {
      app.get("/health", (c) => c.text("ok"));
    });
  },
};
```

Notes:

- Keep `name` unique across modules.
- Use `dependsOn` to declare optional ordering dependencies.
- Use `requires` when a dependency is mandatory and should cause a hard failure if missing.

## Development & Tests

Run the package tests (from repository root):

```bash
pnpm -w -F @comity/application test
```

Run the full monorepo test suite:

```bash
pnpm -w test
```

Linting and type checks are provided at the workspace level; run your usual tooling as needed.

## License

See the package `LICENSE` in the repository root.
