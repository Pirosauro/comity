# Documentation Standards

> **Note:** This is the Community-specific transitional copy. The canonical Comity-wide version is maintained in `comity-development/docs/standards/documentation.md`
This document defines the official documentation standards for the Comity monorepo.

All packages MUST comply with these rules. Any deviation must be intentional, explicit, and justified.

---

## Documentation Philosophy

Documentation in Comity follows these principles:

- Documentation is structural, not narrative.
- Documentation explains intent and constraints, not implementation details.
- Documentation must prevent misuse, not teach basics.
- Consistency across packages is more important than completeness.

Documentation is not a blog, not a tutorial, and not a changelog.

---

## README.md — Package Landing Page

### Purpose

Each package MUST contain a README.md in its root.

The README is a technical landing page, not full documentation.

It must allow a reader to answer in under one minute:

- What is this package?
- Why does it exist?
- What does it explicitly NOT do?
- Where do I find more information?

---

### Mandatory README Structure

Every `README.md` MUST follow this structure:

```markdown
# @comity/<package-name>

One-line description of the package purpose.

---

## Purpose

What this package does and why it exists.

---

## Scope

This package:

- ✅ does X
- ✅ does Y

This package does NOT:

- ❌ do A
- ❌ do B

---

## Public API

High-level description of the public API surface. No exhaustive reference.

---

## Documentation

- docs/overview.md
- docs/conventions.md
- docs/<other>.md

---

## Related Packages

- @comity/<related>
- @comity/<adapter>

---

## Status

Stable | Experimental | Draft
```

---

### Forbidden in `README.md`

A `README.md` MUST NOT contain:

- Installation instructions (unless strictly required).
- Long examples or tutorials.
- Architecture explanations.
- Design decisions.
- ADR references.
- Framework-specific usage.

All of the above MUST live in `docs/`.

---

## Package `docs/` Directory

Each package MAY contain a `docs/` directory. If present, it MUST follow the standard structure below.

### Standard Structure

```text
docs/
├─ overview.md
├─ conventions.md
├─ architecture.md        (optional)
├─ events.md              (optional)
├─ decisions/             (optional)
```

---

### File Responsibilities

`overview.md` (REQUIRED)

Describes:

- What the module is.
- What problem it solves.
- High-level architecture and flow.

No implementation details.

---

`conventions.md` (REQUIRED)

Defines:

- Hard rules.
- Constraints.
- What is allowed and forbidden.

This file is normative.

---

`architecture.md` (OPTIONAL)

Use only if the module has multiple layers or non-trivial internal structure.

Contains diagrams and structural explanations.

---

`events.md` (OPTIONAL)

Required only for event-driven modules.

Defines:

- Event philosophy.
- Naming conventions.
- Event contracts.
- Emission rules.

---

`decisions/*.md` (OPTIONAL)

Used to document active design decisions. Package-level decisions use the ADR-style format below.

---

## Design Decisions (ADRs)

Comity documents architectural decisions as **Architecture Decision Records (ADRs)**.

Architecture ADRs live under `docs/standards/decisions/` and use the classic ADR format:

```text
# ADR-<NNN> — <short title>

**Status:** <Accepted | Proposed | Deprecated>

## Context
Why this decision was needed.

## Decision
What was chosen.

## Consequences
What this enables and what it forbids.

## References
Supporting documents, standards, and code paths.
```

Rules:

- One decision per file.
- ADRs represent **architectural history**: they record what was decided and why, including decisions that are later superseded.
- Historical decisions MUST remain traceable. Do not delete an accepted ADR; if a decision is overturned, record the new ADR and reference the old one.
- Corrections MUST preserve historical context: describe what existed historically and what changed, rather than rewriting the record as if the current state had always been true.
- Existing ADR references MUST NOT be removed.
- Package-level decisions MAY be documented in `packages/<name>/docs/decisions/*.md` using the same ADR-style format.

### Machine-readable ADR artifacts

ADR files use the convention `ADR-NNN-title.md` (e.g., `ADR-008-explicit-core-module-composition-exceptions.md`).

Machine-readable artifacts that serialize ADR decisions (e.g., data contracts, registers) live under `docs/standards/decisions/data/`:

```text
docs/standards/decisions/
├─ ADR-NNN-title.md
└─ data/
   └─ adr-nnn-description.ext
```

Data artifacts use the lowercase convention `adr-nnn-description.ext`, deriving their name from the ADR they serialize:

- `adr-008-core-exception-register.json`
- `adr-008-core-exception-register.schema.json`

Such artifacts are derived representations of their ADR. The ADR remains the architectural authority; a data artifact MUST NOT redefine architectural decisions.

---

## Monorepo `docs/` Directory

The monorepo root MAY contain a `docs/` directory reserved for cross-package documentation.

### Recommended Structure

```text
docs/
├─ architecture/
│  ├─ system-overview.md
│  ├─ module-boundaries.md
│
├─ standards/
│  ├─ decisions/
│  │  ├─ ADR-NNN-title.md   (architecture ADRs)
│  │  └─ data/              (machine-readable ADR artifacts)
│  ├─ documentation.md
│  ├─ events.md
│  ├─ errors.md
│
├─ glossary.md
```

---

## What Belongs Here

- Platform-wide standards.
- Cross-cutting architectural decisions.
- Naming conventions.
- Glossary and shared vocabulary.

Package-specific details MUST NOT be placed here.

---

## Markdown Rules

All documentation MUST follow these formatting rules:

Allowed:

- Standard Markdown.
- Headings and lists.
- Code blocks.

Forbidden:

- YAML frontmatter.
- Emojis in titles.
- Blog-style prose.
- Decorative formatting.

Documentation must be readable as plain text.

---

## Enforcement

- New packages MUST follow this standard.
- Existing packages SHOULD be progressively aligned.
- Code reviews MUST enforce documentation consistency.

Documentation consistency is a first-class concern.

---

## Final Note

Documentation exists to protect the architecture.

If documentation becomes unclear, verbose, or inconsistent, the architecture will follow.
