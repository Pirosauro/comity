---
id: documentation-governance
status: authoritative
version: 1.0.0
owner: @architecture-council
enforcement: block
last_reviewed: 2026-01-08
next_review: 2027-01-08
supersedes: []
---

# Documentation Governance — Implementation Procedures

## Purpose

This document defines the **procedural implementation** of the Constitutional Axioms. It specifies _how_ to operationalize the documentation system, not _what_ rules must be followed.

Normative rules are defined exclusively in:

- **Level 0:** Constitutional Axioms (governing principles)
- **Level 3:** Standards (normative rules: MUST, MUST NOT)
- **Level 4:** Contracts (binding API definitions)

This document contains only **procedures, mechanisms, and workflows**.

---

## 1. Authority Hierarchy Procedures

### 1.1 Document Classification Procedure

To classify a document into the authority hierarchy:

```
1. Determine the document's primary purpose:
   - Defining inviolable principles → Level 0 (Constitution)
   - Recording architectural decisions → Level 1 (ADRs)
   - Expressing beliefs and direction → Level 2 (Principles)
   - Specifying enforceable rules → Level 3 (Standards)
   - Defining API contracts → Level 4 (Contracts)
   - Recommending approaches → Level 5 (Patterns)
   - Explaining how to accomplish tasks → Level 6 (Guides)

2. Place the document in the corresponding directory:
   /docs/00-constitution/   (Level 0)
   /docs/01-decisions/      (Level 1)
   /docs/02-principles/     (Level 2)
   /docs/03-standards/      (Level 3)
   /docs/04-contracts/      (Level 4)
   /docs/05-patterns/       (Level 5)
   /docs/06-guides/         (Level 6)

3. Set the appropriate front matter:
   - status: authoritative (Levels 0-4) or non-authoritative (Levels 5-6)
   - enforcement: block (Levels 0-3), warn (Level 4), none (Levels 5-6)
```

### 1.2 Conflict Resolution Procedure

When documents appear to conflict:

```
1. Identify the conflict:
   - Document A says X
   - Document B says Y
   - X and Y cannot both be true

2. Apply resolution steps:
   a. Check document levels (higher level prevails)
   b. Check version recency (newer prevails within same level)
   c. Check domain specificity (more specific prevails for its domain)

3. If still unresolved within 24 hours:
   a. Create emergency ADR ticket
   b. Suspend conflicting guidance
   c. Architecture Council decides within 48 hours
```

### 1.3 Constitutional Amendment Procedure

To amend Constitutional Axioms (Level 0):

```
1. Proposal Phase (14 days):
   - Draft amendment with clear rationale
   - Circulate to Architecture Council
   - Gather initial feedback

2. Review Phase (30 days):
   - Formal review by all council members
   - Document impacts on all dependent documents
   - Update all cross-references

3. Approval Phase:
   - Unanimous Architecture Council vote required
   - Major version bump (X.0.0)
   - Update registry and notify all document owners

4. Implementation Phase (90 days):
   - Update all dependent documents
   - Retrain AI models
   - Update validation scripts
```

---

## 2. Registry Management Procedures

### 2.1 Document Registration Procedure

To register an authoritative document:

```
1. Ensure the document:
   - Has correct front matter (id, status, version, owner, enforcement)
   - Passes schema validation
   - Is placed in correct directory per its level

2. Add entry to /docs/00-constitution/registry.json:
   {
     "id": "document-id",
     "path": "/docs/xx-category/document-name.md",
     "level": 0|1|2|3|4,
     "owner": "@team/name",
     "enforcement": "block"|"warn"|"none",
     "registered": "YYYY-MM-DD"
   }

3. Run validation:
   npm run docs:validate-registry

4. Notify document owner of successful registration
```

### 2.2 Registry Validation Procedure

Daily CI/CD validation includes:

```
1. Schema validation:
   - All registry entries match registry.schema.json
   - Required fields present and valid

2. Existence validation:
   - All registered documents exist at their paths
   - All authoritative documents are registered

3. Consistency validation:
   - Document level matches directory placement
   - Enforcement level appropriate for document level
   - Owner exists and is active

4. Cross-reference validation:
   - All references in documents point to registered documents
   - No broken links
```

### 2.3 Document Deregistration Procedure

To remove a document from the registry (when deprecated or superseded):

```
1. Update document status to "deprecated" or "superseded"
2. Add supersedes field pointing to replacement document
3. Move document to /docs/07-archive/ maintaining original path
4. Remove from active registry
5. Add to historical registry (/docs/00-constitution/registry-history.json)
6. Update all cross-references to point to replacement
7. Notify dependent document owners
```

---

## 3. Divergence Management Procedures

### 3.1 Divergence Ticket Creation Procedure

To create an authorized divergence:

```
1. Prerequisite: ADR authorizing the divergence exists and is accepted

2. Create divergence ticket with schema:
   Title: Divergence: [Standard ID] - [Brief description]
   Type: emergency | migration | discovery
   Authorized by: [ADR ID]
   Expires: YYYY-MM-DD | [Event condition]
   Scope: [Files/components affected]
   Resolution Criteria: [Acceptance criteria]
   Owner: [Team/person responsible]

3. Place ticket in /docs/08-divergence/[type]/[ticket-id].md

4. Add to divergence registry (/docs/00-constitution/divergence-registry.json)
```

### 3.2 Divergence Monitoring Procedure

Automated monitoring workflow:

```
Daily:
- Check for expired divergences
- Send warnings for divergences expiring in 7 days

On PR creation:
- Check if code changes affect diverged components
- Warn if modifying code under divergence
- Block if divergence has expired

On divergence expiry:
- Automatically create remediation ticket
- Block all PRs to affected components
- Notify divergence owner and team lead
```

### 3.3 Emergency Divergence Procedure

For critical, time-sensitive situations (security, production incidents):

```
1. Create emergency divergence ticket:
   - Type: emergency
   - Expires: 72 hours from creation
   - Authorized by: [EMERGENCY-APPROVAL] tag

2. Prefix commit messages: [EMERGENCY-DIVERGENCE]

3. Changes must be:
   - Minimal and focused on the emergency
   - Reversible without breaking changes
   - Documented in the divergence ticket

4. Within 72 hours, either:
   a. Create proper ADR and convert to migration divergence
   b. Revert the changes
   c. Update documentation to match new reality

5. Emergency approval expires automatically after 72 hours
```

---

## 4. Document Lifecycle Procedures

### 4.1 Document Creation Procedure

To create a new authoritative document:

```
1. Determine appropriate level (see 1.1)
2. Use correct template:
   - Standards: /docs/templates/standard-template.md
   - Contracts: /docs/templates/contract-template.md
   - ADRs: /docs/templates/adr-template.md
   - Principles: /docs/templates/principle-template.md

3. Write content following:
   - Terminology from canonical definitions
   - Reference format specifications
   - Schema requirements for the document type

4. Submit as PR with [DOC-NEW] prefix

5. Review requirements:
   - Level 0-2: Architecture Council approval
   - Level 3: Relevant domain owner + Architecture Council
   - Level 4: Contract stakeholders + Architecture Council

6. Upon approval:
   - Merge to appropriate directory
   - Register in registry
   - Update AI training corpus if needed
```

### 4.2 Document Update Procedure

To update an existing authoritative document:

```
1. Determine change type:
   - Non-breaking (clarification, examples) → minor version bump
   - Breaking (rule changes, new requirements) → major version bump

2. For breaking changes:
   a. Create ADR justifying the change
   b. 14-day comment period
   c. Migration plan for existing code

3. Update document:
   a. Change status to "draft"
   b. Make changes
   c. Update version number
   d. Update last_reviewed date

4. Review and approval (same as creation)

5. Update registry with new version
```

### 4.3 Document Deprecation Procedure

To deprecate a document:

```
1. Identify replacement document (new standard, updated contract)

2. Update document being deprecated:
   - status: deprecated
   - supersedes: [replacement document ID]
   - Add deprecation notice at top of document

3. Update replacement document:
   - supersedes: [deprecated document ID]

4. Move deprecated document to archive after grace period
   - 90 days for Standards
   - 30 days for other documents

5. Update all cross-references
6. Notify dependent document owners
```

---

## 5. Validation and Enforcement Procedures

### 5.1 CI/CD Pipeline Implementation

The documentation compliance pipeline runs:

```
On every commit:
- Schema validation (all documents)
- Front matter validation
- Reference validation
- Terminology consistency check

On PR creation:
- Authority hierarchy validation
- Duplicate normative statement detection
- Divergence ticket validation
- Cross-reference integrity check

On merge to main:
- Registry update
- Document status transitions
- AI training corpus update (if needed)
- Notification to document owners
```

### 5.2 Validation Script Procedures

Maintained validation scripts:

```
docs:validate-hierarchy
  - Purpose: Ensure document levels match directory placement
  - Runs: Pre-commit, PR validation
  - Output: List of hierarchy violations

docs:check-duplicates
  - Purpose: Find duplicate normative statements
  - Runs: Weekly, on PR for Standards
  - Output: Report of duplicates for consolidation

docs:validate-references
  - Purpose: Ensure all references are valid
  - Runs: Pre-commit, on merge
  - Output: List of broken references

docs:check-divergences
  - Purpose: Monitor divergence ticket status
  - Runs: Daily, on PR to diverged components
  - Output: Warnings for expiring/expired divergences
```

### 5.3 Owner Responsibilities Procedure

Document owners must:

```
Weekly:
1. Review validation reports for owned documents
2. Address any violations or warnings
3. Review divergence tickets they own
4. Check for cross-reference updates needed

Monthly:
1. Review document metrics (usage, violations)
2. Update documentation based on feedback
3. Coordinate with dependent document owners

Before next_review date:
1. Conduct comprehensive review
2. Update content if needed
3. Update next_review date (+1 year)
4. Submit update PR if changes made
```

---

## 6. AI Governance Integration Procedures

### 6.1 AI Training Corpus Update Procedure

When documentation changes:

```
1. Determine change impact:
   - Level 0-3 change → Mandatory retraining
   - Level 4 change → Recommended retraining
   - Level 5-6 change → Optional update

2. Update training corpus:
   - Add new/updated documents
   - Remove deprecated/superseded documents
   - Update document references

3. Retraining schedule:
   - Emergency changes: Within 24 hours
   - Major version changes: Within 30 days
   - New ADRs: Within 7 days
   - Terminology updates: Within 48 hours

4. Validation after update:
   - Run AI compliance test suite
   - Verify 95%+ generation compliance
   - Document model version and training date
```

### 6.2 AI-Generated Content Review Procedure

To review AI-generated code or documentation:

```
1. Check for required headers:
   - GENERATED tag with date
   - COMPLIANCE statement
   - VALIDATION report
   - REVIEW required marker

2. Validate against checklists:
   - AI Governance validation checklist
   - Document-specific compliance checklist
   - Terminology consistency check

3. Apply standard review process:
   - Same rigor as human-authored content
   - Special attention to architectural constraints
   - Verification of reference accuracy

4. If violations found:
   - Reject the generation
   - Provide specific feedback
   - Request corrected version
```

### 6.3 AI Model Compliance Verification

Quarterly verification procedure:

```
1. Test suite execution:
   - 100 test prompts covering all document levels
   - Measure compliance rate per document type
   - Track violation patterns

2. Accuracy validation:
   - Reference accuracy (must be 99%+)
   - Terminology accuracy (must be 98%+)
   - Authority chain accuracy (must be 100%)

3. Performance review:
   - Compliance rate trends
   - Common violation categories
   - Prompt effectiveness analysis

4. Update recommendations:
   - Model retraining if compliance < 95%
   - Prompt template updates
   - Documentation clarifications needed
```

---

## 7. Annual Documentation Audit Procedure

Conducted every January (excluding ADRs):

```
Phase 1: Preparation (Week 1)
- Compile list of all authoritative documents
- Gather metrics from CI/CD validation
- Collect feedback from document users

Phase 2: Review (Weeks 2-3)
For each authoritative document:
1. Check completeness and accuracy
2. Verify cross-references are valid
3. Assess clarity and usability
4. Identify gaps or ambiguities

Phase 3: Consolidation (Week 4)
1. Group similar issues across documents
2. Prioritize based on impact and frequency
3. Create remediation plan

Phase 4: Implementation (Q1)
1. Update documents according to plan
2. Update registry and references
3. Update AI training corpus
4. Document audit findings and actions
```

### 7.1 ADR-Specific Consideration

ADRs are explicitly excluded from annual audit because:

- They are append-only historical records
- They are not subject to periodic review
- Their authority comes from being accepted, not from being current

However, ADR relationships are validated:

- No cycles in supersedes graph
- All referenced ADRs exist and have valid status
- Superseded ADRs are properly archived

---

## 8. Directory Structure Maintenance

### 8.1 Structure Implementation

The canonical directory structure is:

    docs/
    ├── 00-constitution/
    │   ├── constitutional-axioms.md
    │   ├── documentation-governance.md
    │   ├── terminology.md
    │   ├── ai-governance.md
    │   ├── adr-process.md
    │   ├── registry.json
    │   ├── terms.json
    │   └── divergence-registry.json
    │
    ├── 01-decisions/
    │   ├── README.md
    │   └── 000[1-9]-*.md
    │
    ├── 02-principles/
    │   ├── philosophy.md
    │   ├── design-philosophy.md
    │   └── [domain]-philosophy.md
    │
    ├── 03-standards/
    │   ├── error-handling.md
    │   └── [domain]-standards.md
    │
    ├── 04-contracts/
    │   ├── event-bus.contract.md
    │   ├── hook-bus.contract.md
    │   └── [component].contract.md
    │
    ├── 05-patterns/
    │   ├── recommended/
    │   └── anti-patterns/
    │
    ├── 06-guides/
    │   ├── onboarding.md
    │   ├── adding-a-module.md
    │   └── evolving-standards.md
    │
    ├── 07-archive/
    │   └── [maintains-original-structure]/
    │
    └── 08-divergence/
        ├── emergency/
        ├── migration/
        └── discovery/

### 8.2 Structure Validation Procedure

Monthly structure validation:

    npm run docs:validate-structure

Checks:

- All directories exist and have correct permissions
- Files are in correct locations per their level
- No unauthorized files in authoritative directories
- Archive maintains original structure for historical reference

---

## 9. Compliance Verification Procedure

### 9.1 Self-Compliance Check

This document complies with Constitutional Axioms by:

- **Axiom 1:** Defines procedures that make documentation govern reality
- **Axiom 2:** Implements explicit hierarchy through classification procedures
- **Axiom 3:** Contains no normative rules—only procedures
- **Axiom 4:** Provides divergence management procedures
- **Axiom 5:** Implements sunset enforcement for divergences
- **Axiom 6:** Preserves history through archive procedures
- **Axiom 7:** Validates against undefined behavior
- **Axiom 8:** Provides structural enforcement via CI/CD procedures

### 9.2 Change Impact Assessment

When procedures in this document change:

1. **Impact assessment:** Determine which documents and processes are affected
2. **Migration plan:** Create step-by-step migration procedure
3. **Communication plan:** Notify all document owners and stakeholders
4. **Rollout schedule:** Phased implementation with rollback options

---

## References

- [Constitutional Axioms](/docs/00-constitution/constitutional-axioms.md)
- [Terminology](/docs/00-constitution/terminology.md)
- [ADR Process](/docs/00-constitution/adr-process.md)
- [AI Governance](/docs/02-principles/ai-principles.md)
- [Registry Schema](/docs/00-constitution/registry.schema.json)
- [Standard Template](/docs/templates/standard-template.md)
- [ADR Template](/docs/templates/adr-template.md)

**Note:** Normative rules referenced in these procedures are defined exclusively in their respective authoritative documents.
