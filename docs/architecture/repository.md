# Repository Overview

## Package Inventory (52 packages)

### Kernel / Primitives (3)

| Package               | Description                                                                                                      |
| --------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `@comity/primitives`  | Foundational building blocks: `Result<T,E>`, error base class, DI container, utility types, lifecycle primitives |
| `@comity/kernel`      | Runtime engine: module lifecycle, service registration, event dispatching, hook execution, module initialization |
| `@comity/composition` | Module loader, resolver, shared services, runtime orchestrator                                                   |

### Core Modules (31)

| Package                   | Description                                                                                    |
| ------------------------- | ---------------------------------------------------------------------------------------------- |
| `@comity/http`            | HTTP contracts: request, response, handler, middleware, cookie, status codes, context          |
| `@comity/router`          | Routing contracts: `Route`, `Router`, `UrlRewriter`                                            |
| `@comity/html`            | HTML rendering contracts: `Renderer`, `Document`, `Layout`, `Head`, `Attribute`                |
| `@comity/hydration`       | Island hydration contracts: `Island`, `HydrationScheduler`, strategy, serializer               |
| `@comity/auth`            | Authentication: session contracts, policies (assurance/refresh/revocation), guards, use-cases  |
| `@comity/auth-tokens`     | Token contracts: envelope, facade                                                              |
| `@comity/cache`           | Caching contracts: `Cache`, `CacheStore`, in-memory store implementation                       |
| `@comity/catalog`         | Product catalog domain: product definition, `ProductRepository`, `BrandRepository`      |
| `@comity/pricing`         | Pricing domain: `Currency`, `Money`, `Price`, `PriceModifier`, `calculatePrice`       |
| `@comity/inventory`       | Inventory contracts: `InventoryModel`                                                    |
| `@comity/taxonomy`        | Shared taxonomy: `CategoryModel`, `TaxonomyModel`, `TaxonomyRepository`                  |
| `@comity/order`           | Order domain: `Order` entity, `OrderRepository`, `OrderId`, status lifecycle                    |
| `@comity/content`         | CMS/Content: `BlockRepository`, `PageRepository`, `Navigation`, `Breadcrumb`                   |
| `@comity/media`           | Media asset contracts: ` Media` interface                                                      |
| `@comity/search`          | Search contracts: criteria, filter, sort, pagination, aggregation, result                      |
| `@comity/seo`             | SEO contracts: `OpenGraph`, `StructuredData`, `TwitterCard`                                    |
| `@comity/i18n`            | Internationalization: translator, locale, loader, resolver                                     |
| `@comity/sql`             | SQL abstraction: client, query, transaction, result                                            |
| `@comity/storage`         | Storage contracts: store interface with error types and setup                                  |
| `@comity/storefront`      | Storefront page-composition capability: page models, composers, enrichers, `StorefrontContext` |
| `@comity/graphql-builder` | Zero-dependency GraphQL query builder                                                          |
| `@comity/graphql-client`  | GraphQL client contracts: transport, registry, request, response                               |
| `@comity/address`         | Address domain: `Address`, `AddressId`, `AddressLine`, `AddressRepository`, `AddressValidator` |
| `@comity/geography`       | Geography contracts: `GeographyProvider`, country/subdivision metadata, `GeographyError`       |
| `@comity/identity`        | Identity domain: `User`, `UserId`, `UserValidator`                                             |
| `@comity/cli`             | CLI core capability: command/hook contracts, `CommandRegistry`, `CliExecutionFacade`, `createCliExecutionFacade` |
| `@comity/acl`             | Authorization capability: `Authorizer`, `AuthorizationContext`, `AuthorizationDecision`        |
| `@comity/organization`    | Shared organization identifiers: `ChannelId`, `TenantId`                                       |
| `@comity/payment`         | Payment domain abstractions: `PaymentProvider`, `PaymentRequest`, `PaymentOutcome`             |
| `@comity/customer`        | Customer domain: `Customer`, `CustomerRepository`, `CustomerId`, classification               |
| `@comity/validation`      | Validation contracts: `Validator`, `ValidationError`, `ValidationResult`                       |

### Adapters (18)

| Package                         | Implements                    | External Library                      |
| ------------------------------- | ----------------------------- | ------------------------------------- |
| `@comity/http-hono`             | `@comity/http`                | `hono` (peer)                         |
| `@comity/router-path-to-regexp` | `@comity/router`              | `path-to-regexp`                      |
| `@comity/html-react`            | `@comity/html`                | `react`, `react-dom` (peer)           |
| `@comity/html-preact`           | `@comity/html`                | `preact` (peer)                       |
| `@comity/hydration-react`       | `@comity/hydration`           | `react`, `react-dom` (peer)           |
| `@comity/hydration-preact`      | `@comity/hydration`           | `preact` (peer)                       |
| `@comity/auth-jose`             | `@comity/auth`                | `jose`                                |
| `@comity/cache-kv`              | `@comity/cache`               | — (KV store adapter)                  |
| `@comity/cache-redis`           | `@comity/cache`               | `ioredis` or `redis` (peer, optional) |
| `@comity/i18n-typesafe`         | `@comity/i18n`                | `typesafe-i18n` (peer)                |
| `@comity/sql-kysely`            | `@comity/sql`                 | `kysely`                              |
| `@comity/graphql-client-fetch`  | `@comity/graphql-client`      | Fetch API                             |
| `@comity/http-fetch`            | `@comity/http`                | Fetch API                             |
| `@comity/validation-zod`        | `@comity/validation`          | `zod` (peer)                          |
| `@comity/cli-commander`         | `@comity/cli`                 | `commander` (peer)                    |
| `@comity/acl-casl`              | `@comity/acl`                 | `@casl/ability` (peer)                |
| `@comity/graphql-client-ws`     | `@comity/graphql-client`      | `graphql-ws` (peer)                   |

---

## Workspace Configuration

### pnpm Workspace

File: [pnpm-workspace.yaml](../../pnpm-workspace.yaml)

```yaml
packages:
  - "examples/**"
  - "packages/**"
```

Package manager: **pnpm@10.13.1** (enforced via `preinstall` script)

### Dependencies

**Root devDependencies:**

| Tool                        | Version | Purpose                                |
| --------------------------- | ------- | -------------------------------------- |
| `turbo`                     | ^2.10.7 | Monorepo build orchestrator            |
| `vitest`                    | ^4.1.10 | Test runner                            |
| `@vitest/coverage-v8`       | ^4.1.10 | Coverage reporter                      |
| `typescript`                | ^5.9.3  | Type system (also in `pnpm.overrides`) |
| `eslint`                    | ^9.39.5 | Linter                                 |
| `@typescript-eslint/parser` | ^8.65.0 | TS parser for ESLint                   |
| `@changesets/cli`           | ^2.31.1 | Versioning                             |
| `prettier`                  | ^3.9.6  | Formatter                              |

**pnpm overrides:**

- `typescript` pinned to `^5.9.3`

**Peer dependency exceptions** (ignored missing):

- `react`, `vue`, `solid-js` — optional renderer frameworks

---

## Toolchain Reference

### Turborepo Pipeline

File: [turbo.json](../../turbo.json)

| Task    | Depends On | Cached          | Outputs             |
| ------- | ---------- | --------------- | ------------------- |
| `build` | `^build`   | Yes             | `dist/**`           |
| `dev`   | —          | No (persistent) | —                   |
| `test`  | `build`    | No              | —                   |
| `clean` | —          | No              | `dist/**`, `.turbo` |

**Build inputs tracked for cache**: `src/**/*.ts`, `src/**/*.tsx`, `tsconfig.json`, `package.json`

**Excluded from build**: none

### TypeScript Configuration

File: `tsconfig.json`

| Option                               | Value                |
| ------------------------------------ | -------------------- |
| Module system                        | `es2022`             |
| Module resolution                    | `bundler`            |
| Target                               | `es2022`             |
| Strict mode                          | `true`               |
| `noUncheckedIndexedAccess`           | `true`               |
| `exactOptionalPropertyTypes`         | `true`               |
| `noPropertyAccessFromIndexSignature` | `true`               |
| Declaration emit                     | Off (`noEmit: true`) |
| Incremental                          | Off (`false`)        |

### Vitest Configuration

File: `vitest.config.ts`

| Option              | Value                                                      |
| ------------------- | ---------------------------------------------------------- |
| Mode                | Workspace projects: `packages/*/vitest.config.{ts,js,mjs}` |
| Environment         | `node`                                                     |
| Globals             | `true`                                                     |
| Timeout             | 10,000ms                                                   |
| Coverage provider   | `v8`                                                       |
| Coverage format     | text, json, html, lcov                                     |
| Coverage thresholds | **80%** lines, functions, branches, statements             |

### ESLint Layered Rules

File: `eslint.config.js`

**Base** (all `*.ts`):

- `no-explicit-any`: error
- `consistent-type-imports`: prefer `type-imports`
- JSDoc requirements: `@description`, `@param`, `@returns`

**Domain** (`domain/**`):

- Forbids `throw` statements — must use `Result<T, E>`
- Forbids `Date`, `performance`, `Math.random`
- Forbids `throw-literal`

**Core** (`core/**`):

- Same restrictions as domain

**Adapters** (`adapters/`):

- Permissive JSDoc (arrow functions exempt)
- `no-throw-literal` enforced
- No determinism restrictions

### Prettier Configuration

File: `prettier.config.js`

| Option         | Value    |
| -------------- | -------- |
| Print width    | 100      |
| Tab width      | 2        |
| Quotes         | Double   |
| Semicolons     | `true`   |
| Trailing comma | `es5`    |
| Arrow parens   | `always` |

---

## Standard Package Structure

```
packages/<name>/
├── src/
│   ├── contracts/      # Interfaces (Core Modules only)
│   ├── error/           # Custom error types
│   │   └── __tests__/   # Error-specific tests
│   ├── hooks/           # Lifecycle hooks
│   ├── internal/        # Package-internal code (never exported)
│   │   └── __tests__/
│   ├── setup/           # Constants, types, configuration
│   │   └── __tests__/
│   ├── __tests__/       # Root-level tests
│   └── index.ts         # Public API barrel
├── docs/
│   ├── overview.md       # Package description and API
│   ├── conventions.md    # Package-specific conventions
│   └── architecture.md   # Architecture decisions (optional)
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── LICENSE
└── README.md
```

Each package has its own `package.json` with:

- **Dual ESM/CJS exports** — `import` and `require` conditions
- **DTS types** — `types` property and `typesVersions`
- **Subpath exports** — matching physical folders (e.g., `"./error"`, `"./setup"`)

---

## Key Configuration Files

| File                  | Purpose                                                |
| --------------------- | ------------------------------------------------------ |
| `package.json`        | Root scripts, workspaces, devDependencies, pnpm config |
| `pnpm-workspace.yaml` | Workspace paths (`examples/**`, `packages/**`)         |
| `turbo.json`          | Turborepo task pipeline                                |
| `tsconfig.json`       | Base TypeScript config                                 |
| `eslint.config.js`    | Layered ESLint rules (base, domain, core, adapters)    |
| `prettier.config.js`  | Code formatting                                        |
| `vitest.config.ts`    | Root test config (workspace projects mode)             |
| `AGENTS.md`           | AI agent instructions for the codebase                 |
| `SKILL.md`            | Framework overview, conventions, decision process      |
| `.npmrc`              | Package manager flags                                  |
