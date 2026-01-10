---
id: gradual-adoption-guide
status: non-authoritative
version: 1.0.0
owner: @architecture-council
enforcement: none
last_reviewed: 2026-01-09
next_review: 2027-01-09
supersedes: []
---

# Gradual Adoption Guide

## Purpose

This guide provides a **practical, phased approach** to adopting Comity's Constitutional Documentation Model. It addresses that teams have different sizes, constraints, and starting points.

**Team Size Considerations:** This guide now includes adaptations for teams of all sizes (1-3, 4-8, 9+ developers) with clear migration paths to full compliance.

This is a **Level 6: Guide** (non-authoritative, procedural). It does not create new rules or override existing Standards.

---

## Core Principle

> **Adopt constraints that solve your immediate problems, not all possible future problems.**

Start with what hurts most, prove value, then expand. Each level builds on the previous, creating compounding benefits.

**Key Concept:** **Compliance Migration Path** - The process of moving from simplified implementations to full Standards compliance as teams grow and mature.

---

## 📊 **Team Size Considerations**

### Small Teams (1-3 Developers)

**Characteristics:** Limited bandwidth, wearing multiple hats, rapid iteration needs.

#### Suggested Adaptations:

**1. Documentation Scope Focus:**

- **Essential:** Error Handling Standard implementation
- **Important:** ADRs for key decisions
- **Useful:** API documentation for public endpoints
- **Deferred:** Comprehensive pattern library

**2. Process Simplifications:**

- **Review:** Pair programming as primary mechanism
- **Validation:** Manual checks before automation
- **Registry:** Single markdown file vs full JSON
- **Timeline:** Extended grace periods (180 days vs 90)

**3. Graduation Triggers (Move to Full Compliance When):**

- Team grows to 4+ developers
- Product reaches production with external users
- Codebase exceeds 10,000 lines
- 12 months have passed since adoption

### Medium Teams (4-8 Developers)

**Characteristics:** Some specialization possible, need coordination, balance velocity vs quality.

#### Suggested Path: Standard Progression

- Follow adoption levels 0-5 as described
- Implement CI/CD automation from Level 2
- Establish code review standardization
- Rotate documentation ownership

### Large Teams (9+ Developers)

**Characteristics:** Multiple squads, need consistency, formal processes required.

#### Additional Requirements:

- Domain-specific Standards early
- Automated compliance reporting
- Formal training program for new members
- Documentation health metrics dashboard

---

## Adoption Levels

### Level 0: Foundation (Week 1-2)

**Goal:** Establish basic documentation governance without blocking development.

**Required:**

1. Directory structure (`/docs/00-constitution/` through `/docs/06-guides/`)
2. Constitutional Axioms (read and acknowledge)
3. Terminology (reference when writing code)
4. Basic PR template with ADR/Standard references

**Optional:**

- Full registry system
- CI/CD validation
- All Standards enforcement

**Team Size Adaptations:**

- **Small teams:** Manual validation acceptable initially
- **Medium/Large:** Setup basic CI/CD validation

**Expected Benefits:**

- Clear documentation location
- Shared terminology
- Basic decision tracking

### Level 1: Error Handling Standard (Weeks 3-4)

**Goal:** Eliminate stringly-typed errors and improve error traceability.

**Required:**

1. Implement `BaseError` pattern
2. Use `domain:error_type` error codes
3. Adopt `Result<T, E>` with `success` discriminator for new code
4. Update public APIs to return `Result` types

**Migration Strategy:**

- New code: Full compliance
- Existing code: Wrap in `try/catch` returning `Result`
- Critical paths: Prioritize migration
- Legacy code: Document with `// TODO: Migrate to Result pattern by <date>`

**Team Size Adaptations:**

- **Small teams:** Start with 5-10 common error types
- **All teams:** Error codes required, full metadata optional initially

**Verification:**

- Manual code review for error patterns
- ESLint rule: `no-throw-literal`
- Test coverage for error cases

**Expected Benefits:**

- Better error debugging
- Structured error logging
- Type-safe error handling

### Level 2: Core Purity Constraints (Weeks 5-8)

**Goal:** Establish architectural boundaries and improve testability.

**Required:**

1. Create `/core/` directory structure
2. Move pure business logic to Core
3. Implement Port interfaces for external dependencies
4. No framework types in Core (detect via CI/CD)

**Team Size Adaptations:**

- **Small teams:** Combined Service/Core layer permitted initially
- **All teams:** Framework imports in Core must be flagged for migration

**Migration Strategy:**

- Identify pure domain logic
- Extract to Core with explicit time parameters
- Create adapter layer for existing implementations
- Use dependency injection for services

**Verification:**

- CI/CD: Detect framework imports in Core
- Manual review: IO operations in Core
- Tests: Core tests without mocks

**Expected Benefits:**

- Deterministic business logic
- Framework independence
- Improved testability

### Level 3: Type Safety Standards (Weeks 9-12)

**Goal:** Leverage TypeScript to prevent invalid states.

**Required:**

1. Branded types for domain primitives (new code)
2. Discriminated unions for state machines
3. No `any` in public APIs
4. Readonly return types

**Team Size Adaptations:**

- **Small teams:** `no-explicit-any` warning only for private methods
- **Medium/Large:** Full enforcement from start

**Migration Strategy:**

- New types: Use branded types
- Existing types: Add validation functions
- Public APIs: Incremental migration
- Complex state: Refactor to discriminated unions

**Verification:**

- TypeScript: `no-explicit-any` enabled
- CI/CD: Branded type detection
- Manual review: State representation

**Expected Benefits:**

- Compile-time validation
- Self-documenting types
- Reduced runtime checks

### Level 4: Full Standards Adoption (Months 4-6)

**Goal:** Complete compliance with all Standards.

**Required:**

1. Full Error Handling Standard compliance
2. Complete Core purity
3. Comprehensive type safety
4. AI Governance integration

**Team Size Considerations:**

- **Small teams:** May need 6-9 months for full compliance
- **Medium teams:** Target 4-6 months
- **Large teams:** Can accelerate with dedicated resources

**Migration Strategy:**

- Address all `// TODO` comments
- Remove legacy error patterns
- Finalize branded type migration
- Implement full CI/CD validation

**Verification:**

- All CI/CD checks passing
- 100% Standards compliance for new code
- > 90% compliance for existing code

**Expected Benefits:**

- Full architectural governance
- Predictable system evolution
- Reduced defect rates

### Level 5: AI Integration (Months 7-12)

**Goal:** Leverage AI as constrained collaborator.

**Required:**

1. AI Principles understanding and application
2. Training corpus maintained
3. AI validation in CI/CD
4. Prompt engineering discipline

**Team Size Adaptations:**

- **Small teams:** Focus on boilerplate generation with manual review
- **Medium/Large:** Can implement full validation automation

**Verification:**

- AI-generated code compliance rate >95%
- Validation headers present
- Prompt templates standardized

**Expected Benefits:**

- Accelerated development
- Consistent code generation
- Knowledge preservation

---

## Compliance Migration Paths

### Path A: Startup/Greenfield (Recommended)

```
Month 1-2: Level 0-1 (Foundation + Error Handling)
Month 3-4: Level 2 (Core Purity)
Month 5-6: Level 3 (Type Safety)
Month 7-9: Level 4 (Full Standards)
Month 10-12: Level 5 (AI Integration)
```

### Path B: Brownfield/Legacy Codebase

```
Month 1: Level 0 (Foundation Only)
Month 2-4: Level 1 (Error Handling - Critical paths first)
Month 5-8: Level 2 (Core Purity - New features only)
Month 9-12: Level 3 (Type Safety - Incremental)
Month 13-18: Level 4-5 (Full compliance)
```

### Path C: Enterprise/Large Team

```
Month 1: Level 0-1 (All teams)
Month 2-3: Level 2 (Architecture team leads)
Month 4-6: Level 3 (All teams with training)
Month 7-9: Level 4 (Full compliance with grace)
Month 10-12: Level 5 (Center of excellence)
```

---

## Risk-Based Prioritization

### High Risk Areas (Adopt First)

1. **Security-critical code:** Full Standards immediately
2. **Public APIs:** Error Handling + Type Safety
3. **Shared libraries:** All Standards before publishing
4. **Integration points:** Contract definitions early

### Medium Risk Areas (Adopt Within 3 Months)

1. **Internal services:** Core Purity + Error Handling
2. **Database layer:** Port interfaces
3. **Business logic:** Type Safety + Determinism

### Low Risk Areas (Adopt Within 6 Months)

1. **Admin interfaces:** Gradual migration
2. **Reporting systems:** Error Handling first
3. **Internal tools:** Foundation only

---

## 📊 **Metrics and Success Criteria**

### Adoption Metrics Checklist

**Level 0: Foundation**

- [ ] Documentation directory exists
- [ ] Team has read Constitutional Axioms
- [ ] PRs reference relevant documents

**Level 1: Error Handling**

- [ ] > 80% new errors use BaseError
- [ ] Error codes follow `domain:error_type` format
- [ ] Result pattern used in new Core code

**Level 2: Core Purity**

- [ ] Core layer exists with pure functions
- [ ] No framework types in Core (or migration plan)
- [ ] Port interfaces defined for external dependencies

**Level 3: Type Safety**

- [ ] New domain primitives use branded types
- [ ] No `any` in new public APIs
- [ ] State machines use discriminated unions

**Level 4: Full Standards**

- [ ] All new code passes CI/CD validation
- [ ] > 90% existing code compliant
- [ ] Documentation references are valid

**Level 5: AI Integration**

- [ ] AI-generated code includes validation headers
- [ ] Prompt templates standardized
- [ ] Training corpus updated regularly

### Success Criteria by Timeframe

**3 Months (Minimum Success):**

- Level 1 fully adopted
- Team consensus on value
- Reduction in error debugging time (>30%)

**6 Months (Good Success):**

- Level 3 adopted
- Measurable code quality improvement (defect rate ↓20%)
- New hires onboard faster (<5 days to first productive PR)

**12 Months (Excellent Success):**

- Full system adopted
- AI integration productive (>50% boilerplate generated)
- System evolution predictable (change impact analysis <1 hour)

---

## 🚨 **Common Challenges and Solutions**

### Challenge 1: "Too Much Overhead"

**Symptoms:** Team complains about documentation burden, velocity decreases.

**Solutions:**

- **Re-evaluate:** Are you solving immediate pain points?
- **Simplify:** Use appropriate team size adaptations
- **Automate:** Invest in CI/CD validation gradually
- **Demonstrate value:** Show error reduction metrics
- **Start small:** One Standard at a time

### Challenge 2: "Inconsistent Adoption"

**Symptoms:** Some code compliant, some not; confusion about what applies.

**Solutions:**

- **Clear boundaries:** New vs existing code markers
- **Migration markers:** `// TODO: Migrate by <date>`
- **Team agreement:** Consensus on adoption pace
- **Regular checkpoints:** Monthly progress reviews
- **Visual indicators:** Dashboard showing compliance status

### Challenge 3: "Tooling Not Ready"

**Symptoms:** CI/CD validation missing, manual review overwhelming.

**Solutions:**

- **Start manual:** Checklists before automation
- **Incremental tooling:** Add one validation at a time
- **Open source:** Use community ESLint plugins initially
- **Team contribution:** Build missing tooling as team capacity allows
- **Temporary adaptations:** Document what's manual vs automated

### Challenge 4: "Resistance to Change"

**Symptoms:** Team pushes back, seeks workarounds, reverts to old patterns.

**Solutions:**

- **Involve early:** Team helps shape adoption plan
- **Show benefits:** Metrics from early adopters
- **Pair programming:** Knowledge transfer through collaboration
- **Celebrate wins:** Recognize compliance improvements
- **Provide support:** Dedicated office hours for questions

---

## 🔄 **Compliance Migration Process**

### Step 1: Assessment

```
1. Current State Analysis:
   - Codebase size and complexity
   - Team size and experience
   - Existing documentation quality
   - Pain points and priorities

2. Adoption Path Selection:
   - Choose path (A, B, or C) based on assessment
   - Adjust timeline based on team capacity
   - Set realistic milestones
```

### Step 2: Planning

```
1. Create Migration Plan:
   - Timeline with milestones
   - Resource allocation
   - Risk mitigation strategies
   - Success metrics

2. Team Preparation:
   - Training schedule
   - Tooling setup
   - Process adjustments
   - Communication plan
```

### Step 3: Execution

```
1. Phase Implementation:
   - Start with Level 0 (Foundation)
   - Move to highest-priority Standard
   - Implement team-appropriate adaptations
   - Monitor metrics and adjust

2. Continuous Improvement:
   - Weekly check-ins
   - Monthly retrospectives
   - Quarterly compliance reviews
   - Annual system audit
```

### Step 4: Graduation to Full Compliance

```
1. Graduation Criteria:
   - All new code compliant
   >90% existing code compliant
   - CI/CD validation fully implemented
   - Team self-sufficient on Standards

2. Graduation Ceremony:
   - Document completion
   - Celebrate achievement
   - Set maintenance goals
   - Plan next improvement cycle
```

---

## 🆘 **Emergency and Adaptation Procedures**

### Temporary Adaptations

**When to use:** When full compliance is temporarily impossible due to constraints.

**Requirements:**

1. **Documented:** Adaptation clearly described with rationale
2. **Time-bound:** Sunset date specified (max 90 days)
3. **Scoped:** Limited to specific area of codebase
4. **Tracked:** Added to adaptation registry

**Example Adaptation Record:**

```markdown
## Adaptation: Combined Core/Service Layer

**Team:** @team-frontend (3 developers)
**Reason:** Limited bandwidth during product launch
**Scope:** `/src/features/checkout/` only
**Sunset:** 2026-04-09 (90 days)
**Graduation Plan:** Split after launch, by 2026-04-09
```

### Emergency Procedures Integration

When emergencies require temporary Standards violations:

1. Follow [Emergency Standards](/docs/03-standards/emergency-standards.md)
2. Document in emergency registry
3. Include cleanup plan in emergency ticket
4. Conduct post-mortem for process improvement

### Team Capacity Issues

If team cannot maintain adoption pace:

1. **Freeze** at current level
2. **Document** constraints and revised timeline
3. **Request** additional resources if needed
4. **Resume** when capacity available

---

## 📚 **References**

- [Constitutional Axioms](/docs/00-constitution/constitutional-axioms.md) - Foundation principles
- [Documentation Governance](/docs/00-constitution/documentation-governance.md) - Implementation procedures
- [Error Handling Standard](/docs/03-standards/error-handling.md) - Level 1 adoption focus
- [Core Purity Standard](/docs/03-standards/core-purity.md) - Level 2 adoption focus
- [Type Safety Standard](/docs/03-standards/type-safety.md) - Level 3 adoption focus
- [Code Review Verification Procedures](/docs/03-standards/code-review-verification-procedures.md) - Verification requirements
- [Emergency Standards](/docs/03-standards/emergency-standards.md) - Emergency procedures
- [AI Principles](/docs/02-principles/ai-principles.md) - AI integration foundation

---

## 📝 **Amendment History**

_2026-01-09_: Version 1.0.0 - Initial version

---

**Note:** This guide complements but does not override authoritative Standards. Teams should adapt timelines based on their specific context while maintaining compliance with Constitutional Axioms.
