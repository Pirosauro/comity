CRITICAL CODE REVIEW PROMPT - TypeScript Package Enterprise Standards

Analyze the TypeScript package in the current workspace and perform a comprehensive enterprise-grade review following Comity documentation standards.

## PRIMARY TASKS

### 1. PACKAGE.JSON AUDIT

Review package.json for enterprise readiness:

- Correct package naming convention (`@comity/` prefix)
- Versioning strategy (semantic versioning compliance)
- Dependency audit:
  - Production vs dev dependencies separation
  - Version ranges (avoid loose ranges like `^` or `~` for production)
  - Peer dependencies (if applicable)
  - Optional dependencies analysis
- Scripts section:
  - Required scripts: build, test, lint, type-check
  - Missing or incomplete scripts
- Keywords (must be relevant, not generic)
- Repository and licensing information
- Engine requirements (Node.js version, etc.)
- Private/public package configuration
- Export maps and entry points
- TypeScript configuration references

### 2. CODE QUALITY AUDIT (src/)

Review ALL source files for:

- Enterprise readiness (error handling, edge cases, type safety)
- Production concerns (performance, memory, security)
- Architectural compliance with Comity patterns
- TypeScript strictness and proper typing
- Testability and dependency injection
- Error boundary definitions and handling
- Event emission patterns (if applicable)

### 3. JSDOC COMPLIANCE & ENHANCEMENT

For every function, class, method, and exported symbol:

- Verify JSDoc presence per ESLint rules (require-jsdoc: warn)
- Complete missing documentation following tag sequence:
  1. @typeParam/@template (if needed)
  2. @param (with descriptions)
  3. @returns (with descriptions)
  4. @throws (document ALL error conditions)
  5. @remarks (for intent/constraints)
  6. @example (if helpful)
  7. @deprecated/@see (if applicable)
- Ensure descriptions explain INTENT and CONSTRAINTS, not implementation

### 4. DOCUMENTATION STRUCTURE REVIEW (docs/)

Verify and create/update documentation per Comity standards:

#### README.md - CRITICAL CHECK

Must follow EXACT structure:

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

_Review Completed: <date>_
_Reviewer: Hobiri MAGI (Qwen 2.5)_
_Compliance Score: <compliance_score>% (Green|Yellow|Red)_
```

FORBIDDEN in README:

- Installation instructions
- Tutorials/examples
- Architecture details
- Design decisions
- Framework usage

#### docs/ Directory Structure

REQUIRED:

- `overview.md`: What module is, problem solved, high-level flow
- `conventions.md`: Hard rules, constraints, allowed/forbidden patterns

OPTIONAL (create if needed):

- `architecture.md`: For multi-layer/internal structure
- `events.md`: For event-driven modules (define philosophy, contracts)
- `decisions/`: Decision files (NO ADRs)

#### Decision Files Format

Create `decisions/<topic>.md` with:

```markdown
# Decision: <short title>

## Context

Why this decision was needed.

## Decision

What was chosen.

## Consequences

What this enables and what it forbids.
```

NO dates, versions, authors, or deprecated decisions.

### 5. MARKDOWN FORMATTING ENFORCEMENT

- No YAML frontmatter
- No emojis in titles
- No blog-style prose
- Readable as plain text
- Code blocks for examples only

## REVIEW OUTPUT FORMAT

Provide findings in this structure:

### CODE QUALITY ISSUES

[Bulleted list of production/enterprise concerns]

### JSDOC DEFICIENCIES

[Specific files/functions missing documentation]

### DOCUMENTATION VIOLATIONS

1. README.md deviations:
   - [Missing/incorrect sections]
   - [Forbidden content]

2. docs/ structure issues:
   - [Missing required files]
   - [Incorrect format]

### ENTERPRISE RECOMMENDATIONS

[Actionable items to reach production-ready status]

### IMMEDIATE ACTIONS

[Top 5 critical fixes needed if any]

### COMPLIANCE SCORE

[Calculated percentage compliance score]

## SPECIAL INSTRUCTIONS

1. Focus on PREVENTING MISUSE through documentation
2. Documentation must be STRUCTURAL, not narrative
3. Explain constraints and intent, not implementation
4. Consistency > Completeness
5. Delete any deprecated decision files
6. Ensure all public API methods have @throws documentation
7. Verify error types align with Comity error standards

Review package as if deploying to enterprise production tomorrow.
