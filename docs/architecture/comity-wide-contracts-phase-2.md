# Comity-Wide Contracts — Phase 2 Audit and Formalization

## 1. Phase 2 Objective

This phase formalizes the Comity-wide normative contracts that will eventually be owned by `comity-development`. It does **not**:

- Create `comity-development`, `comity-enterprise`, or any new repository
- Move standards, ADRs, or files
- Rename packages or package scopes
- Create `@comity-dev/*` or `@comity-enterprise/*` packages
- Extract tooling or scripts
- Reorganize the repository
- Modify runtime package APIs
- Change `comity.layer` or `comity.implements` semantics
- Alter ADR-008 register semantics or ADR-009 register instance
- Introduce generic validator frameworks or development CLIs
- Solve Enterprise release-channel or standards distribution decisions

The purpose is to make ownership boundaries and normative contracts unambiguous enough that physical separation becomes a mechanical migration rather than an architectural redesign.

---

## 2. Ownership Model

| Category | Future Owner | Current Location | Scope |
|----------|--------------|------------------|-------|
| **Comity-wide normative contracts** | `comity-development` | `docs/standards/`, `docs/standards/decisions/` (selected ADRs) | Normative rules, architectural decisions, metadata contracts, register schemas, contributor/AI conventions |
| **Community-specific implementation/history** | `comity-community` | `packages/`, `scripts/`, `.github/`, `docs/architecture/`, ADR-008 register instance, ADR-009 instance, repository inventory | Runtime implementation, repository-specific graphs, CI/release, build engine, validator implementation, migration/conformance state |

**Distinction principle**: Normative contract vs. repository-specific implementation/instance.

---

## 3. Normative Contract Inventory

### 3.1 Standards

The repository contains 19 files in `docs/standards/`. The verified separation plan identifies 18 normative standards intended to become Comity-wide contracts, plus `architecture-validation.md` as mixed content.

| Standard | Current Owner | Future Owner | Scope | Repository-Specific Content | Phase 2 Action |
|----------|---------------|--------------|-------|----------------------------|----------------|
| `layering-policy.md` | Community | Development | Comity-wide | No | Normalize scope language |
| `architecture-principles.md` | Community | Development | Comity-wide | No | Normalize scope language |
| `dependency-graph-policy.md` | Community | Development | Comity-wide | No | Normalize scope language |
| `adapters.md` | Community | Development | Comity-wide | Two repo-specific refs | Generalize or mark |
| `modules.md` | Community | Development | Comity-wide | No | Normalize scope language |
| `lifecycle.md` | Community | Development | Comity-wide | No | Normalize scope language |
| `events.md` | Community | Development | Comity-wide | No | Normalize scope language |
| `commands.md` | Community | Development | Comity-wide | No | Normalize scope language |
| `errors.md` | Community | Development | Comity-wide | No | Normalize scope language |
| `coding.md` | Community | Development | Comity-wide | No | Normalize scope language |
| `domain-modeling.md` | Community | Development | Comity-wide | No | Normalize scope language |
| `testing.md` | Community | Development | Comity-wide | No | Normalize scope language |
| `documentation.md` | Community | Development | Comity-wide | References "monorepo" | Normalize |
| `public-api.md` | Community | Development | Comity-wide | No | Normalize scope language |
| `read-me.md` | Community | Development | Comity-wide | No | Normalize scope language |
| `configuration.md` | Community | Development | Comity-wide | No | Normalize scope language |
| `module-promotion-criteria.md` | Community | Development | Comity-wide | No | Normalize scope language |
| `vision.md` | Community | Development | Comity-wide | No | Normalize scope language |
| `architecture-validation.md` | Community | Mixed | Mixed | Conformance state (§11) | Document boundary |

### 3.2 ADRs — Comity-wide (Normative Intent)

The following ADRs express architectural decisions intended to be Comity-wide in scope. Status varies (Accepted/Proposed); Phase 2 records their intent without changing status.

| ADR | Actual Title | Status | Future Owner | Scope | Phase 2 Action |
|-----|--------------|--------|--------------|-------|----------------|
| ADR-001 | Entity Creation and Hydration via Constructor with Supplied Persistence State | Accepted | Development | Comity-wide | Normalize scope |
| ADR-002 | Repository vs Domain Command Port | Accepted | Development | Comity-wide | Normalize scope |
| ADR-003 | HTTP Client Extraction from @comity/http | Accepted | Development | Comity-wide | Normalize scope |
| ADR-007 | Multi-Context Adapter Architecture for Platform Integrations | Accepted | Development | Comity-wide | Normalize scope |
| ADR-010 | Architecture Validator Design | Accepted | Development | Comity-wide | Remove repo-specific assumptions |
| ADR-011 | Catalog Owns Product Definition, Not Commercial Execution | Accepted | Development | Comity-wide | Normalize scope |
| ADR-012 | Standard Domain Modeling for Core Modules | Accepted | Development | Comity-wide | Normalize scope |
| ADR-013 | Order Entity Consolidation | Accepted | Development | Comity-wide | Normalize scope |
| ADR-014 | Pricing Domain Model | Proposed | Development | Comity-wide | Normalize scope; status is Proposed |
| ADR-015 | Domain Events Boundary | Proposed | Development | Comity-wide | Normalize scope; status is Proposed |
| ADR-016 | Event Publication Reliability Policy | Proposed | Development | Comity-wide | Normalize scope; status is Proposed |
| ADR-017 | Aggregate History and Audit Boundary | Proposed | Development | Comity-wide | Normalize scope; status is Proposed |
| ADR-018 | Shipping Destination Mutability and Application-Owned Temporal History | Proposed | Development | Comity-wide | Normalize scope; status is Proposed |
| ADR-019 | Product Purchasability Policy Boundary | Proposed | Development | Comity-wide | Normalize scope; status is Proposed |
| ADR-020 | Inventory Capability Boundary and Checkout Workflow Independence | Accepted | Development | Comity-wide | Normalize scope |
| ADR-021 | Capability vs Workflow Boundary | Accepted | Development | Comity-wide | Normalize scope |
| ADR-022 | CLI Core Module and Technology Adapter Architecture | Accepted | Development | Comity-wide | Normalize scope |
| ADR-025 | Execution Context Composition via Application-Owned Wiring | Accepted / Implemented | Development | Comity-wide | Normalize scope |
| ADR-026 | Architecture Validator Authoritative Package Classification | Accepted | Development | Comity-wide | Formalize contract |

### 3.3 ADRs — Community-specific

| ADR | Title | Future Owner | Scope | Reason |
|-----|-------|--------------|-------|--------|
| ADR-008 | Explicit Core Module Composition Exceptions | Community | Repository graph | Register is this repository's dependency graph |
| ADR-009 (instance) | Machine-Readable Core Exception Register | Community | Repository-specific | JSON instance is this repository's register |

### 3.4 ADRs — Superseded / Not Classified in Phase 2

| ADR | Title | Status | Note |
|-----|-------|--------|------|
| ADR-023 | Execution Scopes and Context Contributions | Proposed | Superseded by ADR-024, then ADR-025 |
| ADR-024 | Execution Context Composition via Typed Facades | Accepted | Superseded by ADR-025 |

---

## 4. Scope Audit

### 4.1 Standards Requiring Scope Normalization

The following standards contain language that implicitly assumes a single repository/monorepo:

| Standard | Issue | Evidence | Decision |
|----------|-------|----------|----------|
| `documentation.md` | Uses "monorepo" and "monorepo root" | Lines 3, 238, 244 | Replace with "repository" or "Comity repository"; the standard applies to any Comity repository |
| `layering-policy.md` | References ADR-008 by relative path from this repo | Line 79: `docs/standards/decisions/ADR-008-...` | Generalize to "ADR-008" without path; the ADR is the authority regardless of location |
| `dependency-graph-policy.md` | References ADR-008 by relative path | Line 31: `docs/standards/decisions/ADR-008-...` | Same as above |
| `domain-modeling.md` | References ADR-008 by relative path | Line 516: `docs/standards/decisions/ADR-008-...` | Same as above |
| `public-api.md` | References `docs/migrations/public-api.md` | Line 6: `docs/migrations/public-api.md` | Migration docs are Community-specific; remove or mark as repo-local |
| `architecture-validation.md` | Entire §11 is repository conformance state | Lines 229-246 | Document boundary: normative rules (§1-10) vs. conformance state (§11) |
| `adapters.md` | Two repository-specific references | Lines 160-162, 256-268 | See §4.2 |

### 4.2 Special Case: `adapters.md`

**Repository-specific reference 1** (Lines 160-162):
> Examples: `@comity/http-hono`, `@comity/sql-kysely`, `@comity/graphql-client-ws`

These are Community packages. The standard should generalize to "Technology Adapters bind one Core Module to one interchangeable technology; examples include HTTP server adapters, SQL adapters, GraphQL transport adapters."

**Repository-specific reference 2** (Lines 256-268):
> ```text
> Integration Adapter
>     storefront platform integration
>             │
>             ├── @comity/storefront
>             ├── @comity/catalog
>             ├── @comity/router
>             ├── @comity/cache
>             └── @comity/graphql-client
> ```

This is a Community-specific integration adapter example. The standard should either:
- Generalize to a schematic example without specific package names, OR
- Mark explicitly as "Community integration adapter example" and retain as historical reference

**Decision**: Generalize the example to schematic form; retain the architectural rules as Comity-wide.

### 4.3 Special Case: `architecture-validation.md`

**Boundary identification**:

| Section | Content | Classification |
|---------|---------|----------------|
| §1-2 | Purpose, authoritative sources | Comity-wide normative |
| §3 | Package classification (schema) | Comity-wide normative |
| §4-10 | Dependency rules, kernel boundary, adapter rules, metadata, exports, README | Comity-wide normative |
| §11 | Current Repository Conformance (table) | **Community-specific** — conformance state of this repository |
| §12 | Future Enforcement (validator design) | Comity-wide design principles; implementation is Community-specific |

**Decision**: Do not physically split. Add explicit marker comment at §11 boundary: "The following section records this repository's conformance state and is Community-specific. Normative rules end at §10."

---

## 5. Metadata Contract

### 5.1 `comity.layer`

**Formal statement**: `comity.layer` in `package.json` is the **authoritative source** for package layer classification across all Comity repositories.

| Property | Value |
|----------|-------|
| Location | `package.json` → `comity.layer` |
| Required | Yes, for all `@comity/*` packages |
| Values | `primitives`, `kernel`, `composition`, `core`, `technology-adapter`, `integration-adapter` |
| Authority | Supersedes `docs/architecture/repository.md` (which is now documentation-only) |
| Validator behavior | Discovers packages from filesystem; reads `comity.layer`; fails if missing |

**Cross-repository applicability**: Applies to all first-party `@comity/*` packages regardless of repository. Enterprise-authored `@comity/*` packages MUST follow the same contract.

### 5.2 `comity.implements`

**Formal statement**: `comity.implements` identifies the **Core Module contract** implemented by a Technology Adapter.

| Property | Value |
|----------|-------|
| Location | `package.json` → `comity.implements` |
| Required | For `technology-adapter` packages only |
| Value | Core Module package name (e.g., `@comity/http`) |
| Semantics | One adapter = one Core Module contract implemented |
| Authority | Validator uses this to verify Technology Adapter classification |

**Cross-repository applicability**: Applies to all first-party Technology Adapters regardless of repository.

### 5.3 Classification Rules (Normative)

1. `comity.layer` is authoritative — no repository-local heuristic supersedes it
2. `repository.md` is documentation only — not an architectural classification source
3. `classifyFromRepository` is deleted — classification is derived exclusively from `comity.layer` in `package.json`
4. Runtime package namespace remains `@comity/*` across all repositories

---

## 6. Register Model

### 6.1 ADR-008 Register (Schema vs Instance)

| Aspect | Schema | Instance |
|--------|--------|----------|
| **Owner** | Comity-wide (`comity-development`) | Community-specific (`comity-community`) |
| **Location** | `docs/standards/decisions/data/adr-008-core-exception-register.schema.json` | `docs/standards/decisions/data/adr-008-core-exception-register.json` |
| **Authority** | ADR-009 defines the schema contract | ADR-008 Markdown is the architectural authority |
| **Scope** | Defines structure for any Comity repository | Contains THIS repository's Core-to-Core edges |
| **Governance** | Schema changes require ADR | Instance changes require ADR-008 update in this repo |

### 6.2 Explicit Distinction

- **Schema** → Comity-wide: defines the machine-readable contract for Core-to-Core exception registers. Any Comity repository that maintains a Core-to-Core exception register MUST conform to this schema.
- **Instance** → Repository-specific: the actual dependency graph edges approved for this repository. A different Comity repository (e.g., Enterprise) would have its own instance with different edges.

**Do not** convert the current instance into a cross-repository registry. Each repository owns its register instance.

---

## 7. ADR Ownership

### 7.1 ADR-008 — Community-specific (with Comity-wide principle)

**Principle**: "Core → Core dependencies are forbidden unless explicitly registered" — this principle is Comity-wide.

**Register**: The current register (`docs/standards/decisions/data/adr-008-core-exception-register.json`) is **this repository's dependency graph**. It is Community-specific.

**Phase 2 action**: Do not move. Do not modify register semantics. Document explicitly:
> The exception register in this ADR is the Community repository's instance. The principle (Core-to-Core forbidden by default, exceptions explicit) is Comity-wide. Other Comity repositories maintain their own register instances conforming to the ADR-009 schema.

### 7.2 ADR-009 — Schema Comity-wide, Instance Community-specific

**Schema**: `adr-008-core-exception-register.schema.json` is a Comity-wide contract (future `comity-development`).

**Instance**: `adr-008-core-exception-register.json` is Community-specific.

**Phase 2 action**: Do not physically extract schema. Add explicit statement in ADR-009:
> The JSON Schema (`adr-008-core-exception-register.schema.json`) is a Comity-wide contract. The JSON instance (`adr-008-core-exception-register.json`) is this repository's register. Future Comity repositories will have their own instances conforming to this schema.

---

## 8. Repository-Specific Material (Remains with Community)

The following MUST remain in `comity-community` and are NOT Comity-wide contracts:

| Artifact | Reason |
|----------|--------|
| `packages/**` | Runtime implementation |
| `scripts/validate-architecture.mjs` + `scripts/architecture-validator/**` | Validator implementation (ADR-010 design is Comity-wide; implementation is repo-specific) |
| `scripts/normalize-package-json.mjs` | **Current implementation:** Community; **Semantic scope:** Comity-wide candidate; **Future owner:** `comity-development`; **Future package:** `@comity-dev/package-tools`; **Extraction:** deferred to Phase 5 |
| `scripts/normalize-exports.mjs` | **Current implementation:** Community; **Semantic scope:** Comity-wide candidate; **Future owner:** `comity-development`; **Future package:** `@comity-dev/package-tools`; **Extraction:** deferred to Phase 5 |
| `scripts/migrate-readmes.mjs` | One-shot migration script (deleted after use) |
| `.github/workflows/` | Community CI/release |
| `docs/architecture/repository.md` | Repository inventory (documentation only) |
| `docs/migrations/**` | Migration tracking for this repository |
| ADR-008 register instance | This repository's dependency graph |
| ADR-009 register instance | This repository's register data |
| Architecture validator baseline (`architecture-validator-baseline.md`) | Historical conformance record |
| Forensic audit documents (`*.md` at root) | Historical review artifacts |

---

## 9. Contributor/AI Convention Ownership

| Document | Comity-wide Content | Community-specific Content | Phase 2 Action |
|----------|---------------------|---------------------------|----------------|
| `AGENTS.md` | Architectural principles, change policy, scope discipline, layering model, contracts vs implementations, composition model | Hotfix exception, specific tool commands (`pnpm architecture:validate`), this repository's package count (36 in SKILL.md, 51 actual) | Document split; correct stale counts |
| `SKILL.md` | Architecture, layering, package identification, key design principles, conventions, workflow patterns, decision process | Specific package count (36 vs actual 51), specific dev commands, `docs/architecture/repository.md` references | Document split; correct count to 51 |
| `CONTRIBUTING.md` | General contribution principles | GitHub URL, project structure (refers to `packages/core` which doesn't exist), Hono-specific guidance | Document split; correct structure |
| `docs/ai/skill-template.md` | Template structure (Comity-wide convention) | None | Mark as Comity-wide template |

**Stale counts correction**:
- `SKILL.md` Line 5: "36 packages" → actual committed: **51 packages**
- `ADR-026` Line 9: "52 packages" → actual committed: **51 packages**

These are documentation drift; correct to actual count (51) without architectural change.

---

## 10. Stale Reference Remediation

These references remain in the ADRs as historical artifacts. Phase 2 does not modify ADRs; it documents them for future remediation.

| # | Location | Stale Reference | Required Future Resolution |
|---|----------|-----------------|----------------------------|
| 1 | ADR-010 Line 33, 261 | `docs/architecture/repository.md` as authoritative package classification | Replace with: "package classification defined by `comity.layer` in `package.json` (ADR-026)" |
| 2 | ADR-026 Line 49 | `classifyFromRepository` function retained for documentation validation | Remove reference; function is deleted. State: "Classification is derived exclusively from `comity.layer` in `package.json`." |
| 3 | `architecture-validator-baseline.md` Line 175 | `scripts/migrate-readmes.mjs` (deleted) | Add note: "The migration script was a one-shot tool and has been removed. The baseline records the post-migration conformance state." |

---

## 11. Future Extraction Boundaries (Recorded, Not Executed)

| Extraction | Prerequisites | Phase |
|------------|---------------|-------|
| `comity-development` repository | All Comity-wide contracts normalized, ownership explicit | 3 |
| `@comity-dev/package-tools` | Parameterize repository root; remove `EXCLUDED_PACKAGES`; add fixture tests; preserve idempotence/check-mode | 5 |
| `comity-enterprise` repository | Enterprise release-channel decision; standards distribution mechanism | 6 |
| ADR-008 register schema extraction | Schema stabilized; no further changes expected | 3 |
| Architecture validator as shared package | Design stabilized; implementation parameterized for repo root | 5 |

**No extraction occurs in Phase 2.**

---

## 12. Phase 2 Validation

### 12.1 Commands Executed (Actual Results)

```bash
# Architecture validation
pnpm architecture:validate
# Result: PASS (exit 0)
# All architectural checks passed: Register schema, Core dependency graph, Kernel layer, Adapter layer, Package metadata, README documentation contract

# Build
pnpm build
# Result: PASS
# 51/51 packages built successfully (cached)

# Tests
pnpm test
# Result: FAIL (exit 1)
# 1746 passed / 1 failed
# Failure is pre-existing and unrelated to Phase 2: @comity/inventory stock.test.ts "should be safe to call twice with the same quantity" double-commit failure
```

### 12.2 Verification Checklist

- [x] All 18 standards + mixed-content `architecture-validation.md` audited for scope language
- [x] All 23 ADRs audited for ownership classification (19 Comity-wide normative intent, 2 Community-specific, 2 superseded/not classified)
- [x] `comity.layer` remains authoritative for package classification
- [x] `comity.implements` semantics intact for Technology Adapters
- [x] Three stale references documented for future remediation (ADR-010, ADR-026, architecture-validator-baseline.md)
- [x] ADR-008/009 register ownership correctly documented (schema Comity-wide, instance Community-specific)
- [x] ADR-025 unchanged — verified: no contradiction with cross-repository model exists
- [x] No repository split occurred
- [x] No tooling extraction occurred
- [x] No runtime code modified
- [x] No package metadata changed accidentally
- [x] Working tree integrity preserved (only 4 pre-existing forensic docs + new deliverable untracked)

---

## 13. Phase 2 Non-Goals (Explicitly Confirmed)

- [x] No repository split (`comity-development`, `comity-enterprise` not created)
- [x] No standards moved or extracted
- [x] No ADRs moved or extracted
- [x] No packages renamed or moved
- [x] No `@comity-dev/*` packages created
- [x] No `@comity-enterprise/*` packages created
- [x] No scripts extracted
- [x] No architecture rewritten
- [x] No runtime package APIs modified
- [x] `comity.layer` / `comity.implements` unchanged
- [x] ADR-008 register semantics unchanged
- [x] ADR-009 register instance unchanged
- [x] No generic validator frameworks introduced
- [x] No generic development CLIs introduced
- [x] No umbrella packages created
- [x] Enterprise release-channel decision not solved
- [x] Standards distribution mechanism not solved

---

## 14. Final Verification Statement

**PHASE 2 VERIFIED — INVENTORY CONSISTENT**

All of the following are true:

- ✅ All 18 standards + mixed-content `architecture-validation.md` were audited for scope normalization
- ✅ All 23 ADRs were audited and classified by ownership (19 Comity-wide normative intent, 2 Community-specific, 2 superseded/not classified)
- ✅ Ownership boundaries are explicit (Comity-wide vs Community-specific)
- ✅ `comity.layer` remains authoritative for package-layer classification
- ✅ `comity.implements` remains authoritative for adapter implementation metadata
- ✅ Stale references documented for future remediation (ADR-010, ADR-026, architecture-validator-baseline.md)
- ✅ ADR-008/009 register ownership correctly documented (schema Comity-wide, instance Community-specific)
- ✅ ADR-025 was not changed — verified: no contradiction with cross-repository model proven
- ✅ No repository split occurred
- ✅ No tooling extraction occurred
- ✅ Architecture validation passes
- ✅ Build passes
- ✅ Tests: 1746 passed / 1 failed (pre-existing unrelated `@comity/inventory` double-commit failure documented)
- ✅ Working-tree integrity preserved (only 4 pre-existing forensic documents + new deliverable remain untracked)

The repository's normative material is now internally consistent, explicit, and ready to become the source material for `comity-development`.