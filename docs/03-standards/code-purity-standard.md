---
id: core-purity
status: authoritative
version: 1.0.0
owner: @architecture-council
enforcement: block
last_reviewed: 2026-01-08
next_review: 2027-01-08
supersedes: []
---

# Core Purity Standard

## Purpose

This document defines **mandatory rules specific to Core layer purity** in Comity architecture. It specifies constraints that ensure Core layer functions are deterministic, side-effect free, and independent of external systems.

**Core Guarantee:** Code in the Core layer can execute in any environment (Node.js, browser, test runner) without modification and will produce identical results given identical inputs.

This is a **Level 3: Authoritative Standard**. Violations block merges.

---

## Scope

This Standard applies exclusively to code in the Core layer:

- All files in `/core/` directory and subdirectories
- TypeScript/JavaScript files implementing domain logic
- Type definitions for domain concepts

**Excluded from this Standard's rules:**

- Error handling patterns (defined in Error Handling Standard)
- Type safety patterns (will be defined in Type Safety Standard)
- Code review procedures (defined in Documentation Governance)
- AI generation constraints (defined in AI Governance)

---

## 1. Input/Output Prohibitions

### 1.1 Network Operations Prohibition

**Rule 1.1.1:** Core layer MUST NOT perform network operations.

**Detectable Violations:** Static analysis can detect:

```typescript
fetch(), axios.*(), http.*(), WebSocket,
socket.*(), net.*(), dgram.*(), https.*()
```

**Enforcement:** CI/CD static analysis. Violations block merge.

### 1.2 Filesystem Operations Prohibition

**Rule 1.2.1:** Core layer MUST NOT perform filesystem operations.

**Detectable Violations:** Static analysis can detect:

```typescript
fs.*(), require() with dynamic paths,
import() with side effects, path.*() with IO
```

**Enforcement:** CI/CD static analysis. Violations block merge.

### 1.3 Database Operations Prohibition

**Rule 1.3.1:** Core layer MUST NOT perform database operations.

**Detectable Violations:** Static analysis can detect:

```typescript
db.*(), sql.*(), knex(), sequelize.*(),
mongoose.*(), typeorm.*(), redis.*()
```

**Enforcement:** CI/CD static analysis. Violations block merge.

### 1.4 Environment Access Prohibition

**Rule 1.4.1:** Core layer MUST NOT access environment or runtime context.

**Detectable Violations:** Static analysis can detect:

```typescript
process.env, Deno.env, window.*, document.*,
globalThis, global, self, location.*
```

**Enforcement:** CI/CD static analysis. Violations block merge.

---

## 2. State Management Prohibitions

### 2.1 Global State Prohibition

**Rule 2.1.1:** Core layer MUST NOT use global variables.

**Detectable Violations:** Static analysis can detect:

```typescript
global.* = , window.* = , self.* = ,
top.* = , parent.* = , frames.* =
```

**Enforcement:** CI/CD static analysis. Violations block merge.

### 2.2 Singleton Pattern Prohibition

**Rule 2.2.1:** Core layer MUST NOT implement singleton patterns.

**Detection Method:** Manual code review for patterns:

```typescript
class Service {
  private static instance: Service;
  static getInstance() {
    /* singleton */
  } // ❌
}
```

**Enforcement:** Manual code review. Violations block merge.

### 2.3 Static Mutable State Prohibition

**Rule 2.3.1:** Core layer MUST NOT use static mutable state.

**Detectable Violations:** Static analysis can detect:

```typescript
static property = value; // Mutable
static property: Type = value; // Mutable
```

**Allowed:** `static readonly` and `static const` declarations.

**Enforcement:** CI/CD static analysis. Violations block merge.

---

## 3. Framework & Transport Prohibitions

### 3.1 Framework Type Prohibition

**Rule 3.1.1:** Core layer MUST NOT import framework-specific types.

**Detectable Violations:** Static analysis can detect imports from:

```typescript
"express", "react", "@angular/*", "vue", "fastify", "koa", "nestjs/*", "redux";
```

**Enforcement:** CI/CD import analysis. Violations block merge.

### 3.2 HTTP Concept Prohibition

**Rule 3.2.1:** Core layer MUST NOT reference HTTP-specific concepts.

**Detection Method:** Manual review for:

```typescript
headers, cookies, query, params, status codes,
request/response, middleware, routes
```

**Enforcement:** Manual code review. Violations block merge.

### 3.3 Transport Protocol Prohibition

**Rule 3.3.1:** Core layer MUST NOT reference transport protocol details.

**Detection Method:** Manual review for:

```typescript
topics, partitions, queues, exchanges, protocols(HTTP, gRPC, WebSocket, MQTT);
```

**Enforcement:** Manual code review. Violations block merge.

---

## 4. Determinism Requirements

### 4.1 Explicit Time Parameter Requirement

**Rule 4.1.1:** Time-dependent logic MUST receive current time as explicit parameter.

**Detectable Violations:** Static analysis can detect:

```typescript
Date.now(), new Date(), Date.parse(), performance.now(), process.hrtime();
```

**Required Pattern:**

```typescript
function isValid(token: Token, now: number): boolean {
  return token.expiresAt > now; // ✅ Explicit parameter
}
```

**Enforcement:** CI/CD static analysis. Violations block merge.

### 4.2 Explicit Random Source Requirement

**Rule 4.2.1:** Random number generation MUST use explicit random source.

**Detectable Violations:** Static analysis can detect:

```typescript
Math.random(), crypto.getRandomValues() without parameter
```

**Required Pattern:**

```typescript
function generateId(random: () => number): string {
  return `id_${random()}`; // ✅ Explicit source
}
```

**Enforcement:** CI/CD static analysis. Violations block merge.

### 4.3 Pure Function Requirement

**Rule 4.3.1:** Core functions MUST not have observable side effects.

**Detection Method:** Manual review for side effects:

```typescript
console.log(), console.*(),
external state modification,
asynchronous callbacks with side effects
```

**Verification:** Functions should be testable without mocking side effects.

**Enforcement:** Manual code review. Violations block merge.

---

## 5. Testability Requirements

### 5.1 No Mocking Requirement

**Rule 5.1.1:** Core functions MUST be testable with plain objects.

**Verification Method:** Tests MUST NOT require:

- Mocked external services
- Special test environment setup
- Network or database connectivity

**Detection:** Test code review for `jest.mock()`, `vi.mock()`, mocking libraries.

**Enforcement:** Manual test review. Violations require fix.

### 5.2 Explicit Dependency Requirement

**Rule 5.2.1:** Dependencies MUST be explicit function parameters.

**Prohibited Pattern:**

```typescript
function processOrder(order: Order) {
  const repo = getOrderRepository(); // ❌ Implicit
  return repo.save(order);
}
```

**Required Pattern:**

```typescript
function processOrder(order: Order, repo: OrderRepository) {
  return repo.save(order); // ✅ Explicit
}
```

**Enforcement:** Manual code review. Violations require fix.

### 5.3 Deterministic Test Requirement

**Rule 5.3.1:** Core logic MUST produce identical results in tests regardless of execution time.

**Verification:** Tests MUST pass when:

- Executed at different times
- Time is mocked to past/future values
- Run in different timezones

**Enforcement:** CI/CD test suite with time mocking. Violations require fix.

---

## 6. Port Definition Rules

### 6.1 Port Interface Location

**Rule 6.1.1:** Interfaces for external capabilities MUST be defined in Core.

**Required Location:** `/core/ports/[capability].port.ts`

**Example:**

```typescript
// /core/ports/user.repository.port.ts
export interface UserRepository {
  findById(id: UserId): Promise<Result<User, NotFoundError>>;
  save(user: User): Promise<Result<void, RepositoryError>>;
}
```

**Enforcement:** CI/CD directory structure validation. Violations block merge.

### 6.2 Port Interface Purity

**Rule 6.2.1:** Port interfaces MUST NOT contain implementation details.

**Prohibited in Ports:**

```typescript
// ❌ Implementation details
connectionString: string;
poolSize: number;
cacheStrategy: "lru" | "fifo";
```

**Enforcement:** Manual interface review. Violations require fix.

### 6.3 Contract Boundary Definition

**Rule 6.3.1:** Core MUST define contracts for all external interactions.

**Required Contracts:**

- Repository interfaces for data persistence
- Service interfaces for external services
- Event interfaces for domain events
- Gateway interfaces for system boundaries

**Enforcement:** Manual architecture review. Missing contracts require fix.

---

## 7. Compliance Verification

### 7.1 Automated Validation Requirements

**Rule 7.1.1:** CI/CD MUST validate prohibitions with static analysis.

**Required Checks:**

- Network operation detection (Rule 1.1.1)
- Filesystem operation detection (Rule 1.2.1)
- Environment access detection (Rule 1.4.1)
- Framework import detection (Rule 3.1.1)
- Implicit time usage detection (Rule 4.1.1)

**Enforcement:** CI/CD pipeline. Missing validation blocks Standard updates.

### 7.2 Manual Verification Requirements

**Rule 7.2.1:** Rules requiring manual verification MUST have objective criteria.

**Manual Verification Checklist:**

- [ ] No singleton patterns (Rule 2.2.1)
- [ ] No HTTP concepts (Rule 3.2.1)
- [ ] No transport protocol details (Rule 3.3.1)
- [ ] No observable side effects (Rule 4.3.1)
- [ ] Port interfaces are pure (Rule 6.2.1)

**Enforcement:** Code review against checklist. Missing verification requires re-review.

### 7.3 Test Suite Requirements

**Rule 7.3.1:** Core test suite MUST validate determinism.

**Required Test Patterns:**

```typescript
describe("determinism", () => {
  test("produces same result at different times", () => {
    const result1 = functionUnderTest(input, Date.now());
    const result2 = functionUnderTest(input, Date.now() + 1000);
    expect(result1).toEqual(result2);
  });
});
```

**Enforcement:** CI/CD test execution. Missing tests require fix.

---

## 8. Exception Handling

### 8.1 Permitted Exceptions

The following ARE permitted in Core despite general prohibitions:

**8.1.1 Programmer Error Assertions:**

```typescript
function assert(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}
```

**8.1.2 Unreachable Code Markers:**

```typescript
function assertUnreachable(x: never): never {
  throw new Error(`Unreachable: ${String(x)}`);
}
```

**8.1.3 Type Guards with Validation:**

```typescript
function isUser(obj: unknown): obj is User {
  // Pure validation logic permitted
  return typeof obj === "object" && obj !== null && "id" in obj;
}
```

### 8.2 Emergency Procedure

**Rule 8.2.1:** Temporary violations require authorized divergence.

**Requirements for Exception:**

1. ADR authorizing the Core purity violation
2. Divergence ticket with explicit sunset date
3. Comment in code explaining the exception
4. Plan to restore purity before sunset

**Enforcement:** CI/CD divergence ticket validation. Missing authorization blocks merge.

---

## 9. References

- [Error Handling Standard](/docs/03-standards/error-handling.md) - For error patterns in Core
- [Code Review Procedures](/docs/03-standards/code-review-verification-procedures-verification-procedures) - For verification procedures
- [Terminology](/docs/00-constitution/terminology.md) - "Core layer" definition
- [Documentation Governance](/docs/00-constitution/documentation-governance.md) - Review procedures
- [Philosophy](/docs/02-principles/philosophy.md#2-the-sacred-core) - Rationale for Core purity

**Note:** Type safety patterns will be defined in a separate Type Safety Standard.

---

## 10. Compliance Statement

This Standard complies with Constitutional Axioms:

- **Axiom 2:** Level 3 Standard, under Constitutional Axioms
- **Axiom 3:** Single authoritative source for Core purity rules only
- **Axiom 8:** Every rule specifies verification method (CI/CD or manual)
- **Axiom 9:** Uses canonical terminology; introduces no new terms

This Standard does NOT duplicate rules from other Standards. It focuses exclusively on Core layer purity constraints.

---

## 11. Amendment History

_2026-01-08_: Initial version - Core purity rules only
