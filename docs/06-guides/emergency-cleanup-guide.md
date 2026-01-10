---
id: emergency-cleanup-guide
status: non-authoritative
version: 1.0.0
owner: @architecture-council
enforcement: none
last_reviewed: 2026-01-09
next_review: 2027-01-09
supersedes: []
---

# Emergency Cleanup Guide

## Purpose

This guide provides a **step-by-step process** for cleaning up emergency code after an emergency has been resolved. It ensures complete removal of all emergency artifacts while maintaining system stability and compliance with Standards.

This guide implements the cleanup requirements from [Emergency Standards §2.3](/docs/03-standards/emergency-standards.md#23-automatic-sunset) with practical, verifiable steps.

This is a **Level 6: Guide** (non-authoritative, procedural). It provides implementation guidance but does not create new rules.

---

## Cleanup Principles

### Principle 1: Complete Removal

> No emergency code, configuration, or documentation may remain after cleanup.

**Rationale:** Residual emergency code becomes technical debt and can cause confusion or accidental reuse.

### Principle 2: Safe Sequencing

> Cleanup must proceed in a safe order to avoid breaking dependencies.

**Rationale:** Emergency code may have dependencies that must be removed in the correct sequence.

### Principle 3: Verified Completion

> Cleanup is not complete until verified by both automated and manual checks.

**Rationale:** Humans miss things; automated verification catches residual artifacts.

### Principle 4: Documented Process

> Every cleanup action must be documented for audit and learning.

**Rationale:** Documentation enables process improvement and compliance verification.

---

## Cleanup Timeline and Triggers

### Standard Cleanup Timeline

```
Emergency Resolution → Cleanup Planning (24h) → Execution (72h) → Verification (24h) → Completion
```

### Triggers for Cleanup Initiation

**Automatic Triggers (Must Cleanup):**

1. Emergency ticket status changes to "resolved"
2. Emergency sunset date arrives (CI/CD warning at 48h before)
3. Post-mortem completed with cleanup action items

**Manual Triggers (Should Cleanup):**

1. Emergency no longer needed (problem solved via other means)
2. Team capacity available for cleanup
3. Upcoming release or deployment window

### Cleanup Ownership

**Primary Owner:** Emergency declarer (who created the emergency)
**Secondary Owner:** Team lead or designated cleanup engineer
**Verification:** Architecture Council member or domain expert

---

## Phase 1: Assessment and Planning (Day 1)

### Step 1.1: Emergency Artifact Inventory

Create a complete inventory of all emergency artifacts following the guidelines in [Emergency Implementation Guide §2.1](/docs/06-guides/emergency-implementation-guide.md#21-code-change-procedures).

### Step 1.2: Risk Assessment

Assess risks for each artifact per [Emergency Standards §1.2](/docs/03-standards/emergency-standards.md#12-emergency-classification).

**High Risk (Cleanup First):**

- Core layer violations (IO in Core, framework types in Core)
- Security-related changes
- Data corruption risks
- External dependencies

**Medium Risk (Cleanup Next):**

- Service layer changes
- Configuration overrides
- Performance optimizations

**Low Risk (Cleanup Last):**

- Logging and monitoring changes
- Documentation updates
- Test code

### Step 1.3: Cleanup Plan Creation

Create a detailed cleanup plan in the emergency ticket following the template in [Emergency Implementation Guide §1.2](/docs/06-guides/emergency-implementation-guide.md#12-emergency-ticket-creation).

**Plan Approval:** Cleanup plan requires approval from:

- Emergency owner
- Team lead
- One Architecture Council member

---

## Phase 2: Execution (Days 2-4)

### Step 2.1: Preparation

**Prerequisites per [Emergency Standards §2.2](/docs/03-standards/emergency-standards.md#22-minimum-necessary-change):**

    [ ] Emergency ticket updated with cleanup plan
    [ ] Team notified of cleanup window
    [ ] Deployment scheduled (if needed)
    [ ] Rollback procedure tested
    [ ] Tests passing in current state

**Branch Strategy:**

- Create branch: `cleanup/EMG-YYYY-MM-DD-XXX`
- Small, focused commits (one artifact or related group per commit)
- Commit message format: `cleanup(emergency): [artifact] - [description]`

### Step 2.2: Code Cleanup Sequence

**Recommended Order following [Emergency Code Patterns](/docs/05-patterns/emergency-code-patterns.md):**

    1. Remove emergency data and state (Pattern 2)
    2. Cleanup configuration overrides (Pattern 4)
    3. Remove emergency adapters and wrappers (Patterns 3, 5)
    4. Update normal code to handle missing emergency paths
    5. Remove emergency tests
    6. Update documentation
    7. Remove emergency monitoring and logging (Pattern 6)

**Cleanup Verification (per artifact):**

    [ ] Code compiles without errors
    [ ] TypeScript types are correct
    [ ] Tests pass (including integration tests)
    [ ] No new linting errors introduced
    [ ] Emergency header removed from file
    [ ] Dependencies updated if needed

### Step 2.3: Configuration Cleanup

**Common Configuration Locations:**

- Environment variables (`EMERGENCY_` prefix)
- Configuration files (`.json`, `.yaml`, `.toml`)
- Feature flag services
- Database configuration tables

**Cleanup Steps:**

    1. Identify all configuration values set for emergency
    2. Determine correct normal values from Standards
    3. Update configuration sources
    4. Restart or reload services if needed
    5. Verify configuration is applied

### Step 2.4: Test Cleanup

**Emergency Test Categories:**

    1. Tests that only run in emergency mode
    2. Tests that verify emergency behavior
    3. Tests that mock emergency dependencies
    4. Emergency cleanup verification tests

**Cleanup Approach per [Emergency Implementation Guide §2.3](/docs/06-guides/emergency-implementation-guide.md#23-testing-emergency-code):**

```typescript
// BEFORE: Emergency-specific test
describe("Emergency tax calculation", () => {
  beforeEach(() => {
    process.env.EMERGENCY_MODE = "true";
  });

  test("uses external API when database is down", () => {
    // Emergency-specific test logic
  });
});

// AFTER: Either remove or convert to normal test
describe("Tax calculation", () => {
  test("calculates tax correctly", () => {
    // Normal test logic - emergency scenario removed
  });
});
```

### Step 2.5: Documentation Cleanup

**Locations to Check:**

- Emergency ticket itself
- ADRs created during emergency
- Code comments referencing emergency
- Runbooks or operational procedures
- Team documentation (Wiki, Notion, etc.)

**Cleanup Actions:**

    1. Update emergency ticket with cleanup completion
    2. Archive emergency ADR if superseded by normal ADR
    3. Remove emergency comments from code
    4. Update runbooks to remove emergency procedures
    5. Clean team documentation of emergency references

---

## Phase 3: Verification (Day 5)

### Step 3.1: Automated Verification

**CI/CD Verification Script as required by [Emergency Standards §5.1](/docs/03-standards/emergency-standards.md#51-cicd-validation-requirements):**

```typescript
// cleanup-verification.js
import { readFileSync, readdirSync } from "fs";
import { join } from "path";

function verifyEmergencyCleanup(emergencyId: string): VerificationResult {
  const results = {
    codeClean: true,
    configClean: true,
    testsClean: true,
    docsClean: true,
    violations: [] as string[],
  };

  // Scan for emergency headers
  const sourceFiles = getAllSourceFiles();
  for (const file of sourceFiles) {
    const content = readFileSync(file, "utf-8");
    if (content.includes(`EMERGENCY: ${emergencyId}`)) {
      results.codeClean = false;
      results.violations.push(`Emergency header in ${file}`);
    }
    if (content.includes(`VIOLATES:`)) {
      results.codeClean = false;
      results.violations.push(`Violation marker in ${file}`);
    }
  }

  // Check configuration
  const config = loadConfiguration();
  if (config.emergencyMode || config.emergencyOverrides) {
    results.configClean = false;
    results.violations.push("Emergency configuration still present");
  }

  return results;
}
```

### Step 3.2: Manual Verification Checklist

**Code Review Verification per [Code Review Verification Procedures §U5](/docs/03-standards/code-review-verification-procedures.md#u5-emergency-code-header-validation):**

    [ ] No emergency headers in any source file
    [ ] No VIOLATES: comments in code
    [ ] No emergency feature flags or configuration
    [ ] No emergency adapters or wrappers
    [ ] No emergency imports or dependencies
    [ ] Code follows all Standards (re-audit critical violations)

**Test Suite Verification:**

    [ ] All tests pass (normal mode)
    [ ] No tests depend on emergency mode
    [ ] Emergency test files removed
    [ ] Test coverage maintained or improved
    [ ] Integration tests work without emergency code

**Configuration Verification:**

    [ ] Environment variables cleaned
    [ ] Configuration files at normal values
    [ ] Feature flags disabled or removed
    [ ] Database schema normalized
    [ ] External service configurations normal

**Documentation Verification:**

    [ ] Emergency ticket updated with cleanup report
    [ ] ADRs archived or updated
    [ ] Code comments cleaned
    [ ] Runbooks updated
    [ ] Team documentation updated

### Step 3.3: Production Verification

**If emergency code was deployed to production per [Emergency Standards §4.2.2](/docs/03-standards/emergency-standards.md#42-emergency-code-patterns):**

    1. Monitor metrics for 24 hours post-cleanup
    2. Verify error rates haven't increased
    3. Check performance metrics are normal
    4. Confirm user-facing functionality works
    5. Validate data integrity if emergency involved data

**Monitoring Checklist:**

    [ ] Error rate < 0.1% (normal baseline)
    [ ] Response times normal
    [ ] No new error patterns emerged
    [ ] System resource usage normal
    [ ] User sessions unaffected

---

## Phase 4: Completion and Documentation (Day 6)

### Step 4.1: Cleanup Report

Create a final cleanup report in the emergency ticket following the template in [Emergency Implementation Guide §4.2](/docs/06-guides/emergency-implementation-guide.md#42-post-mortem-agenda-template).

### Step 4.2: Registry Updates

Update the emergency registry as required by [Emergency Standards §6.2.1](/docs/03-standards/emergency-standards.md#62-registry-maintenance):

```json
{
  "id": "EMG-2026-01-09-001",
  "declared": "2026-01-09T14:30:00Z",
  "level": "SEV-2",
  "declarer": "@alice",
  "status": "cleaned",
  "sunset": "2026-01-10T14:30:00Z",
  "ticket_path": "/docs/08-emergency/2026-01-09-001.md",
  "resolved_at": "2026-01-10T10:15:00Z",
  "cleanup_completed": "2026-01-13T16:45:00Z",
  "cleanup_verified_by": ["@bob", "@charlie"]
}
```

### Step 4.3: Team Notification

Notify the team and stakeholders following [Emergency Implementation Guide §6.3](/docs/06-guides/emergency-implementation-guide.md#63-emergency-communication-templates).

---

## Special Cases and Edge Conditions

### Case 1: Emergency Code Became Permanent

**Scenario:** Emergency solution worked so well it should become permanent.

**Process per [Emergency Implementation Guide §7.2](/docs/06-guides/emergency-implementation-guide.md#72-emergency-becoming-permanent):**

    1. Create ADR proposing to make emergency code permanent
    2. Update emergency code to comply with all Standards
    3. Remove emergency headers and markers
    4. Update emergency ticket with "converted to permanent" status
    5. Follow normal change process for permanent code

### Case 2: Cleanup Reveals Bug in Normal Code

**Scenario:** Removing emergency code exposes a bug that was masked.

**Process per [Emergency Implementation Guide §7.3](/docs/06-guides/emergency-implementation-guide.md#73-cleanup-reveals-bug-in-normal-code):**

    1. Stop cleanup immediately
    2. Create bug ticket for the revealed issue
    3. Decide: Fix bug first or create new emergency
    4. If bug is critical, may need new emergency
    5. Resume cleanup after bug is fixed

### Case 3: Emergency Spanned Multiple Services

**Scenario:** Emergency code exists across multiple repositories or services.

**Process:** 1. Coordinate cleanup across all affected services 2. Create master cleanup plan with dependencies 3. Schedule synchronized cleanup windows 4. Verify all services clean before considering complete 5. Update all emergency registries

### Case 4: Data Migration Required

**Scenario:** Emergency created data that needs migration or cleanup.

**Process:** 1. Create data migration plan separate from code cleanup 2. Run migration during maintenance window 3. Verify data integrity post-migration 4. Remove migration code after verification 5. Document migration in emergency ticket

---

## Cleanup Metrics and Improvement

### Metrics to Track

```typescript
interface CleanupMetrics {
  timeToCleanup: number; // Hours from resolution to completion
  artifactsRemoved: {
    codeFiles: number;
    configItems: number;
    tests: number;
    documentation: number;
  };
  verificationTime: number; // Hours spent verifying
  issuesFound: number; // Problems discovered during cleanup
  reworkRequired: boolean; // Whether cleanup had to be redone
}
```

### Continuous Improvement

**Quarterly Cleanup Review as required by [Emergency Standards §5.2.1](/docs/03-standards/emergency-standards.md#52-manual-verification-requirements):**

    1. Review all cleanups from past quarter
    2. Identify common patterns or issues
    3. Update this guide with improvements
    4. Share learnings with team
    5. Update emergency patterns if needed

**Cleanup Process Metrics Goals:**

- Time to cleanup: < 72 hours for SEV-1/2, < 7 days for SEV-3
- Verification completeness: 100% automated + manual
- Zero residual artifacts in production
- No new emergencies caused by cleanup

---

## Integration with Other Processes

### Emergency Standards Integration

This guide implements [Emergency Standards §2.3](/docs/03-standards/emergency-standards.md#23-automatic-sunset):

    Emergency Standards requires:
    - Cleanup ticket creation ✓ (Phase 1 planning)
    - Blocked merges after sunset ✓ (CI/CD verification)
    - Mandatory cleanup ✓ (This entire guide)

### Code Review Integration

Cleanup code must pass [Code Review Verification Procedures](/docs/03-standards/code-review-verification-procedures.md):

    Review must verify:
    - No new Standards violations introduced ✓ (Verification phase)
    - Code quality maintained ✓ (Manual verification)
    - Tests updated appropriately ✓ (Test cleanup section)

---

## References

- [Emergency Standards](/docs/03-standards/emergency-standards.md) - Authoritative source for cleanup requirements
- [Emergency Implementation Guide](/docs/06-guides/emergency-implementation-guide.md) - Emergency procedures
- [Emergency Code Patterns](/docs/05-patterns/emergency-code-patterns.md) - Patterns for emergency code structure
- [Code Review Verification Procedures](/docs/03-standards/code-review-verification-procedures.md) - Review requirements for cleanup code

---

## Amendment History

_2026-01-09_: Initial version - Comprehensive cleanup guide

---

**Note:** This guide provides procedural implementation details. All cleanup must comply with the authoritative requirements in [Emergency Standards](/docs/03-standards/emergency-standards.md). Teams may adapt timelines based on emergency severity and team capacity, but must maintain the verification and documentation standards.
