---
id: result-pattern-examples
status: non-authoritative
version: 1.0.0
owner: @architecture-council
enforcement: none
last_reviewed: 2026-01-09
next_review: 2027-01-09
supersedes: []
---

# Result Pattern Examples

## Purpose

This document provides **comprehensive, practical examples** of implementing the `Result<T, E, D>` pattern with support for customizable discriminators. These examples show real-world usage patterns while maintaining compliance with all Standards.

This is a **Level 5: Pattern document** (non-authoritative, recommended approaches). It provides implementation guidance but does not create new rules.

**Reference Authority:** All patterns derive from the authoritative [Error Handling Standard §3](/docs/03-standards/error-handling.md#3-the-result-pattern-for-control-flow).

---

## Core Result Type Definition

### Implementation with Customizable Discriminator

```typescript
import type { BaseError } from "../errors/base.js";

/**
 * Success result contract.
 */
export type ResultSuccess<Value, Discriminator extends string = "success"> = {
  readonly value: Value;
  readonly meta?: Record<string, unknown>;
} & { readonly [K in Discriminator]: true };

/**
 * Failure result contract.
 */
export type ResultFailure<
  E extends BaseError = BaseError,
  Discriminator extends string = "success"
> = {
  readonly error: E;
} & { readonly [K in Discriminator]: false };

/**
 * Prevent using reserved discriminators.
 */
type PreventReservedDiscriminator<K extends string> = K extends "value"
  ? {
      _error: "Cannot use 'value' as discriminator. It's used for the success value.";
    }
  : K extends "error"
  ? {
      _error: "Cannot use 'error' as discriminator. It's used for the failure error.";
    }
  : K extends "meta"
  ? { _error: "Cannot use 'meta' as discriminator. It's used for metadata." }
  : K; // Valid key

/**
 * Generic result type for fallible operations.
 * Uses 'success' discriminator for semantic clarity.
 */
export type Result<
  Value,
  Error extends BaseError = BaseError,
  Discriminator extends string = "success"
> = PreventReservedDiscriminator<Discriminator> extends infer CheckedDiscriminator
  ? CheckedDiscriminator extends string
    ? ResultSuccess<Value, Discriminator> | ResultFailure<Error, Discriminator>
    : CheckedDiscriminator // Shows error object
  : never;
```

**Key Features:**

- **Default discriminator:** `success` (recommended for most cases)
- **Customizable:** Can use semantic discriminators per domain
- **Type-safe:** Prevents reserved words (`value`, `error`, `meta`)
- **Immutable:** All properties are `readonly`

---

## Example 1: Default Success Discriminator (Recommended)

### Standard Pattern for Most Use Cases

```typescript
// Default import - uses 'success' discriminator
import type { Result } from "../types/result.js";
import { BaseError } from "../errors/base.js";

// Domain error
class ValidationError extends BaseError {
  constructor(field: string, issue: string) {
    super("validation:invalid_field", `Field ${field} is invalid: ${issue}`, {
      field,
      issue,
    });
  }
}

// Function using default 'success' discriminator
function validateEmail(email: string): Result<string, ValidationError> {
  if (!email.includes("@")) {
    return {
      success: false, // Default discriminator
      error: new ValidationError("email", "must contain @"),
    };
  }

  return {
    success: true, // Default discriminator
    value: email.toLowerCase(),
    meta: { validatedAt: Date.now() },
  };
}

// Usage - standard pattern
const result = validateEmail("user@example.com");

if (result.success) {
  // TypeScript narrows to ResultSuccess
  console.log(`Valid email: ${result.value}`);
  // result.error ❌ Property 'error' does not exist
} else {
  // TypeScript narrows to ResultFailure
  console.error(`Invalid email: ${result.error.message}`);
  // result.value ❌ Property 'value' does not exist
}
```

**Recommendation:** Use default `success` discriminator for consistency unless domain semantics require customization.

---

## Example 2: Custom Discriminator for Authentication Domain

### Semantic Discriminators for Domain Clarity

```typescript
// Custom discriminator for auth domain
type AuthResult<T, E extends BaseError> = Result<T, E, "allowed">;

// Auth domain errors
class AuthError extends BaseError {
  constructor(
    code: string,
    message: string,
    meta: Record<string, unknown> = {}
  ) {
    super(`auth:${code}`, message, meta);
  }
}

class PermissionDeniedError extends AuthError {
  constructor(userId: string, resource: string) {
    super("permission_denied", `User ${userId} cannot access ${resource}`, {
      userId,
      resource,
    });
  }
}

// Auth function with semantic discriminator
function checkPermission(
  userId: string,
  resource: string,
  action: string
): AuthResult<boolean, PermissionDeniedError> {
  // Business logic
  const hasPermission = checkUserPermissions(userId, resource, action);

  if (!hasPermission) {
    return {
      allowed: false, // Custom discriminator
      error: new PermissionDeniedError(userId, resource),
    };
  }

  return {
    allowed: true, // Custom discriminator
    value: true,
    meta: {
      userId,
      resource,
      action,
      checkedAt: Date.now(),
    },
  };
}

// Usage with semantic discriminator
const authResult = checkPermission("user-123", "document-456", "read");

if (authResult.allowed) {
  // Semantic discriminator
  console.log(`Access ${authResult.value ? "granted" : "denied"}`);
  // Can access authResult.value (boolean)
} else {
  console.log(`Permission denied: ${authResult.error.message}`);
  // Can access authResult.error (PermissionDeniedError)
}

// Type safety example
function processAuthResult(result: AuthResult<boolean, AuthError>) {
  // These are compile-time errors:
  // if (result.success) { } // ❌ Property 'success' does not exist
  // if (result.ok) { }      // ❌ Property 'ok' does not exist

  // Correct:
  if (result.allowed) {
    // Handle allowed case
  } else {
    // Handle denied case
  }
}
```

**When to use custom discriminators:**

- Domain-specific semantics (auth → `allowed`, payment → `completed`)
- Team preference for semantic clarity
- Integration with existing code using different discriminators

---

## Example 3: Domain-Specific Discriminators

### Multiple Domains with Semantic Discriminators

```typescript
// Payment domain - 'completed' discriminator
type PaymentResult<T, E extends BaseError> = Result<T, E, "completed">;

class PaymentError extends BaseError {
  constructor(
    code: string,
    message: string,
    meta: Record<string, unknown> = {}
  ) {
    super(`payment:${code}`, message, meta);
  }
}

function processPayment(amount: number): PaymentResult<string, PaymentError> {
  try {
    const transactionId = chargeCreditCard(amount);

    return {
      completed: true,
      value: transactionId,
      meta: { amount, processedAt: Date.now() },
    };
  } catch (error) {
    return {
      completed: false,
      error: new PaymentError("failed", `Payment failed: ${error.message}`),
    };
  }
}

// Validation domain - 'valid' discriminator
type ValidationResult<T, E extends BaseError> = Result<T, E, "valid">;

function validateUserInput(
  input: unknown
): ValidationResult<UserInput, ValidationError> {
  if (typeof input !== "object" || input === null) {
    return {
      valid: false,
      error: new ValidationError("input", "must be an object"),
    };
  }

  return {
    valid: true,
    value: input as UserInput,
    meta: { validatedFields: Object.keys(input) },
  };
}

// Usage across domains
async function checkoutProcess(userId: string, amount: number) {
  // Payment domain
  const paymentResult = processPayment(amount);

  if (paymentResult.completed) {
    console.log(`Payment ${paymentResult.value} completed`);

    // Validation domain
    const validationResult = validateUserInput({ userId, amount });

    if (validationResult.valid) {
      console.log(`Input valid:`, validationResult.value);
    } else {
      console.error(`Validation failed:`, validationResult.error);
    }
  } else {
    console.error(`Payment failed:`, paymentResult.error);
  }
}
```

**Consistency Recommendation:** Within a single domain, use consistent discriminators. Across domains, discriminators can vary for semantic clarity.

---

## Example 4: Type Safety with Reserved Discriminators

### Compile-Time Prevention of Invalid Discriminators

```typescript
// These are COMPILE-TIME ERRORS:

// ❌ Cannot use 'value' as discriminator
type InvalidResult1<T, E> = Result<T, E, "value">;
// Type error: { _error: "Cannot use 'value' as discriminator. It's used for the success value." }

// ❌ Cannot use 'error' as discriminator
type InvalidResult2<T, E> = Result<T, E, "error">;
// Type error: { _error: "Cannot use 'error' as discriminator. It's used for the failure error." }

// ❌ Cannot use 'meta' as discriminator
type InvalidResult3<T, E> = Result<T, E, "meta">;
// Type error: { _error: "Cannot use 'meta' as discriminator. It's used for metadata." }

// Valid discriminators:
type ValidResult1<T, E> = Result<T, E, "success">; // Default
type ValidResult2<T, E> = Result<T, E, "ok">; // Legacy support
type ValidResult3<T, E> = Result<T, E, "allowed">; // Auth domain
type ValidResult4<T, E> = Result<T, E, "completed">; // Payment domain
type ValidResult5<T, E> = Result<T, E, "valid">; // Validation domain
type ValidResult6<T, E> = Result<T, E, "passed">; // Testing domain

// Runtime validation helper
function createResult<T, E extends BaseError, D extends string>(
  discriminator: D,
  isSuccess: boolean,
  valueOrError: T | E,
  meta?: Record<string, unknown>
): Result<T, E, D> {
  // Type guard to ensure discriminator is valid
  const reserved = ["value", "error", "meta"];
  if (reserved.includes(discriminator)) {
    throw new Error(`Cannot use reserved discriminator: ${discriminator}`);
  }

  if (isSuccess) {
    return {
      [discriminator]: true,
      value: valueOrError as T,
      ...(meta && { meta }),
    } as Result<T, E, D>;
  } else {
    return {
      [discriminator]: false,
      error: valueOrError as E,
    } as Result<T, E, D>;
  }
}

// Usage with dynamic discriminator
const authResult = createResult("allowed", true, true, { userId: "123" });
// Type: Result<boolean, BaseError, 'allowed'>

const paymentResult = createResult(
  "completed",
  false,
  new PaymentError("failed", "Card declined")
);
// Type: Result<never, PaymentError, 'completed'>
```

---

## Example 5: Utility Functions with Generic Discriminators

### Discriminator-Aware Helper Functions

```typescript
// Generic result utilities that work with any discriminator
namespace ResultUtils {
  // Factory function with custom discriminator
  export function success<T, D extends string = "success">(
    value: T,
    discriminator: D = "success" as D,
    meta?: Record<string, unknown>
  ): Result<T, never, D> {
    return {
      [discriminator]: true,
      value,
      ...(meta && { meta }),
    } as Result<T, never, D>;
  }

  // Failure factory
  export function failure<E extends BaseError, D extends string = "success">(
    error: E,
    discriminator: D = "success" as D
  ): Result<never, E, D> {
    return {
      [discriminator]: false,
      error,
    } as Result<never, E, D>;
  }

  // Map success value (preserves discriminator)
  export function map<T, U, E extends BaseError, D extends string>(
    result: Result<T, E, D>,
    mapper: (value: T) => U
  ): Result<U, E, D> {
    if ((result as any)[getDiscriminator(result)]) {
      const successResult = result as ResultSuccess<T, D>;
      return {
        ...successResult,
        value: mapper(successResult.value),
      };
    }
    return result as ResultFailure<E, D>;
  }

  // Extract discriminator from result
  function getDiscriminator<T, E extends BaseError, D extends string>(
    result: Result<T, E, D>
  ): D {
    // Find the discriminator property
    const keys = Object.keys(result) as (keyof Result<T, E, D>)[];
    const discriminator = keys.find(
      (k) => result[k] === true || result[k] === false
    );

    if (!discriminator) {
      throw new Error("Could not find discriminator in result");
    }

    return discriminator as D;
  }

  // Check if result is successful (works with any discriminator)
  export function isSuccess<T, E extends BaseError, D extends string>(
    result: Result<T, E, D>
  ): result is ResultSuccess<T, D> {
    const discriminator = getDiscriminator(result);
    return result[discriminator] === true;
  }

  // Check if result failed
  export function isFailure<T, E extends BaseError, D extends string>(
    result: Result<T, E, D>
  ): result is ResultFailure<E, D> {
    return !isSuccess(result);
  }
}

// Usage examples
const defaultSuccess = ResultUtils.success(42); // Uses 'success' discriminator
const authSuccess = ResultUtils.success(true, "allowed", { userId: "123" });
const paymentFailure = ResultUtils.failure(
  new PaymentError("declined", "Card declined"),
  "completed"
);

// Type-safe checks
if (ResultUtils.isSuccess(authSuccess)) {
  console.log(`Allowed: ${authSuccess.value}`);
  // Can access authSuccess.value
}

if (ResultUtils.isFailure(paymentFailure)) {
  console.log(`Payment failed: ${paymentFailure.error.message}`);
  // Can access paymentFailure.error
}
```

---

## Example 6: Migration and Compatibility

### Supporting Multiple Discriminator Patterns

```typescript
// Legacy code using 'ok' discriminator
type LegacyResult<T, E> =
  | { ok: true; value: T; meta?: Record<string, unknown> }
  | { ok: false; error: E };

// Adapter function to convert legacy to new format
function fromLegacy<T, E extends BaseError>(
  legacy: LegacyResult<T, E>,
  discriminator: string = "success"
): Result<T, E> {
  if (legacy.ok) {
    return {
      [discriminator]: true,
      value: legacy.value,
      ...(legacy.meta && { meta: legacy.meta }),
    } as Result<T, E>;
  } else {
    return {
      [discriminator]: false,
      error: legacy.error,
    } as Result<T, E>;
  }
}

// Convert new format to legacy (for compatibility)
function toLegacy<T, E extends BaseError, D extends string>(
  result: Result<T, E, D>
): LegacyResult<T, E> {
  const discriminator = Object.keys(result).find(
    (k) =>
      result[k as keyof typeof result] === true ||
      result[k as keyof typeof result] === false
  ) as D;

  if (result[discriminator]) {
    const success = result as ResultSuccess<T, D>;
    return {
      ok: true,
      value: success.value,
      ...(success.meta && { meta: success.meta }),
    };
  } else {
    const failure = result as ResultFailure<E, D>;
    return {
      ok: false,
      error: failure.error,
    };
  }
}

// Progressive migration example
class MigrationService {
  // Phase 1: Accept both formats
  processResult<T, E extends BaseError>(
    result: LegacyResult<T, E> | Result<T, E>
  ): void {
    // Convert to unified format internally
    const unified = "ok" in result ? fromLegacy(result) : result;

    // Process with new format
    this.processUnifiedResult(unified);
  }

  // Phase 2: Internal new format
  private processUnifiedResult<T, E extends BaseError>(
    result: Result<T, E>
  ): void {
    if (result.success) {
      this.handleSuccess(result.value, result.meta);
    } else {
      this.handleFailure(result.error);
    }
  }

  // Phase 3: External API returns new format
  getResult(): Result<number, BaseError> {
    return {
      success: true,
      value: 42,
      meta: { generatedAt: Date.now() },
    };
  }
}
```

---

## Example 7: Testing with Custom Discriminators

### Test Utilities for Discriminator-Aware Results

```typescript
// Test helpers that work with any discriminator
describe("Custom discriminator results", () => {
  // Helper to assert success with any discriminator
  function assertSuccess<T, E extends BaseError, D extends string>(
    result: Result<T, E, D>,
    expectedDiscriminator?: D,
    expectedValue?: T
  ): asserts result is ResultSuccess<T, D> {
    // Find discriminator
    const keys = Object.keys(result) as D[];
    const discriminator = keys.find(
      (k) => result[k] === true || result[k] === false
    );

    expect(discriminator).toBeDefined();

    if (expectedDiscriminator) {
      expect(discriminator).toBe(expectedDiscriminator);
    }

    expect(result[discriminator!]).toBe(true);

    if (expectedValue !== undefined) {
      expect((result as ResultSuccess<T, D>).value).toEqual(expectedValue);
    }
  }

  // Helper to assert failure
  function assertFailure<T, E extends BaseError, D extends string>(
    result: Result<T, E, D>,
    expectedDiscriminator?: D,
    expectedErrorCode?: string
  ): asserts result is ResultFailure<E, D> {
    const keys = Object.keys(result) as D[];
    const discriminator = keys.find(
      (k) => result[k] === true || result[k] === false
    );

    expect(discriminator).toBeDefined();

    if (expectedDiscriminator) {
      expect(discriminator).toBe(expectedDiscriminator);
    }

    expect(result[discriminator!]).toBe(false);

    if (expectedErrorCode) {
      expect((result as ResultFailure<E, D>).error.code).toBe(
        expectedErrorCode
      );
    }
  }

  test("auth result with allowed discriminator", () => {
    const result: AuthResult<boolean, PermissionDeniedError> = {
      allowed: true,
      value: true,
      meta: { userId: "123" },
    };

    assertSuccess(result, "allowed", true);
    expect(result.meta?.userId).toBe("123");
  });

  test("payment result with completed discriminator", () => {
    const error = new PaymentError("declined", "Card declined");
    const result: PaymentResult<string, PaymentError> = {
      completed: false,
      error,
    };

    assertFailure(result, "completed", "payment:declined");
    expect(result.error.message).toContain("Card declined");
  });

  test("type error for reserved discriminator", () => {
    // This should be a compile-time error:
    // type Test = Result<number, BaseError, 'value'>;
    // Expect TypeScript error: Cannot use 'value' as discriminator

    // Runtime check
    expect(() => {
      createResult("value", true, 42);
    }).toThrow("Cannot use reserved discriminator: value");
  });
});
```

---

## Best Practices and Recommendations

### 1. Default Discriminator Usage

**Use `success` as default:**

```typescript
// ✅ Recommended for most cases
type UserResult = Result<User, UserError>;
// Uses 'success' discriminator by default

// Only customize when domain semantics require it
type AuthResult = Result<boolean, AuthError, "allowed">;
// Custom discriminator for semantic clarity
```

### 2. Domain Consistency

**Within a domain, be consistent:**

```typescript
// ✅ Consistent within auth domain
type AuthCheckResult = Result<boolean, AuthError, "allowed">;
type AuthTokenResult = Result<string, AuthError, "allowed">;

// ❌ Inconsistent (avoid)
type AuthCheckResult = Result<boolean, AuthError, "allowed">;
type AuthTokenResult = Result<string, AuthError, "success">; // Mixed
```

### 3. Discriminator Naming Guidelines

**Choose semantic, clear names:**

- Authentication: `allowed`, `authenticated`, `verified`
- Payments: `completed`, `processed`, `settled`
- Validation: `valid`, `passed`, `acceptable`
- Testing: `passed`, `failed`
- Approvals: `approved`, `rejected`

**Avoid:**

- Generic: `result`, `status`, `state` (too vague)
- Negative: `failed`, `error` (use boolean discriminator value instead)
- Reserved: `value`, `error`, `meta` (compile-time prevented)

### 4. Migration Strategy

**Gradual migration if changing discriminators:**

1. Support both discriminators temporarily
2. Update consumers to handle new discriminator
3. Remove old discriminator support
4. Update tests to use new discriminator

### 5. Type Safety Enforcement

**Leverage TypeScript for safety:**

```typescript
// Compile-time prevention of invalid discriminators
type Invalid = Result<number, Error, "value">; // ❌ Compile error

// Use discriminated unions for type narrowing
if (result.allowed) {
  // TypeScript knows result.value exists
  // TypeScript knows result.error does not exist
}
```

---

## Common Questions and Answers

### Q: When should I use a custom discriminator?

**A:** When the domain has clear semantic alternatives to "success". For example, authentication results are better described as "allowed" vs "not allowed" rather than "success" vs "failure".

### Q: Can I use different discriminators in the same module?

**A:** It's possible but not recommended. Consistency within a module helps with predictability and reduces cognitive load.

### Q: How do I handle results with unknown discriminators?

**A:** Use the `ResultUtils.isSuccess()` and `ResultUtils.isFailure()` helpers which work with any discriminator.

### Q: What about performance with dynamic discriminators?

**A:** The discriminator is known at compile time, so there's no runtime performance impact. TypeScript eliminates the discriminated property at runtime.

### Q: How do I document which discriminator a function uses?

**A:** Include it in JSDoc:

```typescript
/**
 * Checks user permissions.
 * @returns Result with 'allowed' discriminator
 */
function checkPermission(): Result<boolean, AuthError, "allowed"> {
  // ...
}
```

---

## References

- [Error Handling Standard](/docs/03-standards/error-handling.md) - Authoritative source for Result pattern requirements
- [Terminology](/docs/00-constitution/terminology.md) - Definitions of BaseError and Result pattern
- [Type Safety Standard](/docs/03-standards/type-safety.md) - Type patterns and discriminated unions
- [Implementation Source](../types/result.js) - Actual Result type implementation

---

## Amendment History

_2026-01-09_: Initial version - Custom discriminator support examples  
_2026-01-09_: Updated to reflect actual implementation with customizable discriminators

---

**Important:** While custom discriminators are supported, the default `success` discriminator is recommended for consistency across most code. Custom discriminators should be used judiciously for clear semantic benefits within specific domains.
