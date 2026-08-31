# ADR-023 — Execution Scopes and Context Contributions

**Status:** Proposed

## Context

A Comity application may expose the same application module graph through multiple execution contexts:

- CLI
- HTTP
- Worker
- RPC
- GraphQL
- other future runtimes

These contexts may share application infrastructure while requiring independent runtime concerns.

For example:

**Shared:**

- database
- cache
- repositories
- domain services
- configuration
- EventBus
- HookBus

**Context-specific:**

- CLI command registry
- CLI output/input
- HTTP server
- HTTP middleware
- request context
- worker queues
- transport-specific lifecycle

The application should therefore be able to compose its modules once and expose them through multiple execution contexts without creating parallel kernels or coupling the composition system to any transport.

The current architectural constraints are:

1. There is one Kernel for an application/module graph.
2. `CliKernel`, `HttpKernel`, `WorkerKernel`, etc. are forbidden.
3. Composition MUST remain completely transport-agnostic.
4. Modules MUST NOT expose transport-specific entrypoints such as:
   - `module.cli()`
   - `module.http()`
   - `module.worker()`
   - `module.graphql()`
5. Modules MUST NOT depend on concrete transport adapters.
6. Existing Kernel infrastructure MUST be reused where possible:
   - DI
   - EventBus
   - HookBus
   - lifecycle
7. The Application owns execution-context selection and wiring.
8. CLI and HTTP require independent runtime lifecycles even when they share application services.
9. New generic infrastructure MUST be kept minimal.
10. Composition must continue to own module dependency resolution, ordering and conflict detection.

### The fundamental problem

A module may need to expose context-specific behavior.

For example, an `orders` module may need to expose:

- CLI commands such as `orders:list`
- HTTP routes such as `GET /orders`

The module should not import Commander, Hono, Node HTTP APIs, or other concrete infrastructure.

At the same time, the application should not need to know every command and route provided by every module.

Therefore the architecture requires a mechanism through which modules can declare **context contributions** without Composition understanding what those contributions mean.

---

# Decision

Comity adopts an **Execution Scope + typed Contribution** model.

The model consists of four distinct responsibilities:

```text
Application
    │
    ├── Kernel
    │     ├── shared services
    │     ├── EventBus
    │     ├── HookBus
    │     └── global lifecycle
    │
    ├── Composition
    │     └── module graph + setup()
    │
    ├── CLI Scope
    │     └── CLI contributions + CLI lifecycle
    │
    └── HTTP Scope
          └── HTTP contributions + HTTP lifecycle
```

The important distinction is:

> **Composition composes modules. Scopes activate a particular execution context.**

Neither responsibility is transferred to the other.

---

# 1. Kernel

There is exactly one Kernel for an application/module graph.

The Kernel owns foundational infrastructure:

- DI container
- EventBus
- HookBus
- global lifecycle

The Kernel lifecycle remains:

```text
open → sealed → running → stopped
```

The Kernel does not know about:

- CLI
- HTTP
- Hono
- Commander
- Worker
- GraphQL
- RPC
- execution scopes

The Kernel must remain transport-agnostic.

A Scope does not create another Kernel.

---

# 2. Composition

Composition remains responsible only for module composition.

It owns:

- receiving modules
- dependency resolution
- topological ordering
- priority ordering
- conflict detection
- executing `setup(ctx, options)`
- loading the module graph into the Kernel

Composition MUST NOT:

- import `@comity/cli`
- import `@comity/http`
- inspect CLI commands
- inspect HTTP routes
- create Scopes
- start or stop transports
- contain transport-specific branches

Conceptually:

```text
Composition
    ↓
Module graph
    ↓
setup()
    ↓
Kernel
```

Composition has no knowledge of what execution contexts will eventually consume the composed application.

---

# 3. Execution Scope

A Scope represents an execution-context runtime over an already-composed Kernel.

Examples:

```text
CliScope
HttpScope
WorkerScope
RpcScope
```

A Scope owns:

- context-specific runtime state
- context-specific registrations
- context-specific lifecycle
- activation of context contributions
- interaction with the relevant Adapter

A Scope does NOT own:

- the Kernel
- the module graph
- dependency resolution
- module ordering
- global services
- global lifecycle

A Scope therefore has a lifecycle independent from other Scopes:

```text
created → started → stopped
```

while operating against the shared Kernel.

For example:

```text
Kernel
  running
    │
    ├── CliScope
    │     started → stopped
    │
    └── HttpScope
          started → stopped
```

Stopping the CLI Scope does not stop the HTTP Scope.

Stopping a Scope does not stop the Kernel.

Kernel shutdown is responsible for shutting down active Scopes before the Kernel reaches `stopped`.

---

# 4. Context Contributions

Modules need a way to expose context-specific behavior without adding transport-specific methods to their API.

Comity therefore introduces a minimal **typed contribution mechanism**.

The mechanism has three concepts:

```text
ContributionToken<T>
ContributionStore
Scope
```

A token identifies a type of contribution.

A contribution is data registered by a module during `setup()`.

A Scope consumes contributions for the context it implements.

The mechanism is intentionally generic.

Composition does not know what a token means.

---

# 5. Contribution Tokens

Tokens are contracts, not transport implementations.

Conceptually:

```ts
interface ContributionToken<T> {
  readonly id: symbol;
}
```

The contribution API is intentionally small:

```ts
ctx.contribute(token, value);
```

The token determines the type of `value`.

For example, a CLI contract may define:

```ts
type CliCommandContribution = {
  name: string;
  description?: string;
  execute: CliCommandHandler;
};
```

and expose a token representing that contribution type.

Similarly, HTTP may define an HTTP route contribution contract.

The important architectural distinction is:

```text
CLI contract
    ≠
CLI adapter
```

The contract describes what a CLI Scope needs.

The Commander adapter describes how that contract is implemented using Commander.

Likewise:

```text
HTTP route contract
    ≠
Hono adapter
```

The route contract remains technology-independent.

---

# 6. Ownership of Context Contracts

Context contribution contracts belong to their corresponding Core Module.

For example:

```text
@comity/cli
    └── CLI contribution contract

@comity/http
    └── HTTP contribution contract
```

They MUST NOT contain technology-specific implementations.

They may contain:

- types
- tokens
- facades
- scope contracts

They must not contain:

- Commander
- Hono
- Node-specific infrastructure
- framework middleware

Adapters implement these contracts.

---

# 7. Module Usage

A module that wants to expose CLI functionality may depend on the **CLI contract**, but must not depend on the Commander adapter.

For example:

```ts
import { CLI_COMMAND } from "@comity/cli";

export const orders = {
  name: "@comity/orders",

  setup(ctx) {
    ctx.contribute(CLI_COMMAND, {
      name: "orders:list",
      description: "List orders",

      execute: async (commandContext) => {
        const orders = await commandContext.services.resolve("orderService").list();

        return orders;
      },
    });
  },
};
```

The module does not know:

- Commander
- argv parsing
- process exit
- terminal output
- command registration mechanics

It only declares a CLI capability.

Likewise an HTTP-capable module can contribute an HTTP route using the HTTP contract.

This does **not** create:

```ts
module.cli();
module.http();
```

The module still has exactly one composition entrypoint:

```ts
setup(ctx, options);
```

---

# 8. Why This Does Not Pollute Composition

Composition sees only:

```ts
ctx.contribute(token, value);
```

It does not inspect the token's semantic meaning.

It does not contain:

```ts
if (token === CLI_COMMAND) ...
if (token === HTTP_ROUTE) ...
```

It does not import either Core Module.

Its responsibility is only to preserve the contributions as part of the composed application state.

Conceptually:

```text
Module
  │
  │ setup()
  ▼
Composition Context
  │
  ├── services
  ├── events
  ├── hooks
  └── contributions
          │
          ▼
      Composed State
```

Composition remains completely generic.

---

# 9. Composed State

Composition produces a composed application state.

This state contains:

- the resolved module order
- registered shared services
- registered events
- registered hooks
- context contributions

The composed state is not a second runtime.

It is the result of composition.

The Kernel remains the owner of shared runtime infrastructure.

The contribution store may therefore be implemented as part of the existing composition/kernel context rather than as a new independent bus.

No `ContributionBus` is introduced.

No generic plugin registry is introduced.

No separate module registry is introduced.

---

# 10. CLI Scope

The CLI Core Module defines the CLI contribution contract and the CLI Scope.

Conceptually:

```ts
const cli = createCliScope({
  kernel,
  context: cliContext,
  adapter,
});
```

The Scope:

1. obtains CLI contributions from the composed application
2. validates them
3. registers them with the CLI execution environment
4. manages CLI-specific lifecycle
5. delegates technology-specific behavior to the Adapter

The Commander Adapter therefore implements the CLI contract:

```text
CliScope
    ↓
@comity/cli contract
    ↓
@comity/cli-commander
    ↓
Commander
```

The Adapter does not participate in Composition.

---

# 11. HTTP Scope

HTTP follows the same pattern.

```text
HttpScope
    ↓
@comity/http contract
    ↓
@comity/http-hono
    ↓
Hono
```

The HTTP Scope owns:

- HTTP runtime lifecycle
- route activation
- HTTP context
- HTTP-specific runtime state

The Hono adapter owns:

- Hono integration
- request/response translation
- framework-specific middleware

Composition remains unaware of all of this.

---

# 12. Shared Services vs Context Runtime

A critical distinction is made between **shared services** and **context runtime objects**.

### Shared

These are normally registered in the Kernel:

```text
Database
Cache
Repositories
Domain services
Configuration
EventBus
HookBus
```

They may be consumed by multiple Scopes.

### Context-specific

These belong to a Scope:

```text
CliContext
CliOutput
HttpRequest
HttpResponse
HttpContext
Commander Program
Hono Application
Worker runtime
```

They must not become globally shared Kernel services merely because a module needs them.

This prevents execution-context state from leaking across contexts.

---

# 13. Service Scope

This ADR does **not** require a child DI container.

The initial implementation should reuse the existing Kernel DI model.

If future requirements demonstrate that true scoped service isolation is necessary, a separate ADR may introduce:

```text
Kernel services
      │
      ├── CLI scope services
      └── HTTP scope services
```

Such a change must be justified by an actual use case.

ADR-023 therefore explicitly avoids introducing speculative scoped-DI infrastructure.

---

# 14. Lifecycle

The lifecycle is divided into two levels.

### Application / Kernel lifecycle

```text
Application
    ↓
create Kernel
    ↓
Composition
    ↓
setup()
    ↓
Kernel seal
    ↓
Kernel start
```

### Execution lifecycle

```text
Kernel running
    │
    ├── create CliScope
    │       ↓
    │     start
    │       ↓
    │     execute
    │       ↓
    │     stop
    │
    └── create HttpScope
            ↓
          start
            ↓
          serve
            ↓
          stop
```

Scopes cannot operate against a Kernel that has not reached its required runtime state.

A Scope must not change the Kernel lifecycle.

---

# 15. Application Structure

The intended application structure becomes:

```text
application/
├── config.ts
├── modules.ts
├── cli.ts
└── http.ts
```

### `config.ts`

Owns application configuration.

### `modules.ts`

Owns the module graph and Kernel/Composition initialization.

Conceptually:

```ts
export async function createApplication() {
  const kernel = createKernel(config);

  await compose(kernel, [database, orders, users, catalog]);

  return kernel;
}
```

### `cli.ts`

Owns CLI execution.

```ts
const kernel = await createApplication();

const cli = createCliScope({
  kernel,
  adapter: createCommanderAdapter(),
  context: createCliContext(),
});

await cli.start();
```

### `http.ts`

Owns HTTP execution.

```ts
const kernel = await createApplication();

const http = createHttpScope({
  kernel,
  adapter: createHonoAdapter(),
  context: createHttpContext(),
});

await http.start();
```

Neither file needs to import every command or route provided by the modules.

---

# 16. Multiple Execution Contexts

An application may expose multiple contexts over the same composed application.

For example:

```text
                    Application
                         │
                    Shared Kernel
                         │
              ┌──────────┼──────────┐
              │          │          │
           CliScope  HttpScope  WorkerScope
              │          │          │
          Commander     Hono       Worker
```

Each context can be started or stopped independently.

This allows an application to:

- expose HTTP and CLI simultaneously
- run workers without HTTP
- run CLI commands against the same services used by HTTP
- add future execution contexts without modifying Composition

---

# 17. Dependency Direction

The design preserves the official layering policy:

```text
Application
    ↓
Extensions
    ↓
Adapters
    ↓
Core Modules
    ↓
Kernel
    ↓
Primitives
```

The relevant dependency relationships are:

```text
@comity/cli
    → Kernel / Primitives

@comity/cli-commander
    → @comity/cli
    → Commander

@comity/http
    → Kernel / Primitives

@comity/http-hono
    → @comity/http
    → Hono
```

Modules that consume context contracts depend only on those contracts.

No Core Module may depend on an Adapter.

Composition must not depend on CLI, HTTP or any other execution context.

Kernel must not depend on any execution context.

---

# 18. Alternatives Considered

## A. Separate Kernel per execution context

```text
CliKernel
HttpKernel
WorkerKernel
```

**Rejected.**

This duplicates foundational infrastructure and creates independent DI, event and hook systems where shared infrastructure is required.

It also violates the existing architectural decision against parallel kernels.

---

## B. Transport-specific module entrypoints

```ts
module.setup();
module.cli();
module.http();
```

**Rejected.**

This causes the module API to grow with every new execution context.

Adding GraphQL, Worker or RPC would require additional module entrypoints.

---

## C. Application-owned manual registration

```ts
cli.ts
  → import orders
  → register orders commands
  → import users
  → register users commands
  → ...
```

**Rejected.**

It makes the Application responsible for knowing every module's context-specific capabilities and prevents modules from remaining independently composable.

---

## D. Transport-specific logic inside Composition

```ts
if (context === "cli") ...
if (context === "http") ...
```

**Rejected.**

This violates Composition's architectural responsibility and makes the module composition mechanism transport-aware.

---

## E. Generic untyped plugin/capability framework

```ts
ctx.contribute("anything", arbitraryValue);
```

**Rejected.**

This creates a loosely typed registry that becomes an architectural dumping ground.

Contributions must instead be represented by explicit typed contracts and tokens.

---

## F. Scoped DI / child containers

**Deferred.**

Scoped DI may eventually be useful, but there is currently insufficient evidence that it is required by the execution-scope model itself.

The initial design should not introduce it speculatively.

---

# 19. Consequences

### Positive

- One Kernel remains the shared foundation.
- Composition remains completely transport-agnostic.
- CLI and HTTP have independent runtime lifecycles.
- Modules retain a single `setup()` entrypoint.
- Modules do not depend on technology adapters.
- Commands and routes can be contributed by modules without manual application registration.
- Existing EventBus, HookBus and DI infrastructure is reused.
- New execution contexts can be added without modifying Composition.
- Context-specific runtime objects do not need to become global services.
- The contribution mechanism remains small and typed.

### Negative

- A minimal contribution mechanism becomes part of the module setup contract.
- Context contracts must be designed carefully to avoid becoming transport-specific implementations.
- A module that explicitly contributes CLI or HTTP capabilities necessarily depends on the corresponding **Core contract**, although it remains independent of the technology adapter.
- Multiple Scopes require explicit application lifecycle management.
- True scoped service isolation is not provided by this ADR.

---

# 20. Implementation Constraints

The implementation of ADR-023 MUST satisfy the following:

### MUST

- reuse the existing Kernel
- reuse EventBus and HookBus
- preserve Composition's transport independence
- preserve the single `setup(ctx, options)` module entrypoint
- use typed contribution contracts
- keep technology-specific behavior in Adapters
- keep Scope lifecycle independent from Kernel lifecycle
- prevent context runtime objects from becoming implicit global services
- keep internal registries private unless they are part of an explicit public contract

### MUST NOT

- introduce `CliKernel`, `HttpKernel`, etc.
- add `module.cli()`, `module.http()`, etc.
- add transport branches to Composition
- add Commander/Hono dependencies to Core contracts
- create a generic untyped plugin registry
- create a `ContributionBus`
- create a second EventBus or HookBus
- introduce child DI containers without a separate architectural decision
- infer commands or routes from arbitrary service names

---

# 21. Acceptance Criteria

ADR-023 is considered implemented only when all of the following are true:

1. A single Kernel can be used by multiple execution contexts.
2. Composition contains zero knowledge of CLI, HTTP or other transports.
3. Composition loads the module graph exactly once.
4. Modules retain a single `setup()` entrypoint.
5. A module can contribute a typed context capability without importing a technology adapter.
6. CLI Scope can consume CLI contributions without the Application manually registering each command.
7. HTTP Scope can consume HTTP contributions without the Application manually registering each route.
8. CLI and HTTP have independent start/stop lifecycle.
9. Shared services remain available to both contexts.
10. Context-specific runtime state is not globally registered by default.
11. Commander remains confined to `@comity/cli-commander`.
12. Hono remains confined to `@comity/http-hono`.
13. No parallel Kernel implementation exists.
14. No generic untyped contribution/plugin registry exists.
15. Architecture validation passes with zero violations.
16. Core and Adapter tests pass.
17. Documentation and ADR examples match the actual implementation.

---

# Final Statement

ADR-023 establishes the execution boundary for Comity applications:

> **Composition builds the application. The Kernel provides the shared foundation. Scopes activate execution contexts. Typed contributions connect modules to those contexts. Adapters implement the technology.**

This allows Comity to support CLI, HTTP and future execution contexts without turning Composition into a transport framework, without multiplying Kernels, and without expanding the module API for every new runtime.
