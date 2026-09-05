# Comity Coding Standards — Class Design

> **Note:** This is the Community-specific transitional copy. The canonical Comity-wide version is maintained in `comity-development/docs/standards/coding.md`
This document defines the **official class design and construction standards** for all Comity packages.

These rules apply to:

- Core packages (`@comity/*`)
- Infrastructure modules
- Public and internal APIs

Violations MUST be considered design bugs.

---

## 1. Class Philosophy

Comity classes:

- Represent **long-lived domain or infrastructure components**
- Must have **explicit lifecycle and state**
- Must be **readable as plain JavaScript**, not TypeScript magic

If a class cannot be understood by reading its constructor and fields, it is incorrectly designed.

---

## 2. Field Declaration Rules

### 2.1 Explicit Fields (MANDATORY)

All fields MUST be declared explicitly.

```ts
class Example {
  readonly #state: State;
}
```

❌ Forbidden:

```ts
constructor(private state: State) {}
```

**Reason**: Parameter properties hide state and couple API to TypeScript syntax.

---

### 2.2 Private Fields

- Internal state MUST use `#private` fields
- `private` keyword is NOT sufficient for core state

```ts
class Kernel {
  readonly #lifecycle: Lifecycle;
}
```

---

### 2.3 Public Access

- Public state MUST be exposed via getters
- Direct field access is forbidden

```ts
get state(): KernelState {
  return this.#lifecycle.state;
}
```

---

## 3. Constructor Rules

### 3.1 Constructor Responsibilities

The constructor MUST:

- Fully initialize the instance
- Establish invariants
- Create internal state

```ts
class HttpContext {
  readonly #state: HttpState;

  constructor() {
    this.#state = createState();
  }
}
```

---

### 3.2 No Field Initializers (Except Constants)

Field initializers are FORBIDDEN unless:

- They are constants
- They have no side effects

❌ Forbidden:

```ts
class X {
  state = new State();
}
```

✅ Allowed:

```ts
class X {
  static readonly DEFAULT_TIMEOUT = 5000;
}
```

---

## 4. Immutability Rules

- Constructor parameters MUST NOT be mutated
- Internal state mutation MUST be explicit and localized

```ts
constructor(request: HttpRequest) {
  this.#request = request;
}
```

---

## 5. Error Handling Rules

- Classes MUST throw only `BaseError` or subclasses
- `new Error()` is forbidden
- Error types MUST encode semantic intent

```ts
throw new InvalidLifecycleStateError({
  action: "seal",
  state: this.#lifecycle.state,
});
```

---

## 6. Lifecycle Awareness

If a class has phases (open → sealed → running):

- It MUST use a `Lifecycle` abstraction
- Illegal transitions MUST throw

```ts
if (!this.#lifecycle.is("open")) {
  throw new InvalidLifecycleStateError(...);
}
```

---

## 7. Events & Side Effects

- Classes MUST NOT emit events implicitly
- Event emission MUST be explicit and injectable
- Event payloads MUST be minimal and non-sensitive

```ts
this.#events.requestStarted({ id, method });
```

---

## 8. Inheritance Rules

- Inheritance is allowed ONLY for:
  - Error hierarchies
  - Adapters
- Business logic inheritance is forbidden

Prefer composition.

---

## 9. Testing & Readability

A class is considered correct if:

- It can be instantiated in a unit test without mocks
- Its lifecycle is understandable from the constructor
- All state transitions are explicit

---

## 10. Canonical Class Template

```ts
export class Example {
  readonly #state: State;
  readonly #events: ExampleEvents;

  constructor(events: ExampleEvents) {
    this.#state = new State();
    this.#events = events;
  }

  get status(): Status {
    return this.#state.status;
  }

  execute(): void {
    if (!this.#state.canExecute()) {
      throw new InvalidLifecycleStateError(...);
    }

    this.#events.started();
    this.#state.advance();
  }
}
```

---

## Summary

> If the constructor does not tell the full story, the class is wrong.

Comity favors:

- Explicitness over brevity
- Lifecycle over convenience
- Semantics over syntax tricks
