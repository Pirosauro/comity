# AGENTS.md — Comity Framework

## Purpose

Comity is an enterprise-grade, modular TypeScript framework built around strict architectural layering.

The primary goal is long-term maintainability through explicit contracts, replaceable infrastructure, and dependency inversion.

When contributing to Comity, your primary responsibility is **preserving the architecture**, not simply implementing features.

---

## Change Policy

Unless explicitly requested:

- do not refactor
- do not rename public APIs
- do not move files
- do not redesign modules
- do not introduce new abstractions
- do not fix unrelated issues discovered during the task

Focus only on the requested scope.

If architectural issues are discovered, report them as follow-up items rather than fixing them automatically.

---

## Scope Discipline

Every task must respect its declared scope.

| Scope         | Allowed                           | Forbidden                 |
| ------------- | --------------------------------- | ------------------------- |
| Documentation | Modify docs, README, conventions  | Modify source code        |
| Refactoring   | Restructure code, extract helpers | Redesign architecture     |
| Cleanup       | Remove dead code, fix style       | Change behavior           |
| Analysis      | Observe, measure, report          | Modify files              |
| Bug fix       | Fix targeted issue, add tests     | Refactor surrounding code |

If a change exceeds the requested scope, stop and report it.

---

## Documentation Policy

Documentation must describe the current implementation. Documentation must never invent future APIs.

- Architecture documents describe current architectural intent
- README files describe public usage
- Conventions documents describe package-specific rules
- Overview documents describe what a package provides

Do not document features that do not exist.

---

## Architectural Review Policy

When reviewing architecture:

- distinguish observations from recommendations
- distinguish architectural defects from possible improvements
- classify findings by severity
- avoid proposing redesigns unless requested

---

## Decision Classification

Findings should be classified as one of:

| Classification           | Definition                                                      |
| ------------------------ | --------------------------------------------------------------- |
| **Bug**                  | Behavior contradicts intended behavior                          |
| **Documentation Drift**  | Documentation does not match implementation                     |
| **Technical Cleanup**    | Dead code, naming inconsistencies, style violations             |
| **Architectural Defect** | Violates layering, dependency direction, or contract boundaries |
| **ADR Candidate**        | A design decision that should be formally captured              |
| **Future Improvement**   | An enhancement that is out of current scope                     |

Do not mix these categories.

---

## Evidence First

Every architectural statement should be supported by repository evidence. Prefer consulting:

- `package.json` (imports, exports, dependencies)
- source code
- tests
- documentation

Avoid assumptions based solely on naming.

---

## Planning Policy

Planning documents must never assume implementation.

Planning should describe:

- current state
- target state
- required actions

Implementation belongs to execution phases.

Planning stays in read-only scope.

---

## Escalation Rules

When uncertain about architecture or design:

- ask for clarification

Do not invent architecture. Do not introduce new concepts without explicit request.

When multiple interpretations exist, prefer the one that stays within the declared scope.

---

## Core Principles

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

## Architecture

Comity follows a strict layering model.

```
Application
      ↓
Adapters
      ↓
Core Modules
      ↓
Kernel / Primitives
```

Dependencies may only flow downward. Reverse dependencies are architectural defects.

### Layer Responsibilities

**@comity/primitives** — Foundational building blocks.

- Result, Error types, Tokens, Utility types, Value objects, Shared contracts
- No runtime state, No infrastructure, No business logic, No policies

**@comity/kernel** — Runtime engine.

- Module lifecycle, dependency injection, service registration, event dispatching, hook execution, module initialization
- No HTTP, No Router, No HTML, No Storefront, no infrastructure-specific code
- The Kernel orchestrates modules. It never implements application behavior.

**Core Modules** — Business abstractions (e.g. `@comity/http`, `@comity/catalog`, `@comity/sql`).

- MAY depend on `@comity/primitives`
- MAY depend on `@comity/kernel` when runtime capabilities required
- MUST NOT depend on Adapters
- MUST NOT depend on Applications
- SHOULD avoid dependencies on other Core Modules unless explicitly justified
- Core Modules define contracts, not implementations

**Adapters** — Integrate external technologies (e.g. `@comity/http-hono`, `@comity/sql-kysely`).

- Depend on one Core Module
- Depend on a third-party library (peerDependency)
- Must remain replaceable
- Must not introduce business logic

**Application** — Composes the framework.

- Owns configuration, routing, presenters, business orchestration
- May depend on every lower layer

---

## Module Philosophy

Each package should have a single responsibility. A module should expose the minimum public API necessary.

Avoid convenience APIs that leak implementation details. Contracts should remain stable even if implementations change.

---

## Contracts vs Implementations

Contracts belong to Core Modules. Implementations belong to Adapters or Applications.

```
Core Module:   CategoryRepository          (abstraction)
Adapter:       MagentoGraphqlCategoryRepository  (implementation)
```

Repositories return domain models. They never return: view models, page models, React components, HTML, framework-specific objects. Transformations belong to higher layers.

---

## Composition Model

Comity favors composition over inheritance. Objects should be assembled through small composable units.

Prefer: Composer, Enricher, Resolver, Transformer. Avoid deep inheritance hierarchies.

---

## Configuration

Every configurable module follows the same chain:

```
defaults → user options → configuring hook
```

Never bypass this mechanism. Configuration should never be modified after initialization.

---

## Code Style

**Prefer:** immutable data, pure functions, dependency injection, small interfaces, explicit contracts.

**Avoid:** static state, hidden globals, service locators outside composition, unnecessary inheritance, framework-specific types in Core Modules.

---

## Consistency Rule

When two valid solutions exist, choose the one that matches the existing architecture. Consistency takes precedence over optimization. A framework is maintained through coherence, not elegance.

---

## Before Opening a Pull Request

- [ ] Layering is respected — dependencies flow downward
- [ ] No reverse dependencies
- [ ] No framework types leaked into Core Modules
- [ ] Contracts are stable — no breaking changes without justification
- [ ] New abstractions are justified — not created "just in case"
- [ ] Public APIs include JSDoc documentation
- [ ] `package.json` subpath exports align with physical `src/` folders
- [ ] Tests cover new behavior
- [ ] Changes preserve module replaceability

If a feature requires violating these principles, redesign the solution before implementing it.
