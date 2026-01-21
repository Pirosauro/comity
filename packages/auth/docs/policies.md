# Writing Policies for @comity/auth

This document explains how to design and implement **policies** for the
`@comity/auth` module.

Policies define **business rules** around session validity, assurance,
refresh eligibility, and revocation.

They are:

- injected at runtime
- fully replaceable
- pure domain logic
- observable via events

---

## What Is a Policy?

A policy is a **rule enforcer**, not a decision maker.

It:

- receives a fully constructed `AuthSession`
- evaluates it against a rule
- throws a domain error if the rule is violated

It **does not**:

- mutate sessions
- persist data
- emit events directly
- know who is calling it

---

## Available Policy Types

| Policy                        | Responsibility               |
| ----------------------------- | ---------------------------- |
| `AuthSessionAssurancePolicy`  | Enforces minimum assurance   |
| `AuthSessionRefreshPolicy`    | Controls refresh eligibility |
| `AuthSessionRevocationPolicy` | Rejects revoked sessions     |

All policies follow the same mental model.

---

## General Rules for Policy Authors

### 1. Policies Must Be Pure

A policy must be:

- deterministic
- side-effect free
- synchronous

❌ No I/O  
❌ No repository access  
❌ No event emission

---

### 2. Policies Must Throw Domain Errors

A policy **signals rejection by throwing**.

Do **not** return booleans or results.

```ts
throw new AssuranceRequiredError(...)
```

The `AuthGuard`:

- catches the error
- emits the correct event
- rethrows it

---

### 3. Policies Must Be Narrow

Each policy should enforce **one concern**.

Good:

- minimum assurance score
- refresh window expiration
- revoked-by-reason check

Bad:

- mixing assurance + refresh logic
- checking invariants (already handled elsewhere)

---

## Assurance Policy

### Interface

```ts
export interface AuthSessionAssurancePolicy {
  assert(session: AuthSession, now: number): void;
}
```

### Responsibility

- Enforce **minimum authentication strength**
- Decide whether a session is “strong enough” for use

### Example: Minimum Score Policy

```ts
export class MinScoreAssurancePolicy implements AuthSessionAssurancePolicy {
  constructor(
    private readonly minScore: number,
    private readonly policyName = "min_score"
  ) {}

  assert(session: AuthSession): void {
    if (session.assurance.score < this.minScore) {
      throw new AssuranceRequiredError({
        reason: "insufficient_assurance",
        policy: this.policyName,
        required: this.minScore,
        actual: session.assurance.score,
      });
    }
  }
}
```

### Design Notes

- Assurance is **evaluated elsewhere**
- This policy only _asserts_
- Policies should not care how the score was computed

---

## Refresh Policy

### Interface

```ts
export interface AuthSessionRefreshPolicy {
  assert(session: AuthSession, now: number): void;
}
```

### Responsibility

- Decide if a session can be refreshed
- Enforce refresh expiration or constraints

### Example: Expiration-Based Refresh

```ts
export class ExpiringRefreshPolicy implements AuthSessionRefreshPolicy {
  assert(session: AuthSession, now: number): void {
    if (!session.refresh?.enabled) {
      throw new SessionRefreshNotAllowedError({
        reason: "refresh_disabled",
      });
    }

    if (session.refresh.expiresAt !== undefined && now > session.refresh.expiresAt) {
      throw new SessionRefreshExpiredError({
        reason: "refresh_expired",
        expiredAt: session.refresh.expiresAt,
      });
    }
  }
}
```

### Design Notes

- Refresh policies **do not create sessions**
- They only gate the operation

---

## Revocation Policy

### Interface

```ts
export interface AuthSessionRevocationPolicy {
  assert(session: AuthSession, now: number): void;
}
```

### Responsibility

- Reject sessions that are revoked
- Implement time-based or reason-based revocation

### Example: Simple Revocation Flag

```ts
export class RevokedFlagPolicy implements AuthSessionRevocationPolicy {
  assert(session: AuthSession): void {
    if (session.revokedAt) {
      throw new SessionRevokedError({
        reason: "session_revoked",
        revokedAt: session.revokedAt,
      });
    }
  }
}
```

---

## Error Design Guidelines

### Use Specific Domain Errors

Policies should throw:

- `AssuranceRequiredError`
- `SessionRefreshExpiredError`
- `SessionRevokedError`
- or other `BaseError` subclasses

### Always Include Metadata

Errors should include:

- `reason` (machine-readable)
- `policy` (when relevant)
- timestamps or thresholds if useful

This metadata is used by:

- event emitters
- logs
- metrics
- security analysis

---

## Event Emission (Important)

❗ Policies **do not emit events**.

Events are emitted by:

- `AuthGuard`
- based on:
  - which policy failed
  - which error was thrown

This keeps:

- policies reusable
- observability centralized
- behavior consistent

---

## Runtime Configuration

Policies are injected at module setup:

```ts
new AuthGuard({
  assurance: new MinScoreAssurancePolicy(50),
  refresh: new ExpiringRefreshPolicy(),
  revocation: new RevokedFlagPolicy(),
});
```

This allows:

- per-environment rules
- per-application customization
- feature flags
- A/B experiments

---

## Anti-Patterns to Avoid

❌ Calling repositories inside policies  
❌ Emitting events from policies  
❌ Returning booleans instead of throwing  
❌ Depending on use-case inputs  
❌ Re-evaluating assurance inside policies

---

## Mental Model Summary

> **Evaluators compute facts.  
> Policies enforce rules.  
> Guards orchestrate validation.  
> Use cases coordinate behavior.**

If your policy follows this rule, it is correct.

---

## When to Write a New Policy

Write a new policy when:

- a rule is environment-specific
- a security requirement changes
- a new compliance constraint is introduced

Do **not** modify use cases for policy changes.

---

## Final Checklist for Policy Authors

- [ ] Is the policy pure?
- [ ] Does it throw (not return)?
- [ ] Is it narrow in scope?
- [ ] Does it avoid infrastructure?
- [ ] Does it expose useful error metadata?

If yes → it belongs in `@comity/auth`.
