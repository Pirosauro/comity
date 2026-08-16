# Architecture Validator Baseline

**Date:** 2026-08-16
**Validator:** `scripts/validate-architecture.mjs` (Phase 1 — report-only)
**Status:** Baseline recorded. No changes were made to architecture, ADRs, or standards.

## Scope

This baseline records the first automated conformance run of the repository against the documented architecture model. It covers the rules implemented in the validator MVP: **ADR-008 Core-to-Core register validation**, **Kernel layer dependency boundary**, and **Adapter layer dependency rules** (Technology/Integration Adapter classification per ADR-007, `adapters.md §11`).

The Adapter rule `ARCH-ADAPTER-001` was refined (2026-08-15) to classify a Technology Adapter's Core Module references from its source: a real runtime dependency is a violation only when it is neither a type-only reference nor composition infrastructure, and an adapter is considered contract-implementing when it `implements` a Core contract type or binds a single real-runtime Core dependency. This removed three false positives while keeping the rule strict.

The Metadata Validation rule family (`ARCH-META-001..007`) was added (2026-08-16) per ADR-010 §Metadata Validation. Rules implemented:

- `ARCH-META-001` package name MUST follow `@comity/<name>` (`architecture-validation.md §8`).
- `ARCH-META-002` package `type` MUST be `module`.
- `ARCH-META-003` `engines.node` MUST exist and satisfy `>=24.0.0` (dependency versions are not enforced).
- `ARCH-META-004` `license` MUST exist (presence only; no value check).
- `ARCH-META-005` every declared `exports` target MUST resolve to an existing file (`./package.json` self-reference is treated as resolvable).
- `ARCH-META-006` every `typesVersions["*"]` entry MUST have a matching `exports` entry.
- `ARCH-META-007` exported subpaths MUST NOT use the forbidden paths (`/utils`, `/helpers`, `/shared`, `/internal`, `/lazy`) per `public-api.md §3.2`; allowed subpath membership is not enforced.

The validator was refactored (2026-08-16) per ADR-010 from a single monolith (`scripts/validate-architecture.mjs`) into modular domain files under `scripts/architecture-validator/`: `index.mjs` (orchestration), `context.mjs` (immutable validation context: repository root, package inventory, ADR/data paths, classification data), `graph.mjs` (dependency discovery, classification, graph construction), `report.mjs` (output formatting), `utils/{paths,filesystem}.mjs` (shared path and I/O helpers), and `rules/{kernel,core,adapters,metadata,readme,register}.mjs`. Each rule module exports `validate(context)` returning violations. `scripts/validate-architecture.mjs` remains the thin compatibility entrypoint. Rule logic, ARCH-* codes, remediation messages, and report output are unchanged.

Not covered by this run (future phases): CI integration.

## Repository Snapshot

Derived from `docs/architecture/repository.md` classification and `packages/*/package.json` discovery.

| Metric                                      | Count |
| ------------------------------------------- | ----- |
| Packages                                    | 42    |
| Kernel / Primitives                         | 3     |
| Core Modules                                | 22    |
| Technology Adapters                         | 15    |
| Integration Adapters                        | 0     |
| Draft packages                              | 2     |
| Internal `@comity/*` dependency edges (all) | 81    |
| Core-to-Core dependency edges               | 16    |
| ADR-008 register entries                    | 16    |

## Validation Results

Executed: `node scripts/validate-architecture.mjs` (exit code 0).

| Rule                                             | Status |
| ------------------------------------------------ | ------ |
| ADR-009 register schema                          | PASS   |
| Core dependency completeness                     | PASS   |
| Register stale entries                           | PASS   |
| Rejected exceptions as approved                  | PASS   |
| Kernel: primitives isolation                     | PASS   |
| Kernel: kernel dependency boundary               | PASS   |
| Kernel: composition dependency boundary          | PASS   |
| Adapter: no multi-Core-Module Technology Adapter | PASS   |
| Adapter: no cross-adapter edges                  | PASS   |
| Adapter: no Core Module → Adapter                | PASS   |
| Metadata: package naming                         | PASS   |
| Metadata: package type                           | PASS   |
| Metadata: Node engine                            | PASS   |
| Metadata: license                                | PASS   |
| Metadata: export target resolution               | PASS   |
| Metadata: typesVersions consistency              | PASS   |
| Metadata: public API subpath rules               | PASS   |

## Detected Violations

### Adapter rules

None. The three Technology Adapters that declare multiple Core Module dependencies
(`@comity/auth-jose`, `@comity/html-preact`, `@comity/html-react`) were previously
flagged by `ARCH-ADAPTER-001` on the raw dependency edge. Source-level analysis shows
each implements exactly one Core contract, with the additional dependency being either a
type-only reference or composition infrastructure:

1. `@comity/auth-jose` → `@comity/auth` (implements `AuthTokenService`); `@comity/auth-tokens` is type-only (`AuthTokenFacade`) plus canonical `DefaultAuthTokenFacade` (composition infrastructure). **PASS**
2. `@comity/html-preact` → `@comity/html` (implements `HtmlRenderer`); `@comity/http` is a type-only reference (`import type { HttpStatus }`). **PASS**
3. `@comity/html-react` → `@comity/html` (implements `HtmlRenderer`); `@comity/http` is a type-only reference (`import type { HttpStatus }`). **PASS**

These are regression PASS cases for the refined rule. No architecture, ADR, or manifest was changed.

### Metadata rules

No violations. The earlier `@comity/graphql-client-fetch` finding is resolved: the package now emits `dist/types/index.d.ts`, so both `import.types` and `require.types` targets resolve. All 42 packages satisfy `ARCH-META-001..007`.

## Comparison With Documentation

### Matching facts

- **`docs/standards/architecture-validation.md` §11** states "All Core-to-Core edges registered in ADR-008 — Conform (16 edges verified)". Validator confirms: 16 Core-to-Core edges, all present in the register (0 unregistered, 0 stale).
- **`docs/standards/architecture-validation.md` §11** states "Kernel layer dependencies (primitives/kernel/composition) — Conform". Validator confirms: `@comity/primitives` has no internal dependencies, `@comity/kernel` → `@comity/primitives`, `@comity/composition` → `@comity/kernel`, `@comity/primitives`. No Kernel violations.
- **`docs/architecture/repository.md`** inventory (42 packages: 3 Kernel/Primitives, 22 Core Modules, 15 Adapters, 2 Draft) matches validator classification output exactly (15 Technology + 0 Integration Adapter).
- **ADR-009 / ADR-010** load paths used by the validator match the documented locations (`docs/standards/decisions/data/adr-008-core-exception-register.json`, `.schema.json`, `ADR-008-explicit-core-module-composition-exceptions.md`).
- Example PASS case (`@comity/storefront → @comity/catalog`) is registered and validated clean.

### Adapter rule comparison (`architecture-validation.md §7`, ADR-007, `adapters.md §11`)

- **`architecture-validation.md` §11 "Adapter → Adapter edges — None present"** — confirmed: no Adapter → Adapter edges exist (the public repository currently has no Integration Adapter).
- **`architecture-validation.md` §11 "Adapter classification (15 Technology) — Conform"** — confirmed by classification from `docs/architecture/repository.md`.
- **Known observation `auth-jose → kernel`** — NOT a violation. `@comity/kernel` is in the Technology Adapter allowed set (`architecture-validation.md §7.1`: "MAY depend on `@comity/primitives` and `@comity/kernel`"). The `§11` "dead internal dependencies" entry classifies it as a metadata/dependency-hygiene concern, not a layering violation.
- **Known observations `graphql-client-ws → composition` and `graphql-client-ws → primitives`** — NOT violations. `@comity/composition` and `@comity/primitives` are Kernel-layer packages; Technology Adapters may depend on `@comity/primitives` and on composition infrastructure (`layering-policy.md §2.3`, `architecture-validation.md §4.1`). The `§11` "dead internal dependencies" entry reflects unused/declared dependency hygiene, not an adapter-rule violation.

### Metadata rule comparison (`architecture-validation.md §8`, `public-api.md §3`)

- **`architecture-validation.md §8`** states "`type: module`, `engines.node >= 24.0.0`, `license` — Conform (all 42 packages)". Validator confirms: all 42 packages satisfy `name`, `type`, `engines.node`, and `license`. No deviation from the documented conformance claim.
- **`architecture-validation.md §9.1`** states "Every declared `exports` target MUST resolve to an existing file" and "`typesVersions` entries MUST have matching `exports` entries". Validator confirms `typesVersions` consistency across all 42 packages but finds the missing `./dist/types/` output for `@comity/graphql-client-fetch` (two `import.types` / `require.types` targets point to the same non-existent file).
- **`public-api.md §3.2`** forbidden subpaths (`/utils`, `/helpers`, `/shared`, `/internal`, `/lazy`) are not present in any package's `exports`. Other subpaths outside §3.1 (e.g. `auth/use-cases`, `primitives/di`, `primitives/result`, `primitives/time`, `router/routers`) are not flagged because the rule enforces only the forbidden set; allowed-list membership is informational and not introduced as a stricter rule.

### Discrepancies

- **Initial run surfaced `ARCH-ADAPTER-001` findings** not recorded in `architecture-validation.md §11`: `auth-jose → auth-tokens`, `html-preact → http`, `html-react → http`. These were investigated and resolved as **false positives** via the `ARCH-ADAPTER-001` refinement: each adapter implements exactly one Core contract and the additional Core dependency is type-only or composition infrastructure. No migration-backlog entry is required.
- **`ARCH-META-005` finding for `@comity/graphql-client-fetch` resolved**: the package now emits `dist/types/`, so the declared `import.types` / `require.types` targets resolve. No migration-backlog entry is required.

### Stale documentation candidates

- **`architecture-validation.md` §11 "Future Enforcement (Planning — Does Not Exist)"** states the register is "a future serialization of ADR-008" and that no validator exists. Since ADR-009, ADR-010, and the Phase-1 validator now exist, this section is partially stale and should be reviewed for alignment with the current state (observation only — not changed here).
- `architecture-validation.md` §11 migration backlog items outside Phase-1 scope (README dates, canonical line, adapter peerDependency pairing, dead internal dependencies) remain unverified by this validator run; they are not addressed here.

## Validator Coverage Summary

Implemented (Phase 1):

- Package discovery from `packages/*/package.json` (name, version, `@comity/*` dependencies).
- Package classification from `docs/architecture/repository.md` (no inferred classifications).
- Internal dependency graph construction (workspace edges only).
- ADR-008 register validation:
  - JSON schema validity against `adr-008-core-exception-register.schema.json` (dependency-free subset validator for ADR-009 keywords).
  - Completeness: every real Core-to-Core edge must be registered.
  - No stale entries: every register entry must correspond to a real dependency edge.
  - No rejected exception treated as approved (ADR-008 "Explicitly NOT registered" table, including the `catalog → <adapter>` wildcard).
- Kernel layer validation (per `layering-policy.md §2.1`, `dependency-graph-policy.md`):
  - `@comity/primitives` has no internal `@comity/*` dependencies (`ARCH-KERNEL-001`).
  - `@comity/kernel` depends only on `@comity/primitives` (`ARCH-KERNEL-002`).
  - `@comity/composition` depends only on `@comity/kernel` and `@comity/primitives` (`ARCH-KERNEL-003`).
  - The three Kernel packages are explicitly defined; all other classification is derived from `docs/architecture/repository.md`.
- Adapter layer validation (per `adapters.md §11`, `architecture-validation.md §7`, ADR-007):
  - Technology Adapter must implement exactly ONE Core Module contract (`ARCH-ADAPTER-001`). Additional Core Module dependencies are permitted only as type-only references or composition infrastructure (canonical facades/factories/wiring helpers, `layering-policy.md §2.3`). Reference classification is derived from adapter source: `implements`-clause resolution plus import value/type analysis (`isCompositionInfrastructureName`). When no `implements` contract is detected, a single real-runtime Core dependency is treated as the implemented contract (covers composition/setup-bound adapters such as `http-hono`).
  - Adapter → Adapter edges forbidden, except Integration Adapter → Technology Adapter (`ARCH-ADAPTER-002`).
  - Core Module → Adapter forbidden (`ARCH-ADAPTER-004`).
  - Adapter → Application-layer code forbidden (no Application packages exist in this repository; rule is defined but has no input to match).
- Package metadata validation (per `architecture-validation.md §8` and `public-api.md §3`):
  - Package name MUST follow `@comity/<kebab-case-name>` (`ARCH-META-001`).
  - Package `type` MUST be `module` (`ARCH-META-002`).
  - `engines.node` MUST exist and satisfy `>=24.0.0`; only the leading `>=` range and exact pin are recognized (`ARCH-META-003`). Dependency version ranges are intentionally not enforced.
  - `license` MUST exist (`ARCH-META-004`); no value validation.
  - Every declared `exports` target MUST resolve to an existing file (`ARCH-META-005`); `./package.json` self-reference is treated as resolvable.
  - Every `typesVersions["*"]` entry MUST have a matching `./<key>` `exports` entry (`ARCH-META-006`).
  - Exported subpaths MUST NOT use the forbidden paths from `public-api.md §3.2` (`ARCH-META-007`); allowed-list membership is not enforced.

Not implemented (future phases, per ADR-010 scope):

- CI integration.

## Next Validation Rules to Implement

Ordered by dependency and migration-backlog priority (from ADR-010 and `architecture-validation.md §11`):

1. **CI integration** — run validation as part of CI; merge MUST fail on violations.

### README rules (implemented 2026-08-16)

The README documentation contract (`ARCH-README-001..005`) was implemented per `read-me.md` and `architecture-validation.md §10`:

- `ARCH-README-001` — required sections (`## Purpose`, `## Scope`, `## Public API`, `## Documentation`, `## Related Packages`, `## Status`) must exist in order; a missing README is a violation.
- `ARCH-README-002` — forbidden sections (Getting Started, Installation, Usage, Examples, API Reference, Contributing, License) must not exist.
- `ARCH-README-003` — `## Status` must contain exactly one vocabulary label (Stable, Experimental, Draft); compound labels and forbidden labels (Beta, Internal) are violations.
- `ARCH-README-004` — dates in README metadata must be ISO `YYYY-MM-DD`.
- `ARCH-README-005` — `## Public API` must contain the canonical line `No exhaustive reference; see docs for constraints.`

Current repository conformance (`node scripts/validate-architecture.mjs`, exit 1): 56 README violations — `ARCH-README-004` × 35 (non-ISO dates) and `ARCH-README-005` × 21 (missing canonical line). All READMEs have the six required sections in order, no forbidden sections, and valid status labels. The 35 non-ISO dates match the `architecture-validation.md §11` migration backlog ("35 READMEs use non-ISO dates"); the canonical-line count (21) differs from the documented 23, a stale documentation figure. These constituted the README portion of the migration backlog.

### README migration (2026-08-16)

A one-shot migration (`scripts/migrate-readmes.mjs`) was run to close the README backlog: 35 non-ISO dates were normalized to `YYYY-MM-DD` and 21 missing canonical Public API lines were added across 39 READMEs. The canonical line was inserted before the section's `---` divider, preserving section order and structure (verified: all 42 READMEs retain valid section structure). Validator now reports `PASS README documentation contract` with exit 0 and zero violations. No validator logic, standards, or ADRs were changed; only `packages/*/README.md` files and the new migration script were modified.

### Follow-up items from this phase

- The `§11` "dead internal dependencies" entries (`auth-jose → kernel`, `graphql-client-ws → composition`, `primitives`) are metadata hygiene items, not adapter-rule violations; they will be validated by the future metadata phase, not the adapter phase.
- The `ARCH-ADAPTER-001` refinement introduces a source-analysis dependency; any Technology Adapter that binds its contract via a pattern other than `implements` and has more than one real-runtime Core dependency will be flagged. This is intentional (conservative) and should be re-reviewed if such an adapter is added.
- The `@comity/graphql-client-fetch` `ARCH-META-005` finding is resolved (see Detected Violations).

> Baseline established 2026-08-15. Updated 2026-08-15 to include the Kernel layer rule family. Updated 2026-08-15 to include the Adapter layer rule family. Updated 2026-08-15 to refine `ARCH-ADAPTER-001` with source-level Core reference classification (regression PASS for `auth-jose`, `html-preact`, `html-react`). Updated 2026-08-16 to include the Metadata rule family (`ARCH-META-001..007`) and to modularize the validator per ADR-010. Updated 2026-08-16 to include the README documentation contract (`ARCH-README-001..005`) and to run the one-shot README migration (closing the backlog). Updated 2026-08-16 to restructure the modular validator into the target layout (`utils/`, unified `validate(context)` rule interface); both `node scripts/architecture-validator/index.mjs` and `node scripts/validate-architecture.mjs` produce identical output and exit 0.
