# Hexagonal Architecture Review Cheatsheet

## CRITICAL (Block Merge)

### Architecture Violations

- [ ] **NO** framework imports in core/domain (Express, React, DB clients)
- [ ] **NO** exceptions thrown for business logic (use `Result<T, E>`)
- [ ] **NO** generic names in public API (`Orchestrator` → `AclOrchestrator`)
- [ ] Core must **NEVER** depend on adapters

### Security & Correctness

- [ ] Errors properly mapped to domain codes (`auth:token_expired`)
- [ ] No library errors exposed to callers
- [ ] Public API contracts maintained

## IMPORTANT (Should Fix)

### Structure & Organization

- [ ] Files under 400 lines
- [ ] No monolithic `constants.ts` files
- [ ] Barrel exports hide internal structure
- [ ] Logical grouping by domain/feature

### Type Safety

- [ ] No `any` types (use `unknown` with guards)
- [ ] Generics properly constrained (`extends Record<string, unknown>`)
- [ ] Discriminated unions for state
- [ ] `as const` on constant objects

### Error Handling

- [ ] `Result<T, E>` pattern for expected failures
- [ ] Same error codes across adapters for same conditions
- [ ] HTTP adapters can handle errors without knowing source

## Documentation

### JSDoc Requirements (Public APIs)

- [ ] `@param` for non-obvious parameters
- [ ] `@returns` explaining success conditions
- [ ] `@template` for complex generics
- [ ] `@remarks` for design decisions
- [ ] `@example` showing usage

### Comments Philosophy

- [ ] Explain **why**, not what
- [ ] Document invariants and misuse prevention
- [ ] No redundant comments
- [ ] Boundary documentation only

## Adapter Patterns

### Common Requirements

- [ ] Error mapping to domain codes
- [ ] No framework-specific types in signatures
- [ ] Configuration isolated from logic
- [ ] Time parameter for deterministic behavior
