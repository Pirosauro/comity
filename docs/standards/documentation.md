# Documentation Standards

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

Experimental | Stable | Internal
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

Used to document active design decisions. These files replace traditional ADRs.

---

## Design Decisions (No ADRs)

Comity does NOT use classic ADR files with headers, dates, and authors. Instead, decisions are documented as individual files in the `decisions/` directory.

### Decision File Format

Filename convention: `decisions/<topic>.md` (e.g., `decisions/error-handling.md`).

Each decision file MUST follow this structure:

```text
# Decision: <short title>

## Context
Why this decision was needed.

## Decision
What was chosen.

## Consequences
What this enables and what it forbids.
```

Rules:

- One decision per file.
- No dates.
- No version numbers inside the file.
- No authors.
- Only current decisions.

Deprecated decisions MUST be deleted from the directory.

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
│  ├─ documentation.md
│  ├─ events.md
│  ├─ errors.md
│
├─ decisions/
│  ├─ platform.md
│  ├─ auth.md
│  ├─ http.md
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
