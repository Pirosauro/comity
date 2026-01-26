# CRITICAL CODE REVIEW REQUEST

## CONTEXT

I'm providing you with:

1. **@comity<package_name> package source code** (`packages/<package_name>`)
2. **Comity Standards Documentation** (in the `docs/` folder)

## REVIEW MANDATE

Perform a **comprehensive, production-grade critical review** of the provided codebase against the Comity Standards. This is for an enterprise-ready framework - **no compromises on quality**.

## REVIEW APPROACH

### Phase 1: Architectural Alignment

1. **Layer Verification**
   - Identify which code belongs to: Primitives, Kernel, Modules, or Adapters
   - Verify each layer follows its specific rules
   - Flag any mixed concerns or boundary violations

2. **Dependency Direction Check**
   - Map dependency graph between layers
   - Verify: Primitives → Kernel → Modules → Adapters (only forward)
   - Flag any reverse dependencies or circular dependencies

### Phase 2: Standards Compliance

#### A. Error Handling (Critical)

- [ ] All errors extend `BaseError`
- [ ] Error codes are namespaced (`module:reason`)
- [ ] No generic `new Error()` throws
- [ ] Error messages are safe to log
- [ ] HTTP status is hint-only, not dependency
- [ ] **CRITICAL**: Verify no sensitive data in error messages

#### B. Class Design

- [ ] All fields explicitly declared (no parameter properties)
- [ ] Internal state uses `#private` fields
- [ ] Public access via getters only
- [ ] Constructors fully initialize instances
- [ ] No field initializers (except constants)
- [ ] Lifecycle-aware classes use `Lifecycle` abstraction

#### C. Public API Surface

- [ ] Clear separation: Public API vs Internal API
- [ ] No `internal/` directory exports
- [ ] Sub-entrypoints represent conceptual domains (not technical)
- [ ] Facades used where appropriate
- [ ] All public APIs documented

#### D. Module System

- [ ] Each module exports `ModuleMeta` descriptor
- [ ] Explicit `dependsOn` declarations
- [ ] No module depends on adapters
- [ ] Module `setup` is pure (no side effects)
- [ ] Clear separation: App Authors vs Module Authors APIs

#### E. Events & Hooks

- [ ] Events are observational only (no control flow)
- [ ] Hooks are participatory
- [ ] No event-to-hook triggering
- [ ] Event payloads contain identifiers, not objects
- [ ] No sensitive data in event payloads

#### F. Testing Strategy

- [ ] Tests validate behavior, not implementation
- [ ] Layer-appropriate testing:
  - Primitives: pure, deterministic, zero mocks
  - Kernel: minimal test doubles
  - Adapters: integration-style allowed
- [ ] No snapshot testing for kernel state
- [ ] Error tests assert type, code, semantics

### Phase 3: Production Readiness

#### Security & Safety

- [ ] No raw objects in event/error payloads
- [ ] No implicit I/O in domain/primitives
- [ ] No environment assumptions in modules
- [ ] Input validation at boundaries
- [ ] No silent error swallowing

#### Performance & Reliability

- [ ] No blocking operations in hot paths
- [ ] Memory leak prevention patterns
- [ ] Resource cleanup on lifecycle transitions
- [ ] Timeout handling where appropriate
- [ ] No unhandled promise rejections

#### Maintainability

- [ ] Single responsibility per class/module
- [ ] Cyclomatic complexity < 10 per function
- [ ] No magic numbers/strings
- [ ] Configuration over hardcoding
- [ ] Clear separation of test vs production code

#### TypeScript Specifics

- [ ] Strict mode enabled
- [ ] No `any` types (use `unknown` if needed)
- [ ] No non-null assertions (`!`) without validation
- [ ] Proper generic constraints
- [ ] Discriminated unions for state
- [ ] No type casting without runtime checks

### Phase 4: Critical Risk Assessment

#### RED FLAGS (Immediate Fix Required)

1. **Security Issues**
   - Sensitive data exposure in logs/errors
   - Missing input validation
   - SQL/command injection possibilities

2. **Architecture Violations**
   - Adapters containing business logic
   - Domain code performing I/O
   - Kernel depending on adapters
   - Circular dependencies between layers

3. **Production Risks**
   - Memory leaks (event listeners, subscriptions)
   - Unhandled promise rejections
   - Blocking main thread operations
   - No error boundaries

#### YELLOW FLAGS (Should Fix)

1. **Standards Violations**
   - Using `private` instead of `#private`
   - Public field access instead of getters
   - Mixed concerns in modules
   - Tests that lock implementation

2. **Code Quality Issues**
   - High complexity functions
   - Duplicate logic
   - Magic strings/numbers
   - Poor error recovery

## REVIEW OUTPUT FORMAT

Provide your review in this structure:

### 1. Executive Summary

- Overall assessment (Green/Yellow/Red)
- Critical issues count
- Architecture compliance score

### 2. Layer-by-Layer Analysis

For each identified layer (Primitives, Kernel, Modules, Adapters):

- **Status**: Compliant/Partial/Non-compliant
- **Issues Found**: List with severity
- **Dependencies**: Correct/Incorrect

### 3. Critical Issues (RED)

List with:

- Location (file:line)
- Issue description
- Standards violation reference
- Potential impact
- Recommended fix

### 4. Standards Violations (YELLOW)

List with:

- Location
- Violation
- Rule reference
- Suggested improvement

### 5. Production Readiness Gaps

- Missing patterns
- Security concerns
- Performance risks
- Monitoring/observability gaps

### 6. Positive Findings

- Well-implemented patterns
- Good architectural decisions
- Strong testing approaches

### 7. Recommendations Priority

1. **Immediate** (critical security/architecture)
2. **Short-term** (standards compliance)
3. **Medium-term** (quality improvements)
4. **Long-term** (enhancements)

## SPECIAL INSTRUCTIONS

1. **Be Ruthless** - This is for production. No "nice-to-have" leniency.
2. **Cite Standards** - Always reference specific rules from Comity docs.
3. **Provide Examples** - Show incorrect code and corrected version.
4. **Check Edge Cases** - Look for race conditions, memory issues.
5. **Verify Test Coverage** - Tests should match architecture layers.
6. **Documentation Check** - Public APIs must be documented.

## FINAL CHECK

Before completing review, verify:

- [ ] All architectural boundaries respected
- [ ] No framework-specific code in modules
- [ ] Error handling consistent across layers
- [ ] Lifecycle management correct
- [ ] Events/hooks used appropriately
- [ ] All public APIs stable and documented

**Remember**: This framework must withstand enterprise-scale usage. Every violation is a potential production incident.
