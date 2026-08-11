# ADR-001 — Entity Creation and Hydration via Constructor with Supplied Persistence State

**Status:** Accepted

## Context

Comity's `domain-modeling.md §5` establishes two invariants for entity lifecycle:

1. **Creation** initializes creation-time state.
2. **Hydration** restores persisted state and MUST NOT regenerate or alter persisted timestamps.

`@comity/customer` already implements this distinction correctly. Its entity constructor honors supplied persistence metadata and falls back to `Instant.now()` only when the caller has not provided it:

```ts
constructor(fields: CustomerCreate, id?: CustomerId) {
  this.#id = id;

  // ...

  this.#createdAt = fields.createdAt ?? Instant.now();
  this.#updatedAt = fields.updatedAt ?? null;
  this.#deletedAt = fields.deletedAt ?? null;
}
```

The architectural audit identified that `@comity/address` and `@comity/identity` currently violate §5: their constructors unconditionally call `Instant.now()` for `createdAt` and (in Identity) hard-code `status: "active"`. A repository adapter that constructs an entity from a database row silently overwrites the original persisted timestamps and lifecycle status.

The framework needs a single, documented pattern for entity construction so that:

- hydration semantics are explicit and consistent across Core Modules;
- new Core Modules do not reinvent the pattern;
- adapters can construct entities from persisted state without timestamp drift;
- existing correct implementations (`Customer`) remain authoritative.

The decision does not introduce a new architectural concept. It documents the canonical implementation of an existing standard.

## Decision

Comity adopts the constructor-based pattern demonstrated by `@comity/customer` as the canonical mechanism for entity creation and hydration.

### Creation

A new entity is constructed from creation data. Lifecycle metadata that the caller has not supplied is initialized by the entity itself.

```ts
this.#createdAt = fields.createdAt ?? Instant.now();
this.#updatedAt = fields.updatedAt ?? this.#createdAt;
```

`Instant.now()` is a **creation-time fallback**, not a default. It runs only when the caller has not provided a value.

At creation, when no `updatedAt` is supplied, it defaults to `createdAt`. `createdAt` and `updatedAt` MUST NOT be nullable merely to represent "never updated".

### Hydration

An existing entity is reconstructed from persisted state. Persistence metadata supplied by the caller MUST be preserved exactly. The entity MUST NOT regenerate or alter persisted timestamps.

```ts
const persisted = readRow();
const entity = new Customer(
  {
    ...persisted,
    createdAt: persisted.createdAt,
    updatedAt: persisted.updatedAt,
    deletedAt: persisted.deletedAt,
  },
  new CustomerId(persisted.id)
);
```

The architectural invariant is **timestamp preservation**, not a particular factory syntax.

### Implementation requirement

For every entity that persists lifecycle metadata:

1. `State` includes `createdAt`, and `updatedAt` / `deletedAt?` when the bounded context tracks them.
2. `Create` is an explicit construction contract defined according to domain creation semantics. It is NOT required to be derived from `State`. Lifecycle metadata MAY appear in `Create` as optional fields so the same constructor can support both normal creation and hydration.
3. The constructor uses the `??` fallback pattern for lifecycle fields, falling back to creation-time defaults when no persisted values are supplied:

   ```ts
   this.#createdAt = fields.createdAt ?? Instant.now();
   this.#updatedAt = fields.updatedAt ?? this.#createdAt;
   this.#deletedAt = fields.deletedAt ?? null;
   ```

4. The entity MUST NOT overwrite supplied persistence values with newly generated values.

## Create vs State

`Create` and `State` are distinct contracts with different responsibilities.

### State

`State` represents the **complete persisted state** of an entity. For entities that track lifecycle metadata:

```ts
interface EntityState extends EntityData {
  readonly id: EntityId;
  readonly createdAt: Instant;
  readonly updatedAt: Instant;
}
```

`deletedAt` appears only where the bounded context supports soft deletion.

### Create

`Create` represents an **explicit construction contract** for an entity. It is defined according to domain creation semantics rather than mechanically derived from `State`:

```ts
type UserCreate = UserData & {
  readonly createdAt?: Instant;
  readonly updatedAt?: Instant;
  readonly status?: UserStatus;
};
```

Lifecycle metadata MAY appear in `Create` as optional fields so that the same constructor can support both:

1. normal entity creation (timestamps absent);
2. hydration from persisted state (timestamps supplied).

The exact fields and their optionality reflect the bounded context's creation and hydration semantics.

### Update

`Update` represents a **partial mutation contract**:

```ts
type EntityUpdate = Partial<Omit<EntityState, "updatedAt">>;
```

`Partial` remains appropriate for update contracts because partial modification is explicitly intended there.

### Create is NOT Partial

Comity MUST NOT adopt as a general convention:

```ts
type EntityCreate = Partial<Omit<EntityState, "id">>;
```

`Partial` around the entire `Create` contract is rejected because it weakens the structural information required at construction time. Optionality in `Create` is expressed intentionally at the individual property level (`?:`), not by applying `Partial` globally.

A field that may legitimately have no value:

```ts
readonly name: string | null;
```

A field that is genuinely absent:

```ts
readonly name?: string | null;
```

The validator remains responsible for determining whether supplied values satisfy domain validation rules and invariants.

### Separation of Responsibilities

```text
Type system
    → structural shape and required/optional fields

Validator
    → semantic validity and domain constraints

Entity
    → lifecycle and invariant-preserving behavior
```

This separation is preserved by the canonical pattern. It is not a broader validation architecture decision.

## `fromState()`

Comity does **not** standardize a `fromState()` factory at this time.

The constructor-based approach is the preferred and default pattern because:

- `@comity/customer` already implements it successfully;
- it avoids maintaining separate creation and hydration construction paths;
- it introduces no additional framework abstraction;
- it keeps entity construction simple;
- it satisfies the hydration requirement in `domain-modeling.md §5`.

A module MAY use a different mechanism when its domain genuinely requires one. This ADR does not establish another canonical mechanism and does not forbid module-specific variants.

The framework MUST NOT introduce:

- a generic `EntityFactory` in `@comity/primitives`;
- a `HydrationRepository` abstraction;
- a `HydrationService` or similar infrastructure;
- reflection-based hydration;
- framework-level hydration machinery.

## Timestamp Rules

- `createdAt` belongs to persisted `State`, not to business `Data`.
- `updatedAt` belongs to `State` when the bounded context tracks it.
- `deletedAt` belongs to `State` only when the bounded context supports soft deletion.
- Persisted timestamps are authoritative during hydration.
- `Instant.now()` is a creation-time fallback only.
- An entity MUST NOT overwrite supplied persistence timestamps with newly generated values.
- `createdAt` and `updatedAt` MUST NOT be nullable merely to represent "never updated". At creation they MUST be equal.

The semantic distinction between creation and hydration is the architectural invariant:

```text
Creation
  Create data
  + persistence metadata may be omitted
        ↓
  missing timestamps
        ↓
  entity initializes defaults:
    createdAt = Instant.now()
    updatedAt = createdAt

Hydration
  Create data
  + persisted metadata supplied
        ↓
  timestamps supplied
        ↓
  entity preserves persisted values exactly
```

## Repository Implications

This ADR does not modify repository contracts.

Repositories continue to use the existing repository conventions established in `domain-modeling.md §6`. Repositories MAY return hydrated entity instances. Repositories are responsible for supplying persisted state when reconstructing entities.

No new abstraction is introduced:

- no `HydrationRepository`;
- no `EntityFactory`;
- no `RepositoryResult`;
- no change to `Result<T, RepositoryError>`.

This ADR concerns entity construction semantics, not repository architecture.

## Reference Implementation: `@comity/customer`

`Customer` conceptually demonstrates the constructor-based hydration pattern. Its entity honors supplied persistence metadata and falls back to creation-time defaults when none is provided.

The accompanying tests (`packages/customer/src/entities/__tests__/customer.test.ts`) explicitly cover both creation defaults and hydration preservation:

- "should use provided createdAt when given"
- "should accept explicit updatedAt"
- "should accept explicit deletedAt"

The `Customer` reference illustrates the **constructor pattern** and the **timestamp-preservation invariant**. It is not the only valid `Create` shape — other bounded contexts MAY define their own `Create` contracts according to their domain semantics, including optional lifecycle metadata suitable for hydration.

## Affected Modules

This decision was prompted by the audit of:

- `@comity/address` — currently regenerates `createdAt` at `packages/address/src/entities/address.ts:41`.
- `@comity/identity` — currently regenerates `createdAt` and hard-codes `status: "active"` at `packages/identity/src/entities/user.ts:26-27`.

Both modules need to align with this decision in a separate, dedicated migration task. This ADR only records the architectural decision; it does not implement the fixes.

## Consequences

**Positive:**

- Persisted timestamps remain authoritative across all Core Modules.
- Creation and hydration semantics become explicit at the type and implementation level.
- No additional construction abstraction is required.
- New Core Modules have a clear implementation pattern from day one.
- Existing `@comity/customer` behavior is documented as the reference.
- Repository adapters can construct entities from persisted state with confidence.

**Negative / Trade-offs:**

- `Create` may contain optional persistence metadata when used for hydration; this is the intended dual purpose, not a defect.
- Constructors must distinguish supplied values from omitted values using the `??` fallback pattern.
- Tests must cover both creation defaults and hydration preservation for every entity with lifecycle metadata.
- Modules with unusual lifecycle semantics may require a different construction mechanism (this ADR permits but does not standardize it).

## Scope

This ADR concerns:

- entity construction;
- entity hydration;
- the `Create` / `State` distinction;
- lifecycle timestamp preservation.

This ADR does NOT concern:

- aggregate roots;
- domain services;
- repository contracts;
- validation architecture;
- Value Objects;
- event sourcing;
- persistence technology;
- serialization;
- generic entity factories;
- dependency injection;
- application-layer orchestration.

## References

- `docs/standards/domain-modeling.md` §4 — Data Models.
- `docs/standards/domain-modeling.md` §5 — Entity Lifecycle & Hydration.
- `packages/customer/src/entities/customer.ts` — reference implementation.
- `packages/customer/src/contracts/customer.ts` — `CustomerState` and `CustomerCreate` shape.
- `packages/customer/src/entities/__tests__/customer.test.ts` — hydration preservation tests.
