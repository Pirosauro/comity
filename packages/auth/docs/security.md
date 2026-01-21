# Security & Threat Model – @comity/auth

This document describes the **security model**, **trust boundaries**, and
**threat assumptions** of the `@comity/auth` module.

---

## Design Goals

- Explicit trust boundaries
- No hidden side effects
- Observable security decisions
- Replaceable security rules
- Defense-in-depth by composition

---

## Trust Boundaries

### 1. Input Boundary

All inputs to auth originate from:

- adapters (e.g. jose)
- application code
- external identity providers

**Assumption:**  
Inputs may be malformed, incomplete, or hostile.

Mitigation:

- structural invariants
- guard validation
- explicit policies

---

### 2. Domain Boundary

Inside `@comity/auth`:

- all logic is deterministic
- no implicit I/O
- no hidden persistence

**Assumption:**  
Domain logic is trusted once invariants pass.

---

### 3. Adapter Boundary

Adapters (e.g. `@comity/auth-jose`) are:

- untrusted
- replaceable
- observable via events

They:

- produce raw inputs
- consume domain decisions

---

## Threat Model

### Threat: Forged or Malformed Sessions

Mitigation:

- invariant checks
- strict session structure
- guard-based validation

---

### Threat: Reuse of Revoked Sessions

Mitigation:

- revocation policy
- explicit revocation events
- centralized enforcement in `AuthGuard`

---

### Threat: Weak Authentication Accepted

Mitigation:

- assurance evaluator + policy split
- explicit `AssuranceRequiredError`
- observable rejection events

---

### Threat: Silent Security Failures

Mitigation:

- mandatory event emission
- centralized guard
- no hidden catches

---

## Why Events Are Critical

Every security-relevant decision emits an event:

- session validated
- session invalid
- assurance rejected
- refresh rejected
- session revoked

This enables:

- audit logging
- metrics
- alerting
- intrusion detection

---

## Why Policies Are Runtime-Injected

Policies are injected via module options to:

- avoid hardcoded security rules
- support different environments
- enable gradual rollouts
- support compliance requirements

Security is **configuration**, not code.

---

## No Implicit Escalation

- Step-up sessions are explicit
- Parent sessions are referenced
- Assurance is re-evaluated

No session silently gains privileges.

---

## Replay & Refresh Safety

- Refresh eligibility is explicit
- Refresh windows are enforced
- Expired refresh throws hard errors

No silent session extension.

---

## Error as Control Flow

Errors are:

- typed
- structured
- meaningful

They are part of the security contract.

---

## What @comity/auth Does NOT Do

- No cryptography
- No token parsing
- No identity verification
- No persistence assumptions

These belong to adapters and infrastructure.

---

## Security Philosophy Summary

> **Explicit over implicit  
> Observable over silent  
> Configurable over hardcoded  
> Domain-first over infrastructure-first**

---

## Recommended Practices

- Always listen to auth events
- Log security rejections
- Version assurance logic
- Test policies independently
- Treat adapters as untrusted

---
