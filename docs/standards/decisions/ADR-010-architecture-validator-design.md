# ADR-010 — Architecture Validator Design

> **Note:** This is the Community-specific transitional copy. The canonical Comity-wide version is maintained in `comity-development/docs/standards/decisions/ADR-010-architecture-validator-design.md`
**Status:** Accepted

## Context

Comity enforces a strict layering model: dependencies flow downward only, and architectural rules are documented across `docs/standards/` and the ADR series.

ADR-008 introduced the closed register of Core-to-Core dependency exceptions. ADR-009 defined its machine-readable serialization (`docs/standards/decisions/data/adr-008-core-exception-register.json` and its JSON Schema). Today, however, all of these rules are verified **manually** through architectural review; there is no automated enforcement.

`docs/standards/architecture-validation.md` describes a future automated validation layer ("Future Enforcement — Planning — Does Not Exist") and records the current repository conformance state in its Section 11 table, including a migration backlog of known non-conformances.

ADR-010 defines the **design** of the future validator. It creates no new rules; it automates rules that already exist in the standards and ADR series.

## Problem Statement

Architectural rules are currently enforced by human review. This has consequences:

- violations are detected late (after a dependency, export, or README change has landed);
- the ADR-008 closed register cannot be checked exhaustively by hand as the repository grows;
- consistency between standards and repository state depends on each reviewer's diligence.

The repository needs an automated mechanism that verifies conformance to the documented architecture model, reports violations deterministically, and supports gradual adoption over an existing repository with a known migration backlog.

## Decision

ADR-010 adopts the following design for a future architecture validator:

1. The validator is a **read-only checker**: it inspects repository files and reports violations. It never modifies files. Inspected inputs include package manifests (`packages/*/package.json`), README files (`packages/*/README.md`), documentation paths, and — for export/entrypoint validation — source files (`packages/*/src/**/*.ts`), used to verify that declared export targets resolve and that sub-entrypoint paths comply with `public-api.md §3`.
2. The validator consumes existing authoritative inputs only:
   - the repository dependency graph, derived from `packages/*/package.json` `dependencies`;
   - the ADR-008 exception register serialization (`docs/standards/decisions/data/adr-008-core-exception-register.json`), validated against `adr-008-core-exception-register.schema.json`;
   - the package classification defined by `public-api.md §1` and `docs/architecture/repository.md`;
   - the standards documents it references for rule constants (vocabulary, allowed status labels, canonical lines, allowed/forbidden export paths).
3. The validator is **not an architectural authority**. It reports conformance against ADR-008, ADR-009, and the standards; it does not define architecture.
4. The validator is introduced through a **baseline + gradual enforcement** strategy, never a big-bang rollout (see Baseline and Adoption Strategy).

## Validator Scope

The validator checks exactly the following areas. Nothing beyond these areas is validated.

### Dependency Validation

#### Kernel Layer

Rules (from `layering-policy.md §2.1`, `dependency-graph-policy.md`):

- `@comity/primitives` MUST NOT depend on any other internal package.
- `@comity/kernel` MUST NOT depend on any package except `@comity/primitives`.
- `@comity/composition` MUST NOT depend on any package except `@comity/kernel` and `@comity/primitives`.

Forbidden edges to report:

- `kernel → core`
- `kernel → adapter`
- `kernel → application`

#### Core Modules

Rules (from `layering-policy.md §2.2`, ADR-008):

- Core Module → Kernel / Primitives: allowed.
- Core Module → Core Module: forbidden unless registered in the ADR-008 register.
- Core Module → Adapter: forbidden.
- Core Module → Application: forbidden.

The validator compares the repository dependency graph against `docs/standards/decisions/data/adr-008-core-exception-register.json`. An edge present in the graph but absent from the register is a violation.

Draft packages are classified and validated according to their architectural category (per `architecture-validation.md §3`); Draft status does not create a relaxed dependency model. Draft Core Modules follow Core Module dependency rules, including the ADR-008 register.

#### Adapters

Rules (from `adapters.md §11`, `architecture-validation.md §7`, ADR-007):

- **Technology Adapter**: depends on exactly ONE Core Module (the contract it implements). May also depend on `@comity/primitives`, `@comity/kernel`, and technology-agnostic composition infrastructure.
- **Integration Adapter**: MAY depend on multiple Core Modules, per ADR-007 qualifying criteria (single platform, shared platform-specific layers, unified configuration, replaceable as a whole).

The validator uses ADR-007 as the source for the Integration Adapter category and its dependency allowance. A package classified as an Integration Adapter is checked against ADR-007 rules; a package classified as a Technology Adapter is checked against the one-Core-Module rule.

Forbidden adapter edges:

- Adapter → Adapter is forbidden by default, EXCEPT an Integration Adapter MAY depend on Technology Adapter(s) required to provide its underlying technology, according to ADR-007 (`adapters.md §11`, `architecture-validation.md §7.2`).
- Adapter → Application-layer code.
- Core Module → Adapter (reported under Core Modules above).

### Package Metadata Validation

Rules (from `architecture-validation.md §8`):

- package `name` MUST follow `@comity/<name>`.
- `type` MUST be `module`.
- `engines.node` MUST be `>=24.0.0`.
- `license` MUST be present.
- Declared `exports` targets MUST resolve to existing files.
- `typesVersions` entries MUST have matching `exports` entries.
- Sub-entrypoint paths MUST follow `public-api.md §3`: allowed paths only, forbidden paths (`/utils`, `/helpers`, `/shared`, `/internal`, `/lazy`) reported.

No new metadata fields are introduced. The validator checks fields that already exist and are already normative.

### Documentation Validation

#### README

Rules (from `docs/standards/read-me.md`, `architecture-validation.md §10`):

- `## Status` MUST contain a vocabulary label: `Stable` | `Experimental` | `Draft`, with review metadata.
- Dates MUST be ISO `YYYY-MM-DD`.
- Required sections, in order: `## Purpose`, `## Scope`, `## Public API`, `## Documentation`, `## Related Packages`, `## Status`.
- Forbidden sections: Getting Started, Installation, Usage, Examples, API Reference, Contributing, License, emoji headers.
- The canonical line `No exhaustive reference; see docs for constraints.` MUST appear in `## Public API`.

#### ADR References

The validator checks that documentation references:

- point to existing paths (no broken links to standards, ADRs, or data files);
- do not reference removed or renamed APIs;
- do not reference nonexistent numbered sections.

### ADR-008 Register Validation

The validator MUST verify:

1. **Completeness** — every real Core-to-Core edge in the repository dependency graph exists in the register.
2. **No stale entries** — every register entry must correspond to a real dependency edge, or be reported so the register can be reviewed/updated.
3. **Schema validation** — the register JSON MUST validate against `adr-008-core-exception-register.schema.json` (categories as array, import kind, lifecycle, conditional `removalCandidate`, required justification and ADR reference).

> See also `architecture-validation.md §5` — Exception Register validation.

## Architecture Rule Mapping

| Rule                                        | Source of truth                                         | Validator action                                          |
| ------------------------------------------- | ------------------------------------------------------- | --------------------------------------------------------- |
| Kernel isolation                            | `layering-policy.md §2.1`, `dependency-graph-policy.md` | Report forbidden kernel edges                             |
| Core-to-Core default forbidden              | `layering-policy.md §2.2`, ADR-008                      | Compare graph against register; report unregistered edges |
| Adapter categories and dependency allowance | `adapters.md §11`, ADR-007                              | Classify adapter and check its dependency set             |
| Package metadata                            | `architecture-validation.md §8`                         | Validate package.json fields                              |
| README contract                             | `read-me.md`, `architecture-validation.md §10`          | Validate sections, status, ISO dates, canonical line      |
| Register data contract                      | ADR-009, `adr-008-core-exception-register.schema.json`  | Validate register against its schema                      |

## Implementation Boundary

ADR-010 defines the validator's **design only**. It does not define:

- the programming language or runtime of the validator;
- its internal architecture;
- command names, entrypoints, or CLI surface;
- how the validator is invoked (repository tooling, pre-commit, CI, or otherwise);
- a specific JSON Schema validation library;
- any script or file that must exist.

Future integration may expose the validator through repository tooling; that is a separate decision. ADR-010 does not mandate or assume any specific integration point.

## Execution Model

The validator's execution is deliberately unspecified in ADR-010. Possible models include, without commitment:

- a standalone command run manually by maintainers;
- integration with repository tooling (e.g., a package manager task);
- a CI check gated on a green baseline;
- a pre-commit hook.

Any of these is a future integration decision. ADR-010 does not impose one, and it does not assert that any particular command exists today.

## Failure Reporting

Every reported violation MUST include:

- **rule violated** (with a stable code);
- **package(s) involved**;
- **dependency edge** (for dependency violations);
- **source document** (the standard/ADR that defines the rule);
- **remediation hint**.

Example:

```text
ARCH-CORE-001

Forbidden Core dependency

@comity/catalog
    →
@comity/order

Edge exists in repository dependency graph but is not registered as an approved exception.
Source: ADR-008 (docs/standards/decisions/ADR-008-explicit-core-module-composition-exceptions.md)
Remediation: register the edge via ADR, or remove the dependency.
```

Stable codes group violations by rule family (e.g., `ARCH-KERNEL-*`, `ARCH-CORE-*`, `ARCH-ADAPTER-*`, `ARCH-META-*`, `ARCH-README-*`, `ARCH-REGISTER-*`). The exact code scheme is an implementation detail of the future validator; ADR-010 requires only that codes be stable and deterministic.

## Baseline and Adoption Strategy

The repository already exists and contains known non-conformances recorded in `architecture-validation.md §11` (the migration backlog), for example README date format and the missing canonical "No exhaustive reference" line.

The validator MUST be introduced through a baseline + gradual enforcement strategy:

1. **Baseline** — the first validator run records the current conformance state as the baseline; known non-conformances are documented (they already are, in `architecture-validation.md §11`).
2. **Gradual enforcement** — rules are enabled incrementally as their non-conformances are cleared from the migration backlog. A rule that still has backlog items is reported as informational, not blocking, until its backlog is closed.
3. **No big-bang** — the validator never flips from "not present" to "blocks all changes" in a single change.

This preserves the documented migration backlog as the adoption driver: closing backlog items enables the corresponding rule.

## Migration Plan

1. **Create the validator** as a read-only checker implementing the Validation Rules above, consuming the existing register serialization and schema (per ADR-009).
2. **Establish the baseline** by running the validator against the current repository and reconciling output with `architecture-validation.md §11`.
3. **Clear the migration backlog** in order of dependency: fix non-conformances, enabling each rule family as it reaches green.
4. **Enable enforcement progressively**, per the Baseline and Adoption Strategy.
5. **Introduce integration** (repository tooling and/or CI) only after the baseline is green and stable; integration is a separate decision, not defined by ADR-010.

## Consequences

**Positive:**

- Architectural rules become checkable without human review.
- The ADR-008 register is verified exhaustively against the real dependency graph.
- The register and its schema (ADR-009) are validated automatically, keeping the serialization honest.
- Violations get deterministic, actionable output.

**Negative / Trade-offs:**

- The validator is a new component that must be maintained.
- Adoption depends on closing the migration backlog; until then, enforcement is gradual and partially informational.
- A read-only checker cannot prevent regressions at authoring time unless integration (e.g., CI) is added later.

## Scope

This ADR concerns:

- the design of the future architecture validator;
- the validation scope (dependencies, metadata, documentation, register);
- the mapping from architecture rules to validator checks;
- failure reporting requirements;
- baseline and gradual adoption strategy.

This ADR does NOT concern:

- any change to ADR-007, ADR-008, or ADR-009;
- any change to the ADR-008 register contents;
- new Core-to-Core exceptions;
- new package categories or layers;
- the validator's implementation (language, structure, commands);
- CI pipeline configuration or repository tooling integration;
- any script that must exist.

## References

- ADR-007 — Multi-Context Adapter Architecture (Integration Adapter category).
- ADR-008 — Explicit Core Module Composition Exceptions (closed register, sole authority on exceptions).
- ADR-009 — Machine-Readable Core Exception Register (data contract, sole authority on the register format).
- `docs/standards/decisions/data/adr-008-core-exception-register.json` — the serialized register consumed by the validator.
- `docs/standards/decisions/data/adr-008-core-exception-register.schema.json` — the schema the register must validate against.
- `docs/standards/architecture-validation.md` — normative rules and Section 11 conformance state; its "Future Enforcement" section describes this validator as a planning statement.
- `docs/standards/layering-policy.md` — layer definitions and dependency direction.
- `docs/standards/dependency-graph-policy.md` — allowed and forbidden edges.
- `docs/standards/adapters.md` — adapter categories and dependency rules.
- `docs/standards/public-api.md` — package classification and export rules.
- `docs/standards/read-me.md` — README documentation contract.
- `docs/architecture/repository.md` — recorded package inventory and classification.
