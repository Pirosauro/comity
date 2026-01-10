---
id: type-safety
status: authoritative
version: 1.0.0
owner: @architecture-council
enforcement: block
last_reviewed: 2026-01-08
next_review: 2027-01-08
supersedes: []
---

# Type Safety Standard

## Purpose

This document defines **mandatory type safety rules** for Comity. It specifies how TypeScript's type system must be used to enforce domain invariants at compile time.

**Architectural Principle:** Invalid program states should be unrepresentable in the type system. Compile-time type errors are preferable to runtime logic errors.

This is a **Level 3: Authoritative Standard**. Violations block merges.

**Note:** Implementation patterns and coding conventions are defined in Patterns (Level 5), not in this Standard.

---

## Scope

This Standard applies to **all TypeScript code** in Comity projects, with special focus on:

- Public API signatures (exports, interfaces, type definitions)
- Domain modeling in Core layer
- Data crossing architectural boundaries
- Error type definitions

**Excluded:**

- Test files (may use type assertions for test setup)
- Build scripts and configuration
- Generated code (must comply but validation is post-generation)

---

## 1. Primitive Type Prohibitions

### 1.1 Domain Primitive Representation

**Rule 1.1.1:** Domain concepts MUST NOT be represented by primitive types (`string`, `number`, `boolean`) in public APIs.

**Violation Examples:**

```typescript
// ❌ VIOLATIONS
function getUser(id: string): Promise<User>; // Should be UserId
function calculateTax(amount: number): number; // Should be MonetaryAmount
function isFeatureEnabled(feature: string): boolean; // Should be FeatureName
```

**Enforcement:** CI/CD static analysis detecting primitive types in public API signatures where domain concepts are expected. Violations block merge.

### 1.2 Any Type Prohibition

**Rule 1.2.1:** The `any` type MUST NOT appear in:

- Public exports (functions, classes, interfaces, type aliases)
- Core layer type definitions
- Contract definitions (Level 4 documents)
- Type definitions that cross architectural boundaries

**Allowed Exception:** `any` MAY be used temporarily within private implementation functions during legacy code migration, provided a divergence ticket exists with sunset date.

**Enforcement:** CI/CD static analysis with `no-explicit-any` rule enabled. Violations block merge.

### 1.3 External Data Handling

**Rule 1.3.1:** Data from external systems MUST be typed as `unknown` before validation.

**Required Pattern:**

```typescript
// ✅ COMPLIANT
function parseApiResponse(raw: unknown): Result<UserData, ValidationError> {
  const validation = validateUserSchema(raw); // Returns Result<UserData, ValidationError>
  return validation; // Either success with validated data or failure
}
```

**Prohibited Pattern:**

```typescript
// ❌ VIOLATION
function parseApiResponse(raw: any): UserData {
  return raw as UserData; // Unsafe assumption
}
```

**Enforcement:** Manual code review at system boundaries. Violations require fix.

---

## 2. Branded Types Requirements

**Note:** "Branded types" refer to the TypeScript pattern `type T = BaseType & { readonly __brand: 'T' }` used to create nominal types from structural primitives.

### 2.1 Domain Primitive Branding

**Rule 2.1.1:** Domain primitive types MUST use branded types.

**Required Pattern:**

```typescript
// ✅ COMPLIANT - In /core/types/domain-primitives.ts
export type UserId = string & { readonly __brand: "UserId" };
export type EmailAddress = string & { readonly __brand: "EmailAddress" };
export type MonetaryAmount = number & { readonly __brand: "MonetaryAmount" };
```

**Enforcement:** CI/CD detection of primitive types in domain modeling contexts. Violations block merge.

### 2.2 Branded Type Construction

**Rule 2.2.1:** Branded types MUST be constructed through validation functions.

**Required Pattern:**

```typescript
// ✅ COMPLIANT
export function createUserId(id: string): Result<UserId, ValidationError> {
  if (!isValidUserId(id)) {
    return {
      success: false,
      error: new ValidationError("domain:invalid_user_id", "Invalid user ID"),
    };
  }
  return { success: true, value: id as UserId };
}
```

**Prohibited Pattern:**

```typescript
// ❌ VIOLATION
const userId: UserId = "user-123" as UserId; // Unsafe cast without validation
```

**Enforcement:** Manual code review of branded type instantiation. Violations require fix.

### 2.3 Branded Type Usage

**Rule 2.3.1:** Functions receiving branded types MUST NOT re-validate the brand invariant.

**Required Pattern:**

```typescript
// ✅ COMPLIANT - Trust the type system
function sendNotification(
  userId: UserId,
  message: string
): Promise<Result<void, Error>> {
  // No need to validate userId - type guarantees validity
  return notificationService.send({ userId, message });
}
```

**Enforcement:** Manual code review for unnecessary re-validation. Violations require fix.

---

## 3. Discriminated Unions Requirements

**Note:** "Discriminated unions" refer to TypeScript union types where each member has a discriminant property enabling type narrowing.

### 3.1 State Representation

**Rule 3.1.1:** State machines and modal types MUST use discriminated unions.

**Required Pattern:**

```typescript
// ✅ COMPLIANT
export type DataLoadState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: BaseError };

export type AuthenticationState =
  | { state: "unauthorized" }
  | { state: "authenticating" }
  | { state: "authenticated"; userId: UserId; sessionExpires: number }
  | { state: "failed"; error: AuthError };
```

**Enforcement:** Manual code review of state representation. Violations require fix.

### 3.2 Exhaustiveness Enforcement

**Rule 3.2.1:** Code handling discriminated unions MUST be statically verifiable as exhaustive.

**Required:** TypeScript compiler options MUST include:

```json
{
  "noFallthroughCasesInSwitch": true,
  "noImplicitReturns": true
}
```

**Enforcement:** CI/CD TypeScript compilation. Violations block merge.

### 3.3 Boolean State Flag Prohibition

**Rule 3.3.1:** Multiple boolean properties representing state MUST be replaced with a discriminated union.

**Violation Example:**

```typescript
// ❌ VIOLATION
interface Order {
  isProcessing: boolean;
  isShipped: boolean;
  isDelivered: boolean;
  isCancelled: boolean;
  // Creates 2⁴ = 16 possible states, many invalid
}
```

**Required Pattern:**

```typescript
// ✅ COMPLIANT
type OrderStatus =
  | { status: "processing" }
  | { status: "shipped"; trackingId: string }
  | { status: "delivered"; deliveredAt: number }
  | { status: "cancelled"; cancelledAt: number; reason: string };
```

**Enforcement:** Manual code review for boolean state combinations. Violations require fix.

---

## 4. Immutability Requirements

### 4.1 Public API Immutability

**Rule 4.1.1:** Public API return types representing domain data MUST use readonly/immutable types.

**Required Pattern:**

```typescript
// ✅ COMPLIANT
export interface UserService {
  getUser(id: UserId): Promise<Result<Readonly<User>, NotFoundError>>;
  searchUsers(query: string): Promise<Result<ReadonlyArray<User>, Error>>;
}

export type Configuration = Readonly<{
  apiUrl: string;
  timeout: number;
  retries: number;
}>;
```

**Enforcement:** CI/CD detection of mutable return types in public APIs. Violations block merge.

### 4.2 Configuration Immutability

**Rule 4.2.1:** Configuration objects MUST be declared with `as const` assertions.

**Required Pattern:**

```typescript
// ✅ COMPLIANT
export const ErrorCodes = {
  NOT_FOUND: "domain:not_found",
  VALIDATION_FAILED: "domain:validation_failed",
  UNAUTHORIZED: "domain:unauthorized",
} as const;

// Type is: 'domain:not_found' | 'domain:validation_failed' | 'domain:unauthorized'
export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];
```

**Enforcement:** CI/CD detection of mutable configuration patterns. Violations block merge.

---

## 5. Integration with Error Handling Standard

### 5.1 Error Type Definitions

**Rule 5.1.1:** Error code types MUST use string literal unions following the format defined in the Error Handling Standard.

**Required Pattern:**

```typescript
// ✅ COMPLIANT - References Error Handling Standard format
type AuthErrorCode =
  | "auth:invalid_token"
  | "auth:expired_token"
  | "auth:insufficient_permissions";

class AuthError extends BaseError {
  constructor(
    code: AuthErrorCode,
    message: string,
    meta: Record<string, unknown>
  ) {
    super(code, message, meta);
  }
}
```

**Enforcement:** Manual review of error type definitions. Violations require fix.

### 5.2 Result Type Usage

**Rule 5.2.1:** The `Result<T, E>` type MUST be used with explicitly typed error unions.

**Required Pattern:**

```typescript
// ✅ COMPLIANT
type UserOperationError = ValidationError | NotFoundError | PermissionError;

type UserOperationResult = Result<User, UserOperationError>;

async function updateUserProfile(
  userId: UserId,
  profile: UserProfile
): Promise<UserOperationResult> {
  // Implementation returns properly typed Result
}
```

**Enforcement:** CI/CD detection of untyped Promise rejections in public APIs. Violations require fix.

---

## 6. Integration with Core Purity Standard

### 6.1 Type-Only Imports

**Rule 6.1.1:** Core layer imports of Port interfaces MUST use type-only imports.

**Required Pattern:**

```typescript
// ✅ COMPLIANT - In Core layer
import type { UserRepository } from "../ports/user.repository.port";
import type { EventPublisher } from "../ports/event.publisher.port";

// Runtime imports only for concrete implementations
import { BaseError } from "../errors/base";
import { Result } from "../types/result";
```

**Enforcement:** CI/CD detection of runtime imports for Port interfaces in Core layer. Violations block merge.

### 6.2 Pure Interface Definitions

**Rule 6.2.1:** Interface definitions in Core MUST contain only method signatures, not implementation details.

**Violation Example:**

```typescript
// ❌ VIOLATION
interface UserService {
  // Implementation details in interface
  database: DatabaseConnection; // ❌
  cache: Map<string, User>; // ❌
  initialize(config: Config): void; // ❌ Setup method, not capability
}
```

**Required Pattern:**

```typescript
// ✅ COMPLIANT
interface UserService {
  getUser(id: UserId): Promise<Result<User, NotFoundError>>;
  createUser(user: NewUser): Promise<Result<User, ValidationError>>;
  updateUser(id: UserId, updates: Partial<User>): Promise<Result<User, Error>>;
}
```

**Enforcement:** Manual review of interface definitions. Violations require fix.

---

## 7. Compliance Verification

### 7.1 Automated Validation Requirements

**Rule 7.1.1:** CI/CD MUST validate the following rules automatically:

| Rule  | Validation Method           | Required Tooling             |
| ----- | --------------------------- | ---------------------------- |
| 1.1.1 | Primitive detection in APIs | Custom static analysis       |
| 1.2.1 | No explicit any             | TypeScript `no-explicit-any` |
| 3.2.1 | Exhaustiveness checking     | TypeScript strict options    |
| 4.1.1 | Readonly return types       | TypeScript type checking     |
| 4.2.1 | Const assertions            | TypeScript literal analysis  |
| 6.1.1 | Type-only imports           | Import statement analysis    |

**Enforcement:** CI/CD pipeline validation. Missing validations block Standard updates.

### 7.2 Manual Verification Checklist

Reviewers MUST verify compliance with:

**Branded Types (Section 2):**

- [ ] Domain primitives use branded types (2.1.1)
- [ ] Branded types created through validation (2.2.1)
- [ ] No unnecessary re-validation (2.3.1)

**Discriminated Unions (Section 3):**

- [ ] State represented with discriminated unions (3.1.1)
- [ ] No boolean state flag combinations (3.3.1)

**Error Handling Integration (Section 5):**

- [ ] Error codes follow `domain:error_type` format (5.1.1)
- [ ] Result types have explicit error unions (5.2.1)

**Enforcement:** Manual code review against checklist. Violations require fix.

### 7.3 TypeScript Configuration Requirements

**Rule 7.3.1:** All Comity projects MUST enable these TypeScript compiler options:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "noImplicitThis": true,
    "useUnknownInCatchVariables": true,
    "alwaysStrict": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "exactOptionalPropertyTypes": true,
    "noUncheckedIndexedAccess": true
  }
}
```

**Enforcement:** CI/CD TypeScript configuration validation. Violations block merge.

---

## 8. References

- [Error Handling Standard](/docs/03-standards/error-handling.md) - For error code format and Result pattern
- [Core Purity Standard](/docs/03-standards/core-purity.md) - For Core layer type constraints
- [Code Review Procedures](/docs/03-standards/code-review-verification-procedures-verification-procedures) - For verification procedures
- [Terminology](/docs/00-constitution/terminology.md) - Canonical definitions including "Branded Type", "Discriminated Union"

**Implementation Note:** Specific TypeScript patterns and helper utilities are documented in Patterns (Level 5), not in this Standard.

---

## 9. Compliance Statement

This Standard complies with Constitutional Axioms:

- **Axiom 2:** Level 3 Standard, references higher-level Constitutional documents
- **Axiom 3:** Does not duplicate rules; references Error Handling Standard for error patterns
- **Axiom 8:** Every rule specifies CI/CD or manual enforcement method
- **Axiom 9:** Uses terminology defined in Terminology document; introduces no new terms

This Standard contains only **normative rules** (`MUST`/`MUST NOT`). Guidance and recommendations are documented elsewhere.

---

## 10. Amendment History

_2026-01-08_: Initial version - Type safety rules only
