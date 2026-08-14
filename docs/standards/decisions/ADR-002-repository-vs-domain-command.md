# ADR-002 — Repository vs Domain Command Port

**Status:** Accepted

## Context

`docs/standards/domain-modeling.md` §6 establishes a minimal repository surface (`getById`, `search`, `save`, `remove`) and §7 standardizes the return type as `Result<T, RepositoryError>`. Repository contracts are defined as **persistence boundaries**.

The framework audit identified inconsistent placement of domain operations across the three modules that own mutable aggregates:

- `@comity/customer` — `CustomerRepository` exposes `getById`, `save`, `remove`, `search`. No domain operations.
- `@comity/auth` — `AuthSessionRepository` exposes `getById`, `save`, `revoke(revocation)`. The `revoke()` method carries an `AuthSessionRevocation` (reason, timestamp, actor) and persists it as audit metadata. JSDoc explicitly marks the operation as "at the boundary between persistence and a domain command" and lists Repository-vs-Domain-Command as a candidate ADR.
- `@comity/order` — `OrderRepository` exposes `get`, `addItem`, `removeItem`, `updateItemQuantity`, `applyCoupon`, `removeCoupon`, `clear`. Every mutating method is a domain operation: it enforces business rules (inventory, coupons), coordinates mutation, and returns the updated entity. The contract returns `Result<T, OrderError>`, not `Result<T, RepositoryError>`, so domain validation errors and infrastructure failures are conflated into a single error type.

The divergence produces three architectural questions:

1. Is `revoke()` on `AuthSessionRepository` a persistence operation or a domain command?
2. Are `addItem`, `removeItem`, `applyCoupon`, `clear` on `OrderRepository` persistence operations or domain commands?
3. Under what conditions is a repository method allowed to exist?

`@comity/customer` already implements the minimal canonical surface correctly. `@comity/identity` and `@comity/address` use a similar minimal surface. `@comity/catalog` uses a read-projection repository without `save`/`remove`. The anomaly is concentrated in `@comity/auth` (`revoke`) and `@comity/order` (`addItem` and the rest).

The decision is needed so that:

- new Core Modules do not reinvent repository scope;
- existing repositories can be migrated without redesigning the module;
- adapters remain interchangeable across storage technologies;
- the separation between `Core Module` (contracts) and `Application Layer` (orchestration) remains principled.

This ADR does not introduce a generic framework abstraction (no `RepositoryFactory`, `CommandBus`, `EntityFactory`).

## Decision

Comity adopts a **port-based separation** between persistence and domain commands. A Core Module MAY expose both kinds of contracts, but they MUST live on **distinct ports**.

### 1. Repository port — persistence boundary

A Repository represents persistence of an aggregate's persisted state.

Canonical operations:

```
getById(id): Promise<Result<T | null, RepositoryError>>
search(criteria?): Promise<Result<SearchResult<T>, RepositoryError>>
save(aggregate): Promise<Result<Entity, RepositoryError>>
```

`save()` is a valid mutation because it persists a state transition already decided elsewhere (by a domain command, a policy, or an entity method). It does not decide what to transition to.

`getById()` and `search()` are read operations. Both MUST return `null` or empty results when the entity is absent — they MUST NOT return `Result.failure` for "not found". Not-found is a domain outcome that the caller maps to a domain error.

### 2. Domain command port — business intention boundary

A Domain Command represents a business intention: it enforces business rules, coordinates one or more repositories, and produces a domain outcome (success or a domain error).

Domain command ports are introduced **only when a bounded context genuinely requires them**. A Core Module that has no domain commands MUST NOT introduce an empty port. A command port MUST NOT be introduced merely to wrap a single repository call.

Canonical naming for a command port:

```
<Aggregate>Commands
```

or, when the bounded context has a single primary aggregate, a per-operation port:

```
<Verb><Aggregate> / <Verb><Aggregate>Command
```

Domain commands:

- MAY enforce business rules;
- MAY coordinate multiple repositories and other ports;
- MAY emit lifecycle events;
- MUST return `Result<T, <Domain>Error>` (a domain-specific error type, not `RepositoryError`);
- MUST NOT expose infrastructure concerns;
- MUST NOT be implemented by persistence adapters — they are wired in the Application Layer.

A domain command is **not a class with `execute()`**. It is a port (an interface) that the Application Layer wires. Whether it is implemented as a class, a function, or a service object is left to the module.

### 3. Deletion rules

Deletion is a persistence operation. Soft delete / status transitions are domain operations and MUST live on the command port.

When a bounded context supports both:

- the Repository exposes `remove(id)` for removal from the repository persistence boundary. Whether this maps to physical deletion, archival, or another persistence strategy is an adapter concern;
- the Commands port exposes the soft-delete / status transition (e.g. `deactivateCustomer`, `archiveCustomer`) which internally calls `save()` with the updated state.

A bounded context that only supports soft deletion MUST NOT expose `remove()` on the Repository.

### 4. Read-projection exception (preserved)

Read-projection repositories are valid Core Module contracts and remain unchanged. Such repositories:

- MAY expose only the read operations they semantically own;
- MUST NOT be forced to expose `save` or `remove`;
- SHOULD expose stable, immutable projection models rather than mutable entities.

A read-projection port is a Repository, even when it only exposes `search` and `getById`.

### 5. Return type discipline

All Repository methods return `Result<T, RepositoryError>` per `domain-modeling.md §7`. Not-found is a domain outcome; repositories MUST return `null` for missing entities and let the caller translate.

All Command methods return `Result<T, <Domain>Error>`. A `<Domain>Error` MAY include a `RepositoryError` (or wrap one) for infrastructure failures when the command crosses a persistence boundary, but the command MUST NOT expose raw `RepositoryError` to callers without domain translation.

### 6. Co-location

A Repository and its Commands port MAY live in the same Core Module package. They are separate ports and MUST NOT be merged into a single interface.

A Core Module MAY expose a Repository without a Commands port when no business command is semantically required.

### 7. Application Layer wiring

The Application Layer instantiates command implementations and wires them with repositories, validators, observers, and other dependencies. Commands are not exported from the Core Module's public API as concrete implementations; they are exported as ports.

Concrete command classes MAY be exported from the Core Module when the Application Layer would otherwise have to re-implement trivial orchestration, but the Application Layer remains free to provide its own implementation.

## Repository vs Command Decision Matrix

| Operation                                | Belongs to    | Rationale                                              |
| ---------------------------------------- | ------------- | ------------------------------------------------------ |
| `getById(id)`                            | Repository    | pure read                                              |
| `search(criteria)`                       | Repository    | pure read                                              |
| `save(aggregate)`                        | Repository    | persists a state transition decided elsewhere          |
| `remove(id)` (hard)                      | Repository    | persistence operation                                  |
| `revoke(revocation)` (status transition) | Commands port | domain event with audit metadata; not pure persistence |
| `addItem(input)` (business rule)         | Commands port | enforces inventory, pricing, lifecycle                 |
| `removeItem(itemId)` (business rule)     | Commands port | enforces line-item invariants                          |
| `applyCoupon(code)`                      | Commands port | enforces coupon validity, expiry, conflicts            |
| `clear()` (lifecycle reset)              | Commands port | enforces lifecycle transition                          |
| `updateItemQuantity(itemId, quantity)`   | Commands port | enforces stock availability and aggregate consistency  |

## Concrete Cases

### `@comity/customer`

Current state: `CustomerRepository` exposes `getById`, `save`, `remove`, `search`. No domain commands.

Verdict: **compliant**. No migration required.

`remove()` is documented as hard deletion (or audit-logged hard delete) and aligns with §3.

If soft-delete is added later, the soft-delete operation MUST be exposed on a Commands port (e.g. `deactivateCustomer(id)`) that internally calls `save()` with the updated state. The Repository MUST NOT grow a `deactivate()` method.

### `@comity/auth`

Current state: `AuthSessionRepository` exposes `getById`, `save`, `revoke(revocation)`. `AuthSessionRevocation` carries `reason`, `at`, and optional `actor`.

Analysis: `AuthSession` does not carry a `revokedAt` flag or a `revoked` status. Revocation is recorded separately (as an audit event, a tombstone, or a deletion). The current contract conflates two distinct semantics:

- **Case A** — revocation is a status transition persisted on the same `AuthSession` record:
  - the Repository gains `save()` only; `revoke()` is removed;
  - a Commands port gains `revokeSession(input)` that mutates the session (sets `revokedAt`, emits `onSessionRevoked`) and calls `save()`;
  - the audit metadata (reason, actor) is captured by the command and persisted as part of `AuthSession.State` (or as a sibling audit record managed by the command's adapter).

- **Case B** — revocation is stored separately (sessions table + revoked_sessions table):
  - the Repository exposes `save()` and `revoke()` only when the adapter implementation explicitly separates the two persistence concerns (e.g. one adapter persists the revocation record in a different table);
  - when the adapter chooses to write the revocation atomically with the session record, it collapses to Case A.

Verdict: `@comity/auth` SHOULD migrate to **Case A**. The audit metadata belongs to the domain command, not to the persistence call. Migration:

1. Move `AuthSessionRevocation` and `revokeSession(input)` from `AuthSessionRepository` to a Commands port (e.g. `AuthSessionCommands`).
2. The command implementation: reads the session via `repository.getById`, validates preconditions (not already revoked, not expired by policy), mutates session state, calls `repository.save()`, emits `onSessionRevoked`.
3. The Repository loses `revoke()` and reverts to `getById` + `save()`.
4. `AuthSession` MAY grow a `revokedAt?: number` field in its State when the bounded context supports in-place revocation. This is a domain modeling decision recorded separately, not a repository decision.

Migration is **non-breaking for the public use-case surface**: `RevokeSession.execute()` (already a use-case class) absorbs the change. The Repository signature change is the only breaking change and is documented in this ADR.

#### Implementation (implemented)

The migration above is complete in `@comity/auth`:

- `AuthSessionCommands` is a new command port in `contracts/session-commands.ts` exposing `revoke(sessionId, metadata): Promise<Result<void, AuthError>>`. It returns domain errors only (`AuthError`), never `RepositoryError`.
- `AuthSessionRevocation` moved from `contracts/session-repository.ts` to `contracts/session-commands.ts`. The `id` field was dropped because the session identifier is now the `revoke(sessionId, …)` argument, not part of the metadata.
- `AuthSessionRepository` is reduced to persistence: `getById(id): Promise<Result<AuthSession | null, RepositoryError>>` and `save(session): Promise<Result<void, RepositoryError>>`. `revoke()` is removed entirely (no compatibility shim). Missing sessions return `null` (`session_not_found` is a domain outcome mapped by the command).
- `AuthSession` gained `revokedAt?: number` (Case A in-place revocation).
- `RevokeSession` implements `AuthSessionCommands`. The command: `getById(sessionId)` → returns `session_not_found` when missing and `session_revoked` when `revokedAt` is already set → sets `revokedAt` → `save()` → emits `onSessionRevoked`. A best-effort `execute(input, now): Promise<void>` wrapper is retained for the facade, which delegates to `revoke()` and swallows failures.
- `AuthGuard.assertRevocation` rejects sessions whose `revokedAt` is set and `<= now`, emitting `onSessionInvalid` with reason `session_revoked` before consulting revocation policies.
- `checkSessionInvariants` validates `revokedAt` (must be `>= createdAt` if present) using the new `revoked_at_invalid` violation.
- The in-memory adapter `MemoryAuthSessionRepository` no longer implements `revoke`; revocation persists by saving the session with `revokedAt` set.

Adapters implementing the old contract MUST drop `revoke()` and rely on the command writing the revoked state through `save()`.

### `@comity/order`

Current state: `OrderRepository` exposes `get`, `addItem`, `removeItem`, `updateItemQuantity`, `applyCoupon`, `removeCoupon`, `clear`. Returns `Result<T, OrderError>`. The contract is a domain surface masquerading as a repository.

Verdict: **non-compliant**.

Migration:

1. Rename to `OrderCommands` (or split into `OrderCommands` + `OrderRepository`).
2. Move all mutating methods (`addItem`, `removeItem`, `updateItemQuantity`, `applyCoupon`, `removeCoupon`, `clear`) onto `OrderCommands`.
3. Reduce `OrderRepository` to `get` and `save` only.
4. `OrderCommands` returns `Result<T, OrderError>`; `OrderRepository` returns `Result<T, RepositoryError>`.
5. `OrderError` retains its current reason vocabulary (`not_found`, `validation_failed`, `access_denied`, `repository_error`, `invalid_status_transition`, `unknown`). The `repository_error` reason is retained for command methods that delegate to a Repository and surface infrastructure failures as a domain error. This is consistent with §5.

This migration aligns `@comity/order` with `@comity/customer`, `@comity/identity`, `@comity/address`, and `@comity/auth` (post-migration).

## When a Repository Method Is Allowed to Exist

A method belongs on a Repository port when it satisfies **all** of:

1. It maps directly to a persistence operation: read a row, write a row, delete a row.
2. It does not enforce business rules beyond basic persistence integrity.
3. It does not require coordination with another repository, validator, observer, or external service.
4. It does not carry audit / reason / actor metadata that belongs to a domain event.
5. It does not change the lifecycle state of the aggregate beyond what `save()` already implies.

When any of these is violated, the method belongs on the Commands port.

## Consequences

**Positive:**

- Repository contracts become predictable: `getById`, `search`, `save`, plus module-specific read projections.
- Domain operations are explicit and discoverable: they live on a Commands port and return domain errors.
- The boundary between Core Module (contracts) and Application Layer (wiring) becomes principled.
- Adapter implementations become narrower and more replaceable (a Repository adapter only needs to persist; a Command implementation only needs to enforce business rules).
- The `Result<T, RepositoryError>` discipline in §7 is preserved; commands return their own error type.
- Migration paths are limited in scope (AuthSessionRepository loses one method; OrderRepository loses six methods).
- `@comity/customer`, `@comity/identity`, `@comity/address`, `@comity/catalog` (read projection) remain authoritative reference implementations.

**Negative / Trade-offs:**

- `@comity/auth` and `@comity/order` require a contract migration. The migrations are non-breaking for callers that go through the use-case surface.
- A Core Module with both kinds of ports must export two interfaces. The public API grows.
- The naming `<Aggregate>Commands` introduces a new convention; modules that already have one operation may prefer a per-operation port name (e.g. `RevokeSessionCommand`). Both are allowed.
- Forcing the boundary in low-complexity modules (e.g. a module with only one domain command) MAY feel over-engineered. The decision allows omitting the Commands port entirely when no business command exists.
- `OrderError.reason = "repository_error"` is preserved as a wrap reason; some teams prefer to translate `RepositoryError` at the command boundary without a new reason. The ADR does not standardize this translation.

## Constraints Honored

- No generic framework abstraction is introduced. No `RepositoryFactory`, `CommandBus`, `CommandHandler<C, R>`, or `EntityFactory`.
- The `Result<T, RepositoryError>` convention from `domain-modeling.md §7` is preserved for repositories.
- The `commands.md` standard (`Command = DTO`, `CommandHandler` in Application Layer, optional `CommandBus`) is preserved: this ADR concerns **Core Module ports**, not Application Layer handlers.
- The `Read-Projection Exception` from `domain-modeling.md §6` is preserved.
- No new package is created.
- No modification to `domain-modeling.md` is required by this ADR. `§6` (Repository Contracts), `§7` (Return Types), and `§11` (Cross-Module Relationships) remain authoritative. This ADR documents their application to the Repository-vs-Command boundary.

## Scope

This ADR concerns:

- the boundary between Repository contracts and Domain Command contracts inside Core Modules;
- the placement of mutating operations on the appropriate port;
- the return-type discipline (`Result<T, RepositoryError>` vs `Result<T, <Domain>Error>`);
- the canonical surface of Repository contracts.

This ADR does NOT concern:

- the internal implementation of Command handlers (Application Layer concern, see `commands.md`);
- the existence of a `CommandBus` (left to `commands.md §5`);
- the existence of cross-cutting policies on commands (left to `commands.md §7-§9`);
- the migration of `@comity/order` to a full aggregate root with invariants (separate decision);
- the addition of `revokedAt` to `AuthSession.State` (separate decision);
- aggregate root identification, invariants, or lifecycle modeling (separate standard);
- generic framework abstractions (`RepositoryFactory`, `CommandBus`, etc.);
- the Application Layer composition model;
- the `Cmd → Event → Observer` flow inside the Application Layer.

## Migration Implications

| Module             | Action                                                                                                                                                                          | Breaking?                                                  |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `@comity/customer` | none                                                                                                                                                                            | no                                                         |
| `@comity/address`  | none                                                                                                                                                                            | no                                                         |
| `@comity/identity` | none                                                                                                                                                                            | no                                                         |
| `@comity/catalog`  | none (read projection)                                                                                                                                                          | no                                                         |
| `@comity/auth`     | move `revoke()` from `AuthSessionRepository` to `AuthSessionCommands`; update `RevokeSession` use case; remove `AuthSessionRevocation` export from `auth-session-repository.ts` | yes — Repository signature change; **done** |
| `@comity/order`    | rename `OrderRepository` to `OrderCommands`; expose minimal `OrderRepository` with `get`/`save`                                                                                 | yes — Repository interface change; command surface renamed |

All migrations are scoped to their respective modules. No other module is affected.

## Unresolved Decisions

1. **Command port naming.** `<Aggregate>Commands` vs per-operation (`<Verb><Aggregate>`). The ADR allows both. A future standard may settle on one.
2. **Command implementations as concrete classes in Core Modules.** The ADR allows exporting concrete command classes when the Application Layer would otherwise re-implement trivial orchestration. The boundary between "trivial orchestration" and "Application Layer concern" is not standardized.
3. **Wrapping `RepositoryError` inside `<Domain>Error`.** The ADR permits it but does not require it. `@comity/order`'s `OrderError.reason = "repository_error"` is preserved as the reference pattern.
4. **`AuthSession.revokedAt`.** Whether revocation becomes a state transition on the session record is a separate domain modeling decision. The ADR allows both Case A and Case B persistence layouts, but recommends Case A.
5. **Application Layer command bus.** Whether to introduce a `CommandBus` is left to `commands.md §5` and is not affected by this ADR.

## References

- `docs/standards/domain-modeling.md` §6 — Repository Contracts.
- `docs/standards/domain-modeling.md` §7 — Repository Return Types.
- `docs/standards/domain-modeling.md` §8 — Repository Errors.
- `docs/standards/domain-modeling.md` §11 — Cross-Module Relationships.
- `docs/standards/domain-modeling.md` §15 — Future Work (lists "Commands" and "Domain services" as separate standards).
- `docs/standards/commands.md` — Commands (Imperative Operations Model).
- `docs/standards/layering-policy.md` §3 — Dependency Rules.
- `docs/standards/decisions/ADR-001-entity-creation-and-hydration.md` — Entity construction and hydration.
- `packages/customer/src/contracts/customer-repository.ts` — reference implementation of minimal surface.
- `packages/identity/src/contracts/user-repository.ts` — reference implementation of minimal surface.
- `packages/address/src/contracts/address-repository.ts` — reference implementation of minimal surface.
- `packages/catalog/src/contracts/product-repository.ts` — reference implementation of read-projection exception.
- `packages/auth/src/contracts/session-repository.ts` — current boundary case (`revoke`).
- `packages/auth/src/use-cases/session-revoke.ts` — current use case that delegates to the repository.
- `packages/order/src/contracts/order-repository.ts` — current non-compliant contract.
