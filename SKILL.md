# SKILL.md — Comity Framework

## Purpose

Comity is an enterprise-grade, modular TypeScript framework built around strict architectural layering. The monorepo contains 36 packages organized by architectural responsibility.

The primary goal is long-term maintainability through:

- **Explicit boundaries** — every piece of code belongs to a single architectural layer
- **Replaceable infrastructure** — any adapter can be swapped without touching business logic
- **Strong contracts** — Core Modules define stable interfaces; Adapters implement them
- **Composition over inheritance** — objects are assembled through small composable units
- **Framework independence** — Core Modules never import framework-specific types

Every change must reinforce these principles rather than simply implementing features.

---

## Architecture

### Layering Model

Dependencies flow **only downward**. Reverse dependencies are architectural defects.

```
Application
      ↓
Adapters
      ↓
Core Modules
      ↓
Kernel / Primitives
```

### Layer Responsibilities

| Layer | Responsibility | Key Rule |
|-------|---------------|----------|
| **Primitives** | Foundational types, `Result`, DI container, error base class | No runtime state, no infrastructure, no business logic |
| **Kernel** | Module lifecycle, service registration, event dispatching, hooks | No HTTP, no Router, no HTML, no infrastructure |
| **Core Modules** | Business abstractions. Define contracts (interfaces), never implementations | Must not depend on Adapters or Application |
| **Adapters** | Integrate external technologies (Hono, React, Kysely, Preact, Jose, etc.) | Depend on one Core Module + external library. Must remain replaceable |
| **Application** | Configuration, routing, presenters, business orchestration | May depend on every lower layer |

### Package Identification

| Type | Dependencies | Has external lib? | Has `contracts/` folder? |
|------|-------------|-------------------|--------------------------|
| Core Module | Only `@comity/*` (primitives, kernel, other cores) | No | Yes |
| Adapter | Core Module(s) + external library (peerDependency) | Yes | Rarely |
| Kernel/Primitives | Nothing or only `@comity/primitives` | No | Sometimes |

### Key Design Principles

- **Contracts vs Implementations** — `CategoryRepository` lives in Core; `MagentoGraphqlCategoryRepository` lives in an Adapter
- **Repositories return domain models** — never view models, page models, React components, or HTML
- **Renderers consume PageModels** — never query repositories themselves
- **Lazy registration** — prefer `ctx.services.define(TOKEN, () => impl)` over eager construction
- **Configuration precedence** — `defaults → user options → configuring hook`; never modify config after initialization

For a complete list of all 36 packages with descriptions, see `docs/architecture/repository.md`.

---

## Conventions

### Folder Naming

| Element | Form | Example |
|---------|------|---------|
| Errors | Singular | `src/error/` |
| Contracts | Plural | `src/contracts/` |
| Hooks | Plural | `src/hooks/` |
| Setup | Singular | `src/setup/` |

### Folder Structure (Standard Package)

```
packages/<name>/
├── src/
│   ├── contracts/      # Interfaces (Core Modules only)
│   ├── error/           # Custom error types
│   ├── hooks/           # Lifecycle hooks (Core Modules only)
│   ├── setup/           # Constants, types, configuration
│   ├── internal/        # Package-internal code (never exported in package.json)
│   ├── __tests__/       # Co-located tests
│   └── index.ts         # Public API barrel export
├── docs/
│   ├── overview.md       # High-level description and API
│   └── conventions.md    # Package-specific conventions
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── README.md
```

### Code Style

**Prefer**: immutable data, pure functions, dependency injection, small interfaces, explicit contracts.
**Avoid**: static state, hidden globals, service locators outside composition, unnecessary inheritance, framework-specific types in Core Modules.

ESLint enforces layered rules (see `docs/architecture/repository.md` for details).

### Documentation

Every package MUST document its public API with JSDoc. ESLint requires `@description` on public declarations, `@param` and `@returns` on functions.

---

## Workflow

### Development Commands

| Command | Purpose |
|---------|---------|
| `pnpm install` | Install dependencies (pnpm only, enforced via preinstall) |
| `pnpm dev` | Watch mode across all packages |
| `pnpm build` | Full build via Turborepo (excludes draft packages) |
| `pnpm build:single @comity/http` | Build a single package and its deps |
| `pnpm type-check` | TypeScript type checking across all packages |
| `pnpm test` | Run all tests (Vitest workspace mode) |
| `pnpm test:watch` | Watch mode for tests |
| `pnpm test:coverage` | Run tests with 80% minimum coverage |
| `pnpm changeset` | Create a versioning changeset |

### Build Pipeline

Turborepo (`turbo.json`) coordinates builds:
- `build` tasks depends on `^build` (build dependencies first)
- Cache enabled for builds, tracked by `src/**/*.ts` + `tsconfig.json` + `package.json`
- Output: `dist/` with dual ESM/CJS bundles

### Testing

Vitest workspace mode: each package declares its own `vitest.config.ts`. Root config sets:
- Environment: `node`
- Coverage thresholds: **80%** (lines, functions, branches, statements)
- Timeout: 10s

### Key Patterns

**Error Handling** — Never throw in Core Modules or domain code. Always use `Result<T, E>` from `@comity/primitives`:

```typescript
// Success
const result = Result.success({ userId: "123" });
// Failure
const result = Result.failure(new AuthError("session-expired"));
```

**Dependency Injection** — Use tokens and lazy registration:

```typescript
const TOKEN = createToken<MyRepository>("@comity/catalog/my-repo");
ctx.services.define(TOKEN, () => new Implementation());
```

**Lifecycle Hooks** — `@comity/module:configuring` (modify config), `@comity/module:initialized` (signals ready).

---

## Decision Process

### When Making a Change

Follow this sequence:

1. **Identify the owning package** — which existing package is responsible for this concern? If unsure, consult `docs/architecture/repository.md`.
2. **Verify the architectural layer** — does this change belong in the Core Module, Adapter, or Application?
3. **Reuse existing abstractions** — is there already a contract, type, or utility that handles this? Do not create duplicates.
4. **Prefer extending contracts over creating parallel APIs** — enlarge existing interfaces rather than introducing new ones.
5. **Avoid introducing new dependencies** — every new dependency is a coupling point. Justify it.
6. **Preserve public API compatibility** — existing subpath exports, function signatures, and type names should remain stable unless explicitly requested.
7. **Keep documentation aligned with implementation** — if you change a contract, update its JSDoc and the package's `docs/overview.md`.

### Never

- **Move responsibilities between packages** without explicit request — each package owns its domain
- **Introduce new architectural layers** — the 5-layer model is the framework
- **Rename public exports** — even if it seems redundant, it breaks downstream consumers
- **Change dependency direction** — an Adapter should never import a Core Module
- **Create new abstractions unless existing ones are insufficient** — an abstraction do not need to exist for its own sake

---

## Contributing

### New Package Checklist

1. Create `packages/<name>/src/index.ts`
2. Add standard folders: `contracts/` (Core only) or `error/`, `setup/`, `hooks/` as appropriate
3. Create `package.json` with workspace dependencies
4. Add `tsconfig.json`, `vitest.config.ts`, `README.md`, `LICENSE`
5. Create `docs/overview.md` and `docs/conventions.md`
6. Register in `pnpm-workspace.yaml` under `packages/`

### Pull Request Checklist

- [ ] **Layering respected** — dependencies flow down, no reverse imports
- [ ] **Contracts stable** — no breaking changes to existing contract types
- [ ] **Public API mapped** — `package.json` subpath exports mirror physical folders
- [ ] **Folder naming correct** — `error/` not `errors/`, `contracts/` not `contract/`, etc.
- [ ] **No framework types leaked into Core Modules** — Core Modules are framework-independent
- [ ] **Internal/ not exported** — nothing in `src/internal/` appears in `package.json` exports
- [ ] **Tests cover behavior** — coverage maintained above 80%
- [ ] **Documentation updated** — JSDoc on public methods, `docs/` folder updated
- [ ] **No throw in domain/core** — use `Result<T, E>` for all failures
- [ ] **No secrets commited** — `.npmrc`, `.env`, credentials excluded

---

## Do / Don't

| Do | Don't |
|----|------|
| Start from "who owns this responsibility?" | Start from "where can I put this?" |
| Define contracts in Core Modules | Put implementations in Core Modules |
| Expose only the minimum public API | Create convenience short cuts that leak implementation |
| Register services lazily | Construct eagerly |
| Use `Result<T, E>` for failures | Throw for business logic |
| Preserve folder naming conventions | Use singular for `contracts/` or plural for `error/` |
| Align exports with physical folders | Export subpaths for non-existent directories |
| Justify every abstraction | Create abstraction "just in case" |