---
id: code-review-guide
status: non-authoritative
version: 1.0.0
owner: @architecture-council
enforcement: none
last_reviewed: 2026-01-09
next_review: 2027-01-09
supersedes: ["code-review-guide-v1"]
---

# Code Review Guide

## Purpose

This document provides **non-normative guidance, best practices, and suggestions** for conducting effective code reviews in Comity. It complements but does not override any Standards.

**Critical Clarification:** This is a **Level 6: Guide** (advisory, non-authoritative). It contains:

- ✅ Suggestions and recommendations
- ✅ Best practices and patterns
- ✅ Team culture guidance
- ✅ Educational content

**Does NOT contain:**

- ❌ Normative rules (`MUST`, `MUST NOT`, `SHOULD`)
- ❌ Architectural constraints (defined in Standards)
- ❌ Verification requirements (defined in Verification Procedures)

**Reference Authority:** All mandatory requirements are defined in [Code Review Verification Procedures](/docs/03-standards/code-review-verification-procedures-verification-procedures.md).

---

## 📚 Review Philosophy: Learning Over Gatekeeping

### Suggested Mindset for Reviewers

> **"Be a teacher, not a critic. Assume positive intent. Focus on what matters."**

**We suggest reviewers:**

1. **Improve code quality** through collective ownership
2. **Share knowledge** across the team
3. **Catch issues early** through collaborative review
4. **Maintain consistency** by applying Standards uniformly
5. **Develop engineers** through constructive feedback

### Suggested Review Principles

**Balance is key:**

- Architectural integrity **and** team velocity
- Consistency **and** context awareness
- Thoroughness **and** reasonable time investment
- Standards compliance **and** practical implementation

---

## 🔄 Suggested Review Workflow

### Phase 1: Pre-Review Preparation (Author)

**We suggest authors prepare PRs with:**

```
1. Self-review: Walk through your own code first
2. Run validations: Ensure CI/CD passes
3. Update documentation: Include relevant references
4. Test thoroughly: Verify functionality works
5. Scope appropriately: Consider keeping PRs < 400 lines
```

**Suggested PR Description Template:**

```markdown
## What Changed

[Brief description]

## Why This Change

[Business context, problem being solved]

## Standards References

- Affects Core purity? Reference: [Core Purity Standard §X.X]
- Changes error handling? Reference: [Error Handling Standard §Y.Y]
- Modifies public APIs? Reference: [Type Safety Standard §Z.Z]
- Emergency code? Reference: [Emergency Standards §A.A]

## Testing Approach

[What was tested, coverage considerations]

## Areas for Reviewer Focus

[Specific concerns or complex sections]
```

### Phase 2: Review Execution (Reviewer)

**Suggested review approach:**

```
First Pass (10-15 min):
1. Understand context from PR description
2. Scan architecture at high level
3. Verify CI/CD status is green
4. Check Standards references are appropriate

Deep Review (Time proportional to changes):
1. Read code thoroughly
2. Consider edge cases and error handling
3. Assess test coverage
4. Evaluate maintainability
5. Note questions and suggestions

Final Pass (5 min):
1. Review comments for clarity and tone
2. Ensure feedback is actionable
3. Verify nothing critical missed
4. Decide: Approve, Request Changes, or Discuss
```

**Suggested Time Guidelines:**

- Small PR (< 200 lines): 30-60 minutes
- Medium PR (200-400 lines): 60-90 minutes
- Large PR (> 400 lines): Consider splitting or scheduling dedicated session

### Phase 3: Post-Review Collaboration

**We suggest this collaborative resolution process:**

```
1. Author addresses comments
2. Reviewer verifies fixes
3. Both agree when PR is ready
4. Merge with descriptive commit messages
```

**For disagreements, we suggest:**

- Discuss constructively with reference to Standards
- Escalate to third reviewer if stuck
- Remember: Goal is best solution, not "winning"
- Document rationale for unusual decisions

---

## 🧠 Suggested Cognitive Frameworks

### The "Four Lenses" Approach

**Consider code through these perspectives:**

1. **Architectural Lens**

   - Does this respect layer boundaries?
   - Are dependencies properly directed?
   - Is Core purity maintained?

2. **Correctness Lens**

   - Are edge cases handled?
   - Is error handling appropriate?
   - Are business rules correctly implemented?

3. **Maintainability Lens**

   - Is code readable and understandable?
   - Are complex sections documented?
   - Could this be simplified?

4. **Evolution Lens**
   - Will this be easy to change later?
   - Are assumptions documented?
   - Does this create technical debt?

### The "Scout Rule" Mindset

> **"Leave the codebase better than you found it."**

**We suggest looking for opportunities to:**

- Improve naming for clarity
- Add helpful comments for complex logic
- Reduce duplication when appropriate
- Update outdated patterns (with proper migration)

---

## 👥 Team Practices and Culture Suggestions

### Review Rotation and Pairing

**We suggest teams consider:**

```
1. Rotate review assignments to spread knowledge
2. Pair program on complex changes before review
3. Include junior engineers in reviews for learning
4. Schedule regular review syncs for large features
5. Maintain "review buddy" system for mentorship
```

### Handling Different Experience Levels

**For junior engineers, we suggest reviewers:**

- Focus on teaching, not just correcting
- Explain the "why" behind Standards
- Be patient with learning curves
- Celebrate improvements and growth

**For senior engineers, we suggest:**

- Seek their architectural perspective
- Value their experience with edge cases
- Encourage mentoring of junior reviewers
- Leverage their system knowledge

### Remote and Async Review Practices

**For distributed teams, we suggest:**

```
1. Use video calls for complex architectural reviews
2. Document discussions clearly in PR comments
3. Be explicit about timezone availability
4. Use async tools effectively (Loom, annotated screenshots)
5. Schedule overlap hours for synchronous discussion
```

---

## 📋 Suggested Review Considerations by Change Type

### General Considerations (All PRs)

**We suggest checking:**

```
[ ] Code compiles and tests pass
[ ] CI/CD validation successful
[ ] PR description complete and accurate
[ ] Changes are focused and coherent
[ ] No debug code or console.log in production code
[ ] TODO/FIXME comments have associated tickets
[ ] Documentation updated if needed
```

### When Reviewing Architectural Changes

**We suggest verifying the author has considered:**

- Impact on layer boundaries (Core/Service/Adapter)
- Dependency direction preservation
- Port interface definitions if needed
- Whether an ADR is required (for significant decisions)

**Reference Standards for verification:**

- [Core Purity Standard](/docs/03-standards/core-purity.md)
- [Design Philosophy §3](/docs/02-principles/design-philosophy.md#3-dependency-direction-shapes-architectural-integrity)

### When Reviewing Error Handling Changes

**We suggest looking for:**

- Use of proper error patterns (Result with 'success' discriminator)
- Error codes following `domain:error_type` format
- Appropriate error metadata for debugging
- Test coverage for error cases

**Reference Standards for verification:**

- [Error Handling Standard](/docs/03-standards/error-handling.md)
- [Result Pattern Examples](/docs/05-patterns/result-pattern-examples.md)

### When Reviewing Type Safety Changes

**We suggest considering:**

- Use of branded types for domain primitives
- Discriminated unions for state machines
- Readonly/immutable types where appropriate
- Type guards for external data validation

**Reference Standards for verification:**

- [Type Safety Standard](/docs/03-standards/type-safety.md)

### When Reviewing AI-Generated Code

**We suggest ensuring:**

- Validation headers are present and complete
- References to relevant Standards are included
- Code follows established Comity patterns
- Human review has been conducted

**Reference documents:**

- [AI Principles](/docs/02-principles/ai-principles.md)
- [Code Review Verification Procedures §U6](/docs/03-standards/code-review-verification-procedures-verification-procedures.md#u6-ai-generated-code-header-check)

### When Reviewing Emergency Code

**We suggest verifying:**

- Emergency headers are present and valid
- Sunset dates are appropriate and not expired
- Code follows emergency patterns
- Rollback path exists if needed

**Reference documents:**

- [Emergency Standards](/docs/03-standards/emergency-standards.md)
- [Emergency Code Patterns](/docs/05-patterns/emergency-code-patterns.md)

---

## 🎯 Quality Heuristics and Patterns

### Code Smells to Consider Flagging

**We suggest discussing these patterns:**

**Architectural Smells:**

- Functions doing too much (> 40 lines)
- Deep nesting of conditionals or loops
- Magic numbers or strings without explanation
- Repeated code patterns (opportunity for abstraction)

**Maintainability Smells:**

- Unclear variable or function names
- Functions with side effects not documented
- Complex type assertions (lots of `as` casts)
- Missing error handling for expected failures

**Test Quality Smells:**

- Tests that depend on execution order
- Tests with unclear assertions
- Missing edge case coverage
- Over-mocked tests (testing mocks, not logic)

### Positive Patterns to Encourage

**We suggest recognizing and praising:**

**Code Clarity:**

- Small, focused functions with single responsibility
- Clear variable names that reveal intent
- Explicit error handling with Result pattern
- Helpful comments for non-obvious logic

**Architectural Integrity:**

- Clean separation of concerns (Core/Service/Adapter)
- Proper dependency injection
- Immutable data where appropriate
- Well-defined Port interfaces

**Testing Excellence:**

- Deterministic tests
- Clear test descriptions
- Realistic test data
- Edge case coverage
- Fast execution

---

## 🆘 Common Review Scenarios and Suggested Responses

### Scenario: "This violates a Standard"

**Author says:** "But this is faster/cleaner/simpler."

**Suggested response:** "I understand the appeal. The Standard exists because [explain rationale from documentation]. Let's find a compliant solution that achieves your goal. Would [suggest alternative] work, or should we discuss an ADR if this constraint is problematic?"

### Scenario: "I don't understand this code"

**Reviewer is confused by complex logic.**

**Suggested response:** "I'm having trouble following this logic. Could you add a comment explaining the approach or consider breaking it into smaller functions? This will help future maintainers (including future you!)."

### Scenario: "This test is flaky"

**Test fails intermittently.**

**Suggested response:** "This test appears non-deterministic. Let's make it reliable by [suggest fix: mock time, isolate dependencies, etc.]. Flaky tests reduce confidence in our test suite."

### Scenario: "Too many comments on my PR"

**Author feels overwhelmed.**

**Suggested response:** "Let's hop on a quick call to walk through these together. Some comments might be related and have a common solution."

### Scenario: "Disagreement on approach"

**Author and reviewer have different opinions.**

**Suggested response:** "Let's evaluate both approaches against our Standards and Principles. If still unclear, let's bring in [third reviewer] for perspective or escalate to Architecture Council if architectural."

---

## 🛠️ Suggested Tooling and Environment

### IDE Configuration Suggestions

**We suggest these settings for consistency:**

```json
// Suggested VS Code/EditorConfig settings
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.validate.enable": true,
  "eslint.validate": ["typescript", "typescriptreact"]
}
```

### Suggested PR Templates

**Consider creating domain-specific templates:**

```
.github/PULL_REQUEST_TEMPLATE/
├── feature.md          # New feature workflow
├── bugfix.md           # Bug fix workflow
├── refactor.md         # Refactoring workflow
├── emergency.md        # Emergency fix workflow
└── docs.md            # Documentation changes
```

### Suggested Review Automation

**Teams might consider:**

- Code owners automation for domain expertise
- Required reviewer assignment based on changed files
- Review reminder bots (with reasonable timeouts)
- Metrics dashboards for review performance tracking
- Knowledge sharing platforms (internal blogs, wikis)

---

## 📈 Learning and Development Suggestions

### Suggested Reviewer Training Path

**For new reviewers, we suggest:**

```
Phase 1: Observation (1-2 weeks)
- Shadow experienced reviewers
- Read review comments on others' PRs
- Study Code Review Verification Procedures

Phase 2: Assisted Review (2-4 weeks)
- Review small, low-risk PRs first
- Get feedback on review comments
- Pair with experienced reviewer

Phase 3: Independent Review (1-2 months)
- Review progressively more complex PRs
- Mentor other new reviewers
- Contribute to review process improvement
```

### Suggested Continuous Learning Activities

**We recommend teams consider:**

```
Monthly:
- Review quality discussion in team meeting
- Share interesting review cases as learning opportunities
- Discuss pain points and process improvements

Quarterly:
- Review challenging PRs as learning cases
- Update guidance based on team experience
- Cross-team review exchange for perspective sharing

Annually:
- Refresh on all Standards and updates
- Review team review metrics and trends
- Set improvement goals for next year
```

### Suggested Learning Resources

**We suggest reviewers familiarize themselves with:**

- [Code Review Verification Procedures](/docs/03-standards/code-review-verification-procedures-verification-procedures.md) - Verification requirements
- [Error Handling Standard](/docs/03-standards/error-handling.md) - Error patterns deep dive
- [Core Purity Standard](/docs/03-standards/core-purity.md) - Architectural constraints
- [Type Safety Standard](/docs/03-standards/type-safety.md) - Type patterns and practices
- [ADR Decisions](/docs/01-decisions/) - Historical architectural decisions
- [Design Philosophy](/docs/02-principles/design-philosophy.md) - Design principles context

---

## ⚠️ Important Compliance Notes

### What This Guide Does NOT Do

**This guide:**

- Does NOT define what must be checked (defined in Verification Procedures)
- Does NOT create new requirements (defined in Standards)
- Does NOT override Constitutional Axioms (inviolable)
- Does NOT replace team judgment and context

### Relationship to Verification Procedures

**For mandatory verification requirements, refer to:**

- [Code Review Verification Procedures](/docs/03-standards/code-review-verification-procedures-verification-procedures.md) - Universal verification requirements
- Specific Standards for domain rules

**This guide provides context and suggestions around those requirements.**

### When Standards Are Unclear

**If a Standard seems ambiguous or contradictory:**

1. Discuss with team to align on interpretation
2. Document the agreed interpretation for consistency
3. Consider proposing a clarification to the Standard
4. Never assume or create "local interpretations" without documentation

---

## 📚 References and Authority

### Primary References (Mandatory Requirements)

- **[Code Review Verification Procedures](/docs/03-standards/code-review-verification-procedures-verification-procedures.md)** - Universal verification requirements
- **[Emergency Standards](/docs/03-standards/emergency-standards.md)** - Emergency code rules
- **[AI Principles](/docs/02-principles/ai-principles.md)** - AI generation philosophy

### Supporting Standards (Normative Rules)

- [Error Handling Standard](/docs/03-standards/error-handling.md) - Error pattern rules
- [Core Purity Standard](/docs/03-standards/core-purity.md) - Architectural rules
- [Type Safety Standard](/docs/03-standards/type-safety.md) - Type usage rules

### Process Documents (Procedural)

- [Documentation Governance](/docs/00-constitution/documentation-governance.md) - Documentation procedures
- [ADR Process](/docs/00-constitution/adr-process.md) - Decision documentation

### Advisory Documents (Guidance)

- [Design Philosophy](/docs/02-principles/design-philosophy.md) - Design principles
- [Comity Philosophy](/docs/02-principles/philosophy.md) - Core beliefs
- [Gradual Adoption Guide](/docs/06-guides/gradual-adoption-guide.md) - Adoption strategies
- [Small Team Adaptations](/docs/06-guides/small-team-adaptations.md) - Team size adaptations

---

## 🎯 Constitutional Compliance Statement

This guide complies with all Constitutional Axioms:

- **Axiom 1:** Provides guidance for implementing documented intent
- **Axiom 2:** Level 6 Guide, references higher-level documents
- **Axiom 3:** Contains **zero** normative rules; references authoritative sources
- **Axiom 8:** Specifies `enforcement: none` (purely advisory)
- **Axiom 9:** Uses canonical terminology exclusively

**Key Compliance Achievement:** All `MUST`/`MUST NOT` requirements have been removed. This document now contains only suggestions, best practices, and educational content.

---

## 📝 Amendment History

_2026-01-08_: Version 1.0.0 - Initial version

---

**Important Reminder:** This guide provides suggestions and best practices only. All mandatory requirements are defined in the [Code Review Verification Procedures](/docs/03-standards/code-review-verification-procedures-verification-procedures.md) and referenced Standards. Teams may adapt these suggestions based on their specific context while maintaining compliance with all Standards.
