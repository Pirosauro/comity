# Comity Coding Standards — Testing

This document defines how testing is approached across the Comity ecosystem.

Testing in Comity is **structural**, **behavioral**, and **layer-aware**.

---

## 1. Core Philosophy

> Test behavior, not implementations.

Tests must validate:

- Contracts
- Invariants
- Public behavior

Tests must NOT:

- Lock internal implementations
- Assert incidental details
- Duplicate production logic

---

## 2. Testing Layers

Comity code is tested at different layers with different goals.

### 2.1 Primitives

**Goal:** Guarantee semantic correctness.

Test:

- Types and contracts
- Invariants
- Edge cases

Do NOT test:

- Integration
- Runtime behavior
- Side effects

Primitives tests should:

- Be pure
- Be deterministic
- Have zero mocks

---

### 2.2 Kernel

**Goal:** Validate orchestration and lifecycle.

Test:

- Lifecycle transitions
- Module registration
- Event propagation
- Error conditions

Do NOT test:

- Business logic
- Adapter behavior
- Framework integration

Kernel tests may:

- Use minimal test doubles
- Simulate modules
- Assert ordering and state transitions

---

### 2.3 Modules

**Goal:** Validate module contracts.

Test:

- Public APIs
- Setup behavior
- Event emission
- Hook execution

Do NOT test:

- Kernel internals
- Adapter translation
- External I/O

Modules SHOULD:

- Be testable without adapters
- Expose deterministic behavior
- Avoid global state

---

### 2.4 Adapters

**Goal:** Validate translation correctness.

Test:

- Input → context mapping
- Result → output mapping
- Error translation

Do NOT test:

- Module internals
- Kernel lifecycle logic
- Domain rules

Adapter tests MAY:

- Use real frameworks
- Use integration-style tests
- Depend on runtime environments

---

## 3. Test Types

### 3.1 Unit Tests

Used for:

- Primitives
- Small kernel components
- Pure functions

Characteristics:

- Fast
- Isolated
- No I/O

---

### 3.2 Integration Tests

Used for:

- Kernel + modules
- Module interactions
- Adapter + facade

Characteristics:

- Multiple components
- Real execution paths
- Controlled environment

---

### 3.3 Contract Tests

Used for:

- Facades
- Public APIs
- Adapter compatibility

Characteristics:

- Validate shape and behavior
- Prevent breaking changes
- Stable over time

---

## 4. Error Testing

All error tests MUST:

- Assert error type
- Assert error code
- Assert semantic meaning

Do NOT:

- Assert exact error messages
- Depend on stack traces

Example:

```ts
expect(error).toBeInstanceOf(BaseError);
expect(error.code).toBe("core:invalid-lifecycle-state");
```

---

## 5. Events & Hooks Testing

Events:

- Should be tested as signals
- Never as control flow

Hooks:

- Should be tested for invocation
- Not for side effects

Do NOT:

- Depend on event ordering unless specified
- Assert on event listeners implementation

---

## 6. Mocks & Fakes

Preferred order:

1. Real implementations
2. Fakes
3. Mocks (last resort)

Avoid:

- Deep mocks
- Framework mocks
- Mocking primitives

If mocking is required:

- Mock at boundaries only
- Keep mocks minimal and explicit

---

## 7. Snapshot Testing

Snapshot tests are:

- Allowed for adapters
- Discouraged for primitives
- Forbidden for kernel state

Snapshots must:

- Represent stable output
- Avoid timestamps and IDs

---

## 8. Naming Conventions

Test files:

- `*.test.ts` or `*.spec.ts`

Describe blocks:

- Use behavior-focused language
- Avoid implementation names

Example:

```ts
describe("HTTP facade", () => {
  it("finalizes the response exactly once", () => {});
});
```

---

## 9. Performance Tests

Performance tests:

- Are optional
- Must be isolated
- Must not block CI by default

Performance regressions should:

- Be measured explicitly
- Be documented, not guessed

---

## 10. What Not to Test

Never test:

- TypeScript compiler behavior
- Third-party libraries
- Language features
- Framework internals

If a test fails because a dependency changed, it is the wrong test.

---

## Summary

Good Comity tests:

- Protect contracts
- Enable refactoring
- Reflect architecture

If a test breaks when internals change but behavior does not, the test is wrong.
