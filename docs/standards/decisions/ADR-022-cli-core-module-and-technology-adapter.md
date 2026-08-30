# ADR-022 — CLI Core Module and Technology Adapter Architecture

**Status:** Accepted

## Context

Comity historically had an `@comity/cli` package that was removed because it violated the adapter architecture by directly depending on Commander.js. The old implementation embedded Commander, process/runtime concerns, and the executable entry point in a single package, coupling the CLI abstraction to a specific technology.

The objective is to reintroduce CLI capability following Comity's strict layering model:

```
Application
    ↓
Adapters
    ↓
Core Modules
    ↓
Kernel / Primitives
```

Where:

- `@comity/cli` defines the CLI abstraction as a Core Module
- `@comity/cli-commander` binds that abstraction to Commander.js as a Technology Adapter
- The Application layer owns the executable/bin entry point

## Decision

### Package Classification

| Package | Category | Binds |
|---------|----------|-------|
| `@comity/cli` | **Core Module** | — |
| `@comity/cli-commander` | **Technology Adapter** | One Core Module (`@comity/cli`) to one interchangeable technology (Commander.js) |

### Dependency Rules

```
Application
    ↓
@comity/cli-commander (Technology Adapter)
    peerDependencies: @comity/cli, commander
    ↓
@comity/cli (Core Module)
    dependencies: @comity/primitives
    ↓
@comity/primitives (Kernel / Primitives)
```

**Forbidden Dependencies:**

- `@comity/cli` MUST NOT import: `commander`, `node:*` (process, fs, path, console, etc.), `@comity/cli-commander`, Application code
- `@comity/cli-commander` MUST NOT import: Application code, other Adapters

### ESM-First Source with Dual ESM/CJS Distribution

Both packages are **ESM-first source** (`"type": "module"`) with **dual ESM/CJS distribution** (`exports.import` / `exports.require`). This is justified because:

1. Node 24+ executes ESM binaries natively via `#!/usr/bin/env node`
2. Commander v14+ provides full ESM support with `exports.import`
3. TypeScript 5.9.3 with `moduleResolution: bundler` compiles the architecture correctly
4. Neither Core nor Adapter requires CommonJS at the architecture level

This decision is **independent of the repository-wide CJS compatibility contract**. The existing 47 packages' dual ESM/CJS distribution (`exports.require`) remains unaffected.

### Historical Migration

The previous `@comity/cli` (removed in commit 451fefa "Reset", 2026-01-23) provided useful requirements that are retained:

**Retained/Refined:**

- Command registration and execution
- Plugin system with commands and hooks
- Hook system (`beforeCommand`, `afterCommand`)
- Async command support
- Configuration abstraction (`CliConfig`, `defineConfig`)
- Type-safe option definitions

**Discarded (architectural violations):**

- Commander.js dependency from Core
- `process.argv`, `process.exit()`, `process.cwd()` from Core
- Console/stdout/stderr handling from Core
- Hardcoded config file discovery in Core
- Concrete logger implementation (pino) in Core
- `bin` entry point from Core package
- Shebang in Core package

### Core Module Contract

`@comity/cli` exports a minimal abstraction:

- `CliCommand` — command definition (name, description, action, options)
- `CliOption` — option metadata (flags, description, default)
- `CliCommandArgs` — opaque parsed arguments (`Record<string, unknown>`)
- `CliCommandContext` — injected context (config, logger)
- `CliHook` / `HookContext` — lifecycle hooks
- `CliPlugin` — extensibility unit (name, version, commands, hooks)
- `CliConfig` — configuration shape
- `CliConfigLoader` — interface only (implementation in Adapter)
- `Logger` — minimal interface (info, error, debug)
- `CliContext` — canonical implementation for registration/execution
- `defineConfig` — type-safe configuration helper

### Technology Adapter Contract

`@comity/cli-commander` provides:

- `createCommanderAdapter(context, options)` → `{ run(argv) }`
- Maps `CliCommand` to Commander command tree
- Handles argv parsing, option/flag mapping, help, version
- Executes hooks around command actions
- Maps errors to exit codes (0=success, 1=error, 2=usage)
- Implements filesystem config loader (`CliConfigLoader`)
- Owns all Commander, process, filesystem, and console concerns

### Bin/Executable Ownership

The **Application layer** owns the `bin` entry point:

```json
// Application package.json
{
  "type": "module",
  "bin": { "comity": "./dist/bin/cli.js" }
}
```

The bin file is a thin ESM entry point:

```js
#!/usr/bin/env node
import { CliContext } from "@comity/cli";
import { createCommanderAdapter } from "@comity/cli-commander";

const context = new CliContext(config);
const adapter = createCommanderAdapter({ name: "comity", version, context });
await adapter.run();
```

## Consequences

**Positive:**

- Strict layering preserved: Core = abstraction, Adapter = implementation
- Commander is replaceable without touching Core or Application
- ESM-first: the CLI architecture does not require CJS; dual ESM/CJS distribution is provided per repository convention
- Testable: Core logic testable without Commander; Adapter testable via `program.parseAsync(argv, { from: "user" })`
- Follows existing Comity patterns (e.g., `@comity/http` + `@comity/http-hono`)

**Negative/Trade-offs:**

- New package category requires ADR and standards updates
- ESM-first source with dual ESM/CJS distribution is consistent with the repository dual-package convention
- Application must provide bin entry point (slight additional setup)

## References

- `docs/standards/layering-policy.md` — Layering model
- `docs/standards/adapters.md` — Adapter responsibilities
- `docs/standards/public-api.md` — Package classification
- `docs/standards/decisions/ADR-007-multi-context-adapter-architecture.md` — Technology vs Integration Adapter distinction
- `docs/standards/decisions/ADR-008-explicit-core-module-composition-exceptions.md` — Core Module dependency rules

## Scope

This ADR covers the architectural decision for the CLI packages. Implementation details are tracked in the respective package documentation.