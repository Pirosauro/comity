## Kernel Lifecycle

The kernel models the application runtime as a finite state machine.

### States

- **open** — Modules may register services, hooks, and listeners.
- **sealed** — Registration is closed; the runtime shape is fixed.
- **running** — The application is executing.

---

### Transitions

- `open` → `sealed`
- `sealed` → `running`

Invalid transitions return an error.

---

### Why an Explicit Lifecycle?

- Prevents late mutations.
- Makes startup deterministic.
- Enables predictable module behavior.
- Avoids race conditions.

---

### Responsibility

The kernel enforces when actions are allowed; it does not perform side effects during transitions.

---

## Tokens (Reference)

Tokens are identity-safe keys used to reference services and shared values. They provide explicit wiring without magic.

```typescript
createToken<T>(description?)
```

### What Tokens Are

- Stable identity references.
- Type-safe lookup keys.
- Runtime-agnostic.

### What Tokens Are NOT

- Dependency injectors.
- Global singletons.
- Service locators.

### Usage Rules

- Tokens must be created once.
- Tokens must be shared explicitly.
- Tokens should represent concepts, not implementations.

### Design Rationale

Tokens avoid string-based keys, accidental collisions, and hidden coupling.
