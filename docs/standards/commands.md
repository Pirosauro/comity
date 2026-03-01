# Comity Coding Standards — Commands (Imperative Operations Model)

This document defines the official **Command Pattern policy** for Comity.

Commands complement Events.

If Events describe something that happened,
Commands describe something that must happen.

---

# 1. Purpose of Commands

A Command represents:

- An explicit intention to change state
- A business operation request
- A side-effect-producing action

Examples:

- CreateUser
- RotateSession
- ChargePayment
- PublishArticle

Commands are:

- Imperative
- Explicit
- Single-responsibility
- Deterministic in intent

---

# 2. Commands vs Events

| Commands             | Events            |
| -------------------- | ----------------- |
| Imperative           | Descriptive       |
| "Do this"            | "This happened"   |
| May fail             | Already happened  |
| Owned by application | Emitted by domain |

Commands may produce Events.

Events MUST NOT produce Commands.

This directionality preserves architectural clarity.

---

# 3. Command Structure

A Command is a simple data object.

It MUST:

- Be immutable
- Contain only serializable data
- Contain no behavior
- Contain no infrastructure references

Example:

```ts
export interface CreateUserCommand {
  readonly email: string;
  readonly password: string;
}
```

Commands are DTOs.
They are not services.

---

# 4. Command Handlers

Each Command MUST have exactly one handler.

Handlers:

- Live in the Application Layer
- Depend on Core Modules via interfaces
- May use DI
- Return Result<T, E>

Example:

```ts
export interface CommandHandler<C, R> {
  handle(command: C): Promise<R>;
}
```

Handlers:

- MAY emit Events
- MAY use transactions
- MUST NOT leak infrastructure details

---

# 5. Command Bus (Optional)

Comity does NOT require a command bus.

A command bus MAY be introduced when:

- Cross-cutting policies are required (logging, tracing)
- Commands must be dispatched dynamically
- Distributed execution is required

The command bus:

- Lives in Extensions
- Must remain optional
- Must not introduce domain logic

Minimal systems may directly invoke handlers.

---

# 6. Transaction Boundaries

Commands define natural transaction boundaries.

If a command mutates state:

- The handler is responsible for transaction orchestration
- The command itself must remain unaware of persistence

Transaction control belongs to the Application Layer.

---

# 7. Validation Policy

Validation may occur at two levels:

1. Structural validation (DTO validation)
2. Business validation (inside handler)

Commands must not perform validation themselves.

Validation is policy, not data.

---

# 8. Idempotency

Commands SHOULD support idempotency when:

- They are triggered by external systems
- They may be retried

Idempotency is implemented at the handler or infrastructure level.

It MUST NOT be embedded inside the Command structure.

---

# 9. Error Model

Command handlers MUST:

- Return Result
- Throw only for programmer errors
- Use module-specific Error classes

Commands MUST NOT throw.

---

# 10. Design Intent

Commands make intent explicit.

They:

- Clarify system behavior
- Define mutation boundaries
- Improve observability
- Enable orchestration

Without Commands, systems become implicit and fragile.

With Commands, systems become explicit and composable.

---

# Final Principle

Events describe reality.

Commands change reality.

The Application Layer decides when one becomes the other.
