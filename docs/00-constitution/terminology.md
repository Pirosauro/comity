---
id: terminology
status: authoritative
version: 1.0.0
owner: @architecture-council
enforcement: block
last_reviewed: 2026-01-09
next_review: 2027-01-09
supersedes: []
---

# Terminology

## Purpose

This document defines the **canonical terminology** used throughout Comity documentation, code, and discussions. These definitions establish a shared language that enables precise communication and prevents ambiguity.

This document is authoritative at the governance level and constrains all lower-level documents.

All documentation must use these terms consistently. When new terms are needed, they must be defined here before use in authoritative documents.

---

## 📚 **New Terms (Added 2026-01-09)**

### Verification Procedures Classification

#### Universal Procedure

A verification procedure that **must be applied to every code review** regardless of change type. Universal procedures are objectively verifiable and block merges when violated.

**Usage:** "Core purity check is a universal procedure."
**Source:** [Code Review Verification Procedures §Universal Procedures](/docs/03-standards/code-review-verification-procedures.md#-universal-procedures-always-blocking)

#### Conditional Procedure

A verification procedure that is applied **only when the PR affects the relevant concern**. Marked with `[CONDITIONAL]` in verification documents.

**Usage:** "Branded type verification is a conditional procedure—it only applies when domain types change."
**Source:** [Code Review Verification Procedures §Conditional Procedures](/docs/03-standards/code-review-verification-procedures.md#-conditional-procedures-apply-when-relevant)

#### Exceptional Procedure

A verification procedure that applies **only in special contexts** (AI-generated code, emergencies, migrations). Marked with `[EXCEPTIONAL]` in verification documents.

**Usage:** "Emergency code validation is an exceptional procedure."
**Source:** [Code Review Verification Procedures §Exceptional Procedures](/docs/03-standards/code-review-verification-procedures.md#️-exceptional-procedures-special-contexts)

### Emergency Documentation Split

#### Emergency Standards

The **normative rules** (`MUST`, `MUST NOT`) for emergency handling. Level 3 document containing enforceable requirements.

**Usage:** "All emergency code must comply with Emergency Standards."
**Source:** [Emergency Standards](/docs/03-standards/emergency-standards.md)

#### Emergency Implementation Guide

The **procedural guidance** for implementing emergency standards. Level 6 document containing step-by-step workflows and best practices.

**Usage:** "Follow the Emergency Implementation Guide for proper emergency declaration workflow."
**Source:** [Emergency Implementation Guide](/docs/06-guides/emergency-implementation-guide.md)

### AI Governance Evolution

#### AI Principles

The **philosophical foundation** for AI usage in Comity. Level 2 document expressing beliefs and direction for AI as a constrained collaborator.

**Usage:** "AI-generated code must align with our AI Principles."
**Source:** [AI Principles](/docs/02-principles/ai-principles.md)

### Verification vs Review Distinction

#### Manual Verification

A **formal, documented check** against specific criteria, usually as part of a Standard's enforcement mechanism. Results are recorded as evidence.

**Usage:** "The Standard requires manual verification of dependency direction."
**Characteristics:** Objective criteria, documented evidence, part of enforcement

#### Manual Review

A **human evaluation** of code quality, readability, and design. May include subjective judgment and suggestions.

**Usage:** "The code received thorough manual review from two senior engineers."
**Characteristics:** Subjective elements, improvement suggestions, educational component

---

## Core Concepts

### Documentation System

#### Constitutional Axioms

The eight inviolable principles governing Comity documentation. They define _what documentation is_ in Comity.

**Usage:** Always capitalized when referring to the specific principles.  
**Example:** "This violates Constitutional Axiom 4: No Silent Divergence."

#### Authoritative Document

A document with binding authority over implementation. Only documents with `status: authoritative` carry this weight.

ADRs are authoritative with respect to architectural intent, but do not define normative rules.

**Antonym:** Explanatory document, example, guide.  
**Note:** Not all documents are authoritative; only those explicitly marked as such.

#### Document Level

A document's position in the authority hierarchy (0-7). Higher levels override lower ones.

Override applies only within the same domain of concern.
Decisions (Level 1) do not override Standards (Level 3); they contextualize or supersede them via explicit process.

**Format:** "Level X" where X is 0-7.  
**Example:** "Standards are Level 3 documents."

#### Registry

The central JSON file (`/docs/00-constitution/registry.json`) tracking all authoritative documents and their metadata.

**Key fields:** `id`, `path`, `level`, `owner`, `enforcement`.  
**Validation:** Must be machine-readable and CI/CD validated.

#### Front Matter

YAML metadata at the start of a document defining its status, ownership, and enforcement.

**Required for:** All authoritative documents (Levels 0-4).  
**Optional for:** Patterns, guides, examples.

---

## Decision & Governance

### Architectural Decision Record (ADR)

An append-only historical record of an architectural decision. ADRs are never reviewed or revised.

**Lifecycle:** `proposed` → `accepted` → `superseded` (or `rejected`).  
**Key property:** Immutable once accepted.

#### Supersession

The process of replacing an existing ADR with a new one. The only way to "change" an architectural decision.

**Requirements:** New ADR must explicitly list superseded ADRs.  
**Preservation:** Superseded ADRs are archived, not deleted.

#### Architecture Council

The governing body responsible for accepting or rejecting ADRs.

**Composition:** Senior technical leads from each domain.  
**Authority:** Final say on architectural decisions.

### Authorized Divergence

A documented, time-bound violation of an authoritative standard. Not an exception or waiver.

Authorized divergence does not change the authority or validity of the violated document.

**Key properties:** Explicit, temporary, scoped, with sunset.  
**Process:** Requires ADR authorizing the divergence.

**Never say:** "exception", "waiver", "exemption".  
**Always say:** "authorized divergence", "temporary violation".

#### Divergence Ticket

The tracking mechanism for authorized divergences. Includes expiration and resolution criteria.

**Fields:** Type (emergency/migration/discovery), expires, condition.  
**Enforcement:** Automatic sunset via CI/CD.

---

## Architectural Layers

### Core

The innermost layer containing pure domain logic. Has strict purity rules.

**Rules:** No IO, no global state, no environment access, no implicit time.  
**Testability:** Must be testable with plain objects.

### Service

Orchestration layer coordinating between Core and Adapters. Manages use cases.

**Responsibility:** Sequence, error propagation, transaction boundaries.  
**May contain:** Application-specific logic.

### Adapter

Infrastructure-facing layer translating between external systems and domain types.

**Examples:** HTTP handlers, database clients, message queue consumers.  
**May use:** Framework-specific libraries and patterns.

### Port

An interface defining a capability required by the domain. Implemented by Adapters.

**Purpose:** Dependency inversion.  
**Location:** Defined in Core, implemented outside.

---

## Messaging & Communication Patterns

### EventBus

A mechanism for publishing **observational events**.

**Semantics:**

- Events represent facts that already occurred
- Handlers MUST NOT affect the originating operation
- Handler failures MUST NOT propagate to the caller

**Typical use cases:** logging, metrics, notifications, side effects.

**Semantic Rules:** Concrete usage and error handling semantics are defined in the [Error Handling Standard](/docs/03-standards/error-handling.md#5-eventbus-vs-hookbus-error-semantics).

### HookBus

A mechanism for processing **transformational hooks**.

**Semantics:**

- Hooks participate in the execution flow
- Handlers MAY transform data or enforce rules
- Handler failures MUST propagate and invalidate the operation

**Typical use cases:** pipelines, validation chains, authorization.

**Semantic Rules:** Concrete usage and error handling semantics are defined in the [Error Handling Standard](/docs/03-standards/error-handling.md#5-eventbus-vs-hookbus-error-semantics).

---

## Error & Result Patterns

**Note:** This section defines semantic categories only. Concrete rules, validation requirements, and implementation constraints are defined exclusively in the [Error Handling Standard](/docs/03-standards/error-handling.md).

### Domain Error

A typed error representing a business condition or rule violation. Extends `BaseError`.

**Properties:** Machine-readable `code`, structured `meta`, human-readable `message`.  
**Never:** Generic `Error`, string messages, HTTP status codes.

### Internal Error

A domain error representing a **violated system invariant**.

Internal Errors indicate **programmer errors or bugs** and signal that the system has entered an invalid state.

**Characteristics:**

- Not an expected outcome
- MUST NOT be used for normal control flow
- Indicates that the system logic is incorrect

**Interpretation:** _The system is wrong._

### Unexpected Error

A domain error representing a **failure originating outside the system boundary** that could not be anticipated or classified.

Unexpected Errors are used when:

- An external dependency fails in an unknown way
- An exception escapes classification
- The failure cannot be reliably mapped to a known domain condition

**Interpretation:** _The environment is wrong or unknown._

### Error Code

A stable, machine-readable identifier for an error condition.

**Format:** `domain:error_type` (e.g., `auth:token_expired`).  
**Stability:** Must not change across minor versions.

#### Error Metadata (`meta`)

Structured context attached to an error for diagnostics and rendering.

**Contents:** Identifiers, configuration values, domain details.  
**Serializability:** Must be JSON-serializable.

### Result Pattern

The `Result<T, E>` type used for expected failures in domain logic.

This pattern is mandated by the Error Handling Standard.

    Success: { success: true, value: T, meta?: Record<string, unknown> }
    Failure: { success: false, error: E } where E extends BaseError

**Compatibility Note:** Previous `ok`-based implementations are deprecated. New code MUST use `success` as the discriminator. See [Error Handling Standard](/docs/03-standards/error-handling.md) for migration details.

**Never:** Exceptions for business logic flow control.

### Discriminator

A property used to distinguish between union types in TypeScript. In the Result pattern, `success` is the canonical discriminator distinguishing success from failure outcomes.

**Usage:** Always use `success` as the discriminator for Result types. Legacy `ok` is deprecated.

---

## Enforcement & Compliance

### Enforcement Level

The degree to which a rule is enforced in CI/CD.

Enforcement levels are declared in both document front matter and the authoritative registry.

**Values:**

- `block`: Violations prevent merging
- `warn`: Violations generate warnings but allow merging
- `none`: No automated enforcement (manual review only)

### Compliance

The state of code conforming to authoritative documentation.

**Positive:** "The implementation is compliant with Standard X."  
**Negative:** "This violates Standard Y and requires a divergence ticket."

### Violation

Any instance of code diverging from authoritative documentation without authorization.

**Authorized:** Documented divergence with ADR and ticket.  
**Unauthorized:** Undocumented divergence (treated as bug).

---

## Document Types

### Standard (Level 3)

Authoritative document containing normative rules (`MUST`, `MUST NOT`, `SHOULD`).

**Enforcement:** Typically `block`.  
**Examples:** Error handling, code review, security standards.

### Contract (Level 4)

Authoritative document defining public API interfaces and guarantees.

**Binding:** Breaking changes require major version bump.  
**Examples:** EventBus contract, HookBus contract.

### Pattern (Level 5)

Recommended implementation approaches without normative force.

**Status:** Never `authoritative`.  
**Purpose:** Guidance, not requirement.

### Guide (Level 6)

Procedural documentation explaining how to accomplish tasks.

**Examples:** Onboarding, adding a module, release process.  
**Authority:** Explanatory only.

---

## Time & Determinism

### Deterministic

Producing the same output given the same inputs, regardless of when or where executed.

**Core requirement:** All Core layer functions must be deterministic.  
**Enablers:** Explicit time parameters, no global state, pure functions.

### Time as Parameter

The practice of passing current time explicitly rather than accessing it globally.

    Correct: function isValid(token, now: number)
    Incorrect: function isValid(token) { return token.exp > Date.now() }

### Policy as Data

Business rules expressed as configuration objects rather than hardcoded logic.

**Benefits:** Versionable, re-evaluatable, testable.  
**Examples:** Token TTL, session limits, rate thresholds.

---

## Type Safety

### Typed Domain Integrity

Using TypeScript types to enforce domain invariants at compile time.

**Examples:** `EmailAddress` instead of `string`, `Percentage` instead of `number`.  
**Benefit:** Eliminates runtime validation for known-valid data.

### Branded Type

A nominal typing pattern creating distinct types from primitive bases.

    type UserId = string & { readonly __brand: 'UserId' };

**Purpose:** Prevents primitive obsession and accidental type mixing.

### Discriminated Union

A union type where each member has a discriminant property enabling type narrowing.

    type Result<T, E> =
      | { success: true; value: T }
      | { success: false; error: E };

---

## AI & Automation

### AI Principles

The foundational beliefs and philosophical stance towards Artificial Intelligence in Comity. Expresses intent and direction for AI as a constrained collaborator.

**Source:** `/docs/02-principles/ai-principles.md`  
**Status:** Level 2 (Principles)

### Machine-Readable

Documentation structured for both human comprehension and automated processing.

**Requirements:** Consistent formatting, defined terminology, valid references.  
**Validation:** Automated via CI/CD schema validation.

### Training Corpus

The set of documents used to train or guide AI systems for Comity development.

**Mandatory:** Levels 0-3 documents and current ADRs.  
**Excluded:** Archived documents, draft content.

---

## Process Terms

### Sunset

The automatic expiration of a temporary divergence or provisional document.

**Mechanism:** CI/CD validation on expiration date.  
**Consequence:** Blocked merges until resolution.

### Grace Period

The time allowed for existing code to comply with new authoritative documents.

**Default:** 90 days for Standards changes.  
**Documentation:** Specified in the ADR authorizing the change.

### Audit

Periodic review of documentation compliance and quality.

ADRs are explicitly excluded from audits, as they are append-only historical records.

**Frequency:** Annual for authoritative documents.  
**Scope:** Completeness, accuracy, consistency.

### Cleanup Process

The systematic removal of emergency code, deprecated patterns, or temporary adaptations after their useful life.

**Trigger:** Sunset expiration, graduation criteria met, or deprecation.  
**Documentation:** [Emergency Cleanup Guide](/docs/06-guides/emergency-cleanup-guide.md)

### Graduation Process

The transition from temporary adaptations or simplified processes to full Standards compliance.

**Note:** This term is used in adaptation documents that will be deprecated. Future documentation should use "migration to full compliance" instead.

---

## ⚠️ **Deprecated & Discouraged Terms**

#### "Best Practice" (implies universality)

**Status:** **DISCOURAGED** - Used in `gradual-adoption-guide.md`  
**Use instead:** "Comity pattern", "recommended approach", "established practice"  
**Reason:** Term is vague and implies false universality

#### "Workaround" (suggests circumventing rules)

**Status:** **PROHIBITED** in normative contexts  
**Use instead:** "alternative implementation", "compliance path"  
**Reason:** Implies violating constraints is acceptable

### Legacy Terms (In Migration)

#### "ok" discriminator

**Status:** **DEPRECATED** - Legacy Result pattern discriminator  
**Use instead:** `success` discriminator  
**Migration:** All new code must use `success`; legacy code should migrate

#### "Helper" / "Utility" (vague function categorization)

**Status:** **DISCOURAGED**  
**Use instead:** Specific function names describing capability (e.g., `validation`, `transformation`, `calculation`)

#### "Middleware" (framework-coupled)

**Status:** **DISCOURAGED** in domain/architecture discussions  
**Use instead:** "adapter", "interceptor", "pipeline component"  
**Allowed:** In framework-specific implementation contexts only

#### "Magic" (pejorative for abstraction)

**Status:** **PROHIBITED**  
**Use instead:** "implicit behavior", "automated wiring", "convention-based" with explanation

---

## Term Creation & Evolution

### Adding New Terms

1. Term emerges in three or more PR discussions
2. Propose definition via PR to this document
3. Architecture Council approves definition
4. Term added to `terms.json` for machine readability
5. Term may now be used in authoritative documents

### Deprecating Terms

1. Term becomes ambiguous or misleading
2. ADR proposes replacement term
3. Update this document with deprecation notice
4. Update existing documentation over grace period
5. Remove from `terms.json` after migration

### Term Versioning

Terms are not versioned. If a term's meaning needs to change:

1. Deprecate old term
2. Create new term with new meaning
3. Document relationship between terms
4. Migrate usage via ADR and grace period

---

## Appendix: Quick Reference

### Documentation Hierarchy

    0: Constitutional Axioms      (why we document)
    1: ADRs                       (how we decided)
    2: Principles                 (what we believe)
    3: Standards                  (what we must do)
    4: Contracts                  (what we promise)
    5: Patterns                   (how we recommend)
    6: Guides                     (how we operate)
    7: Code Docs                  (how it works)

### New Verification Classification

    Universal Procedures:     Apply to 100% of reviews (blocking)
    Conditional Procedures:   Apply only when relevant (contextual)
    Exceptional Procedures:   Apply in special contexts (AI, emergencies)

### Common Acronyms

- **ADR**: Architectural Decision Record
- **CI/CD**: Continuous Integration/Continuous Deployment
- **DX**: Developer Experience
- **IO**: Input/Output (side effects)
- **TLD**: Top-Level Directory
- **TTL**: Time To Live

### Key Constraints

- **Core**: No IO, no globals, no time, no exceptions
- **Standards**: MUST/MUST NOT only at Level 3 (see Constitutional Axiom 3)
- **ADRs**: Append-only, never reviewed
- **Errors**: Domain errors only, never strings
- **Time**: Always explicit parameter in Core

---

## References

- [Constitutional Axioms](/docs/00-constitution/constitutional-axioms.md)
- [Documentation Governance](/docs/00-constitution/documentation-governance.md)
- [ADR Process](/docs/00-constitution/adr-process.md)
- [Error Handling Standard](/docs/03-standards/error-handling.md)
- [Code Review Verification Procedures](/docs/03-standards/code-review-verification-procedures.md)
- [Registry Schema](/docs/00-constitution/registry.schema.json)
- [Terms Schema](/docs/00-constitution/terms.schema.json)
