---
id: code-review-verification-procedures
status: authoritative
version: 1.0.0
owner: @architecture-council
enforcement: block
last_reviewed: 2026-01-09
next_review: 2027-01-09
supersedes: []
---

# Code Review Verification Procedures

## Purpose

This document defines **minimal, essential verification procedures** that **must be applied to every code review**. It contains **no normative rules**—only the **minimum verification workflow** required by Constitutional Axiom 8.

**Critical Constraint:** Only includes procedures that:

1. Apply to **100% of code reviews**
2. Are **objectively verifiable** (pass/fail)
3. Have **automated or clear manual enforcement**
4. Block merges when violated

---

## 📊 Verification Procedure Classes

### 1. Universal Procedures (Always Required)

Applied to **every code review** regardless of change type.

### 2. Conditional Procedures (When Applicable)

Applied **only** when the PR affects the relevant concern. Marked with **[CONDITIONAL]**.

### 3. Exceptional Procedures (Special Contexts)

Applied **only** in AI, emergency, or migration contexts. Marked with **[EXCEPTIONAL]**.

**Only Universal Procedures are enforced via `enforcement: block`.**  
Conditional and Exceptional procedures generate warnings or informational flags.

---

## 🚨 Universal Procedures (Always Blocking)

### U1. Constitutional Axiom Compliance Check

**Procedure:**

```
1. Run: npm run validate:constitutional-axioms
2. Check output for violations:
   - Axiom 3: Duplicate normative statements
   - Axiom 4: Undocumented divergences
   - Axiom 5: Missing sunset on divergences
   - Axiom 8: Rules without enforcement
3. If violations found → BLOCK
```

Automated detection may be incomplete; reviewer judgment is authoritative for Axioms 3 and 8.

**Expected Outcome:** Zero Constitutional Axiom violations.  
**Reference:** [Constitutional Axioms](/docs/00-constitution/constitutional-axioms.md)

### U2. Core Purity Violation Check

**Procedure:**

```
1. Run: npm run validate:core-purity
2. Check for:
   - Framework imports in /core/
   - I/O operations in /core/
   - Environment access in /core/
3. If violations found without authorized divergence → BLOCK
```

**Expected Outcome:** Core layer free of I/O, frameworks, environment access.  
**Reference:** [Core Purity Standard §1.1.1](/docs/03-standards/core-purity.md#11-network-operations-prohibition)

### U3. Error Code Format Validation

**Procedure:**

```
1. Run: npm run validate:error-codes
2. Check all error codes follow format: domain:error_type
   - ✅ auth:token_expired
   - ❌ "Token expired"
   - ❌ AUTH_TOKEN_EXPIRED
3. If invalid formats found → BLOCK
```

**Expected Outcome:** 100% of error codes match `domain:error_type` pattern.  
**Reference:** [Error Handling Standard §2.1](/docs/03-standards/error-handling.md#21-error-code)

### U4. Result Pattern Discriminator Check

**Procedure:**

```
1. Search codebase for Result pattern discriminators
2. Verify all use 'success' (not 'ok' or others)
3. Check pattern: { success: true|false, ... }
4. If 'ok' or other discriminators found → BLOCK
```

**Expected Outcome:** All Result patterns use 'success' discriminator.  
**Reference:** [Error Handling Standard §3.2](/docs/03-standards/error-handling.md#32-result-type-definition)

### U5. Emergency Code Header Validation

**Procedure:**

```
1. Search for emergency headers in code
2. If emergency header found:
   a. Verify emergency ID in registry
   b. Check sunset date not expired
   c. Validate approvers match
3. If expired or invalid emergency → BLOCK
```

**Expected Outcome:** Active emergencies valid, expired emergencies blocked.  
**Reference:** [Emergency Procedures §2.2](/docs/00-constitution/emergency-procedures.md#22-emergency-implementation-procedure)

### U6. AI-Generated Code Header Check

**Procedure:**

```
1. Search for AI-generated code markers
2. If found, verify required headers:
   // GENERATED: YYYY-MM-DD
   // COMPLIANCE: Constitutional Axioms 1-8
   // VALIDATION: [report]
3. If missing headers → BLOCK
```

**Expected Outcome:** All AI-generated code has validation headers.  
**Reference:** [AI Governance §Output Format Requirements](/docs/02-principles/ai-principles.md#output-format-requirements)

---

## 📋 Universal Verification Checklist

**Apply this checklist to EVERY code review:**

### ✅ Constitutional Compliance (Blocking)

- [ ] No duplicate normative statements (Axiom 3)
- [ ] All divergences documented (Axiom 4)
- [ ] Temporary divergences have sunset (Axiom 5)
- [ ] Rules have enforcement specified (Axiom 8)

### ✅ Core Layer Integrity (Blocking)

- [ ] No framework imports in /core/
- [ ] No I/O operations in /core/
- [ ] No environment access in /core/
- [ ] Violations have authorized divergences

### ✅ Error Handling Basics (Blocking)

- [ ] Error codes follow `domain:error_type` format
- [ ] Result patterns use 'success' discriminator
- [ ] No string-thrown errors in Core/Service

### ✅ Special Contexts (Blocking)

- [ ] Emergency code has valid headers and sunset
- [ ] AI-generated code has validation headers
- [ ] Divergences have authorized tickets

**If any above item fails → BLOCK merge.**

---

## 🔍 [CONDITIONAL] Procedures (Apply When Relevant)

### C1. Branded Type Usage Verification

**When:** PR modifies domain types or public APIs

**Procedure:**

```
Check: npm run validate:branded-types --files=[changed-files]
```

**Reference:** [Type Safety Standard §2.1.1](/docs/03-standards/type-safety.md#21-domain-primitive-branding)

### C2. Discriminated Union Verification

**When:** PR modifies state machines or modal logic

**Procedure:**

```
Check: Manual review for boolean flag combinations
```

**Reference:** [Type Safety Standard §3.1.1](/docs/03-standards/type-safety.md#31-state-representation)

### C3. Dependency Direction Verification

**When:** PR adds/changes imports between layers

**Procedure:**

```
Run: npm run analyze:dependencies --focus=[changed-files]
```

**Reference:** [Design Philosophy §3](/docs/02-principles/design-philosophy.md#3-dependency-direction-shapes-architectural-integrity)

---

## ⚠️ [EXCEPTIONAL] Procedures (Special Contexts)

### E1. Emergency Code Pattern Compliance

**When:** PR contains emergency code

**Procedure:** Follow [Emergency Code Patterns](/docs/05-patterns/emergency-code-patterns.md)

### E2. AI Prompt Compliance Verification

**When:** PR includes AI-generated code prompts

**Procedure:** Follow [AI Governance §Prompt Engineering](/docs/02-principles/ai-principles.md#prompt-engineering-rules)

### E3. Migration Code Verification

**When:** PR implements migration from deprecated patterns

**Procedure:** Follow migration plan in relevant ADR

---

## 🎯 Minimal Invariant Set: The 6 Universal Gates

Every code review **is required for merge** pass these 6 universal checks:

| #   | Check                          | What It Prevents                 | Enforcement      |
| --- | ------------------------------ | -------------------------------- | ---------------- |
| 1   | **Axiom 3 Violations**         | Duplicate normative rules        | CI/CD + Manual   |
| 2   | **Core Purity Breach**         | Framework/I/O in Core            | Automated scan   |
| 3   | **Error Format Invalid**       | Wrong error code format          | Regex validation |
| 4   | **Result Discriminator Wrong** | Using 'ok' instead of 'success'  | Pattern matching |
| 5   | **Emergency Code Invalid**     | Expired/unauthorized emergencies | Registry check   |
| 6   | **AI Code Missing Headers**    | Unvalidated AI-generated code    | Header detection |

**These 6 checks are NON-NEGOTIABLE and apply to 100% of PRs.**

---

## 📝 Implementation Examples

### Example 1: Simple Bug Fix

```
PR: Fix typo in error message

Verification:
1. Run U1-U6 → All pass
2. No conditional procedures apply
3. APPROVE
```

### Example 2: New Feature with Domain Types

```
PR: Add UserProfile domain type

Verification:
1. Run U1-U6 → All pass
2. Apply C1 (Branded Type Verification) → Check passes
3. Apply C3 (Dependency Direction) → Check passes
4. APPROVE
```

### Example 3: Emergency Database Fix

```
PR: Emergency fallback for database outage

Verification:
1. Run U1-U6 → U5 (Emergency Header) must pass
2. Apply E1 (Emergency Pattern Compliance) → Check passes
3. APPROVE (with emergency sunset tracking)
```

---

## 🔧 Tooling Configuration

### Required CI/CD Pipeline

```yaml
# .github/workflows/universal-verification.yml
name: Universal Verification
on: [pull_request]

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      # Universal Checks (Always Run, Always Block)
      - name: Constitutional Axiom Check
        run: npm run validate:constitutional-axioms

      - name: Core Purity Scan
        run: npm run validate:core-purity

      - name: Error Code Format Validation
        run: npm run validate:error-codes

      - name: Result Discriminator Check
        run: npm run validate:result-discriminator

      - name: Emergency Code Validation
        run: npm run validate:emergency-headers

      - name: AI Header Check
        run: npm run validate:ai-headers

      # Conditional Checks (Run When Files Changed)
      - name: Branded Type Check (Conditional)
        if: contains(github.event.pull_request.files.*.filename, '.ts')
        run: npm run validate:branded-types
```

### Quick Test Commands

```bash
# Run all universal checks
npm run verify:universal

# Run specific check
npm run verify:core-purity
npm run verify:error-codes

# Check a specific file
npm run verify:file -- src/core/user.ts
```

---

## 📚 References

All normative rules are defined in:

- [Constitutional Axioms](/docs/00-constitution/constitutional-axioms.md) - Axioms 3,4,5,8
- [Core Purity Standard](/docs/03-standards/core-purity.md) - §1.1.1
- [Error Handling Standard](/docs/03-standards/error-handling.md) - §2.1, §3.2
- [Emergency Procedures](/docs/00-constitution/emergency-procedures.md) - §2.2
- [AI Governance](/docs/02-principles/ai-principles.md) - Output Format Requirements

**This document contains:**

- ✅ 6 Universal Procedures (always blocking)
- ✅ 3 Conditional Procedures (context-specific)
- ✅ 3 Exceptional Procedures (special cases)
- ❌ Zero normative rules (only references)

---

## 🎯 Constitutional Compliance Statement

**Axiom 8 Compliance:** This document specifies clear, minimal enforcement:

1. **6 Universal checks** apply to 100% of reviews
2. **Each check has explicit enforcement method**
3. **Blocking conditions are objectively verifiable**
4. **No undefined or ambiguous enforcement**

**Axiom 3 Compliance:** Contains zero normative rules. All `MUST`/`MUST NOT` statements reference authoritative sources.

**Success Metric:** Every PR can be verified in < 5 minutes using the 6 universal checks.
