# Comity Coding Standards — Architecture Validation

This document defines the **normative architecture rules** for the Comity repository. It states what the architecture requires, independent of whether an automated tool enforces it today.

> Scope: architectural rules only. The future automated enforcement layer is described separately in the "Future Enforcement" section and in the migration plan — it does not exist yet.

---

## 1. Purpose

Architecture validation keeps repository changes aligned with the Comity layering model. It verifies that changes do not introduce violations of:

- Layering Policy (`docs/standards/layering-policy.md`)
- Dependency Graph Policy (`docs/standards/dependency-graph-policy.md`)
- Adapter rules (`docs/standards/adapters.md`, ADR-007)
- Core Module composition exceptions (ADR-008)
- Package governance rules (`docs/standards/public-api.md`, `docs/standards/read-me.md`)

Rules in this document are normative. The enforcement layer that automates them is a future deliverable and is not assumed to exist.

---

## 2. Authoritative Sources

When documents conflict, the following hierarchy resolves the dispute (highest first):

1. **ADR series** (`docs/standards/decisions/`) — accepted architectural decisions (ADR-007 Adapter classification, ADR-008 Core Module composition exceptions).
2. **Layering Policy** (`layering-policy.md`) — layer definitions, responsibilities, and the direction of dependencies.
3. **Dependency Graph Policy** (`dependency-graph-policy.md`) — allowed and forbidden edges between packages.
4. **Adapters** (`adapters.md`) — adapter categories, boundaries, and technology binding rules.
5. **Public API Policy** (`public-api.md`) — package classification and public surface rules.
6. **README Standard** (`read-me.md`) — package documentation contracts.
7. **Repository Inventory** (`docs/architecture/repository.md`) — the recorded, verified state of the repository.

A newer ADR supersedes an older ADR. A document that contradicts a higher-ranked source is in error and MUST be aligned.

---

## 3. Package Classification

Every `@comity/*` package belongs to exactly one category (per `public-api.md §1`):

| Category                 | Packages                                                                                                                                                                                                                                                                                                                                                                                                                        | Characteristics                                                       |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| **Kernel / Primitives**  | `@comity/primitives`, `@comity/kernel`, `@comity/composition`                                                                                                                                                                                                                                                                                                                                                                   | Foundational building blocks and the runtime engine.                  |
| **Core Modules**         | `@comity/http`, `@comity/router`, `@comity/html`, `@comity/hydration`, `@comity/auth`, `@comity/auth-tokens`, `@comity/cache`, `@comity/catalog`, `@comity/order`, `@comity/content`, `@comity/media`, `@comity/search`, `@comity/seo`, `@comity/i18n`, `@comity/sql`, `@comity/storage`, `@comity/storefront`, `@comity/graphql-builder`, `@comity/graphql-client`, `@comity/address`, `@comity/geography`, `@comity/identity` | Business abstractions and contracts.                                  |
| **Technology Adapters**  | `@comity/http-hono`, `@comity/router-path-to-regexp`, `@comity/html-react`, `@comity/html-preact`, `@comity/hydration-react`, `@comity/hydration-preact`, `@comity/auth-jose`, `@comity/cache-kv`, `@comity/cache-redis`, `@comity/i18n-typesafe`, `@comity/sql-kysely`, `@comity/graphql-client-ws`, `@comity/graphql-client-fetch`, `@comity/http-fetch`, `@comity/validation-zod`                                            | One Core Module to one interchangeable technology.                    |
| **Integration Adapters** | None in this repository                                                                                                                                                                                                                                                                                                                                                                                                         | One external platform to one or more Core Module contracts (ADR-007). |
| **Draft Packages**       | `@comity/customer`, `@comity/validation`                                                                                                                                                                                                                                                                                                                                                                                        | Core Modules in draft state; same rules as Core Modules.              |

Classification is decided by architectural review and recorded in `public-api.md` and `docs/architecture/repository.md`, not inferred from version numbers.

---

## 4. Dependency Graph Rules

The dependency graph is built from the `dependencies` field of each `packages/*/package.json`. Only workspace (`@comity/*`) dependencies are considered for layering validation.

### 4.1 Allowed Edges (from `dependency-graph-policy.md`)

- `primitives` → (no internal deps)
- `kernel` → `primitives`
- `composition` → `kernel`, `primitives`
- Core Modules → `primitives`, `kernel`
- Technology Adapters → the ONE Core Module they implement + `primitives` (+ composition infrastructure, per `layering-policy.md §2.3`)
- Integration Adapters → the Core Modules whose contracts they implement + the Technology Adapters that provide their technology (ADR-007)
- Applications → everything below (no Application packages exist in this repository)

### 4.2 Forbidden Edges

- contracts must never depend on adapters
- primitives must never depend on any other internal package
- no cross-adapter dependencies
- rendering modules must never depend on HTTP runtime implementations or transport behavior
- reverse dependencies (lower layer depending on higher layer)
- any edge that contradicts a rule in a higher-ranked source

### 4.3 Rendering Modules and HTTP Contract Types

Rendering Core Modules MUST NOT depend on HTTP runtime implementations or transport behavior. A Rendering Core Module MAY reference HTTP contract types only when the import is type-only, the dependency is registered in ADR-008 as an Infrastructure Contract Exception, and no HTTP execution logic is introduced.

---

## 5. Core-to-Core Dependency Rule (Closed Register)

> Core Modules MUST NOT depend on other Core Modules unless explicitly allowed. — `layering-policy.md §2.2`

This default is absolute. A Core-to-Core dependency exists **only** as an approved exception.

### 5.1 The Exception Register

The exhaustive, closed list of approved Core-to-Core exceptions is maintained in **ADR-008 — Explicit Core Module Composition Exceptions**, section "Dependency Register (closed list)".

ADR-008 is the single source of truth for the register. This standard does not duplicate it.

### 5.2 Rules

- Every Core → Core edge MUST match an entry in the ADR-008 register.
- An unregistered Core → Core edge is a violation and MUST be removed or approved via a new ADR.
- A Core Module that depends on another Core Module through an unregistered edge fails validation.
- Removing a registered exception requires an ADR update.
- The register classifies exceptions as Capability Exceptions, Infrastructure Contract Exceptions, or Candidates for Removal. Candidates for Removal remain registered until the migration is executed; they are not a license to add similar edges.

### 5.3 Multi-category Edges

An edge may carry both type imports and value imports (e.g. `auth-tokens → auth` registers an error-surface value import; a capability edge may also carry a value import when DI wiring requires it). Both classifications belong to the same register entry. Value imports require explicit justification in ADR-008.

---

## 6. Kernel Boundary

The Kernel layer (`@comity/primitives`, `@comity/kernel`, `@comity/composition`) is foundational:

- `@comity/primitives` MUST NOT depend on any other internal package.
- `@comity/kernel` MUST NOT depend on any package except `@comity/primitives`.
- `@comity/composition` MUST NOT depend on any package except `@comity/kernel` and `@comity/primitives`.

The Kernel MUST NOT depend on HTTP, SQL, Auth, HTML, or any infrastructure Core Module (`layering-policy.md §2.1`). A Kernel → Core dependency is a violation.

---

## 7. Adapter Rules

Adapters are identified by the package classification in Section 3.

### 7.1 Technology Adapters

- implement/bind exactly ONE Core Module;
- MAY depend on the Core Module they implement;
- MAY depend on `@comity/primitives` and `@comity/kernel`;
- MAY consume technology-agnostic composition infrastructure from another Core Module without becoming an adapter for that module (`layering-policy.md §2.3`);
- MUST NOT depend on other adapters;
- MUST NOT depend on Application-layer code;
- MUST NOT introduce business logic.

### 7.2 Integration Adapters

- integrate a SINGLE external platform/system;
- MAY implement contracts from MULTIPLE Core Modules (per ADR-007 qualifying criteria);
- MAY depend on the Core Modules whose contracts they implement;
- MAY depend on the Technology Adapters that provide their technology;
- MUST NOT depend on other Integration Adapters;
- MUST NOT depend on Application-layer code;
- MUST NOT become a masked Application Layer.

### 7.3 Forbidden Adapter Edges

- Adapter → Adapter (both Technology and Integration)
- Core Module → Adapter
- Adapter → Application-layer code

### 7.4 Technology Binding Policy (`adapters.md §12`)

Technology bindings (third-party libraries an adapter binds to) SHOULD be declared as `peerDependencies` when the consumer controls the version, duplicate runtime instances must be avoided, or the adapter only binds to the technology. Dependencies may remain regular dependencies when the adapter owns the dependency lifecycle. The bound technology version MUST also be declared as a `devDependency` so the adapter builds and tests in isolation.

---

## 8. Package Metadata Rules

Every package MUST satisfy the following (all `packages/*` conform today):

```json
{
  "name": "@comity/<name>",
  "version": "0.x.y",
  "description": "...",
  "type": "module",
  "license": "...",
  "engines": { "node": ">=24.0.0" }
}
```

Rules:

- `type` MUST be `module`.
- `engines.node` MUST be `>=24.0.0`.
- `name` MUST follow the `@comity/<name>` convention.
- Deviations are recorded in `docs/migrations/` and are temporary; a compliant package MUST NOT deviate.

---

## 9. Export and Public Surface Rules

### 9.1 Exports Resolution

- Every declared `exports` target MUST resolve to an existing file.
- `typesVersions` entries MUST have matching `exports` entries.
- Sub-entrypoints MUST follow `public-api.md §3` (allowed paths) and MUST NOT use forbidden paths (`/utils`, `/helpers`, `/shared`, `/internal`, `/lazy`).

### 9.2 Root Barrel Rules

- Core Module root barrel: entities, value objects, contract types, facade contracts, canonical domain implementations (`public-api.md §2.1`).
- Technology Adapter root barrel: the single Core Module contract implementation + optional type-only config exports (`public-api.md §2.2`).
- Integration Adapter root barrel: the concrete implementations of the contracts it satisfies; MUST NOT re-export Core Module contracts (`public-api.md §2.2`, `adapters.md §11`).
- Kernel / Primitives root barrel: limited to the documented public identity (`public-api.md §2.3`).

### 9.3 TypeScript Export Rules

- Use explicit `export` syntax.
- Value exports for runtime classes/functions/constants; type exports for structural types.
- MUST NOT use `export { SomeInterface };` even with `verbatimModuleSyntax: false` (`public-api.md §8`).

---

## 10. README Documentation Contracts (`read-me.md`)

Every package README MUST contain exactly these sections, in order:

```
# @comity/[name]
[one-sentence description, max 10 words]
## Purpose
## Scope
## Public API
## Documentation
## Related Packages
## Status
```

Rules:

- `## Status` MUST contain a stable/experimental/draft label and review metadata. Vocabulary: `Draft` (design incomplete or not ready for general usage), `Experimental` (usable, APIs may change without compatibility guarantees), `Stable` (public API compatibility guaranteed).
- Dates MUST be ISO `YYYY-MM-DD`.
- Compliance MUST be recorded as `Compliance: N% (Green)`.
- Forbidden sections: Getting Started, Installation, Usage, Examples, API Reference, Contributing, License, and emoji headers.
- The line `No exhaustive reference; see docs for constraints.` is mandatory in `## Public API`.

---

## 11. Current Repository Conformance

Verified state (2026-08-15):

| Rule                                                                                                   | Status                                               |
| ------------------------------------------------------------------------------------------------------ | ---------------------------------------------------- |
| Kernel layer dependencies (primitives/kernel/composition)                                              | Conform                                              |
| All Core-to-Core edges registered in ADR-008                                                           | Conform (16 edges verified)                          |
| Adapter classification (15 Technology)                                                                 | Conform                                              |
| Adapter → Adapter edges                                                                                | None present                                         |
| `type: module`, `engines.node >= 24.0.0`, `license`                                                    | Conform (all 42 packages)                            |
| README date format `YYYY-MM-DD`                                                                        | **Non-conforming** (35 READMEs use non-ISO dates)    |
| README `## Public API` "No exhaustive reference" line                                                  | **Non-conforming** (23 of 42 packages missing)       |
| Adapter peerDependency/devDependency pairing (`adapters.md §12`)                                       | **Non-conforming** (`cache-redis`, `validation-zod`) |
| Dead internal dependencies (`auth-jose` → `kernel`; `graphql-client-ws` → `composition`, `primitives`) | **Non-conforming**                                   |

Non-conformances listed above constitute the migration backlog. Closing them is part of the future enforcement work described in the next section.

---

## Future Enforcement

The architecture validator is implemented as a read-only conformance checker.

The validator:

- verifies existing architectural rules;
- validates repository state against standards and ADRs;
- consumes ADR-008 and ADR-009 artifacts.

The validator is not an architectural authority:

- ADR-008 remains the authority for Core-to-Core exceptions;
- ADR-009 remains the authority for register serialization;
- standards remain the authority for architectural rules.

Future integration into repository workflows is intentionally a separate decision.

### Target State

- An architecture validator runs as part of CI and MUST fail on architecture violations.
- The validator builds the dependency graph from `packages/*/package.json` and evaluates the rules in Sections 4–10.
- The ADR-008 exception register is consumed in machine-readable form (a future serialization of ADR-008) so that registered edges are checked automatically and unregistered edges fail.

### Scope of Validator

- Package metadata
- Dependency graph
- Layer boundaries
- Public API boundaries
- Documentation contracts

---

## References

- ADR-007 — Multi-Context Adapter Architecture (Integration Adapter category)
- ADR-008 — Explicit Core Module Composition Exceptions (closed register)
- `docs/standards/layering-policy.md`
- `docs/standards/dependency-graph-policy.md`
- `docs/standards/adapters.md`
- `docs/standards/public-api.md`
- `docs/standards/read-me.md`
- `docs/architecture/repository.md`
