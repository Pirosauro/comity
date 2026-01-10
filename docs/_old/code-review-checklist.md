# Code Review Checklist: TypeScript Hexagonal Architecture

Reviewer should be able to answer:

- Can this code be reused without HTTP / DB / WHATEVER?
- Can errors be handled without knowing the adapter?
- Does the name make sense outside its folder?

## Project Structure & Organization

### File Structure

- [ ] No monolithic constants.ts/types.ts files - Use logical grouping by domain/feature
- [ ] Files under 400 lines - Split larger files logically
- [ ] Logical grouping - Group related types, errors, utilities together (e.g., `user/types.ts`, `user/errors.ts`)
- [ ] Barrel exports (`index.ts`) used for public API, hiding internal structure
- [ ] Clear separation between
- - `core/` (ports, canonical errors, orchestration contracts)
- - `domain/` (pure business rules, policies, invariants)
- - `adapters/` (infrastructure & framework bindings)

### Naming Conventions

- [ ] Constant objects: UPPER_SNAKE_CASE with domain prefix (`ACL_ERRORS`, `JWT_ERRORS`, `DATABASE_ERRORS`)
- [ ] Constant values: UPPER_SNAKE_CASE (`ACCESS_DENIED`, `TOKEN_EXPIRED`)
- [ ] Types/Interfaces: PascalCase with domain prefix when needed to avoid collisions (`AclError`, `UserProfile`, `AclOrchestrator`)
- [ ] Functions: camelCase (validateToken, createUserSession)
- [ ] Classes: PascalCase with domain prefix when generic names are too broad (`JwtFacade`, `AclOrchestrator`, `DatabaseConnection`)
- [ ] Error codes: domain:error_type pattern (`auth:jwt_token_expired`, `acl:access_denied`)
- [ ] No naming collisions - Generic names (`Orchestrator`, `Errors`, `Handler`) avoided in public API
- [ ] Consistent naming patterns across all modules

## Architecture & Design

### Hexagonal Architecture Principles

- [ ] Core logic isolated from adapters and frameworks
- [ ] Dependency inversion - Core depends on abstractions, not implementations
- [ ] Adapter boundaries clear - Adapters adapt external systems to core interfaces
- [ ] No framework references in core/domain layers
- [ ] Ports/interfaces defined in core, implemented in adapters
- [ ] Core never throws exceptions - Use `Result<T, E>` pattern for expected failures
- [ ] Exceptions only for programmer errors (invalid arguments, unrecoverable states)
- [ ] Orchestrators coordinate ports and services, but do not implement business rules
- [ ] Orchestrators may emit events but must not depend on adapters
- [ ] Orchestrators return `Result<T, E>`, never throw for expected outcomes

### Type Safety

- [ ] Generics documented with @template tags for non-obvious type parameters
- [ ] as const assertions for constant objects enabling precise literal types
- [ ] Explicit return types on public functions (except trivial cases)
- [ ] Discriminated unions used for state modeling (`Result<T, E>` pattern)
- [ ] No any types - Use unknown with type guards instead
- [ ] Proper generic constraints (extends `Record<string, unknown>`, extends string, etc.)

### Import Boundaries (Core/Domain)

- [ ] **No framework imports** in core/domain (Express, React, etc.)
- [ ] **No infrastructure imports** (DB clients, HTTP clients, cloud SDKs)
- [ ] **Only pure utility libraries** allowed (lodash, date-fns, zod, uuid)
- [ ] **Dependency inversion** used for external services
- [ ] **Custom ESLint rule** enforces import boundaries

## Documentation & Comments

### JSDoc Standards

- [ ] Public APIs documented with JSDoc (functions, classes, interfaces)
- [ ] @param tags for non-obvious parameters
- [ ] @returns tags explaining success conditions beyond type
- [ ] @throws tags only for exceptions (programmer errors), not business logic failures
- [ ] @remarks section for design decisions and constraints
- [ ] @example tags showing correct usage patterns
- [ ] @template tags for generic type parameters when meaning isn't obvious
- [ ] No implementation details in public API documentation

### Comment Philosophy

- [ ] Comments explain "why" not "what" - No line-by-line code explanation
- [ ] Invariants documented - What callers can rely on
- [ ] Misuse prevention - Warnings where incorrect usage is plausible
- [ ] Boundary documentation - Verbose comments at public API boundaries only
- [ ] No redundant comments - Delete comments that just repeat the code
- [ ] Semantic guarantees stated clearly
- [ ] Comments must not act as user manuals or marketing descriptions

## Adapter Patterns

### Common Adapter Requirements

- [ ] Error mapping - Library errors mapped to domain error codes
- [ ] No library-specific errors in public API (use domain errors)
- [ ] Consistent error handling - Same error patterns across adapters
- [ ] Framework agnostic - Adapters don't assume specific HTTP frameworks
- [ ] Configuration isolation - Adapter config separated from core logic
- [ ] Inbound adapters (HTTP, CLI) translate external requests into core inputs
- [ ] Outbound adapters (DB, CASL, JWT) translate core intents into infrastructure calls

### Adapter Specific

- [ ] Standard error codes used: `auth:jwt_token_expired`, `auth:jwt_token_invalid`, `auth:jwt_session_invalid`
- [ ] No JOSE-specific errors exposed to consumers
- [ ] Time parameter accepted for deterministic verification
- [ ] Claims generic properly constrained (extends `Record<string, unknown>`)

## Error Handling

### Result Pattern

- [ ] Result<T, E> type used for expected failures
- [ ] No exceptions for business logic failures - Use Result pattern instead
- [ ] Clear error discrimination - Easy to handle different error cases
- [ ] Error types are strings with domain prefix for easy serialization

### Error Consistency

- [ ] Same error codes used across adapters for same conditions
- [ ] HTTP adapters can handle errors without knowing source adapter
- [ ] Error mapping functions centralized and testable
- [ ] Fallback errors for unmapped library errors

## Testing & Maintainability

### Testability

- [ ] No hidden dependencies - Dependencies injected or obvious
- [ ] Deterministic behavior - Time, random, etc., parameterized
- [ ] Adapter interfaces allow mocking external systems
- [ ] Pure core logic - No side effects in domain models

### Code Quality

- [ ] Single responsibility - Each function/class does one thing
- [ ] Reasonable complexity - Cyclomatic complexity kept low
- [ ] No dead code - Remove unused imports, functions, types
- [ ] Consistent formatting - Prettier/ESLint rules followed

## Consistency Checks

### Cross-Module Consistency

- [ ] Same patterns used across all modules
- [ ] Shared types in appropriate shared locations
- [ ] No circular dependencies between modules
- [ ] Consistent import style - Group external, internal, type imports

### Export Strategy

- [ ] Only public API exported from barrel files
- [ ] Internal types marked with @internal JSDoc tag if exported
- [ ] Default exports avoided - Use named exports for better refactoring
- [ ] Type exports explicit - No export type \* that mixes values and types

### Naming Collision Prevention

- [ ] Domain prefixes used for public classes/types that could collide (`AclOrchestrator` not `Orchestrator`)
- [ ] Contextually unique names - Ensure names make sense when imported standalone
- [ ] No overly generic names in root-level exports (`Handler`, `Service`, `Manager` avoided)
- [ ] Namespace-like prefixes considered for broad utilities (`AclResult` vs `Result` if needed)

## Quick Scan Priorities

### CRITICAL (Blocking):

- [ ] Architecture violations (framework code in core)
- [ ] Missing error handling
- [ ] Security issues (token validation, auth bypass)
- [ ] Breaking public API contracts
- [ ] Core layer throwing exceptions for business logic

### IMPORTANT (Should Fix):

- [ ] Inconsistent naming or naming collisions
- [ ] Missing documentation on public APIs
- [ ] Incorrect error mapping
- [ ] Type safety issues
- [ ] Missing @template documentation for complex generics

### NICE-TO-HAVE (Optional):

- [ ] JSDoc tag completeness
- [ ] Example code in documentation
- [ ] Perfect naming consistency
- [ ] Additional test coverage

## Example Code Snippets for Reference

### Correct Naming (Avoiding Collisions):

```typescript
// ✅ GOOD - Domain prefix prevents collisions
export const ACL_ERRORS = { ... };
export class AclOrchestrator { ... }
export type AclPermission = { ... };

// ❌ BAD - Too generic, could collide
export const ERRORS = { ... };
export class Orchestrator { ... };
export type Permission = { ... };
```

### Correct JSDoc with @template:

```typescript
/**
 * JWT facade for token verification and signing.
 *
 * @template Claims - Type of JWT claims payload
 * @template VerifyError - Type of verification error reasons
 * @template SignError - Type of signing error reasons
 *
 * @remarks
 * Uses Result pattern for error handling, never throws for
 * expected failures like invalid tokens or expired sessions.
 */
export interface JwtFacade<
  Claims extends Record<string, unknown>,
  VerifyError extends string = string,
  SignError extends string = string
> {
  verify(
    token: string,
    now: number
  ): Promise<Result<{ readonly claims: Claims }, VerifyError>>;
}
```

### Correct Error Handling (Core Layer):

```typescript
// ✅ GOOD - Core uses Result pattern
export class UserService {
  async findUser(id: string): Promise<Result<User, UserError>> {
    // Business logic failures return Result
    if (!isValidId(id)) {
      return { success: false, reason: USER_ERRORS.INVALID_ID };
    }
    // Success returns Result
    return { success: true, value: user };
  }
}

// ❌ BAD - Core throws exceptions for business logic
export class UserService {
  async findUser(id: string): Promise<User> {
    if (!isValidId(id)) {
      throw new Error("Invalid ID"); // Avoid in core
    }
    return user;
  }
}
```

_Remember: Code reviews should focus on correctness, security, and maintainability. Be kind but thorough. Ask questions when intent isn't clear. The goal is collective code ownership, not criticism._
