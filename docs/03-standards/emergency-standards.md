---
id: emergency-standards
status: authoritative
version: 1.0.0
owner: @architecture-council
enforcement: block
last_reviewed: 2026-01-09
next_review: 2027-01-09
supersedes: []
---

# Emergency Standards

## Purpose

This document defines **mandatory, normative rules** for emergency handling in Comity systems. It specifies WHAT must be enforced, not HOW to implement.

**Constitutional Foundation:** Implements **Axiom 5 (Temporary Divergence Must Have Sunset)** at the normative level.

This is a **Level 3: Authoritative Standard**. Violations block merges.

---

## 1. Emergency Definition and Classification

### 1.1 Qualifying Emergency Criteria

**Rule 1.1.1:** An emergency qualifies **ONLY** when **ALL** criteria are met:

**A. Immediacy:** Requires resolution within 24 hours  
**B. Impact:** Affects one or more of:

- System security or data integrity
- Production availability (outage or severe degradation)
- Legal/regulatory compliance deadlines
- Critical business operations
  **C. Constraint:** Cannot be resolved through standard processes within required timeframe

**Rule 1.1.2:** The following are **NOT** emergencies and **MUST** use standard processes:

- Feature deadlines or product launches
- Performance optimizations without outage
- Code quality improvements
- Technical debt repayment
- Planning or estimation errors
- "We forgot" or "we didn't plan for this"

### 1.2 Emergency Classification

**Rule 1.2.1:** Emergencies **MUST** be classified according to this matrix:

| Level     | Response Time | Approval Required                     | Sunset Period |
| --------- | ------------- | ------------------------------------- | ------------- |
| **SEV-1** | < 1 hour      | Architecture Council chair + 1 member | 24 hours      |
| **SEV-2** | < 4 hours     | Architecture Council majority (50%+1) | 72 hours      |
| **SEV-3** | < 24 hours    | Domain owner + Council notification   | 7 days        |

**Rule 1.2.2:** Classification **MUST** be documented in the emergency registry at declaration time.

---

## 2. Core Emergency Principles

### 2.1 Document First, Fix Second

**Rule 2.1.1:** No emergency action **MAY** be taken until the emergency is documented in the emergency registry.

**Enforcement:** CI/CD validation of emergency ID in code headers.

### 2.2 Minimum Necessary Change

**Rule 2.2.1:** Emergency changes **MUST** be the smallest possible deviation to resolve the emergency.

**Enforcement:** Manual review against emergency scope declaration.

### 2.3 Automatic Sunset

**Rule 2.3.1:** Every emergency action **MUST** have an automatic expiration that blocks further changes if not resolved.

**Enforcement:** CI/CD blocks merges to emergency code after sunset.

### 2.4 Mandatory Post-Mortem

**Rule 2.4.1:** Every emergency **MUST** have a post-mortem that produces either a Standards update or process improvement.

**Enforcement:** Post-mortem completion tracked in emergency registry.

---

## 3. Emergency Decision Authority

### 3.1 Approval Matrix

**Rule 3.1.1:** Emergency approval **MUST** follow this authority matrix:

| Emergency Level | Minimum Approvers                     | Escalation Path                  |
| --------------- | ------------------------------------- | -------------------------------- |
| **SEV-1**       | Architecture Council chair + 1 member | → All Council → CTO              |
| **SEV-2**       | Architecture Council majority (50%+1) | → Council chair → All Council    |
| **SEV-3**       | Domain owner + Council notification   | → Council member → Council chair |

### 3.2 Decision Criteria

**Rule 3.2.1:** Approvers **MUST** verify all criteria before approval:

1. Emergency qualifies per §1.1 criteria
2. Standard process truly unavailable within timeframe
3. Proposed solution is minimal and reversible
4. Sunset period appropriate for emergency level
5. Post-mortem commitment obtained

**Rule 3.2.2:** All approvals **MUST** be documented in the emergency ticket with:

- Approver identifier
- Timestamp
- Verified criteria list
- Any conditions or reservations

---

## 4. Emergency Code Requirements

### 4.1 Emergency Header Requirements

**Rule 4.1.1:** All files modified during an emergency **MUST** include the emergency header with required sections:

```
// EMERGENCY: EMG-YYYY-MM-DD-XXX
// VIOLATES: Standard-ID §Section
// SUNSET: YYYY-MM-DD HH:MM UTC
// APPROVED: @approver1, @approver2
// TICKET: /docs/08-emergency/ticket.md
```

**Rule 4.1.2:** Header **MUST** be at top of file, before any imports or code.

### 4.2 Emergency Code Patterns

**Rule 4.2.1:** Emergency code **SHOULD** use documented patterns:

- Feature flag overrides
- Wrapper functions
- Configuration overlays
- Emergency adapters

Non-compliance does not block merge but must be justified.

**Rule 4.2.2:** Emergency code **MUST NOT**:

- Make permanent architectural changes
- Remove or bypass security controls
- Create data integrity risks without mitigation

---

## 5. Compliance and Enforcement

### 5.1 CI/CD Validation Requirements

**Rule 5.1.1:** The CI/CD pipeline **MUST** validate:

**On every commit:**

- [ ] Emergency headers reference active emergencies
- [ ] Emergency not expired (sunset check)

**On emergency sunset:**

- [ ] Block all merges to emergency code
- [ ] Create cleanup ticket automatically

**Rule 5.1.2:** Pre-sunset warnings **MUST** be generated 48 hours before expiry.

### 5.2 Manual Verification Requirements

**Rule 5.2.1:** Monthly emergency audit **MUST** be conducted by Architecture Council:

1. Review all active emergencies
2. Verify cleanup progress
3. Check post-mortem completion
4. Identify patterns or abuse
5. Report to engineering leadership

Enforcement: Missing audit blocks next emergency declaration.

### 5.3 Violation Consequences

**Rule 5.3.1:** Unauthorized emergency declaration **MUST** result in:

- Revert all changes
- Mandatory process training
- Architecture Council review

**Rule 5.3.2:** Expired emergency not cleaned up **MUST** trigger:

- SEV-2 emergency declared automatically
- Council mandate to fix within 24 hours
- Engineering leadership notification

---

## 6. Registry Requirements

### 6.1 Emergency Registry Schema

**Rule 6.1.1:** All emergencies **MUST** be registered in `/docs/08-emergency/emergency-registry.json`.

**Rule 6.1.2:** Registry entries **MUST** conform to this schema:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Emergency Registry Schema",
  "type": "array",
  "items": {
    "type": "object",
    "required": [
      "id",
      "declared",
      "level",
      "declarer",
      "status",
      "sunset",
      "ticket_path"
    ],
    "properties": {
      "id": {
        "type": "string",
        "pattern": "^EMG-\\d{4}-\\d{2}-\\d{2}-\\d{3}$"
      },
      "declared": {
        "type": "string",
        "format": "date-time"
      },
      "level": {
        "type": "string",
        "enum": ["SEV-1", "SEV-2", "SEV-3"]
      },
      "declarer": {
        "type": "string",
        "pattern": "^@[a-z0-9\\-_/]+$"
      },
      "status": {
        "type": "string",
        "enum": ["active", "resolved", "cleanup-pending", "violation"]
      },
      "sunset": {
        "type": "string",
        "format": "date-time"
      },
      "ticket_path": {
        "type": "string",
        "format": "uri-reference"
      }
    }
  }
}
```

### 6.2 Registry Maintenance

**Rule 6.2.1:** Emergency registry **MUST** be updated within 1 hour of:

- Emergency declaration
- Emergency resolution
- Cleanup completion
- Status changes

---

## 7. Integration with Constitutional Axioms

### 7.1 Axiom 5 Implementation

This Standard implements **Axiom 5 (Temporary Divergence Must Have Sunset)** by:

1. **Requiring explicit sunset** for all emergency divergences (§2.3)
2. **Enforcing automatic expiration** via CI/CD (§5.1)
3. **Tracking cleanup completion** in registry (§6.2)
4. **Blocking permanent violations** (§4.2.2)

### 7.2 Axiom 4 Implementation

Implements **Axiom 4 (No Silent Divergence)** by:

- Requiring explicit documentation of all emergency divergences (§4.1)
- Registry tracking of all emergency violations (§6.1)
- Post-mortem documentation of all changes (§2.4)

### 7.3 Axiom 8 Implementation

Implements **Axiom 8 (Enforcement Is Structural)** by:

- Specifying CI/CD validation requirements (§5.1)
- Defining manual verification procedures (§5.2)
- Establishing violation consequences (§5.3)

---

## 8. Compliance Verification

### 8.1 Automated Validation Checklist

CI/CD **MUST** validate:

- [ ] Emergency headers present and valid (Rule 4.1.1)
- [ ] Emergency ID exists in registry (Rule 6.1.1)
- [ ] Sunset date not expired (Rule 2.3.1)
- [ ] Approvers match registry (Rule 3.2.2)

### 8.2 Manual Verification Checklist

Monthly audit **MUST** verify:

- [ ] All active emergencies have cleanup plans
- [ ] Post-mortems completed per schedule
- [ ] No pattern of emergency abuse
- [ ] Registry integrity maintained

---

## References

- [Constitutional Axioms](/docs/00-constitution/constitutional-axioms.md) - Axiom 5 implementation
- [Emergency Implementation Guide](/docs/06-guides/emergency-implementation-guide.md) - Procedural guidance
- [Emergency Code Patterns](/docs/05-patterns/emergency-code-patterns.md) - Implementation patterns
- [Documentation Governance](/docs/00-constitution/documentation-governance.md) - Registry procedures

---

## Compliance Statement

This Standard complies with Constitutional Axioms:

- **Axiom 2:** Level 3 Standard, under Constitutional Axioms
- **Axiom 3:** Single authoritative source for emergency rules
- **Axiom 4:** All emergency divergences explicitly documented
- **Axiom 5:** Every emergency has automatic sunset
- **Axiom 8:** Every rule specifies enforcement method

**Note:** Implementation procedures are defined in [Emergency Implementation Guide](/docs/06-guides/emergency-implementation-guide.md).
