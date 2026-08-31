# ADR-025 — Execution Context Composition via Application-Owned Wiring

- **Status:** Accepted / Implemented
- **Date:** 2026-08-31
- **Supersedes:** ADR-024, ADR-023
- **Decision:** Adopt
- **Scope:** Composition, CLI, HTTP, Application Layer

---

# 1. Context

Comity supports multiple execution contexts (CLI, HTTP, future: GraphQL, Workers, RPC). These contexts share a single application composition:

- dependency injection
- domain services
- repositories
- EventBus
- HookBus
- module lifecycle

Each execution context also has its own runtime concerns:

- CLI: command registration and execution
- HTTP: route handling and server lifecycle
- future contexts: their own registration and execution semantics

Previous proposals (ADR-023, ADR-024) attempted to solve context participation through:

- generic contribution mechanisms (`ctx.contribute()`, `ContributionToken`, `ContributionStore`, `Scope`)
- typed registration facades injected into `ModuleSetupContext` via `contextFactories`

Architectural review determined that **both approaches violate the layering policy**:

- `contextFactories` forces Composition to know execution context types
- injected facades (`ctx.cli`, `ctx.http`) couple modules to execution contexts via API surface
- `HttpExecutionFacade` duplicates the existing `HttpFacade` shared service
- `RouteRegistry` contradicts the current HTTP composition-driven architecture

The review also identified an additional boundary violation in the original ADR-025 proposal: passing the entire `Kernel` to module-level execution-context registration methods would bypass the controlled `ModuleSetupContext` API and expose lifecycle-sensitive runtime infrastructure to modules.

ADR-025 therefore establishes explicit Application-owned wiring while keeping the Kernel and Composition boundaries intact.

---

# 2. Problem Statement

**How can modules optionally participate in execution contexts without:**

1. Importing execution-context Core Modules unnecessarily?
2. Making Composition transport-aware?
3. Introducing generic contribution infrastructure?
4. Creating duplicate or conflicting HTTP abstractions?
5. Violating the single-Kernel architecture?
6. Exposing the entire Kernel to module capability registration?
7. Bypassing the controlled `ModuleSetupContext` lifecycle boundary?

---

# 3. Decision

Comity adopts **Application-Owned Explicit Wiring** for execution context composition.

The architecture is:

```text
modules.ts
    │
    └── compose(kernel, modules)    ← single, transport-agnostic
             │
             ▼
          Kernel
       /     |     \
      /      |      \
   CLI     HTTP    (future contexts)
    │        │
    ▼        ▼
registry   HttpFacade (existing)
    │        │
    ▼        ▼
execution  adapter
facade
```

### Core Principles

| Principle                                         | Enforcement                                                                                          |
| ------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| **Composition is transport-agnostic**             | Zero imports/references to `@comity/cli`, `@comity/http`, or other execution-context Core Modules    |
| **Single Kernel**                                 | One `Kernel` per application module graph and process                                                |
| **No generic contribution mechanism**             | No `ctx.contribute()`, `ContributionToken`, `ContributionStore`, `Scope`                             |
| **No child DI containers**                        | Shared Kernel DI only                                                                                |
| **Application owns context wiring**               | `cli.ts`, `http.ts`, and future Application entrypoints explicitly compose contexts                  |
| **Module setup remains context-neutral**          | `ModuleSetupContext` exposes only shared services, events, and hooks                                 |
| **Execution capability registration is explicit** | Application invokes optional module capabilities directly                                            |
| **No Kernel leakage into module registration**    | Module capability registration receives only the context-specific registry required for registration |
| **HTTP uses existing pattern**                    | `HttpFacade` remains the HTTP execution capability                                                   |
| **Single-Kernel execution**                       | Concurrent contexts in the same process share the same Kernel instance                               |

---

# 4. Detailed Architecture

## 4.1 Shared Composition (`modules.ts`)

```typescript
// modules.ts — Application layer
import { createKernel } from "@comity/kernel";
import { compose } from "@comity/composition";
import { databaseModule, ordersModule, usersModule, catalogModule } from "./modules";

export async function createApplication() {
  const kernel = createKernel(config);

  await compose(kernel, [
    databaseModule,
    ordersModule,
    usersModule,
    catalogModule,
    // ... other modules
  ]);

  return kernel;
}
```

**Composition responsibilities (only):**

- module dependency resolution
- topological ordering
- executing `ModuleMeta.setup(ctx, options)` for each module
- shared service registration (`ctx.services.define()`)
- shared event subscription (`ctx.events.subscribe()`)
- shared hook definition (`ctx.hooks.define()`)
- Kernel lifecycle: `open → CONFIGURE → SEAL → INITIALIZE → START → RUNNING`

**Composition does NOT:**

- know about CLI, HTTP, or any execution context
- create or inject registration facades
- maintain context-specific registries
- execute context-specific startup
- invoke module execution-context capabilities

### Composition Invariant

`@comity/composition` MUST NOT import, reference, or structurally depend on:

- `@comity/cli`
- `@comity/http`
- any other execution-context Core Module

Composition may use Kernel and Composition contracts, but execution-context knowledge belongs exclusively to the Application Layer and the corresponding Core Modules/Adapters.

---

## 4.2 Module Setup Contract (Unchanged)

```typescript
// @comity/composition/src/setup/types.ts
export interface ModuleSetupContext<
  Services extends Record<PropertyKey, unknown> = {},
  Events extends Record<string, unknown> = {},
  Hooks extends Record<string, unknown> = {},
> {
  readonly services: DiContainer<Services>;
  readonly events: EventBus<Events>;
  readonly hooks: HookBus<Hooks>;
}
```

**No `cli`, `http`, or context-specific properties.**

Modules register only shared services, events, and hooks during setup.

The `ModuleSetupContext` remains the controlled API through which modules participate in Kernel composition. Modules MUST NOT receive the raw Kernel as part of `ModuleMeta.setup()` or execution-context registration.

---

## 4.3 Optional Module CLI Capability

Modules **may** expose an optional CLI registration method.

This capability is deliberately different from `ModuleMeta.setup()`:

```typescript
export const ordersModule = {
  name: "@comity/orders",
  version: "1.0.0",

  setup(ctx) {
    ctx.services.define("orderService", () => new OrderService());

    return success(async () => {
      // initialization
    });
  },

  // OPTIONAL: CLI command registration.
  // Called explicitly by the Application if CLI is enabled.
  registerCliCommands(registry) {
    registry.registerCommand({
      name: "orders:list",
      description: "List orders",
      action: async (args, context) => {
        const orders = await context.services.resolve("orderService").list();

        console.table(orders);
      },
    });
  },
};
```

### Key properties

- `registerCliCommands()` is **not** part of `ModuleMeta`.
- Composition does not discover or invoke it.
- The Application invokes it explicitly.
- The module receives the **CLI registry only**.
- The module MUST NOT receive the Kernel.
- Command execution receives its `CliCommandContext` from the CLI execution layer.
- The registration method is executed before command execution.
- Registration is not a substitute for `ModuleSetupContext`.
- The capability is optional; a module without CLI support simply does not expose it.

### Module CLI Type Dependency

A module that exposes `registerCliCommands()` and wants full static typing for CLI contracts MAY explicitly import the relevant contracts from `@comity/cli`.

This is an **explicit, allowed optional capability dependency**, not a dependency required by the module's domain setup.

Therefore the architecture distinguishes:

**Pure domain module:**

```text
@comity/orders
    ↓
@comity/primitives
@comity/kernel
@comity/composition
```

**Domain module with CLI capability:**

```text
@comity/orders
    ↓
@comity/cli          ← optional capability dependency
```

The `@comity/cli` dependency is permitted only for modules that intentionally expose CLI capabilities. It MUST NOT be required merely to use the module's domain services.

The preferred implementation is to import the official CLI contracts rather than duplicate them locally.

This preserves type safety and avoids contract drift.

### HTTP Capability

Modules MUST NOT expose a generic `registerHttpRoutes()` capability under this ADR.

HTTP currently uses the existing hook-based configuration architecture described in §8. If a future HTTP route-registry architecture is desired, it MUST be introduced through a separate ADR.

---

# 5. Dependency Rules

The dependency graph MUST follow the layering policy.

For clarity, all graphs in this ADR use:

> **`A → B` means "A depends on B".**

Therefore:

```text
Application
    ↓
Adapters
    ↓
Core Modules
    ↓
Composition
    ↓
Kernel
    ↓
Primitives
```

### Formal package dependencies

```text
Application
    ↓
Technology Adapters
    ↓
Core Modules
    ↓
@comity/composition
    ↓
@comity/kernel
    ↓
@comity/primitives
```

The important dependency relationship is:

```text
@comity/composition → @comity/kernel
Core Modules       → @comity/composition
```

Kernel does **not** depend on Composition.

### Execution Context Specific

```text
@comity/cli-commander → @comity/cli
@comity/cli            → @comity/composition
@comity/http-hono     → @comity/http
@comity/http          → @comity/composition
```

Both `@comity/cli` and `@comity/http` ultimately depend on the shared Kernel through Composition.

### Forbidden

| Forbidden Dependency                                      | Reason                                     |
| --------------------------------------------------------- | ------------------------------------------ |
| `@comity/composition` → `@comity/cli`                     | Composition must remain transport-agnostic |
| `@comity/composition` → `@comity/http`                    | Same                                       |
| `@comity/composition` → any execution-context Core Module | Same                                       |
| `@comity/kernel` → `@comity/composition`                  | Kernel must remain foundational            |
| `@comity/kernel` → `@comity/cli`                          | Kernel must remain transport-agnostic      |
| `@comity/kernel` → `@comity/http`                         | Same                                       |
| Domain Module → `@comity/cli` without CLI capability      | Unnecessary context coupling               |
| Domain Module → `@comity/http` without HTTP capability    | Unnecessary context coupling               |
| Adapter → Application business logic                      | Layering violation                         |
| Module capability registration → raw `Kernel`             | Kernel lifecycle boundary violation        |

### Composition Hard Invariant

The following is normative:

> `@comity/composition` MUST have zero imports, references, or structural dependencies on `@comity/cli`, `@comity/http`, or any other execution-context Core Module.

This rule is enforceable through package dependency checks and architecture validation.

---

# 6. Composition Responsibilities

| Responsibility                           | Owner                                                     |
| ---------------------------------------- | --------------------------------------------------------- |
| Module dependency resolution             | `@comity/composition`                                     |
| Module ordering (topological + priority) | `@comity/composition`                                     |
| Conflict detection                       | `@comity/composition`                                     |
| `ModuleMeta.setup()` execution           | `@comity/composition`                                     |
| Shared service registration              | Module → `ctx.services.define()`                          |
| Shared event subscription                | Module → `ctx.events.subscribe()`                         |
| Shared hook definition                   | Module → `ctx.hooks.define()`                             |
| Kernel sealing                           | `@comity/composition` → `kernel.seal()`                   |
| Kernel initialization                    | `@comity/composition` → `kernel.start()`                  |
| Context registry creation                | **Application (`cli.ts`, `http.ts`, future entrypoints)** |
| Context registration invocation          | **Application**                                           |
| Execution facade creation                | **Application**                                           |
| Adapter instantiation                    | **Application**                                           |
| Context-specific startup                 | **Application**                                           |

The Application owns the composition of execution contexts because execution contexts are runtime concerns rather than module-composition concerns.

---

# 7. CLI Integration

## 7.1 Architecture

```text
cli.ts
    │
    ├── CommandRegistry (created by Application)
    │
    ├── for each selected module:
    │       module.registerCliCommands?.(registry)
    │
    ├── createAppContext(kernel)
    │
    ├── CliExecutionFacade(registry, hooks, events, appContext)
    │
    └── createCommanderAdapter(cliFacade) → Commander
```

The Kernel is **not passed to `registerCliCommands()`**.

The module only receives the registry required to define commands. Kernel services are accessed by command actions through the `CliCommandContext` supplied at execution time.

---

## 7.2 Components

| Component                                                        | Package                 | Responsibility                                     |
| ---------------------------------------------------------------- | ----------------------- | -------------------------------------------------- |
| `CliCommand`, `CliOption`, `CliCommandArgs`, `CliCommandContext` | `@comity/cli`           | Contracts                                          |
| `CliRegistrationFacade`                                          | `@comity/cli`           | Typed registration interface                       |
| `CommandRegistry`                                                | `@comity/cli`           | Stores commands, validates uniqueness              |
| `CliExecutionFacade`                                             | `@comity/cli`           | Executes commands using CLI lifecycle hooks/events |
| `createCommanderAdapter`                                         | `@comity/cli-commander` | Maps `CliExecutionFacade` to Commander             |

### Public API Status

`CliKernel` currently exists as an internal implementation.

ADR-025 changes this by:

1. renaming the internal implementation to `CliExecutionFacade`;
2. exporting `CliExecutionFacade` from the public `@comity/cli` API;
3. adding `CommandRegistry` to the public `@comity/cli` exports.

This is therefore a **new public API**, not a rename of an existing public API.

---

## 7.3 CliExecutionFacade

```typescript
// @comity/cli — public API
export class CliExecutionFacade<Context = {}> {
  constructor(
    private readonly registry: CommandRegistry<Context>,
    private readonly hooks: HookBus<CliLifecycle<Context>>,
    private readonly events: EventBus<CliEvents>,
    private readonly context: Context
  ) {}

  async execute(name: string, args: CliCommandArgs): Promise<Result<void, CliError>> {
    // 1. Run beforeCommand hooks
    // 2. Execute command action
    // 3. Run afterCommand hooks
    // 4. Emit events
  }

  commands(): readonly CliCommand<Context>[] {
    return this.registry.all();
  }
}
```

### HookBus and EventBus Typing

`CliExecutionFacade` operates on CLI-specific lifecycle contracts:

```typescript
HookBus<CliLifecycle<Context>>;
EventBus<CliEvents>;
```

The Application owns the integration between these CLI-specific contracts and the shared Kernel buses.

The Application MUST provide typed views of the shared buses when constructing `CliExecutionFacade`:

```typescript
const cliHooks = kernel.hooks as HookBus<CliLifecycle<AppContext>>;

const cliEvents = kernel.events as EventBus<CliEvents>;

const cli = new CliExecutionFacade(registry, cliHooks, cliEvents, appContext);
```

These assertions are an **Application-level boundary adaptation**. They MUST NOT be performed inside `@comity/composition` or by modules.

The alternative implementation may use a CLI-specific adapter around the shared buses if the implementation later provides one. Such an adapter does not alter this ADR's architectural decision: the Kernel remains the owner of the actual shared buses.

---

## 7.4 CLI Wiring (`cli.ts`)

```typescript
// cli.ts — Application layer
import { createApplication } from "./modules.js";
import { CommandRegistry, CliExecutionFacade } from "@comity/cli";
import { createCommanderAdapter } from "@comity/cli-commander";

async function main() {
  const kernel = await createApplication();

  const registry = new CommandRegistry<AppContext>();

  // Explicitly invoke module CLI capabilities.
  for (const module of [ordersModule, usersModule, catalogModule]) {
    module.registerCliCommands?.(registry);
  }

  const appContext = createAppContext(kernel);

  const cliHooks = kernel.hooks as HookBus<CliLifecycle<AppContext>>;

  const cliEvents = kernel.events as EventBus<CliEvents>;

  const cli = new CliExecutionFacade(registry, cliHooks, cliEvents, appContext);

  const adapter = createCommanderAdapter({
    cli,
    name: "myapp",
    version,
  });

  await adapter.run(process.argv.slice(2));

  await kernel.stop();
}

main();
```

### `createAppContext(kernel)`

The Application defines the execution context supplied to command actions.

The minimal contract is:

```typescript
interface AppContext {
  services: {
    resolve<T>(token: PropertyKey): T;
  };
}

function createAppContext(kernel: Kernel): AppContext {
  return {
    services: {
      resolve: kernel.services.resolve.bind(kernel.services),
    },
  };
}
```

The actual Application may expose additional runtime-safe values such as:

- configuration
- logger
- request metadata
- command metadata

but the context MUST NOT expose lifecycle mutation operations.

In particular, command execution context MUST NOT expose:

- `kernel.seal()`
- `kernel.start()`
- `kernel.stop()`
- service-definition operations
- arbitrary lifecycle mutation

The purpose of `AppContext` is execution, not composition.

### Registration vs Execution

The distinction is normative:

```text
CONFIGURE
    │
    └── ModuleSetupContext
            └── define shared services/events/hooks

SEAL / INITIALIZE / START
    │
    └── Kernel lifecycle

RUNNING
    │
    ├── Application creates CommandRegistry
    │
    ├── Application invokes registerCliCommands(registry)
    │
    └── Command actions receive AppContext at execution time
```

A module therefore never needs the raw Kernel merely to register a command.

---

# 8. HTTP Integration

## 8.1 Architecture (Aligns with Current Implementation)

```text
http.ts
    │
    ├── HttpModuleOptions (middleware, handler)
    │         ↓
    │   @comity/http:configuring hook
    │
    ├── HttpFacade registered in Kernel DI (HTTP_TOKEN)
    │         │
    │         ├── wraps composed HttpHandler (middleware chain)
    │         ├── delegates to Kernel EventBus via HttpObserver
    │         └── IS the HTTP execution capability
    │
    └── createHonoAdapter(kernel.services.resolve(HTTP_TOKEN)) → Hono
```

---

## 8.2 Current HTTP Pattern (Preserved)

**Module setup (`@comity/http/src/setup/composition.ts`):**

```typescript
setup: async (ctx, options) => {
  // 1. Define HttpFacade as shared service (lazy)
  ctx.services.define(HTTP_TOKEN, () => facade!);

  return success(async () => {
    // 2. Configure via hook
    const cfg = await ctx.hooks.execute("@comity/http:configuring", options);

    // 3. Build handler (middleware chain + final handler)
    const httpHandler = createHttpHandler(cfg.middleware, cfg.handler);

    // 4. Create facade with observer
    facade = new HttpFacade(httpHandler, observer);

    // 5. Initialize
    await ctx.hooks.execute("@comity/http:initialized", undefined);
  });
};
```

**Application HTTP module provides configuration:**

```typescript
// http.ts — Application layer
import { createApplication } from "./modules.js";
import { HTTP_TOKEN } from "@comity/http";
import { createHonoAdapter } from "@comity/http-hono";

async function main() {
  const kernel = await createApplication();

  const httpFacade = kernel.services.resolve(HTTP_TOKEN);

  const adapter = createHonoAdapter({
    facade: httpFacade,
  });

  await adapter.start({ port: 3000 });

  process.on("SIGINT", async () => {
    await adapter.stop();
    await kernel.stop();
  });
}
```

The HTTP Core remains unchanged by this ADR.

---

## 8.3 No `HttpExecutionFacade`, No `RouteRegistry`

The existing `HttpFacade` **is** the HTTP execution capability.

It:

- wraps the composed request handler
- emits lifecycle events via Kernel EventBus
- is resolved by the adapter from shared Kernel DI
- handles requests via:

```typescript
handle(
  ctx: HttpContext
): Promise<HttpResponse>
```

No additional execution facade layer is introduced.

No `RouteRegistry` is introduced.

---

## 8.4 HTTP Module Participation

The current HTTP architecture uses **Application-level configuration** through the `@comity/http:configuring` hook.

Modules that need to participate in HTTP composition do so through the existing hook mechanism:

```typescript
setup(ctx) {
  ctx.hooks.define(
    "@comity/http:configuring",
    (options) => {
      return {
        ...options,
        middleware: [
          ...(options.middleware ?? []),
          myMiddleware
        ],
        handler:
          options.handler ?? myFallbackHandler
      };
    }
  );
}
```

This is the existing, working pattern.

Under this ADR:

- modules MUST NOT expose `registerHttpRoutes()`
- Composition does not know about HTTP
- no HTTP registration facade is introduced
- no route registry is introduced

If a future route-registry model is desired, it requires a separate ADR that explicitly changes the HTTP Core architecture.

---

# 9. Lifecycle Semantics

## 9.1 Kernel Lifecycle (Unchanged)

```text
OPEN
  ↓
CONFIGURE        ← module.setup() defines services, hooks, events
  ↓
SEAL             ← kernel.seal() — no more registrations allowed
  ↓
INITIALIZE       ← module init functions run
  ↓
START            ← kernel.start() → RUNNING
  ↓
RUNNING
  ↓
STOP             ← kernel.stop() → STOPPED
```

---

## 9.2 Execution Context Lifecycle

### CLI

```text
Kernel RUNNING
    │
    ├── Application creates CommandRegistry
    │
    ├── Application calls module.registerCliCommands?(registry)
    │       (registry populated — immutable after this)
    │
    ├── Application creates AppContext
    │
    ├── Application creates CliExecutionFacade
    │
    ├── Application creates Commander adapter
    │
    ├── Adapter parses argv
    │
    ├── Adapter invokes cli.execute(name, args)
    │       │
    │       ├── beforeCommand hooks
    │       ├── command action
    │       ├── afterCommand hooks
    │       └── events emitted
    │
    └── Process exits → kernel.stop()
```

**Key points:**

- Registry is populated **before** command execution.
- Registry becomes immutable before the first `execute()`.
- `CliExecutionFacade` is created after the Kernel is `RUNNING`.
- Each command execution is independent.
- CLI has no persistent lifecycle of its own.
- `CliExecutionFacade` does **not** define a `stop()` lifecycle method.
- Process shutdown is owned by the Application and Kernel.

### HTTP

```text
Kernel RUNNING
    │
    ├── HttpFacade already registered in Kernel DI
    │
    ├── Application resolves HttpFacade
    │
    ├── Application creates Hono adapter
    │
    ├── Adapter starts server
    │       │
    │       ├── Incoming request
    │       │       ↓
    │       │   Hono → HttpFacade.handle(ctx)
    │       │       │
    │       │       ├── Request started event
    │       │       ├── Handler executes
    │       │       ├── Request completed/failed event
    │       │       └── Response returned
    │       │
    │       └── Server runs until stop()
    │
    ├── SIGINT
    │       ↓
    │   adapter.stop()
    │
    └── kernel.stop()
```

**Key points:**

- `HttpFacade` is created during Kernel `INITIALIZE`.
- HTTP server starts only after Kernel is `RUNNING`.
- The HTTP server shares the Kernel lifecycle.
- `httpAdapter.stop()` MUST complete before `kernel.stop()` is called.
- After `kernel.stop()`, no service resolution is guaranteed.
- Any adapter shutdown that requires shared services MUST occur before Kernel shutdown.
- The Application owns this ordering.

---

## 9.3 Concurrent CLI + HTTP

A single process running multiple execution contexts MUST use **one shared Kernel**.

```text
                         Application
                              │
                    createApplication()
                              │
                              ▼
                           Kernel
                         RUNNING
                       /          \
                      /            \
                    CLI            HTTP
                     │               │
            CommandRegistry      HttpFacade
                     │               │
            CliExecutionFacade   Hono Adapter
```

The Application MUST call `createApplication()` **once** in such a process.

For example:

```typescript
async function main() {
  const kernel = await createApplication();

  const cli = createCliContext(kernel);
  const http = createHttpContext(kernel);

  await Promise.all([cli.run(), http.start()]);

  await http.stop();
  await kernel.stop();
}
```

Separate entrypoints such as `cli.ts` and `http.ts` MAY each call `createApplication()` when they are executed as separate processes.

They MUST NOT each create a Kernel when both contexts execute within the same process.

### Shutdown order

The Application owns shutdown ordering:

1. stop HTTP adapter
2. stop any other long-running adapters
3. stop Kernel

CLI normally requires no separate shutdown step because command execution is discrete and `CliExecutionFacade` has no persistent lifecycle.

---

# 10. Module Independence

## 10.1 What "Independence" Means

A **pure domain module** is independent if:

- it does not import `@comity/cli` or `@comity/http`
- it does not require CLI or HTTP to be enabled
- its `setup()` registers only shared services/events/hooks
- its domain functionality remains usable without any execution context

A module that intentionally provides an execution-context capability is not completely context-independent at the package-contract level. This is an explicit and accepted trade-off.

---

## 10.2 CLI Capability Dependency

A module exposing:

```typescript
registerCliCommands(registry);
```

may import official CLI contracts from `@comity/cli`.

This dependency is permitted because the module explicitly opts into the CLI capability.

The distinction is:

```text
Pure domain capability
    ↓
No CLI dependency

Optional CLI capability
    ↓
Explicit @comity/cli dependency
```

This avoids pretending that an API can be context-aware while simultaneously having no knowledge of the context's contract.

The architecture therefore favors **explicit API coupling over hidden framework coupling**.

A module MUST NOT import `@comity/cli` merely to perform its normal `setup()` or domain logic.

---

## 10.3 What Independence Does Not Mean

A module that exposes `registerCliCommands`:

- is aware that CLI exists
- knows the CLI command contract
- may import the CLI contract package
- is still independent of whether the CLI runtime is enabled

The Application controls whether the capability is invoked.

This is intentional.

---

## 10.4 Capability Discovery

Capability discovery is an **Application concern**.

The Application MAY use either:

1. an explicit list of modules with CLI capabilities; or
2. an Application-maintained capability list derived from the modules already selected for the application.

The recommended pattern is explicit enumeration:

```typescript
const cliModules = [ordersModule, usersModule, catalogModule];

for (const module of cliModules) {
  module.registerCliCommands?.(registry);
}
```

This is deliberately not automatic framework discovery.

The list makes enabled runtime capabilities visible at the Application boundary.

If automatic capability discovery becomes valuable enough to justify metadata or a generic mechanism, it should be evaluated through a future ADR.

---

# 11. Alternatives Considered

## 11.1 Generic Contribution Registry (ADR-023)

```typescript
ctx.contribute(CLI_COMMANDS_TOKEN, commands);
```

**Rejected:** Creates generic framework mechanism for two known contexts. Introduces token indirection, contribution store, implicit coupling. Not justified.

---

## 11.2 Scope Abstraction (ADR-023)

```typescript
new CliScope(kernel);
new HttpScope(kernel);
```

**Rejected:** Duplicates Kernel DI/EventBus/HookBus. Ambiguous lifecycle/ownership. Not a real abstraction.

---

## 11.3 ContextFactories Injection (ADR-024)

```typescript
compose(kernel, modules, {
  contexts: {
    cli: ...,
    http: ...
  }
});
```

**Rejected:** Makes Composition transport-aware. Requires `ModuleSetupContext` to include context types. Violates ADR-008.

---

## 11.4 Separate Kernel Per Context

```text
CliKernel
HttpKernel
```

**Rejected:** Violates single-Kernel architecture. Duplicates DI, EventBus, HookBus, lifecycle.

---

## 11.5 Child DI Containers

**Rejected:** No scoped dependency visibility requirement. Adds complexity without solving a problem.

---

## 11.6 Transport-Specific Module Entrypoints

```typescript
module.cli();
module.http();
module.graphql();
```

**Rejected:** Module API grows per context and couples module lifecycle to runtime concerns.

---

## 11.7 Application Manual Enumeration

```typescript
module.registerCliCommands?.(registry);
```

**Accepted:** Explicit, type-safe, layering-compliant. Application controls enablement. No framework magic.

The selected approach intentionally accepts an explicit optional `@comity/cli` contract dependency for modules that expose CLI capabilities.

---

# 12. Consequences

## Positive

| Consequence                    | Description                                                                  |
| ------------------------------ | ---------------------------------------------------------------------------- |
| **Composition stays pure**     | Zero knowledge of CLI/HTTP                                                   |
| **Single Kernel**              | No duplication of DI/EventBus/HookBus                                        |
| **No generic registry**        | No `ContributionToken`, `ContributionStore`, `Scope`                         |
| **HTTP unchanged**             | Existing `HttpFacade` + hook pattern preserved                               |
| **CLI clarified**              | `CliKernel` → `CliExecutionFacade` semantic correction                       |
| **Explicit wiring**            | Application controls what runs where                                         |
| **Module opt-in**              | Modules expose capabilities only if they choose                              |
| **Lifecycle safety**           | Raw Kernel is never passed to module capability registration                 |
| **Testable**                   | Registry, facade, adapter, and capability methods can be tested in isolation |
| **Single-process consistency** | Multiple execution contexts share the same Kernel                            |

## Negative

| Consequence                                                                 | Mitigation                                                                              |
| --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Application must enumerate modules with context capabilities                | Document pattern; maintain explicit capability lists                                    |
| New execution context = new explicit wiring in Application                  | Acceptable — contexts are rare                                                          |
| Modules with CLI capabilities have an explicit `@comity/cli` API dependency | Accepted exception; pure domain setup remains context-independent                       |
| No automatic discovery                                                      | Explicit is better than implicit for architecture                                       |
| Application must adapt shared Kernel buses to CLI-specific types            | Keep adaptation at Application boundary; optionally introduce a dedicated adapter later |
| Concurrent contexts require coordinated shutdown                            | Application owns startup/shutdown ordering                                              |

---

# 13. Migration from ADR-024

| Step | Action                                                                                   |
| ---- | ---------------------------------------------------------------------------------------- |
| 1    | Remove `contextFactories` / `contexts` from `compose()` API                              |
| 2    | Remove `cli`, `http` from `ModuleSetupContext` type                                      |
| 3    | Rename internal `CliKernel` implementation → `CliExecutionFacade`                        |
| 4    | Export `CliExecutionFacade` from `@comity/cli`                                           |
| 5    | Add `CommandRegistry` to `@comity/cli` public exports                                    |
| 6    | Ensure `CliRegistrationFacade` remains part of the public CLI contract                   |
| 7    | Change `registerCliCommands(registry, kernel)` → `registerCliCommands(registry)`         |
| 8    | Do not add `HttpExecutionFacade`, `HttpRegistrationFacade`, or `RouteRegistry`           |
| 9    | Verify HTTP continues using `HttpFacade` + `@comity/http:configuring` hook               |
| 10   | Update `cli.ts` to use explicit module capability invocation                             |
| 11   | Define `createAppContext(kernel)` at the Application layer                               |
| 12   | Adapt Kernel HookBus/EventBus types at the Application boundary                          |
| 13   | Update `http.ts` to resolve `HttpFacade` from Kernel DI and wire adapter                 |
| 14   | Ensure `httpAdapter.stop()` occurs before `kernel.stop()`                                |
| 15   | Ensure a single Kernel is shared when CLI and HTTP run in the same process               |
| 16   | Remove any `Scope`, `ContributionToken`, `ContributionStore` code if added               |
| 17   | Add architecture validation ensuring Composition has zero execution-context dependencies |

---

# 14. Forbidden Patterns (Normative)

| Pattern                                                                    | Forbidden By                  |
| -------------------------------------------------------------------------- | ----------------------------- |
| `ctx.contribute(token, value)`                                             | This ADR, ADR-023 rejection   |
| `ContributionToken`, `ContributionStore`, `ContributionRegistry`           | This ADR                      |
| `Scope` or equivalent generic context abstraction                          | This ADR, ADR-023 rejection   |
| `contextFactories`, `contexts` parameter in `compose()`                    | This ADR                      |
| `ModuleSetupContext.cli`, `ModuleSetupContext.http`                        | This ADR                      |
| `registerCliCommands(registry, kernel)`                                    | This ADR — raw Kernel leakage |
| Any module capability receiving the raw Kernel for registration            | This ADR                      |
| `HttpExecutionFacade` (duplicate of `HttpFacade`)                          | This ADR                      |
| `RouteRegistry` (unless HTTP architecture changes via separate ADR)        | This ADR                      |
| Child DI containers for execution contexts                                 | This ADR, ADR-023 rejection   |
| `module.cli()`, `module.http()`, `module.graphql()`                        | This ADR, Layering Policy     |
| Domain Module importing `@comity/cli` without an explicit CLI capability   | Layering Policy               |
| Domain Module importing `@comity/http` without an explicit HTTP capability | Layering Policy               |
| `@comity/composition` importing `@comity/cli`                              | Layering Policy, this ADR     |
| `@comity/composition` importing `@comity/http`                             | Layering Policy, this ADR     |
| `@comity/composition` depending on any execution-context Core Module       | Layering Policy, this ADR     |
| `@comity/kernel` importing execution-context Core Modules                  | Layering Policy               |
| Service resolution after `kernel.stop()`                                   | Kernel lifecycle contract     |

### Normative Composition Invariant

```text
@comity/composition
        │
        ├── MUST NOT → @comity/cli
        ├── MUST NOT → @comity/http
        └── MUST NOT → any execution-context Core Module
```

---

# 15. Formal Dependency Graph

For this ADR:

> **`A → B` means `A` depends on `B`.**

The authoritative package graph is:

```text
Application
    ↓
Technology Adapters
    ↓
Core Modules
    ↓
@comity/composition
    ↓
@comity/kernel
    ↓
@comity/primitives
```

Therefore:

```text
Application
    ↓
@comity/cli-commander
    ↓
@comity/cli
    ↓
@comity/composition
    ↓
@comity/kernel
    ↓
@comity/primitives
```

and:

```text
Application
    ↓
@comity/http-hono
    ↓
@comity/http
    ↓
@comity/composition
    ↓
@comity/kernel
    ↓
@comity/primitives
```

### Domain Module

A pure domain module depends only on the lower-level packages it actually needs:

```text
@comity/orders
    ↓
@comity/composition
    ↓
@comity/kernel
    ↓
@comity/primitives
```

A domain module with an explicit CLI capability MAY additionally depend on:

```text
@comity/orders
    ↓
@comity/cli
```

This is an explicit optional capability dependency.

### Critical Direction

The following dependency directions are authoritative:

```text
@comity/composition → @comity/kernel
Core Modules       → @comity/composition
Adapters            → Core Modules
Application         → Adapters
```

The following reverse dependencies are forbidden:

```text
@comity/kernel      → @comity/composition
@comity/composition → @comity/cli
@comity/composition → @comity/http
Core Module         → Adapter
Adapter             → Application
```

---

# 16. Implementation Guidance

## 16.1 `@comity/composition` Changes

No execution-context API changes are required.

Verify:

- `compose()` / `load()` remains transport-agnostic
- `ModuleSetupContext` remains unchanged
- no execution-context imports exist
- no execution-context package appears in package dependencies
- architecture validation rejects execution-context dependencies

The actual exported Composition entrypoint MUST be verified against the current implementation.

If the package exports `compose()`, the Application may use `compose()` as the convenience API shown in this ADR.

If the actual public API exports only `load()`, the Application MUST use `load()` instead.

This implementation detail does not alter the architectural decision.

---

## 16.2 `@comity/cli` Changes

### Public API additions

```typescript
export { CommandRegistry } from "./internal/command-registry.js";

export { CliExecutionFacade } from "./internal/cli-execution-facade.js";

export { CliRegistrationFacade } from "./contracts/cli.js";

// ... existing contracts
```

Required changes:

- rename the internal `CliKernel` implementation to `CliExecutionFacade`
- export `CliExecutionFacade` publicly
- export `CommandRegistry` publicly
- keep CLI contracts public
- keep `CliRegistrationFacade` public
- ensure the facade uses the CLI-specific lifecycle contracts
- do not make the facade responsible for creating or owning the Kernel

Both `CliExecutionFacade` and `CommandRegistry` are **new public exports**.

This is not a breaking rename of an existing public API because the current `CliKernel` and `CommandRegistry` implementations are internal.

---

## 16.3 `@comity/http` Changes

**No architectural changes required.**

The following remain:

- `HttpFacade`
- `HTTP_TOKEN`
- `@comity/http:configuring`
- `@comity/http:initialized`
- existing HTTP middleware/handler composition

`@comity/http-hono` continues to consume `HttpFacade`.

No:

- `HttpExecutionFacade`
- `HttpRegistrationFacade`
- `RouteRegistry`

are introduced by this ADR.

---

## 16.4 Application Template

```typescript
// modules.ts
export async function createApplication() {
  const kernel = createKernel(config);

  await compose(kernel, [databaseModule, ordersModule, usersModule]);

  return kernel;
}
```

### CLI

```typescript
// cli.ts
const kernel = await createApplication();

const registry = new CommandRegistry<AppContext>();

for (const module of [ordersModule, usersModule]) {
  module.registerCliCommands?.(registry);
}

const appContext = createAppContext(kernel);

const cliHooks = kernel.hooks as HookBus<CliLifecycle<AppContext>>;

const cliEvents = kernel.events as EventBus<CliEvents>;

const cli = new CliExecutionFacade(registry, cliHooks, cliEvents, appContext);

await createCommanderAdapter({
  cli,
  name: "app",
}).run(process.argv.slice(2));

await kernel.stop();
```

### HTTP

```typescript
// http.ts
const kernel = await createApplication();

const httpFacade = kernel.services.resolve(HTTP_TOKEN);

const adapter = createHonoAdapter({
  facade: httpFacade,
});

await adapter.start({
  port: 3000,
});

try {
  await waitForShutdownSignal();
} finally {
  await adapter.stop();
  await kernel.stop();
}
```

### Concurrent CLI + HTTP

```typescript
// application.ts
const kernel = await createApplication();

const cli = createCliContext(kernel);
const http = createHttpContext(kernel);

await Promise.all([cli.run(), http.start()]);

await http.stop();
await kernel.stop();
```

The important invariant is:

```text
one process
    ↓
one createApplication()
    ↓
one Kernel
    ↓
multiple execution contexts
```

---

# 17. Resolved Questions and Assumptions

The following questions are resolved for the purposes of this ADR.

| Question                                                                  | Resolution                                                                                                                                                                                                |
| ------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Does `@comity/composition` export `compose()` or only `load()`?           | Implementation detail to verify. The ADR permits the Application convenience API to use `compose()` if exported; otherwise `load()` is used directly. The architectural decision is unaffected.           |
| Can modules be shared between `cli.ts` and `http.ts` in the same process? | Yes. They MUST share the same Kernel instance. `createApplication()` MUST be called only once per process/module graph.                                                                                   |
| Is `CliExecutionFacade` stateless?                                        | Yes, with respect to command execution lifecycle. It holds the registry, typed shared buses, and execution context; it does not own a persistent runtime lifecycle.                                       |
| How does `createAppContext(kernel)` work?                                 | The Application creates an execution-only context exposing `services.resolve()` and any other explicitly approved runtime values. It MUST NOT expose lifecycle mutation or service-definition operations. |
| What if a module needs different commands for different CLI contexts?     | `registerCliCommands(registry)` may inspect Application configuration or the registry/context contract to decide which commands to register. The Application controls which modules are invoked.          |
| How are CLI HookBus/EventBus types integrated with Kernel?                | The Application adapts the shared Kernel buses to CLI-specific contracts, either through a typed view/cast or a dedicated adapter. Composition remains unaware of CLI.                                    |
| Does CLI have a persistent lifecycle?                                     | No. `CliExecutionFacade` represents discrete command execution and has no `start()` / `stop()` lifecycle.                                                                                                 |
| What is the HTTP execution capability?                                    | `HttpFacade`. No second execution facade is introduced.                                                                                                                                                   |
| What is the HTTP registration mechanism?                                  | Existing `@comity/http:configuring` hook-based composition. No route registry is introduced.                                                                                                              |
| How are CLI-capable modules discovered?                                   | Explicit Application-owned enumeration is the recommended mechanism.                                                                                                                                      |
| Can future contexts use this pattern?                                     | Yes. A future context may introduce its own Core Module, Adapter, execution contracts, and Application wiring. Such work is outside the current ADR scope and MUST preserve the same layering direction.  |

---

# 18. Decision Summary

Comity uses **Application-Owned Explicit Wiring** for execution context composition.

```text
modules.ts
    │
    └── compose(kernel, modules)
              │
              ▼
           Kernel
      shared DI/EventBus/HookBus
              │
      ┌───────┼────────┐
      ▼       ▼        ▼
    cli.ts  http.ts  future
      │       │
      ▼       ▼
CommandRegistry
      │
      ▼
CliExecutionFacade       HttpFacade
      │                       │
      ▼                       ▼
Commander Adapter        Hono Adapter
      │                       │
      ▼                       ▼
    CLI                    HTTP
```

**There is:**

- one Kernel per process/module graph
- one module setup model
- no Scope
- no generic ContributionToken
- no ContributionStore
- no `ctx.contribute()`
- no child DI
- no transport-specific module entrypoints
- no `contextFactories`
- no `ModuleSetupContext.cli`
- no `ModuleSetupContext.http`
- no `HttpExecutionFacade`
- no `HttpRegistrationFacade`
- no `RouteRegistry`
- no raw Kernel passed to module capability registration
- no execution-context dependencies from `@comity/composition`

**There is:**

- Application-owned execution-context wiring
- explicit CLI capability registration
- `CliExecutionFacade` as the CLI runtime boundary
- `HttpFacade` as the existing HTTP runtime boundary
- shared Kernel DI/EventBus/HookBus
- explicit Application-level adaptation of CLI-specific bus types
- explicit Application-owned shutdown ordering
- explicit single-Kernel sharing for concurrent contexts

The shared Kernel remains the foundation.

Execution facades define runtime boundaries.

Adapters bind Core Modules to concrete technologies.

Applications wire the contexts they need.

Modules remain context-neutral during normal composition and may opt into explicit execution-context capabilities when required.

This is the minimal architecture compatible with Comity's layering policy and current HTTP implementation.

---

# 19. Implementation Status

**Status:** Accepted / Implemented (2026-08-31)

**Completed:**

- `@comity/cli` migrated to `CliExecutionFacade` (renamed from internal `CliKernel`)
  - New public exports: `CliExecutionFacade`, `createCliExecutionFacade`, `CommandRegistry`, `CliRegistrationFacade`
  - `CliRegistration` remains internal
  - `registerCliCommands(registry)` pattern uses only the registry (no Kernel)
  - `CliExecutionFacade` created by Application after Composition completes

- `@comity/cli-commander` migrated to new API
  - Adapter consumes `CliExecutionFacade` via `createCommanderAdapter({ program, facade })`
  - Tests updated to new API; pre-existing duplicate symbol declarations in test file fixed

- HTTP unchanged: `HttpFacade` + `@comity/http:configuring` hook pattern preserved
  - No `HttpExecutionFacade`, `HttpRegistrationFacade`, or `RouteRegistry` introduced

- Composition remains transport-agnostic
  - Exports only `load()` and `resolveOrder()`
  - `ModuleSetupContext` unchanged: `services`, `events`, `hooks` only
  - Zero imports/references to execution-context Core Modules

**Verified:**

- All package tests pass: `@comity/cli` (21), `@comity/cli-commander` (17), `@comity/http` (28), `@comity/composition` (25), `@comity/kernel` (48)
- Typecheck, lint, and build pass for: `@comity/cli`, `@comity/cli-commander`, `@comity/http`, `@comity/http-hono`, `@comity/composition`, `@comity/kernel`
- Zero stale references to `CliKernel`, `createCliKernel`, `HttpExecutionFacade`, `HttpRegistrationFacade`, `RouteRegistry`, `registerHttpRoutes`, `contextFactories`, `ContributionToken`, `ContributionStore`, `ctx.contribute` in source code
