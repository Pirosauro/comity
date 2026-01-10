---
id: adr-0000
status: accepted
date: 2026-01-08
owner: @architecture-council
enforcement: block
supersedes: []
---

# ADR 0000: Adopt Constitutional Documentation Model

## Context

Comity began as a collection of architectural patterns and coding conventions. As the codebase grew, several problems emerged:

1. **Documentation drift**: Code evolved faster than documentation
2. **Authority ambiguity**: Conflicting guidance from multiple sources
3. **AI misalignment**: Generated code violated architectural principles
4. **Review inconsistency**: Different reviewers applied different standards
5. **Historical amnesia**: Past decisions were lost or misunderstood

We needed a documentation system that:

- Governs code, not just describes it
- Is machine-readable and AI-aligned
- Preserves historical decisions
- Scales with the project
- Makes architectural violations visible and temporary

## Decision

We adopt the **Constitutional Documentation Model** based on eight inviolable axioms:

### Core Principles

1. **Documentation defines intent** - It describes what the system must be
2. **Explicit authority hierarchy** - Every document has a clear level
3. **Single authoritative source** - Each rule lives in one place
4. **No silent divergence** - All deviations must be documented
5. **Temporary divergence must have sunset** - Violations are time-bound
6. **Decisions are append-only** - History is preserved, not rewritten
7. **Undefined means forbidden** - What's not documented is not permitted
8. **Enforcement is structural** - Rules without enforcement are not rules

### Implementation Architecture

```
Level 0: Constitutional Axioms (/docs/00-constitution)
Level 1: Architectural Decisions (/docs/01-decisions)
Level 2: Philosophical Principles (/docs/02-principles)
Level 3: Authoritative Standards (/docs/03-standards)
Level 4: Contract Definitions (/docs/04-contracts)
Level 5: Implementation Patterns (/docs/05-patterns)
Level 6: Procedural Guides (/docs/06-guides)
Level 7: Code Documentation (in-repo)
```

### Key Mechanisms

- **Registry system**: Central authority tracking for all documents
- **Divergence management**: Temporary, documented violations with automatic sunset
- **CI/CD integration**: Automated validation of documentation compliance
- **AI governance**: Explicit rules for AI-generated code and documentation
- **Historical preservation**: Append-only ADRs, archived documents

## Consequences

### Positive

1. **Architectural governance**: Documentation becomes enforceable policy
2. **AI alignment**: Clear constraints for code generation
3. **Historical clarity**: Complete decision trail preserved
4. **Review consistency**: Objective standards replace subjective judgment
5. **Scalability**: System grows without losing coherence
6. **Onboarding**: New developers understand "the Comity way" immediately

### Negative

1. **Initial overhead**: Setting up the system requires significant investment
2. **Learning curve**: Team must internalize new documentation discipline
3. **Tooling dependency**: Requires CI/CD and validation automation
4. **Rigidity perception**: May feel overly restrictive initially
5. **Maintenance burden**: Regular audits and updates required

### Neutral

1. **Cultural shift**: From "documentation as commentary" to "documentation as constitution"
2. **Process formalization**: Informal practices become explicit procedures
3. **Ownership assignment**: Every document requires clear ownership

## Migration Strategy

### Phase 1: Foundation (Weeks 1-2)

1. Create directory structure as specified
2. Write Constitutional Axioms and Documentation Governance
3. Setup basic registry and validation scripts

### Phase 2: Content Migration (Weeks 3-6)

1. Classify existing documentation into hierarchy levels
2. Update documents with required front matter
3. Register all authoritative documents
4. Convert historical decisions to ADR format

### Phase 3: Enforcement (Weeks 7-8)

1. Implement CI/CD validation pipeline
2. Train team on new processes
3. Begin enforcing documentation compliance in PRs
4. Setup quarterly documentation audits

### Phase 4: Optimization (Ongoing)

1. Refine validation rules based on usage
2. Expand AI governance as tools evolve
3. Continuous improvement of document quality

## Compliance Requirements

All new code and documentation must comply immediately.

Existing code has 90 days to:

1. Align with authoritative standards, or
2. Create documented divergences with sunset dates

After 90 days, undocumented violations will be treated as bugs.

## Supersedes

_None_ - This is a foundational decision establishing the documentation system itself.

## References

1. [Constitutional Axioms](/docs/00-constitution/constitutional-axioms.md)
2. [Documentation Governance](/docs/00-constitution/documentation-governance.md)
3. [Initial Documentation Audit Report](/docs/07-archive/audit-2026-01.md)

## Signatories

- **Filippo Bovo** - Architecture Council Chair
- **Filippo Bovo** - Implementation Lead
- **Filippo Bovo** - Documentation Governance Owner

## Amendment History

_2026-01-08_: Initial adoption by Architecture Council (unanimous)
