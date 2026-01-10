---
id: adr-process
status: authoritative
version: 1.0.0
owner: @architecture-council
enforcement: block
last_reviewed: 2026-01-08
next_review: 2027-01-08
supersedes: []
---

# ADR Process

## Purpose

This document defines the **process for proposing, deciding, and superseding Architectural Decision Records (ADRs)** in Comity.

It implements the Constitutional principle that **architectural decisions are append-only historical records**. ADRs are not policies, not living documents, and not subject to periodic review.

---

## Core Principles

1. **ADRs record decisions, not discussions**
2. **ADRs are append-only** — once accepted, their meaning never changes
3. **ADRs are never reviewed** — they are either applied or superseded
4. **Every change in architectural intent requires a new ADR**
5. **Supersession is explicit and traceable**
6. **ADRs do not override Standards** — they authorize temporary divergences when needed

---

## When to Write an ADR

Write an ADR when a decision:

### Must Write (Required)

1. Introduces a **new architectural pattern** affecting multiple components
2. **Authorizes a temporary divergence** from an Authoritative Standard (Level 3)
3. Establishes migration strategy between incompatible versions
4. Supersedes one or more existing ADRs
5. Establishes or materially changes **system-wide ownership or governance**
6. Defines **baseline error types** or **cross-domain contracts**

### Should Write (Recommended)

1. Selects between competing architectural approaches
2. Defines relationships between bounded contexts
3. Establishes cross-team architectural contracts
4. Documents why a particular technology or pattern was chosen

### Must Not Write

1. Pure implementation details without architectural impact
2. Coding conventions already covered by Standards
3. Decisions scoped to a single pull request
4. Rule definitions that belong in Standards (Level 3)
5. Terminology definitions that belong in Terminology (Level 0)

**Note:** ADRs cannot change or override Standards. They can only authorize temporary divergences from Standards, which remain the authoritative source of rules.

---

## ADR Lifecycle

An ADR progresses through the following states:

    proposed → accepted → superseded
            ↘ rejected

- **proposed:** Draft under consideration by Architecture Council
- **accepted:** Decision is in force and authoritative
- **rejected:** Decision explicitly declined (preserved for historical context)
- **superseded:** Replaced by a newer ADR

**Important:** ADRs use a simplified lifecycle distinct from other documents. They do not use the `draft → provisional → authoritative` status flow defined in Documentation Governance.

At no point is an ADR revised to change its meaning.

---

## ADR Decision Process

### Step 1: Proposal Draft

1. Copy the canonical ADR template from `/docs/templates/adr-template.md`
2. Assign the next available ADR number (see Numbering section)
3. Complete all required sections:
   - Context (problem and constraints)
   - Considered alternatives (minimum two)
   - Decision (what is chosen and why)
   - Consequences (positive, negative, neutral)
   - Compliance Impact (how it affects existing Standards)
   - Migration Strategy (if changing existing architecture)

The ADR remains in **proposed** state during this phase.

### Step 2: Stakeholder Feedback (Non-binding)

1. Share the proposed ADR with affected teams via `[ADR-REVIEW]` tagged PR
2. Allow sufficient time for feedback (minimum 72 hours)
3. Incorporate feedback where it clarifies or strengthens the decision
4. Document significant objections in the ADR's "Considered Alternatives" section

Feedback does **not** constitute approval. The Architecture Council makes the final decision.

### Step 3: Decision by Architecture Council

1. Submit the ADR with final `[ADR-DECISION]` tag
2. Architecture Council evaluates:
   - Architectural impact and rationale
   - Compliance with Constitutional Axioms
   - Consistency with existing ADRs
   - Clarity and completeness
3. Council may:
   - Accept the ADR (majority vote required)
   - Reject the ADR with specific rationale
   - Request clarification (without rewriting the decision)

**Voting:** Acceptance requires simple majority of Architecture Council members.

### Step 4: Acceptance and Registration

When accepted:

1. Update front matter: `status: accepted`
2. Ensure `supersedes` field is accurate (empty array `[]` if none)
3. Place the ADR in `/docs/01-decisions/` with correct numbering
4. Register the ADR in `registry.json`:
   ```json
   {
     "id": "adr-XXXX",
     "path": "/docs/01-decisions/adr-XXXX-title.md",
     "level": 1,
     "owner": "@architecture-council",
     "enforcement": "block",
     "accepted": "YYYY-MM-DD"
   }
   ```
5. Update all cross-references in affected documents
6. Notify affected teams and document owners

From this point, the ADR is **authoritative and immutable**.

---

## Superseding an ADR

To change an existing architectural decision:

1. Create a new ADR describing the new decision
2. Include the old ADR ID(s) in `supersedes` field
3. Document why the old decision is no longer appropriate
4. Accept the new ADR via the standard decision process
5. Update the superseded ADR:
   - Change status to `superseded`
   - Add note about being superseded by new ADR
6. Move superseded ADRs to `/docs/07-archive/01-decisions/` after 90-day grace period

**Validation:** Tooling ensures no cycles in supersedes relationships and that superseded ADRs are not referenced in new code.

Supersession preserves history while updating architectural intent.

---

## Emergency ADRs

Emergency ADRs are permitted only for **critical, time-sensitive architectural decisions** that cannot wait for normal process (e.g., security incidents, production outages).

### Emergency Process

1. Prefix title with `[EMERGENCY]`
2. Use expedited council decision (maximum 24 hours for review)
3. Require 2/3 approval of the Architecture Council
4. Include explicit sunset clause (maximum 30 days)
5. Emergency ADRs **remain valid** once accepted but must be reviewed

### Follow-up Requirement

Within 30 days of emergency ADR acceptance:

1. Create non-emergency ADR that either:
   - Ratifies the emergency decision
   - Replaces it with a refined decision
   - Reverts the decision if no longer needed
2. The non-emergency ADR supersedes the emergency ADR
3. Emergency ADR is archived

**Note:** Emergency ADRs follow the same authority principles as regular ADRs. They cannot override Constitutional Axioms.

---

## ADR Numbering

ADR identifiers follow this format:

    ADR XXXX: Short Descriptive Title

Number ranges indicate domain:

- **0000–0999:** Foundational and governance decisions
- **1000–1999:** Core architecture and patterns
- **2000–2999:** Security and compliance
- **3000–3999:** Performance and scalability
- **4000–4999:** Developer experience and tooling
- **5000–5999:** Operations and deployment
- **6000–6999:** Cross-cutting concerns (logging, monitoring, etc.)
- **7000–7999:** Team and process architecture
- **8000–8999:** Integrations and third-party systems
- **9000–9999:** Reserved for emergencies and temporary decisions

**Number Assignment:** Use the next available number in the appropriate range. Numbers are never reused.

---

## ADR Template (Canonical)

All ADRs **must** follow this template (available at `/docs/templates/adr-template.md`):

    ---
    id: adr-XXXX
    status: proposed | accepted | rejected | superseded
    date: YYYY-MM-DD
    owner: @architecture-council
    enforcement: block
    supersedes: []  # array of ADR IDs this supersedes
    ---

    # ADR XXXX: [Imperative verb] [Architectural decision]

    ## Context

    [Why this decision is necessary. Describe the problem, constraints, and forces at play.]

    ## Considered Alternatives

    [Minimum two alternatives. For each:
    1. Brief description
    2. Pros and cons
    3. Why it was rejected]

    ## Decision

    [What is decided. Be specific and unambiguous.]

    ## Rationale

    [Why this decision was made. Reference principles, trade-offs, and constraints.]

    ## Consequences

    ### Positive
    [What benefits this decision brings]

    ### Negative
    [What drawbacks or costs this decision incurs]

    ### Neutral
    [What side effects or implications are neither clearly positive nor negative]

    ## Compliance Impact

    [How this decision affects existing Standards:
    - Which Standards are impacted
    - Whether it requires divergence tickets
    - Migration requirements]

    ## Migration Strategy

    [If changing existing architecture:
    - Steps to implement the change
    - Grace period for existing code
    - Tooling or automation needed]

    ## References

    - [Related ADRs](/docs/01-decisions/adr-YYYY-title.md)
    - [Affected Standards](/docs/03-standards/standard-name.md)
    - [Relevant Principles](/docs/02-principles/philosophy.md#section)

    ## Signatories

    - **[Name]** - Architecture Council Member
    - **[Name]** - Implementation Lead

    ## Amendment History

    _YYYY-MM-DD_: Initial acceptance by Architecture Council (vote: X/Y)

---

## Schema Compliance

All ADRs must validate against `/docs/00-constitution/adr.schema.json`:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "ADR Front Matter Schema",
  "type": "object",
  "required": ["id", "status", "date", "owner", "enforcement", "supersedes"],
  "properties": {
    "id": {
      "type": "string",
      "pattern": "^adr-[0-9]{4}$",
      "description": "Unique ADR identifier (e.g. adr-0001)"
    },
    "status": {
      "type": "string",
      "enum": ["proposed", "accepted", "rejected", "superseded"],
      "description": "Lifecycle state of the ADR"
    },
    "date": {
      "type": "string",
      "format": "date",
      "description": "Date the ADR was proposed or accepted"
    },
    "owner": {
      "type": "string",
      "pattern": "^@[a-z0-9\\-_/]+$",
      "description": "Owning team or council"
    },
    "enforcement": {
      "type": "string",
      "enum": ["block"],
      "description": "ADRs always have blocking enforcement"
    },
    "supersedes": {
      "type": "array",
      "items": {
        "type": "string",
        "pattern": "^adr-[0-9]{4}$"
      },
      "description": "List of ADRs superseded by this one (empty array if none)"
    }
  },
  "additionalProperties": false
}
```

**Note:** ADRs do not include `version`, `last_reviewed`, or `next_review` fields, as they are append-only and never reviewed.

---

## Relationship to Other Documents

### Standards (Level 3)

- ADRs can authorize temporary divergences from Standards
- ADRs cannot change or override Standards
- Standards remain the authoritative source of rules

### Documentation Governance

- ADRs follow specialized lifecycle (not general document lifecycle)
- ADR supersession follows historical preservation rules
- ADRs are excluded from annual documentation audit

### AI Governance

- AI must respect ADRs as authoritative architectural decisions
- AI-generated code must comply with ADR decisions
- ADRs are part of mandatory AI training corpus

### Terminology

- ADRs must use canonical terminology
- ADRs can define domain-specific terms that later propagate to Terminology
- ADR decisions about terminology require Terminology updates

---

## Prohibitions (Strict)

The following are **explicitly forbidden**:

- Editing an accepted ADR to change its meaning
- Adding version numbers to ADRs (they are immutable)
- Periodic review of ADRs (they are historical records)
- Superseding ADRs without creating a new ADR
- Using ADRs to define normative rules (belongs in Standards)
- Creating ADRs that violate Constitutional Axioms
- Referencing superseded ADRs in new code (use current ADR)

Violations block merges via CI/CD validation.

---

## References

- [Constitutional Axioms](/docs/00-constitution/constitutional-axioms.md) - Axiom 6: Decisions Are Append-Only
- [Documentation Governance](/docs/00-constitution/documentation-governance.md) - Implementation procedures
- [Terminology](/docs/00-constitution/terminology.md) - Canonical definitions
- [Error Handling Standard](/docs/03-standards/error-handling.md) - Example of Standard referenced by ADRs
- [ADR Template](/docs/templates/adr-template.md) - Canonical template

---

## Compliance Statement

This ADR Process complies with all Constitutional Axioms:

- **Axiom 1:** ADRs document intentional architectural decisions
- **Axiom 2:** ADRs are Level 1 in authority hierarchy
- **Axiom 3:** ADRs do not duplicate normative rules from Standards
- **Axiom 4:** ADRs authorize documented divergences from Standards
- **Axiom 5:** Emergency ADRs have explicit sunset clauses
- **Axiom 6:** ADRs are append-only historical records
- **Axiom 7:** Undocumented architectural changes are forbidden
- **Axiom 8:** ADR compliance is enforced via CI/CD blocking

**Version Note:** This 1.1.0 version clarifies the relationship between ADRs and Standards, and aligns with the updated Documentation Governance procedures.
