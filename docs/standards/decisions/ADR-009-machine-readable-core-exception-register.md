# ADR-009 — Machine-Readable Core Exception Register

**Status:** Accepted

## Context

Comity enforces a strict layering model. ADR-008 established the rule:

> Core-to-Core dependencies are forbidden by default. Exceptions are explicit. The exception list is closed. Any Core-to-Core dependency not registered in ADR-008 is an architectural violation.

Today ADR-008 is maintained as human-readable Markdown. The repository requires future automated architecture validation (see `docs/standards/architecture-validation.md`, "Future Enforcement"): the validator must consume the exception register in machine-readable form so registered edges are checked automatically and unregistered edges fail.

ADR-009 defines the **data contract and governance model** for a machine-readable serialization of the ADR-008 register. It does **not**:

- change any ADR-008 decision;
- introduce new Core-to-Core permissions;
- redesign the layering model;
- create a second exception mechanism;
- replace ADR-008 as the architectural authority;
- introduce package categories not already defined;
- assume a validator implementation exists (ADR-010 will define it).

## 1. Purpose

The machine-readable register exists to allow automated verification that:

- all Core-to-Core dependency edges are known;
- all approved exceptions are documented;
- unregistered dependencies fail validation;
- ADR-008 remains the human architectural source of truth.

The machine-readable register is **not an independent architectural authority**. It is a serialized representation of ADR-008. It exists solely so automated tooling can consume the exception register without parsing Markdown.

## 2. Source of Truth Relationship

**Architecture decision authority:** ADR-008 (Markdown).

**Machine-readable register:** a serialized representation of ADR-008.

Precedence rule:

> If ADR-008 and the machine-readable register disagree, ADR-008 requires review/update; the machine-readable file cannot silently redefine architecture.

The register must never be edited to contradict ADR-008. A disagreement is always a defect in the register (or a signal that ADR-008 must be updated through the ADR process), never a license to treat the register as independent authority.

## 3. Storage Location

### Options Evaluated

| Option | Location                                        | Evaluation                                                                                                                                                                             |
| ------ | ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A      | `docs/architecture/`                            | Home of `repository.md` (the recorded, verified repository inventory). It is a descriptive inventory, not a standards artifact; placing a normative data contract here mixes concerns. |
| B      | `docs/standards/architecture/`                  | No such directory exists. Creating a new top-level standards category for a single data artifact is unjustified.                                                                       |
| C      | `docs/standards/decisions/data/`                | Co-locates the register with the ADR series it serializes. Follows the existing convention that `decisions/` hosts ADR artifacts. Minimal, non-inventive extension.                    |
| D      | Repository root architecture metadata directory | No existing root-level metadata convention beyond standard config (`turbo.json`, `pnpm-workspace.yaml`). Inventing a new top-level convention is heavier than needed.                  |

### Decision

**Option C — `docs/standards/decisions/data/`**

The register is data owned by the ADR series (`docs/standards/decisions/`). Co-locating it under `decisions/data/`:

- keeps ADR-008 and its serialization adjacent;
- requires no new top-level directory conventions;
- matches the documented structure (`documentation.md`: `decisions/` hosts architecture ADRs);
- keeps the path stable for future validator consumption (ADR-010).

The register file is `docs/standards/decisions/data/adr-008-core-exception-register.json`, validated by `docs/standards/decisions/data/adr-008-core-exception-register.schema.json`.

## 4. File Format

### Options Evaluated

| Option           | Evaluation                                                                                                                                                            |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| YAML             | Readable, but the repository has no YAML tooling or schema-validation convention beyond `pnpm-workspace.yaml`/`turbo.json` config. Weaker CI schema validation story. |
| JSON             | Native to the repository (TypeScript/Node monorepo; all manifests and config are JSON). Zero-parser friction in CI.                                                   |
| JSON with schema | JSON plus a JSON Schema document enables structural validation of the register without a custom validator. Supports schema evolution via `$schema`/versioning.        |

### Decision

**JSON with schema.**

- JSON is the repository's native data format (`package.json`, `turbo.json`, configs).
- A JSON Schema document (`draft-2020-12`) provides structural CI validation for free, without implying a validator exists today.
- The schema is versioned (`schemaVersion`) so future evolution is explicit.
- Minimal duplication: the register holds only data; ADR-008 Markdown remains the narrative authority.

### Required format capabilities

The format MUST support, per entry:

- source module (`from`);
- target module (`to`);
- dependency category (multi-valued — a single edge may belong to multiple classifications);
- import kind;
- justification;
- ADR reference;
- exception status/lifecycle;
- removal candidate tracking.

## 5. Schema Design

The schema represents current ADR-008 reality. It MUST support `storefront → catalog`, which carries **two** classifications:

- **Capability Exception** (type-only contract reference);
- **Value Import Exception** (DI-token wiring for module setup).

A single edge MAY therefore belong to multiple classifications. The schema models categories as an array, never a single-value field.

### Required Concepts

#### Dependency Edge

| Field        | Description                                                                                 |
| ------------ | ------------------------------------------------------------------------------------------- |
| `from`       | Source package name (e.g., `@comity/storefront`).                                           |
| `to`         | Target package name (e.g., `@comity/catalog`).                                              |
| `layer`      | Layer relationship; for this register always `core-to-core`.                                |
| `categories` | Classification of the dependency's import surface. Sole classification field, multi-valued. |

#### Exception Category (multi-valued array)

Must support:

- `capability` — Capability Exception;
- `infrastructure-contract` — Infrastructure Contract Exception;
- `value-import` — Value Import Exception;
- `candidate-for-removal` — Candidate for Removal.

#### Import Kind

Must support:

- `type-only`;
- `value`;
- `mixed` (both type and value imports; e.g., `auth-tokens → auth`).

#### Lifecycle

Must support:

- `approved` — active approved exception;
- `deprecated` — no longer a preferred pattern; tracked for removal;
- `migration-candidate` — scheduled for removal/refactor (matches ADR-008 "Candidates for Removal").

#### References

Each entry links back to ADR-008 (the authority) and, where practical, the specific register section/table.

#### Removal Candidate Tracking

Entries with `lifecycle: "migration-candidate"` MUST carry a `removalCandidate` object with the failing criteria (`criteria`) and the required action (`action`), mirroring ADR-008's "Candidates for Removal" table. The schema enforces this conditionally: a `migration-candidate` entry without `removalCandidate` fails validation.

### Canonical Schema

The authoritative machine contract lives at:

`docs/standards/decisions/data/adr-008-core-exception-register.schema.json`

The ADR-008 register data file conforms to it:

`docs/standards/decisions/data/adr-008-core-exception-register.json`

## 6. Governance Rules

**Who can modify the register:** the register is modified only as part of an ADR-008 change. It is owned by the architecture review process, not edited independently.

Required rules:

- **Adding a new exception** requires ADR approval (a new or updated ADR) before the register is touched.
- **Removing an exception** requires an ADR update (the removal decision is an ADR decision; the register change is mechanical).
- **Changing a justification** requires architectural review.
- **The register cannot be edited independently** to bypass ADR decisions. A register-only change that contradicts ADR-008 is a defect, not a decision.

## 7. Synchronization Model

### Options Evaluated

| Option | Model                                                  | Evaluation                                                                              |
| ------ | ------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| A      | ADR-008 manually updated; register generated from ADR  | Requires a generation toolchain that does not exist yet. Not viable today.              |
| B      | Register updated first; ADR-008 updated in same change | Risks the register becoming the de facto authority if the ADR update lags.              |
| C      | Both reviewed together in the same change              | Preserves ADR-008 as authority; the register change is co-reviewed with the ADR change. |

### Decision

**Option C — both reviewed together in the same change.**

Every ADR-008 change includes the corresponding register change in the same review. ADR-008 Markdown remains the authority; the register entry is reviewed against it. This holds until future tooling is defined through a separate ADR — but ADR-008 authority is never reduced.

## 8. Validation Requirements

ADR-010 will define the validator implementation. ADR-009 defines only the requirements that the future validator MUST verify. A validator MUST check:

- **every Core-to-Core dependency exists in the register** (unregistered edges fail);
- **every register entry exists in ADR-008** (no entries invented outside the ADR);
- **no stale entries** (register entries referencing dependencies that no longer exist);
- **no unknown modules** (package names in the register must resolve to known `@comity/*` packages);
- **no invalid categories** (category values outside the defined enum fail);
- **no forbidden dependency directions** (e.g., reverse ownership, Core → Adapter);
- **no missing justification** (every entry must reference its ADR justification).

These are requirements only. No validator is implemented in ADR-009.

## 9. Migration Plan

Do not implement scripts. Steps:

1. **Create the machine-readable register** from the current ADR-008 register (done in this ADR as the data file).
2. **Validate against the repository dependency graph** — confirm all 16 current Core-to-Core edges are represented and no unregistered edge exists (performed during this ADR's review).
3. **Document ownership** — the register is owned by the architecture review process; modifications follow §6.
4. **Prepare ADR-010** — define the validator implementation that consumes the schema and register (separate ADR).

## 10. Review Criteria

Before acceptance, verify:

- ADR-009 does not weaken ADR-008;
- ADR-008 remains the architectural authority;
- the schema represents all current 16 Core-to-Core edges;
- value imports are representable (`value-import` category, `value`/`mixed` import kind);
- infrastructure exceptions are representable (`infrastructure-contract`);
- removal candidates are representable (`candidate-for-removal` + lifecycle + action);
- future automation can consume the register (stable path, JSON Schema);
- no new architectural permissions are introduced.

## Consequences

**Positive:**

- Automated validation (ADR-010) can consume the exception register without parsing Markdown.
- The register is validated against a JSON Schema, giving structural checks with no validator code.
- ADR-008 remains the single architectural authority; the register is explicitly subordinate.
- Multi-category edges (`storefront → catalog`) are faithfully representable.

**Negative / Trade-offs:**

- Two artifacts (Markdown + JSON) must be kept in sync; mitigated by the same-change review rule (§7) and by validation requirements (§8).
- Until ADR-010 exists, the register is data-at-rest with no enforcing tool.

## Scope

This ADR concerns:

- the machine-readable data contract for the ADR-008 register;
- the storage location, format, and schema;
- governance and synchronization rules;
- validation requirements for a future validator.

This ADR does NOT concern:

- the validator implementation (ADR-010);
- any change to ADR-008 decisions or its register contents;
- adapter rules (ADR-007);
- package categories.

## References

- ADR-008 — Explicit Core Module Composition Exceptions (the authority this register serializes).
- `docs/standards/architecture-validation.md` — "Future Enforcement (Planning — Does Not Exist)" — the planned automated validation layer.
- `docs/standards/layering-policy.md` §2.2 — Core-to-Core dependency default.
- `docs/standards/decisions/data/adr-008-core-exception-register.schema.json` — the machine contract.
- `docs/standards/decisions/data/adr-008-core-exception-register.json` — the register data.
