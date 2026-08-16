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

### Refactoring Definition

**Refactoring** means any of:

- Renaming identifiers that appear in more than 3 locations
- Extracting functions shared by more than 2 files
- Moving code between modules or layers
- Restructuring inheritance or composition hierarchies

Refactoring requires explicit justification in the PR description, even when classified as a local implementation change.

### Unrelated Issues Definition

**Unrelated issues** are problems discovered in:

- Different files not required for the current change
- Different packages
- Different responsibility boundaries, even within the same file

When discovered:

1. Describe the issue in the PR description as a follow-up
2. Do not fix it in the current PR
3. Do not block the PR on the discovery

### New Abstraction Criteria

**New abstractions** are not allowed for:

- Convenience or syntactic sugar
- Deduplication alone (extract a function instead)
- Future-proofing speculative scenarios

**New abstractions** are allowed when they:

- Enable dependency inversion (replace direct dependency with contract)
- Enable testability (isolating a component for unit testing)
- Replace conditional dispatch with polymorphism (strategy pattern)

When proposing a new abstraction, state which criterion applies in the PR description.

---

## Agent Operating Model

### Before Any Change

The agent MUST:

1. Read the package README.md if available.
2. Read package docs:
   - docs/overview.md
   - docs/conventions.md
   - docs/architecture.md (if present)
3. Inspect package.json exports.
4. Inspect src/index.ts public API.
5. Identify architectural layer.
6. Check dependency direction.
7. Search existing patterns before introducing new ones.

Never introduce a new pattern without checking existing implementations.

**Hotfix exception:** For production emergencies, minimum context is sufficient (read README and identify the owning package). Full checklist is completed post-incident and documented in the PR description.

---

### Change Classification

Before modifying code, classify the request:

#### Documentation only

Allowed:

- README
- docs/\*
- comments

No ADR required.

---

#### Local implementation change

Examples:

- bug fix
- missing test
- internal refactor

Requires:

- preserve public API
- preserve dependencies

A single PR touching multiple packages for the same interface alignment, shared contract, or cross-cutting concern counts as **one** change. Apply the highest classification required by any file modified.

Example: updating a shared interface signature across 5 packages = one Architectural change, not five Local changes.

---

#### Architectural change

Examples:

- new contract
- new dependency
- moving ownership
- new package

Requires:

- ADR
- DESIGN.md
- explicit review

---

### Agent Behavior

Agents should prefer:

- asking clarification over guessing
- documenting uncertainty
- following existing patterns
- small incremental changes

Agents should avoid:

- creating abstractions prematurely
- introducing convenience APIs
- duplicating existing concepts
- changing architecture during implementation

---

## Scope Discipline

Every task must respect its declared scope.

> **Rule Priority applies.** If a rule conflict arises, Correctness and Architecture rules override Scope Discipline. Document the conflict and resolution in the PR description.

| Scope         | Allowed                                                   | Forbidden                 |
| ------------- | --------------------------------------------------------- | ------------------------- |
| Documentation | Modify docs, README, conventions                          | Modify source code        |
| Refactoring   | Restructure code, extract helpers                         | Redesign architecture     |
| Cleanup       | Remove dead code, fix style                               | Change behavior           |
| Analysis      | Observe, measure, report                                  | Modify files              |
| Bug fix       | Fix targeted issue, update tests required for correctness | Refactor surrounding code |

If a change exceeds the requested scope, stop and report it.

Test updates required for fix correctness are part of the bug fix scope. This includes:

- Updating assertions that no longer match corrected behavior
- Adding regression tests for the reported scenario
- Removing tests that validate the incorrect behavior

Test refactoring beyond these three cases is out of scope.

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

## Rule Priority

When rules conflict, apply in this order:

1. **Correctness** — bugs, security, data integrity
2. **Architecture** — layering, contracts, dependency direction
3. **Scope Discipline** — local vs architectural change
4. **Style** — consistency, patterns, conventions

Higher priority rules override lower priority rules.

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

Two categories, governed by ADR-007:

**Technology Adapters** — bind a Core Module contract to a technology implementation.

- MUST depend on exactly one Core Module
- Depend on a third-party library (peerDependency)
- Must remain replaceable
- Must not introduce business logic

Example: `http-hono → http`, `sql-kysely → sql`

**Integration Adapters** — represent platform or ecosystem integrations (ADR-007).

- MAY depend on multiple Core Modules
- Bind a single external platform/system
- Must remain replaceable as a whole
- Must not introduce business logic

Example: a storefront platform integration → `storefront, catalog, router, cache, graphql-client`

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

## Public API Evolution

Public API preservation is the default.

When the public API itself is incorrect:

1. Document the defect
2. Propose the change with migration path
3. Apply the highest rule priority (Correctness over Architecture)
4. Never silently break existing consumers

Breaking changes require explicit justification. The PR description must explain why the contract cannot be preserved.

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

**Configuration** applies to initialization-time setup.

Runtime reload, config rotation, and dynamic configuration sources are supported patterns and do not violate this rule.

When in doubt, ask: does this configuration value exist before the module first serves a request?

- Yes → governed by the configuration chain
- No → runtime configuration, outside this rule's scope

---

## Code Style

**Prefer:** immutable data, pure functions, dependency injection, small interfaces, explicit contracts.

**Avoid:** static state, hidden globals, service locators outside composition, unnecessary inheritance, framework-specific types in Core Modules.

**Comments:** Forbidden by default. Exceptions:

- Public API JSDoc documentation (required)
- Non-obvious behavior in local implementations (allowed when code cannot be self-explanatory)
- Security-sensitive logic (required)

---

## Consistency Rule

When two valid solutions exist, choose the one that matches the existing architecture. Consistency takes precedence over optimization. A framework is maintained through coherence, not elegance.

**Exception:** If the existing pattern is documented as an architectural defect, do not replicate it. Apply Rule Priority: Architecture defects are resolved, not preserved.

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
