# ADR-024 — Execution Context Composition via Typed Facades

- **Status:** Accepted
- **Date:** 2026-08-31
- **Supersedes:** ADR-023
- **Decision:** Adopt
- **Scope:** Composition, CLI, HTTP, Application Layer

---

# 1. Context

Comity supports multiple execution contexts, including CLI and HTTP.

These contexts share the same application composition:

- dependency injection
- domain services
- repositories
- EventBus
- HookBus
- module lifecycle

However, each execution context also has its own runtime concerns:

- CLI commands and command execution
- HTTP routes and request handling
- context-specific lifecycle
- technology-specific adapters

ADR-023 proposed introducing a generic `Scope` abstraction and a generic contribution mechanism based on:

- `Scope`
- `ContributionToken`
- `ContributionStore`
- `ctx.contribute()`

The proposal attempted to provide automatic discovery of context-specific contributions while preserving a single Kernel.

Architectural review determined that this mechanism is unnecessary.

The existing CLI implementation already demonstrates a simpler pattern:

```text
Composition
    ↓
shared Kernel infrastructure
    ↓
typed registration
    ↓
context-specific registry
    ↓
execution facade
    ↓
technology adapter
```

The same pattern can be applied to HTTP without introducing a generic contribution system.

---

# 2. Decision

Comity adopts **Application-owned Execution Context Composition**.

Each execution context consists of:

1. a **Registration Facade** used during module setup
2. a context-specific **Registry**
3. an **Execution Facade** used at runtime
4. a technology-specific **Adapter**

The shared Kernel remains the single orchestration foundation.

The architecture is:

```text
                    Application
                         │
             ┌───────────┴───────────┐
             │                       │
       Shared Composition       Context selection
             │                       │
             ▼                       ▼
        Shared Kernel        ┌───────┴───────┐
             │               │               │
             │              CLI            HTTP
             │               │               │
             │               ▼               ▼
             │        Registration     Registration
             │           Facade            Facade
             │               │               │
             │               ▼               ▼
             │        CommandRegistry    RouteRegistry
             │               │               │
             │               ▼               ▼
             │        CliExecution      HttpExecution
             │           Facade            Facade
             │               │               │
             │               ▼               ▼
             │       cli-commander       http-hono
             │               │               │
             └───────────────┴───────────────┘
```

No `Scope` abstraction is introduced.

No generic contribution registry is introduced.

No child DI container is introduced.

No second Kernel is introduced.

---

# 3. Architectural Model

The model explicitly separates **shared composition** from **execution-context composition**.

## 3.1 Shared Composition

Shared composition creates one Kernel for the complete application module graph.

It is responsible for:

- resolving modules
- ordering modules
- executing module setup
- registering services
- registering events
- registering hooks
- establishing shared application infrastructure
- sealing the Kernel
- initializing the Kernel
- starting the Kernel

Conceptually:

```text
Application
    ↓
Composition
    ↓
Kernel
```

The Kernel is transport-agnostic.

---

## 3.2 Execution Context Composition

Execution contexts are selected and wired by the Application.

Each context has its own:

```text
Registration Facade
        ↓
Context Registry
        ↓
Execution Facade
        ↓
Technology Adapter
```

For CLI:

```text
CliRegistrationFacade
        ↓
CommandRegistry
        ↓
CliExecutionFacade
        ↓
cli-commander
```

For HTTP:

```text
HttpRegistrationFacade
        ↓
RouteRegistry
        ↓
HttpExecutionFacade
        ↓
http-hono
```

Execution contexts consume the shared Kernel infrastructure but do not become part of the Kernel itself.

---

# 4. Single Kernel Rule

There MUST be exactly one Kernel for an application module graph.

The Kernel owns shared infrastructure:

- DI
- EventBus
- HookBus
- module lifecycle
- shared services

Execution contexts MUST NOT create another Kernel.

The following is forbidden:

```text
Application
 ├── Kernel
 ├── CliKernel
 └── HttpKernel
```

Instead:

```text
Application
        │
        ▼
     Kernel
        │
   ┌────┴────┐
   ▼         ▼
CLI facade  HTTP facade
```

An execution facade is not a Kernel.

---

# 5. Execution Facades

An Execution Facade is a context-specific runtime abstraction.

It coordinates:

- the context registry
- the shared Kernel's hooks
- the shared Kernel's events
- application context
- context-specific execution lifecycle

It MUST NOT:

- create another Kernel
- own the application's DI container
- redefine shared lifecycle semantics
- introduce generic contribution mechanisms
- contain technology-specific implementation

Execution Facades are intentionally thin.

---

# 6. Typed Registration Facades

Modules MAY register execution-context capabilities during `setup()` through typed registration facades supplied by the Application composition.

For example:

```typescript
interface CliRegistrationFacade {
  registerCommand(command: CliCommand): void;
}
```

and:

```typescript
interface HttpRegistrationFacade {
  registerRoute(route: HttpRoute): void;
}
```

The facades are explicit and context-specific.

They MUST NOT expose generic APIs such as:

```typescript
ctx.contribute(token, value);
```

or:

```typescript
ctx.register(token, value);
```

The API MUST communicate what is being registered.

Examples:

```typescript
ctx.cli?.registerCommand(command);
ctx.http?.registerRoute(route);
```

This preserves strong typing and makes the architectural intent explicit.

---

# 7. Context Enablement

The Application owns execution-context enablement.

A context MUST NOT be implicitly enabled merely because a module happens to define a command or route.

Conceptually:

```typescript
compose(kernel, modules, {
  contexts: {
    cli: cliContext,
    http: httpContext,
  },
});
```

The exact public API MAY differ, but the architectural requirement is fixed:

> Execution contexts are enabled by the Application, not discovered through a generic contribution mechanism.

When a context is disabled, its registration facade is unavailable.

For example:

```typescript
ctx.cli?.registerCommand(command);
```

If CLI is not enabled, the module does not register the command.

---

# 8. Module Independence

Domain and infrastructure modules MUST remain independent from optional execution contexts.

A domain module MUST NOT need to import:

```typescript
@comity/cli
@comity/http
```

merely to expose an optional command or route.

In particular, the following pattern is forbidden:

```typescript
import { CLI_COMMAND } from "@comity/cli";

ctx.contribute(CLI_COMMAND, command);
```

This creates an unnecessary Core Module dependency:

```text
Domain Module
      ↓
@comity/cli
```

and couples the module to the existence of CLI.

The preferred model is:

```typescript
setup(ctx) {
  ctx.cli?.registerCommand({
    name: "orders:list",
    action: async (args, context) => {
      // application/domain logic
    },
  });
}
```

The module consumes a capability supplied by composition rather than importing the execution-context Core Module directly.

---

# 9. Context Registries

Each execution context MAY maintain a dedicated registry.

Registries are context-specific implementation details.

Examples:

```text
CommandRegistry
RouteRegistry
```

A registry:

- stores validated context definitions
- belongs to its execution context
- is populated during module setup
- is immutable or sealed before execution begins
- is consumed by the corresponding Execution Facade

Registries MUST NOT become generic framework-wide registries.

There is no:

```typescript
ContributionRegistry;
ContributionStore;
```

in the architecture.

---

# 10. CLI Architecture

The CLI follows this model:

```text
Module setup()
      │
      ▼
CliRegistrationFacade
      │
      ▼
CommandRegistry
      │
      ▼
CliExecutionFacade
      │
      ▼
@comity/cli-commander
      │
      ▼
Commander
```

`@comity/cli` owns:

- `CliCommand`
- `CliOption`
- `CliCommandContext`
- `CliRegistrationFacade`
- `CommandRegistry`
- `CliExecutionFacade`
- CLI lifecycle contracts

`@comity/cli-commander` owns:

- Commander integration
- argv parsing
- process integration
- console integration
- technology-specific translation

The CLI Core MUST NOT depend on Commander.

---

# 11. CliExecutionFacade Naming

The existing `CliKernel` implementation is an Execution Facade and MUST NOT be conceptually treated as a second Kernel.

The implementation SHOULD be renamed:

```text
CliKernel
    ↓
CliExecutionFacade
```

The rename is semantic and architectural.

It makes the distinction between:

```text
Kernel
```

and:

```text
Execution Facade
```

explicit in the public API.

The Execution Facade MAY remain internally implemented as a class.

---

# 12. HTTP Architecture

HTTP follows the same pattern:

```text
Module setup()
      │
      ▼
HttpRegistrationFacade
      │
      ▼
RouteRegistry
      │
      ▼
HttpExecutionFacade
      │
      ▼
@comity/http-hono
      │
      ▼
Hono
```

`@comity/http` owns:

- `HttpRequest`
- `HttpResponse`
- `HttpContext`
- `HttpHandler`
- `HttpRoute`
- `HttpRegistrationFacade`
- `RouteRegistry`
- `HttpExecutionFacade`
- HTTP lifecycle contracts

`@comity/http-hono` owns:

- Hono integration
- request translation
- response translation
- Hono lifecycle
- technology-specific middleware integration

The HTTP Core MUST NOT depend on Hono.

---

# 13. Existing HttpFacade

The existing `HttpFacade` remains a shared service.

It is not replaced by `HttpExecutionFacade`.

The distinction is:

```text
HttpFacade
    = shared HTTP service/capability

HttpExecutionFacade
    = HTTP execution-context runtime
```

`HttpFacade` MAY be registered in the shared Kernel DI container using `HTTP_TOKEN`.

The Execution Facade consumes the shared infrastructure and context-specific registry without changing the Kernel's ownership model.

---

# 14. Lifecycle

The Kernel lifecycle remains unchanged.

The shared lifecycle is:

```text
OPEN
  ↓
CONFIGURE
  ↓
SEAL
  ↓
INITIALIZE
  ↓
RUNNING
  ↓
STOPPED
```

Execution-context lifecycle is independent from Kernel registration.

During configuration:

```text
Module setup()
    ↓
register shared services/hooks/events
    +
register context definitions
```

After the Kernel is sealed:

```text
No new shared registrations
```

After composition completes:

```text
CliExecutionFacade(...)
HttpExecutionFacade(...)
```

may be created using the already-composed state.

Execution Facades MUST NOT mutate Kernel registration after sealing.

---

# 15. CLI and HTTP Simultaneously

An application MAY enable multiple execution contexts over the same Kernel.

Example:

```text
                         Application
                              │
                              ▼
                         Composition
                              │
                              ▼
                           Kernel
                     ┌────────┴────────┐
                     │                 │
                shared services   shared events/hooks
                     │                 │
              ┌──────┴──────┐    ┌────┴─────┐
              ▼             ▼    ▼          ▼
       CommandRegistry  RouteRegistry
              │             │
              ▼             ▼
       CliExecution     HttpExecution
          Facade            Facade
              │             │
              ▼             ▼
       cli-commander     http-hono
```

Both execution contexts share:

- DI
- EventBus
- HookBus
- domain services
- repositories
- configuration

They maintain independent:

- registries
- runtime state
- adapters
- execution lifecycle

---

# 16. Adapter Boundary

Technology adapters remain outside Core Modules.

The dependency direction is:

```text
Application
    ↓
Technology Adapter
    ↓
Core Module
    ↓
Kernel
    ↓
Primitives
```

Examples:

```text
@comity/cli-commander → @comity/cli
@comity/http-hono     → @comity/http
```

Adapters MUST NOT:

- participate in module Composition
- register Core Module definitions directly
- modify Kernel internals
- introduce business logic

The Application creates and wires adapters after composition.

---

# 17. Layering Compliance

The model conforms to the official Comity Layering Policy.

```text
Application
    ↓
Extensions / Adapters
    ↓
Core Modules
    ↓
Kernel
    ↓
Primitives
```

Execution-context registration does not create a reverse dependency.

The Application supplies the context capability.

Modules consume the supplied capability.

The Core Module owns the contract.

The Adapter implements the technology binding.

No Core Module needs to import an Adapter.

No Kernel needs to import a Core execution context.

---

# 18. Forbidden Architecture

The following patterns are explicitly forbidden.

## 18.1 Scope

```typescript
new Scope(...)
```

or any equivalent generic execution-context abstraction.

Execution contexts MUST use explicit Execution Facades.

---

## 18.2 Generic Contributions

```typescript
ctx.contribute(token, value);
```

Generic contribution APIs are not part of the Comity architecture.

---

## 18.3 Generic Contribution Stores

```typescript
ContributionStore;
ContributionRegistry;
ContributionToken;
```

These abstractions MUST NOT be introduced to solve execution-context registration.

---

## 18.4 Child DI Containers

Execution contexts MUST NOT introduce child DI containers merely to isolate commands or routes.

The shared Kernel DI container remains the source of shared services.

---

## 18.5 Context-Specific Module Entrypoints

Modules MUST NOT define:

```typescript
module.cli();
module.http();
module.graphql();
```

or equivalent per-context module entrypoints.

Module composition remains centered around the single `setup()` contract.

---

## 18.6 Technology Dependencies in Modules

Modules MUST NOT import:

```typescript
Commander;
Hono;
Express;
Fastify;
```

or equivalent technology implementations.

---

# 19. Dependency Graph

The formal package relationship is:

```text
@comity/primitives
        ↑
@comity/kernel
        ↑
@comity/composition
        ↑
Core Modules
        ↑
Technology Adapters
        ↑
Application
```

For execution contexts:

```text
@comity/cli
    ↑
@comity/cli-commander

@comity/http
    ↑
@comity/http-hono
```

Domain modules remain independent of optional execution-context Core Modules.

---

# 20. Consequences

## Positive

### Explicit architecture

Each execution context has an explicit:

```text
Registration Facade
Registry
Execution Facade
Adapter
```

### Minimal abstraction

There is no generic contribution framework for only a small number of known contexts.

### Strong layering

Execution-context dependencies remain explicit and directional.

### Existing implementation alignment

The architecture extends the already-proven CLI pattern rather than replacing it.

### Independent runtimes

CLI and HTTP can have different runtime lifecycles while sharing the same Kernel.

### Replaceable infrastructure

Commander can be replaced without changing CLI contracts.

Hono can be replaced without changing HTTP contracts.

### No Kernel pollution

The Kernel remains transport-agnostic and policy-free.

---

# 21. Negative Consequences

Each new execution context requires explicit infrastructure.

For example:

```text
GraphQL
    ↓
GraphQLRegistrationFacade
GraphQLRegistry
GraphQLExecutionFacade
GraphQL Adapter
```

This introduces some repetition.

This repetition is intentional.

Comity prefers explicit context-specific abstractions over a generic registry mechanism whose primary purpose is eliminating small amounts of structural duplication.

A generic abstraction MAY be introduced in a future ADR only if multiple execution contexts demonstrate a concrete, repeated semantic requirement that cannot be adequately represented by explicit facades.

---

# 22. Migration

The migration from ADR-023 is intentionally small.

## Step 1 — Remove ADR-023 concepts

Do not implement:

- `Scope`
- `ContributionToken`
- `ContributionStore`
- `ctx.contribute()`
- generic context contribution tokens

---

## Step 2 — Normalize CLI

Rename:

```text
CliKernel
```

to:

```text
CliExecutionFacade
```

and expose the intended public API.

Existing `CommandRegistry` and CLI contracts remain conceptually unchanged.

---

## Step 3 — Extend Composition Context

Provide Application-supplied execution-context registration capabilities to `ModuleSetupContext`.

The Composition mechanism MUST remain generic at the mechanism level.

It MUST NOT import:

```text
@comity/cli
@comity/http
```

or otherwise encode knowledge of individual execution contexts.

---

## Step 4 — Add HTTP Registration

Introduce:

```text
HttpRegistrationFacade
RouteRegistry
HttpExecutionFacade
```

following the established CLI model.

---

## Step 5 — Wire Application

The Application creates and enables the required execution contexts.

Conceptually:

```typescript
const kernel = await compose(modules, {
  contexts: {
    cli: cliContext,
    http: httpContext,
  },
});

const cli = new CliExecutionFacade(...);
const http = new HttpExecutionFacade(...);
```

The exact API is implementation-defined and MUST preserve the architectural constraints of this ADR.

---

# 23. Rejected Alternatives

## A. Generic Contribution Registry

**Rejected.**

`ctx.contribute(token, value)` is a generic typed registry regardless of its implementation details.

It introduces:

- an additional dependency mechanism
- token indirection
- contribution storage
- implicit context coupling

The concrete contexts do not justify this abstraction.

---

## B. Scope

**Rejected.**

Scope duplicates responsibilities already provided by:

- Execution Facades
- registries
- Kernel DI
- Kernel EventBus
- Kernel HookBus

It also creates ambiguity around lifecycle and ownership.

---

## C. Separate Kernel per Context

**Rejected.**

CLI and HTTP share the same application composition and Kernel infrastructure.

Creating another Kernel would violate the single-Kernel architecture.

An Execution Facade provides the required runtime boundary without creating another Kernel.

---

## D. Child DI Containers

**Rejected.**

No scoped dependency visibility is currently required.

Introducing child containers would increase lifecycle and dependency complexity without solving an existing architectural problem.

---

## E. Transport-Specific Module Entrypoints

**Rejected.**

Patterns such as:

```typescript
module.cli();
module.http();
```

make module APIs grow with every execution context and couple modules to runtime concerns.

---

## F. Application-Manually-Enumerated Commands and Routes

**Rejected as the default model.**

The Application SHOULD NOT need to import and manually enumerate every command or route.

Registration is performed during module setup through typed context facades.

The Application controls context enablement without owning every individual definition.

---

# 24. Architectural Invariants

The following invariants are normative.

1. **One Kernel per application module graph.**
2. **Composition remains transport-agnostic.**
3. **Modules have one setup entrypoint.**
4. **Execution contexts are Application-owned.**
5. **Execution contexts use explicit typed registration facades.**
6. **Each execution context MAY have its own registry.**
7. **Each execution context MAY have its own Execution Facade.**
8. **Execution Facades are not Kernels.**
9. **Generic contribution registries are forbidden.**
10. **Scope is not part of the Comity architecture.**
11. **Child DI containers are not introduced for execution contexts.**
12. **Technology adapters remain outside Core Modules.**
13. **The Kernel remains transport-agnostic.**
14. **Execution-context runtime lifecycle MUST NOT redefine Kernel lifecycle.**
15. **Replacing an execution-context Adapter MUST NOT require changes to domain logic.**
16. **Core Module dependencies MUST follow the official layering policy.**

---

# 25. Decision Summary

Comity will use **Application-owned Execution Context Composition**.

The canonical pattern is:

```text
                    Shared Application Composition
                               │
                               ▼
                            Kernel
                               │
                 ┌─────────────┴─────────────┐
                 │                           │
          CLI context                  HTTP context
                 │                           │
                 ▼                           ▼
      CliRegistrationFacade       HttpRegistrationFacade
                 │                           │
                 ▼                           ▼
         CommandRegistry              RouteRegistry
                 │                           │
                 ▼                           ▼
       CliExecutionFacade           HttpExecutionFacade
                 │                           │
                 ▼                           ▼
       cli-commander adapter          http-hono adapter
```

The architecture deliberately favors **explicit, typed, context-specific abstractions** over generic contribution infrastructure.

There is:

- **one Kernel**
- **one module setup model**
- **no Scope**
- **no generic ContributionToken**
- **no ContributionStore**
- **no `ctx.contribute()`**
- **no child DI**
- **no transport-specific module entrypoints**

The shared Kernel remains the foundation.

Execution Facades define runtime boundaries.

Typed Registration Facades define context participation.

Registries hold context-specific definitions.

Adapters bind those definitions to concrete technologies.

This is the minimal architecture that satisfies Comity's layering, replacement, composability, and transport-independence principles.
