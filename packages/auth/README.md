# @comity/auth

`@comity/auth` is the core authentication domain module for Comity.

It provides:

- authenticated session lifecycle management
- policy-based assurance and validation
- step-up authentication support
- refresh and revocation handling
- a clean, minimal facade for consumers

The module is **infrastructure-agnostic** and **fully configurable at runtime**.

---

## Design Goals

- Pure domain logic
- No persistence or transport assumptions
- Strong invariants and explicit validation
- Event-driven observability
- Easy composition with downstream auth modules (JWT, OIDC, etc.)

---

## High-Level Architecture

```text
┌───────────────────────┐
│ AuthFacade            │  ← public API
└───────────┬───────────┘
            │
┌───────────▼───────────┐
│ Use Cases             │
│ - CreateSession       │
│ - RefreshSession      │
│ - StepUpSession       │
│ - RevokeSession       │
└───────────┬───────────┘
            │
┌───────────▼───────────┐
│ AuthGuard             │
│ - invariants          │
│ - revocation          │
│ - assurance           │
│ - refresh             │
└───────────┬───────────┘
            │
┌───────────▼───────────┐
│ Policies &            │
│ Evaluators            │
└───────────┬───────────┘
            │
┌───────────▼───────────┐
│ AuthSessionRepository │
└───────────────────────┘
```

---

## Module Setup

The module must be configured explicitly.

```ts
module: ModuleMeta<AuthModuleOptions>;
```

### Required Options

- `repository: AuthSessionRepository`
- `evaluator: AuthSessionAssuranceEvaluator`

### Optional Options

- `guard.assurance: AuthSessionAssurancePolicy`
- `guard.refresh: AuthSessionRefreshPolicy`
- `guard.revocation: AuthSessionRevocationPolicy`

---

## Public API – AuthFacade

```ts
export interface AuthFacade {
  createSession(input: CreateSessionInput, now: number): Promise<AuthSession>;
  refreshSession(input: RefreshSessionInput, now: number): Promise<AuthSession>;
  stepUpSession(input: StepUpSessionInput, now: number): Promise<AuthSession>;
  revokeSession(sessionId: string, reason: string, now: number): Promise<void>;
  assertSession(session: AuthSession, now: number): void;
}
```

### Key Characteristics

- Stateless
- No domain objects leaked
- No guard or repository exposed
- All methods are deterministic given inputs

---

## Session Lifecycle

```text
Create → (Assert) → Use → Refresh → Step-Up → Revoke
```

### CreateSession

- Builds a new `AuthSession`
- Evaluates assurance
- Validates invariants and policies
- Persists the session
- Emits `session_created`

### RefreshSession

- Loads session from repository
- Validates invariants, revocation, assurance, refresh window
- Creates a new session instance
- Emits `session_refreshed`

### StepUpSession

- Loads parent session
- Re-evaluates assurance with stronger context
- Creates child session linked via `stepUp.parent`
- Emits `stepup_completed`

### RevokeSession

- Revokes session by id
- No validation required
- Emits `session_revoked`

---

## AuthGuard

`AuthGuard` centralizes **all validation logic**.

```ts
guard.assert(session, now);
```

Internally it performs:

1. Structural invariants
2. Revocation policy
3. Assurance policy
4. Optional refresh policy

The guard:

- emits evaluation events
- throws domain errors
- is **never exposed** publicly

---

## Assurance Evaluation

Assurance is evaluated **only when sessions are created or stepped up**.

```ts
evaluator.evaluate(input, now): AuthSessionAssurance
```

### Design Choice

- Assurance is immutable once assigned
- It represents **historical authentication strength**
- It is not re-evaluated on refresh or reuse

Evaluators are injected and can be:

- single
- composite
- environment-specific

---

## Repository

```ts
export interface AuthSessionRepository {
  get(id: AuthSessionId): Promise<AuthSession | undefined>;
  create(session: AuthSession): Promise<void>;
  update(session: AuthSession): Promise<void>;
  revoke(id: AuthSessionId, reason: string, at: number): Promise<void>;
}
```

### Rationale

- Repository may return `undefined` (not found)
- Not-found is a domain concern, not an infrastructure failure
- Use cases decide how to react and emit events accordingly

---

## Events

### Evaluation Events

Emitted during validation:

- `session_validated`
- `session_invalid`
- `assurance_rejected`
- `refresh_validated`
- `refresh_rejected`

### Session Events

Emitted during lifecycle changes:

- `session_created`
- `session_refreshed`
- `session_revoked`
- `stepup_completed`

All events are re-emitted via `ctx.events`.

---

## Why This Design

### Why a Facade?

- Prevents leaking domain internals
- Enables future refactors
- Simplifies onboarding

### Why Policies?

- Business rules change
- Auth requirements differ per environment
- Policies must be replaceable

### Why No Defaults?

- Security-sensitive domain
- Explicit is safer than implicit

---

## Intended Extensions

This module is meant to be extended by:

- `@comity/auth-jose`
- `@comity/auth-oidc`
- `@comity/auth-webauthn`
- custom application policies

---

## Summary

`@comity/auth` is:

- a **domain kernel**
- policy-driven
- event-first
- minimal but extensible

It provides strong guarantees while remaining flexible enough
to support real-world authentication systems.
