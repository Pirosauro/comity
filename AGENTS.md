# AGENTS.md — Comity Framework

## Purpose

Comity is an enterprise-grade, modular TypeScript framework built around strict architectural layering.

The primary goal is long-term maintainability through explicit contracts, replaceable infrastructure, and dependency inversion.

When contributing to Comity, your primary responsibility is **preserving the architecture**, not simply implementing features.

Every change should reinforce the framework's design principles:

- Explicit boundaries
- Minimal abstractions
- Infrastructure replaceability
- Strong contracts
- Composition over inheritance
- Framework independence

When in doubt, architectural consistency takes precedence over convenience.

---

# Core Principles

Before writing any code, determine:

1. Which architectural layer owns this responsibility?
2. Is this an abstraction or an implementation?
3. Does this belong in a Core Module, Adapter, Extension, or Application?
4. Can this dependency be inverted?
5. Does this introduce framework coupling?
6. Can this implementation be replaced without affecting business logic?

Never start from "where can I put this?"

Always start from "who owns this responsibility?"

---

# Architecture

Comity follows a strict layering model.

```
Applications
      ↓
Extensions
      ↓
Adapters
      ↓
Core Modules
      ↓
Kernel / Primitives
```

Dependencies may only flow downward.

Reverse dependencies are architectural defects.

---

# Layer Responsibilities

## @comity/primitives

Contains the foundational building blocks of the framework.

Examples:

- Result
- Error types
- Tokens
- Utility types
- Value objects
- Shared contracts

Rules:

- no runtime state
- no infrastructure
- no business logic
- no policies

---

## @comity/kernel

Contains the runtime engine of Comity.

Responsibilities:

- module lifecycle
- dependency injection
- service registration
- event dispatching
- hook execution
- module initialization

Rules:

- no HTTP
- no Router
- no HTML
- no Storefront
- no infrastructure-specific code

The Kernel orchestrates modules.
It never implements application behavior.

---

## Core Modules

Examples:

- @comity/http
- @comity/router
- @comity/html
- @comity/storefront
- @comity/catalog

Purpose:

Expose reusable abstractions.

Rules:

- Depend only on Kernel.
- Never depend on Adapters.
- Never depend on frameworks.
- Define contracts.
- Own business abstractions.

Core Modules SHOULD depend only on @comity/primitives. They MAY depend on @comity/kernel only when runtime integration (hooks, services, lifecycle, events, or module composition) is required.

---

## Adapters

Examples:

- @comity/http-hono
- @comity/html-react
- @comity/storefront-magento
- @comity/sql-kysely

Purpose:

Integrate external technologies.

Rules:

- May depend on one Core Module.
- May depend on third-party libraries.
- Must remain replaceable.
- Must not introduce business logic.

Adapters own infrastructure.

---

## Extensions

Purpose:

Cross-cutting policies.

Examples:

- Rate limiting
- Tracing
- Retries
- Timeouts
- Circuit breakers

Extensions implement policy, not abstraction.

---

## Application

Application code composes the framework.

It owns:

- configuration
- routing
- presenters/renderers
- business orchestration

Applications may depend on every lower layer.

---

# Module Philosophy

Each package should have a single responsibility.

A module should expose the minimum public API necessary.

Avoid convenience APIs that leak implementation details.

Contracts should remain stable even if implementations change.

---

# Contracts vs Implementations

Always distinguish between contracts and implementations.

Contracts belong to Core Modules.

Implementations belong to Adapters or Applications.

Example:

```
CategoryRepository
```

belongs to a Core Module.

```
MagentoGraphqlCategoryRepository
```

belongs to an Adapter.

---

# Repository Rules

Repositories return domain models.

Repositories never return:

- View models
- Page models
- React components
- HTML
- Framework-specific objects

Transformations belong to higher layers.

---

# Composition Model

Comity favors composition over inheritance.

Objects should be assembled through small composable units.

Prefer:

- Composer
- Enricher
- Resolver
- Transformer

Avoid deep inheritance hierarchies.

---

# Configuration

Every configurable module follows the same hierarchy.

```
Defaults
    ↓
User configuration
    ↓
Adapter overrides
```

Configuration precedence:

```
defaults
    ↓
user options
    ↓
configuring hook
```

Never bypass this mechanism.

---

# Hooks

Standard hook names:

```
@comity/module:configuring
```

Used to modify configuration.

```
@comity/module:initialized
```

Signals initialization completion.

Configuration should never be modified after initialization.

---

# Services

Services are registered through the service container.

Prefer lazy registration.

```
ctx.services.define(TOKEN, () => implementation)
```

Avoid eager construction whenever possible.

---

# Storefront Architecture

Storefront follows this flow.

```
HTTP Request
        ↓
URL Rewriter
        ↓
Router
        ↓
Handler
        ↓
Page Composer
        ↓
Enrichers
        ↓
PageModel
        ↓
Renderer
        ↓
Response
```

Responsibilities:

- Rewriter resolves URLs.
- Handler coordinates the request.
- Composer builds the base PageModel.
- Enrichers add optional information.
- Renderer produces HTML, JSON, React, Vue, etc.

Repositories never render.

Renderers never access repositories.

---

# Rendering

Rendering is independent from business logic.

A renderer receives a PageModel.

It never loads data.

It never queries repositories.

Different renderers may exist for:

- React
- Preact
- Vue
- API
- Static HTML

The same PageModel should work across renderers.

---

# Dependency Rules

Never introduce dependencies that violate layering.

Forbidden examples:

- Kernel importing HTTP
- Core Module importing Adapter
- Adapter importing Application
- Repository importing React
- HTML renderer importing Storefront internals

---

# Design Philosophy

When multiple solutions exist, prefer the one that is:

1. More explicit.
2. More replaceable.
3. Easier to compose.
4. Less coupled.
5. Smaller.

Avoid "magic".

Comity values explicit composition over implicit behavior.

---

# Code Style

Prefer:

- immutable data
- pure functions
- dependency injection
- small interfaces
- explicit contracts

Avoid:

- static state
- hidden globals
- service locators outside composition
- unnecessary inheritance
- framework-specific types in Core Modules

---

# Before Opening a Pull Request

Verify:

- Layering is respected.
- Dependencies flow downward.
- Contracts remain stable.
- New abstractions are justified.
- No framework types leaked into Core Modules.
- Public APIs include documentation.
- Tests cover new behavior.
- Changes preserve module replaceability.

If a feature requires violating these principles, redesign the solution before implementing it.
