---
id: emergency-implementation-guide
status: non-authoritative  
version: 1.0.0
owner: @architecture-council
enforcement: none
last_reviewed: 2026-01-09
next_review: 2027-01-09
supersedes: []
---

# Emergency Implementation Guide

## Purpose

This document provides **step-by-step procedures and best practices** for implementing the [Emergency Standards](/docs/03-standards/emergency-standards.md). It contains **no normative rules**—only implementation guidance.

**Important:** All `MUST`, `MUST NOT`, `SHOULD` requirements are defined in the Emergency Standards. This guide explains HOW to meet those requirements.

---

## 1. Emergency Declaration Workflow

### 1.1 Qualification Check Procedure

**Before declaring an emergency, verify all criteria from [Emergency Standards §1.1.1](/docs/03-standards/emergency-standards.md#11-qualifying-emergency-criteria):**

```
Step 1: Immediacy Check
    Question: Does this require resolution within 24 hours?
    If NO → Use standard process
    If YES → Continue

Step 2: Impact Assessment
    Check if affects:
    - [ ] Security/data integrity
    - [ ] Production availability
    - [ ] Legal/compliance deadlines
    - [ ] Critical business operations
    If NO boxes checked → Use standard process
    If ≥1 boxes checked → Continue

Step 3: Constraint Verification
    Question: Can this wait for standard process?
    Attempt: Contact Architecture Council chair
    If standard process available → Use it
    If truly blocked → Emergency may qualify
```

**Quick Decision Tree:**

```
Is production down? → SEV-1
Is security breached? → SEV-1
Is data corrupted? → SEV-2
Is compliance deadline missed? → SEV-3
Is feature delayed? → NOT an emergency
```

### 1.2 Emergency Ticket Creation

**Following [Emergency Standards §4.1.1](/docs/03-standards/emergency-standards.md#41-emergency-header-requirements):**

```
Template: /docs/08-emergency/YYYY-MM-DD-XXX.md
---
emergency_id: EMG-YYYY-MM-DD-XXX
declarer: @username
level: SEV-1|SEV-2|SEV-3
declared: YYYY-MM-DD HH:MM UTC
sunset: [auto-calculated based on level]
approvers_required: [list from Standards §3.1.1]
---

# Emergency: [Brief description]

## Situation
[What is broken, impact, symptoms]

## Root Cause
[If known, what caused the issue]

## Required Resolution
[What needs to be fixed to resolve emergency]

## Proposed Solution
[How you plan to fix it]

## Impact Assessment
- Systems affected: [list]
- Users impacted: [estimate]
- Data at risk: [yes/no, details]

## Rollback Plan
[Steps to revert if fix causes issues]
```

### 1.3 Approval Request Process

**Implementing [Emergency Standards §3.1.1](/docs/03-standards/emergency-standards.md#31-approval-matrix):**

```
For SEV-1:
1. Immediate ping to Architecture Council chair
2. Contact second council member from roster
3. Use emergency channel: #emergency-sev1
4. Timebox: 15 minutes for response

For SEV-2:
1. Post in #architecture-council channel
2. Tag required members (majority)
3. Include ticket link and justification
4. Timebox: 1 hour for response

For SEV-3:
1. Notify domain owner directly
2. Copy Architecture Council channel
3. Provide context and proposed solution
4. Timebox: 4 hours for response
```

---

## 2. Emergency Implementation Workflow

### 2.1 Code Change Procedures

**Best practices for implementing [Emergency Standards §4.2](/docs/03-standards/emergency-standards.md#42-emergency-code-patterns):**

```
Step 1: Branch Strategy
    git checkout -b emergency/EMG-YYYY-MM-DD-XXX
    git push -u origin emergency/EMG-YYYY-MM-DD-XXX

Step 2: Commit Standards
    Format: [EMERGENCY] EMG-XXX: Brief description
    Example: [EMERGENCY] EMG-2026-01-09-001: Add database fallback

Step 3: File Headers
    Add to every changed file:
    // EMERGENCY: EMG-YYYY-MM-DD-XXX
    // VIOLATES: core-purity §1.1.1
    // SUNSET: 2026-01-10 14:30:00 UTC
    // APPROVED: @alice, @bob
    // TICKET: /docs/08-emergency/2026-01-09-001.md
```

### 2.2 Emergency Pattern Selection Guide

**When to use each pattern from [Emergency Code Patterns](/docs/05-patterns/emergency-code-patterns.md):**

| Situation                    | Recommended Pattern               | Example                              |
| ---------------------------- | --------------------------------- | ------------------------------------ |
| **Temporary feature toggle** | Pattern 2: Feature Flag           | `USE_EXTERNAL_API: true`             |
| **Wrap existing function**   | Pattern 3: Wrapper Function       | `calculateTaxWithFallback()`         |
| **Configuration change**     | Pattern 4: Configuration Override | `timeout: 30000`                     |
| **Replace failing adapter**  | Pattern 5: Emergency Adapter      | `EmergencyUserRepository`            |
| **Need execution tracking**  | Pattern 6: Emergency Logging      | `EmergencyLogger.logEmergencyCall()` |

### 2.3 Testing Emergency Code

**Minimal testing approach for emergencies:**

```
Critical Path Tests Only:
1. Security: Authentication/authorization still works
2. Data integrity: No corruption introduced
3. Basic functionality: Core features operational
4. Rollback verification: Can revert cleanly

Skip During Emergency:
- Performance tests
- Edge case coverage
- UI/UX validation
- Non-critical integration tests
```

---

## 3. Emergency Type Specific Guidance

### 3.1 Security Emergencies

**Additional considerations beyond Standards:**

```
Immediate Actions (First 15 minutes):
1. Containment: Isolate affected systems
2. Notification: Security team + Architecture Council
3. Evidence preservation: Logs, traces, snapshots
4. Communication: Pre-approved comms plan

Implementation Priorities:
1. Close security hole first
2. Preserve forensic evidence
3. Minimize user impact
4. Document all actions

Special Sunset: Maximum 24 hours regardless of level
```

### 3.2 Data Corruption Emergencies

**Safe handling procedures:**

```
Before Any Correction:
1. Verify backups exist and are accessible
2. Take snapshot of current state
3. Document exact corruption symptoms
4. Identify scope (which tables/records)

Correction Approach:
1. Work on copy first, not production
2. Validate correction on copy
3. Schedule maintenance window
4. Have rollback ready

Post-Correction:
1. Verify data integrity
2. Update corruption tracking
3. Schedule comprehensive backup
```

### 3.3 Infrastructure Emergencies

**Stable change procedures:**

```
Pre-Change Checklist:
1. Rollback procedure tested
2. Monitoring enhanced
3. Capacity verified
4. Dependencies notified

Change Execution:
1. One change at a time
2. Validate each step
3. Monitor metrics closely
4. Have abort criteria

Post-Change:
1. Extended monitoring period
2. Team debrief
3. Documentation update
```

---

## 4. Post-Mortem Implementation

### 4.1 Facilitation Guide

**Implementing [Emergency Standards §2.4.1](/docs/03-standards/emergency-standards.md#24-mandatory-post-mortem):**

```
Required Attendees by Level:
- SEV-1: Council + all involved engineers + domain owner
- SEV-2: Council + involved engineers
- SEV-3: Domain owner + 2 Council members

Suggested Facilitator Rotation:
- SEV-1: Architecture Council chair
- SEV-2: Senior engineer not involved in emergency
- SEV-3: Domain owner or delegate
```

### 4.2 Post-Mortem Agenda Template

```
# Post-Mortem: EMG-YYYY-MM-DD-XXX

## 1. Timeline (5-10 minutes)
[Chronological events from detection to resolution]

## 2. Root Cause Analysis (15-20 minutes)
### Primary Cause
[What directly caused the issue]

### Contributing Factors
[What enabled or amplified the issue]

### Systemic Issues
[Process or architectural gaps revealed]

## 3. What Went Well? (5 minutes)
[Successful responses, effective tools, good decisions]

## 4. What Went Poorly? (10 minutes)
[Mistakes, delays, communication issues, tool failures]

## 5. Action Items (10-15 minutes)
### Immediate (1 week)
- [ ] Fix specific bug
- [ ] Update monitoring

### Short-term (1 month)
- [ ] Process improvement
- [ ] Training update

### Long-term (3 months)
- [ ] Architectural change
- [ ] Tooling investment
```

### 4.3 Output Templates

**ADR Template for Emergency Decisions:**

```markdown
---
id: adr-XXXX
status: accepted
date: YYYY-MM-DD
title: [Decision from emergency]
supersedes: []
---

# ADR XXXX: [Decision]

## Context

[Emergency EMG-XXX revealed...]

## Decision

[What we decided during/after emergency]

## Rationale

[Why this decision was necessary]

## References

- Emergency: EMG-YYYY-MM-DD-XXX
- Post-mortem: [link]
```

**Standard Update Template:**

```markdown
# Update to [Standard Name]

## Change Summary

[Brief description]

## Reason for Change

[Learned from EMG-XXX that...]

## Specific Changes

[Section-by-section updates]

## Migration Plan

[How to update existing code]
```

---

## 5. Training and Preparedness

### 5.1 Emergency Drill Schedule

**Quarterly preparedness activities:**

```
Q1: Security Emergency Drill
  - Scenario: Data breach detection
  - Focus: Containment and communication
  - Duration: 2 hours

Q2: Infrastructure Failure
  - Scenario: Database cluster outage
  - Focus: Fallback systems and recovery
  - Duration: 3 hours

Q3: Data Corruption
  - Scenario: Partial data corruption
  - Focus: Recovery procedures
  - Duration: 2 hours

Q4: Full System Exercise
  - Scenario: Multi-system failure
  - Focus: Coordination and prioritization
  - Duration: 4 hours
```

### 5.2 New Team Member Onboarding

**Emergency procedure training checklist:**

```
Week 1: Foundation
- [ ] Read Emergency Standards
- [ ] Review recent emergency post-mortems
- [ ] Locate emergency channels and contacts

Week 2: Tool Familiarity
- [ ] Practice emergency ticket creation
- [ ] Test emergency branch workflow
- [ ] Run through emergency validation scripts

Week 3: Participation
- [ ] Shadow emergency declaration
- [ ] Assist in post-mortem documentation
- [ ] Review emergency code patterns

Month 2: Certification
- [ ] Pass emergency procedure quiz
- [ ] Participate in drill
- [ ] Receive emergency approval for SEV-3
```

### 5.3 Preparedness Metrics

**Track to ensure readiness:**

```
Monthly Metrics:
- Emergency registry accuracy: 100%
- Contact list currency: 100%
- Tool accessibility: 100%
- Training completion: >90%

Quarterly Metrics:
- Drill participation: >80%
- Procedure familiarity survey: >85%
- Response time演练: Meet targets
- Post-mortem quality score: >4/5
```

---

## 6. Tooling and Automation

### 6.1 CI/CD Emergency Validation

**Implementation of [Emergency Standards §5.1.1](/docs/03-standards/emergency-standards.md#51-cicd-validation-requirements):**

```yaml
# .github/workflows/emergency-validation.yml
name: Emergency Code Validation
on: [pull_request, push]

jobs:
  validate-emergency:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Check for emergency headers
        run: |
          # Find files with emergency headers
          grep -r "EMERGENCY: EMG-" --include="*.ts" --include="*.js" --include="*.tsx" --include="*.jsx" . || true

      - name: Validate emergency references
        run: node scripts/validate-emergency-headers.js

      - name: Check sunset dates
        run: node scripts/check-emergency-sunset.js
```

### 6.2 Emergency Monitoring Dashboard

**Suggested monitoring setup:**

```
Required Alerts:
1. Active emergencies count > 0
2. Emergency approaching sunset (48h warning)
3. Emergency expired without cleanup
4. Multiple emergencies in same domain

Dashboard Components:
- Active emergencies list with sunset countdown
- Emergency history (last 30 days)
- Resolution time trends
- Common emergency patterns
- Team response metrics
```

### 6.3 Emergency Communication Templates

**Pre-approved communication channels:**

```
Internal (Team):
- #emergency-sev1 (SEV-1 only)
- #architecture-council (SEV-2+)
- @here for critical notifications

External (If needed):
- Status page updates
- Customer communication templates
- Partner notifications

Template: Status Update
Subject: [MAJOR/MINOR] Incident Update: [Service] - [Time]

Body:
Current Status: [Investigating/Identified/Monitoring/Resolved]
Impact: [Services affected, users impacted]
Next Update: [Time]
More Info: [Status page link]
```

---

## 7. Common Scenarios and Solutions

### 7.1 "We Can't Wait for Approval"

**Situation:** Critical issue needs immediate fix, but approvers unavailable.

**Recommended Approach:**

```
1. Declare SEV-1 emergency (self-approval with post-hoc ratification)
2. Document all actions meticulously
3. Notify next available council member
4. Request post-hoc approval within 1 hour
5. Include in post-mortem for process improvement
```

### 7.2 "Emergency Becoming Permanent"

**Situation:** Emergency fix works well, team wants to keep it.

**Recommended Approach:**

```
1. Create ADR proposing to make emergency code permanent
2. Update emergency code to comply with all Standards
3. Remove emergency headers and markers
4. Update emergency ticket with "converted to permanent" status
5. Follow normal change process for permanent adoption
```

### 7.3 "Cleanup Reveals Bug in Normal Code"

**Situation:** Removing emergency code exposes hidden bug.

**Recommended Approach:**

```
1. Stop cleanup immediately
2. Create bug ticket for revealed issue
3. Decide: Fix bug first or create new emergency
4. If bug critical, declare new emergency
5. Resume cleanup after bug resolution
```

---

## References

- **[Emergency Standards](/docs/03-standards/emergency-standards.md)** - Normative rules (MUST/MUST NOT)
- **[Emergency Code Patterns](/docs/05-patterns/emergency-code-patterns.md)** - Implementation patterns
- **[Emergency Cleanup Guide](/docs/06-guides/emergency-cleanup-guide.md)** - Cleanup procedures
- **[Constitutional Axioms](/docs/00-constitution/constitutional-axioms.md)** - Axiom 5 foundation
- **[Documentation Governance](/docs/00-constitution/documentation-governance.md)** - Registry procedures

---

## Amendment History

_2026-01-09_: Initial version - Split from emergency-procedures.md

---

**Important:** This guide provides implementation suggestions only. All mandatory requirements are defined in [Emergency Standards](/docs/03-standards/emergency-standards.md).
