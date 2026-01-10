---
id: error-handling
status: authoritative
version: 1.0.0
owner: @architecture-council
enforcement: block
last_reviewed: 2026-01-08
next_review: 2027-01-08
supersedes: []
---

# Error Handling Standard

## Purpose

This document defines the **mandatory, normative rules** for representing, propagating, and handling errors in Comity systems.

It makes the architectural Principle **["Errors Are Domain Objects"](/docs/02-principles/philosophy.md#4-errors-are-domain-objects)** enforceable by specifying concrete, verifiable constraints.

This is a **Level 3: Authoritative Standard**. Violations are treated as architectural defects and block merges.

## Scope

This Standard applies to all code within the Comity repository, with explicit allowances noted per layer:

- **Core Layer:** Strict application. No exceptions.
- **Service Layer:** Full application.
- **Adapter Layer:** Full application for domain errors; framework-specific error translation patterns are allowed but must be documented.

UI code, build scripts, and configuration files are out of scope. External API clients must be informed of error serialization formats via API contracts.

## Relationship to Terminology

Canonical definitions for all terms used in this Standard (e.g., "Domain Error", "Result Pattern", "Error Code") are maintained in the [Terminology](/docs/00-constitution/terminology.md) document. This Standard provides the **normative rules** that implement those concepts.

## 1. Domain Errors as First-Class Objects

### 1.1 Rule: Typed Error Representation

1.  **MUST:** Domain errors MUST be represented as instances of typed classes.
2.  **MUST:** Domain error classes MUST extend the canonical `BaseError` class (or a domain-specific base class that itself extends `BaseError`).
3.  **MUST NOT:** Domain errors MUST NOT be represented as primitive strings, numbers, or `null`/`undefined`.
4.  **MUST NOT:** The generic JavaScript `Error` class MUST NOT be used for domain failures.

### 1.2 Rationale

Domain failures are meaningful data, not control flow artifacts. Representing them as structured, typed objects enables:

- Static type checking and autocompletion.
- Safe serialization for logging, events, and API responses.
- Programmatic matching, filtering, and transformation.
- Clear separation from programmer errors (bugs) and system errors (infrastructure failures).

## 2. Mandatory Error Structure

The `BaseError` class provides the minimal structure for all domain errors. All domain errors MUST conform to this structure.

### 2.1 Error Code

1.  **MUST:** Every error MUST have a machine-readable `code` property.
2.  **MUST:** The `code` MUST be stable across minor and patch versions of the system. Changing a code is a breaking change.
3.  **MUST:** The `code` MUST follow the format: `domain:error_type`.
    - `domain`: A lowercase identifier for the bounded context or module (e.g., `auth`, `user`, `payment`).
    - `error_type`: A snake_case descriptor of the specific failure (e.g., `token_expired`, `insufficient_funds`, `validation_failed`).
4.  **Example:** `auth:token_invalid`, `user:email_already_exists`

### 2.2 Error Message

1.  **MUST:** Every error MUST have a human-readable `message` property.
2.  **SHOULD:** The message SHOULD be helpful and context-aware, but MUST NOT contain sensitive data (e.g., passwords, PII).
3.  **MAY:** The message MAY be dynamically generated using data from the `meta` field.

### 2.3 Error Metadata (`meta`)

1.  **MUST:** Every error MUST have a `meta` property of type `Record<string, unknown>`.
2.  **MUST:** The `meta` object MUST be JSON-serializable.
3.  **SHOULD:** The `meta` object SHOULD contain structured context relevant to the error (e.g., `{ userId: 'abc', field: 'email', attemptedValue: 'test' }`).
4.  **MUST NOT:** The `meta` object MUST NOT contain complex objects like class instances, functions, or circular references.

## 3. The Result Pattern for Control Flow

Expected domain failures MUST be communicated using the `Result<T, E>` pattern, where `E extends BaseError`.

### 3.1 Rule: Result Usage

1.  **MUST:** Any Core or Service layer function that can fail as part of normal business logic MUST return a `Result<T, E>` type.
2.  **MUST NOT:** Such functions MUST NOT throw exceptions for expected failures.
3.  **MUST:** Adapter layer functions that call Core/Service code MUST handle the `Result` type and translate failures to appropriate external representations (e.g., HTTP status codes).

### 3.2 Result Type Definition

The canonical `Result` type is defined as:

    type Result<T, E extends BaseError> =
      | { success: true; value: T; meta?: Record<string, unknown> }
      | { success: false; error: E };

### 3.3 Rationale

The Result pattern makes failure explicit in the type signature, enabling the compiler to enforce error handling and making control flow local and predictable.

## 4. Error Creation and Throwing

### 4.1 Rule: Error Instantiation

1.  **MUST:** Domain errors MUST be created using their constructor, providing `code`, `message`, and `meta`.
2.  **SHOULD:** Use factory functions or static methods for common error types to ensure consistency.

### 4.2 Rule: Exception Throwing

1.  **MUST NOT:** Domain errors MUST NOT be thrown for control flow.
2.  **MAY:** Programmer errors (e.g., invalid arguments, assertion failures) MAY still use `throw new Error(...)`. These indicate bugs.
3.  **MAY:** Adapters MAY need to catch exceptions from external libraries and convert them to domain errors within a `Result`.

## 5. Layer-Specific Guidelines

### 5.1 Core Layer

- **Strict Purity:** No `try/catch` blocks for domain logic. Use `Result` exclusively.
- **No Side Effects:** Error creation must be pure (no IO, no logging at creation time).

### 5.2 Service Layer

- **Orchestration:** May aggregate multiple `Result` failures into a single composite error.
- **Translation:** May map lower-level domain errors to higher-level use-case errors.

### 5.3 Adapter Layer

- **Catch Boundaries:** Must be the primary location for `try/catch` to isolate external library exceptions.
- **External Representation:** Responsible for translating `Result<E>` failures to appropriate external signals (e.g., HTTP 400/409/500 responses, specific error response bodies).
- **Logging:** Primary location for error logging, using the structured data from `BaseError`.

## 6. Validation and Examples

### 6.1 Compliant Example

    // 1. Define a domain error
    class ValidationError extends BaseError {
      constructor(field: string, value: unknown) {
        super('validation:invalid_field', `Invalid value for field ${field}`, { field, attemptedValue: value });
      }
    }

    // 2. Core function returns Result
    function validateEmail(input: string): Result<EmailAddress, ValidationError> {
      if (!isValidEmail(input)) {
        return { success: false, error: new ValidationError('email', input) };
      }
      return { success: true, value: brandEmail(input) };
    }

    // 3. Service orchestrates
    function createUser(email: string): Result<User, ValidationError | UserError> {
      const emailResult = validateEmail(email);
      if (!emailResult.ok) {
        return emailResult; // Propagate error
      }
      // ... other logic
    }

### 6.2 Non-Compliant Examples

    // ❌ Throwing string
    throw 'Invalid email';

    // ❌ Throwing generic Error
    throw new Error('Invalid email');

    // ❌ Returning ambiguous object
    return { success: false, message: 'Invalid email' };

    // ❌ Using boolean flag
    return { isValid: false };

## 7. Compliance Verification

The CI/CD pipeline MUST include validation steps that:

1.  Scan for `throw` statements with string literals or generic `Error` in Core/Service layers.
2.  Validate that functions with known error-prone operations return a `Result` type.
3.  Ensure all error codes follow the `domain:error_type` format via static analysis or runtime checks in tests.

## 8. Supersession

This is the initial version of the Error Handling Standard. It supersedes no previous documents.

## References

- [Constitutional Axiom 3: Single Authoritative Source](/docs/00-constitution/constitutional-axioms.md#axiom-3-single-authoritative-source)
- [Terminology: Domain Error, Result Pattern](/docs/00-constitution/terminology.md)
- [Comity Philosophy: Errors Are Domain Objects](/docs/02-principles/philosophy.md#4-errors-are-domain-objects)
- [ADR Process](/docs/00-constitution/adr-process.md)
