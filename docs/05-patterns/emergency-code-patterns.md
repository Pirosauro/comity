---
id: emergency-code-patterns
status: non-authoritative
version: 1.0.0
owner: @architecture-council
enforcement: none
last_reviewed: 2026-01-09
next_review: 2027-01-09
supersedes: []
---

# Emergency Code Patterns

## Purpose

This document provides **concrete implementation patterns** for emergency code that complies with the [Emergency Procedures](/docs/00-constitution/emergency-procedures.md). These patterns ensure emergency code is reversible, documented, and automatically expires.

This is a **Level 5: Pattern document** (non-authoritative, recommended approaches). It provides implementation guidance but does not create new rules.

**Reference Authority:** All patterns derive their requirements from the authoritative [Emergency Procedures](/docs/00-constitution/emergency-procedures.md).

---

## Core Pattern Principles

### Principle 1: Reversible by Design

> Emergency code must be structured for easy removal, not integration.

**Implementation:** Use wrapper functions, feature flags, or configuration overrides instead of modifying core logic.

### Principle 2: Metadata Embedded

> Emergency context must be visible in the code, not just in external documentation.

**Implementation:** Use standardized code headers and structured comments.

### Principle 3: Scope Limited

> Emergency changes must have clear boundaries to prevent contamination.

**Implementation:** Isolate emergency logic in dedicated modules or functions.

### Principle 4: Testable

> Emergency code must support verification without compromising normal operations.

**Implementation:** Include testing hooks and validation mechanisms.

---

## Pattern 1: Emergency Header Template

### Use Case

All files modified during an emergency must include the emergency header.

### Implementation

```typescript
// ============================================================================
// EMERGENCY: EMG-2026-01-09-001
// VIOLATES: core-purity §1.1.1 (Network Operations Prohibition in Core)
// SUNSET: 2026-01-10 14:30:00 UTC
// APPROVED: @alice, @bob
// TICKET: /docs/08-emergency/2026-01-09-001.md
// ============================================================================
// REASON: Database cluster outage requires fallback to external API
// IMPACT: Core purity violation - network call in Core layer
// CLEANUP: Remove after database restored, revert to repository pattern
// ============================================================================
```

### Required Sections

1. **EMERGENCY:** Emergency ID from registry
2. **VIOLATES:** Standard(s) being violated with section reference
3. **SUNSET:** Expiration date/time (ISO 8601 format)
4. **APPROVED:** List of approvers from emergency ticket
5. **TICKET:** Path to emergency ticket
6. **REASON:** Brief explanation of emergency
7. **IMPACT:** What architectural principle is compromised
8. **CLEANUP:** Steps required to remove emergency code

### Validation Rules

- Header must be at top of file, before any imports
- All fields must be present and valid
- SUNSET must match emergency ticket
- VIOLATES must reference actual Standard sections

---

## Pattern 2: Feature Flag Override

### Use Case

Temporarily enable/disable functionality or switch implementations during an emergency.

### Implementation

```typescript
// Emergency feature flag configuration
const EMERGENCY_FLAGS = {
  // Emergency: EMG-2026-01-09-002
  // Sunset: 2026-01-11 09:00:00 UTC
  USE_EXTERNAL_API: true, // Violates: core-purity §1.1.1
  SKIP_VALIDATION: false, // Violates: type-safety §1.3.1
  INCREASE_TIMEOUT: 30000, // Violates: none (configuration change)
} as const;

// Usage in code
async function fetchUserData(userId: UserId): Promise<Result<UserData, Error>> {
  if (EMERGENCY_FLAGS.USE_EXTERNAL_API) {
    // Emergency code path
    return await fetchFromExternalAPI(userId); // Network call in Core
  }

  // Normal code path
  return await userRepository.findById(userId);
}

// Cleanup reminder
function validateEmergencyFlags(): void {
  const now = Date.now();
  const sunset = new Date("2026-01-11T09:00:00Z").getTime();

  if (now > sunset) {
    console.error("EMERGENCY FLAGS EXPIRED - Cleanup required");
    // CI/CD will block merges, this is a runtime warning
  }
}
```

### Benefits

- Clear separation of emergency logic
- Easy to locate and remove
- Configuration-driven, not code changes
- Runtime validation of sunset

### Cleanup Steps

1. Set flag to `false` or default value
2. Remove flag definition
3. Remove conditional logic if no longer needed
4. Run tests to verify normal path

---

## Pattern 3: Wrapper Function

### Use Case

Temporarily wrap existing functionality with emergency behavior.

### Implementation

```typescript
// Original function (pure, no IO)
function calculateTax(amount: MonetaryAmount, taxRate: number): MonetaryAmount {
  return amount * taxRate;
}

// Emergency wrapper (violates Core purity for external API call)
function calculateTaxWithEmergencyFallback(
  amount: MonetaryAmount,
  taxRate: number,
  now: number // Explicit time parameter maintained
): Promise<Result<MonetaryAmount, TaxError>> {
  // EMERGENCY WRAPPER: EMG-2026-01-09-003
  // VIOLATES: core-purity §1.1.1 (Network call in Core)
  // CLEANUP: Remove wrapper after tax service restored

  try {
    // Try normal calculation first
    const normalResult = calculateTax(amount, taxRate);
    return Promise.resolve({ success: true, value: normalResult });
  } catch (error) {
    // Emergency fallback to external service
    console.warn("Using emergency tax calculation API");

    return fetchExternalTaxAPI(amount, taxRate)
      .then((apiResult) => ({
        success: true,
        value: apiResult,
        meta: { emergency: true, source: "external-api" },
      }))
      .catch((apiError) => ({
        success: false,
        error: new TaxError(
          "tax:service_unavailable",
          "Tax calculation service unavailable",
          { emergency: true, fallbackFailed: true }
        ),
      }));
  }
}

// Usage - caller must handle Promise now
const result = await calculateTaxWithEmergencyFallback(amount, 0.2, Date.now());
```

### Benefits

- Original function remains pure
- Clear boundary between normal and emergency code
- Easy to remove wrapper
- Maintains function signature compatibility where possible

### Cleanup Steps

1. Remove wrapper function
2. Update callers to use original function
3. Remove emergency imports
4. Verify no residual emergency dependencies

---

## Pattern 4: Configuration Override

### Use Case

Temporarily change system behavior through configuration instead of code.

### Implementation

```typescript
// Normal configuration
const NORMAL_CONFIG = {
  database: {
    host: process.env.DB_HOST,
    timeout: 5000,
    retries: 3,
  },
  api: {
    rateLimit: 100,
    timeout: 30000,
  },
} as const;

// Emergency configuration overlay
const EMERGENCY_CONFIG_OVERRIDES = {
  // EMERGENCY: EMG-2026-01-09-004
  // VIOLATES: none (configuration changes allowed)
  // SUNSET: 2026-01-12 18:00:00 UTC

  database: {
    timeout: 30000, // Increased timeout for degraded database
    retries: 0, // Disable retries to fail fast
  },

  api: {
    rateLimit: 10, // Reduce load on struggling API
  },
} as const;

// Configuration loader with emergency support
function loadConfiguration() {
  const baseConfig = NORMAL_CONFIG;

  if (isEmergencyActive("EMG-2026-01-09-004")) {
    console.warn("Applying emergency configuration overrides");
    return {
      ...baseConfig,
      database: {
        ...baseConfig.database,
        ...EMERGENCY_CONFIG_OVERRIDES.database,
      },
      api: { ...baseConfig.api, ...EMERGENCY_CONFIG_OVERRIDES.api },
    };
  }

  return baseConfig;
}

// Emergency status checker
function isEmergencyActive(emergencyId: string): boolean {
  const emergencies = loadEmergencyRegistry(); // From emergency registry
  const emergency = emergencies.find((e) => e.id === emergencyId);

  if (!emergency) return false;
  if (emergency.status !== "active") return false;

  const now = new Date();
  const sunset = new Date(emergency.sunset);
  return now < sunset;
}
```

### Benefits

- Zero code changes for configuration-based emergencies
- Easy to revert
- Centralized emergency detection
- Can be managed via environment variables or feature stores

### Cleanup Steps

1. Remove emergency configuration
2. Reset to normal values
3. Remove `isEmergencyActive` calls if no other emergencies
4. Update configuration documentation

---

## Pattern 5: Emergency Adapter

### Use Case

Temporarily replace an adapter implementation during infrastructure outages.

### Implementation

```typescript
// Normal Port interface
interface UserRepository {
  findById(id: UserId): Promise<Result<User, NotFoundError>>;
  save(user: User): Promise<Result<void, RepositoryError>>;
}

// Normal implementation
class DatabaseUserRepository implements UserRepository {
  async findById(id: UserId): Promise<Result<User, NotFoundError>> {
    // Database implementation
    const user = await db.users.findOne({ id });
    if (!user) {
      return { success: false, error: new NotFoundError("user:not_found") };
    }
    return { success: true, value: user };
  }
}

// Emergency adapter (violates architectural layers)
class EmergencyUserRepository implements UserRepository {
  // EMERGENCY ADAPTER: EMG-2026-01-09-005
  // VIOLATES: core-purity §1.1.1, type-safety §1.2.1
  // REASON: Database outage, using localStorage as fallback
  // CLEANUP: Remove after database restored

  private storageKey = "emergency_user_store";

  async findById(id: UserId): Promise<Result<User, NotFoundError>> {
    try {
      const storage = localStorage.getItem(this.storageKey);
      const users: User[] = storage ? JSON.parse(storage) : [];
      const user = users.find((u) => u.id === id);

      if (!user) {
        return { success: false, error: new NotFoundError("user:not_found") };
      }

      return {
        success: true,
        value: user,
        meta: { emergency: true, source: "localStorage" },
      };
    } catch (error) {
      return {
        success: false,
        error: new RepositoryError(
          "db:emergency_failure",
          "Emergency storage failed",
          { originalError: error.message }
        ),
      };
    }
  }

  async save(user: User): Promise<Result<void, RepositoryError>> {
    // Similar implementation with localStorage
  }
}

// Factory that switches implementations
function createUserRepository(): UserRepository {
  if (isEmergencyActive("EMG-2026-01-09-005")) {
    console.warn("Using emergency user repository");
    return new EmergencyUserRepository();
  }

  return new DatabaseUserRepository();
}
```

### Benefits

- Maintains Port interface contract
- Clear separation of concerns
- Easy to remove emergency implementation
- Can be combined with dependency injection

### Cleanup Steps

1. Remove emergency adapter class
2. Update factory to return only normal implementation
3. Remove emergency detection logic
4. Migrate any emergency data back to normal storage

---

## Pattern 6: Emergency Monitoring and Logging

### Use Case

Track emergency code execution for post-mortem analysis and cleanup verification.

### Implementation

```typescript
// Emergency logger with structured metadata
class EmergencyLogger {
  static logEmergencyCall(
    emergencyId: string,
    component: string,
    operation: string,
    metadata: Record<string, unknown> = {}
  ): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      emergencyId,
      component,
      operation,
      metadata,
      type: "emergency_execution",
    };

    // Log to emergency-specific stream
    console.warn(JSON.stringify(logEntry));

    // Also send to monitoring system
    if (typeof process.env.EMERGENCY_MONITORING_URL === "string") {
      fetch(process.env.EMERGENCY_MONITORING_URL, {
        method: "POST",
        body: JSON.stringify(logEntry),
        headers: { "Content-Type": "application/json" },
      }).catch(() => {
        // Silently fail - monitoring shouldn't break emergency code
      });
    }
  }

  static validateEmergencyActive(emergencyId: string): boolean {
    const isActive = checkEmergencyStatus(emergencyId); // From registry

    if (!isActive) {
      this.logEmergencyCall(emergencyId, "validation", "emergency_expired", {
        warning: "Code running after emergency sunset",
        severity: "high",
      });

      // In production, might want to throw or return error
      // In emergency context, we might continue with additional logging
    }

    return isActive;
  }
}

// Usage in emergency code
async function emergencyOperation(
  userId: UserId
): Promise<Result<User, Error>> {
  const emergencyId = "EMG-2026-01-09-006";

  // Log start of emergency operation
  EmergencyLogger.logEmergencyCall(emergencyId, "UserService", "fetchUser", {
    userId,
    reason: "database_outage",
  });

  // Validate emergency is still active
  if (!EmergencyLogger.validateEmergencyActive(emergencyId)) {
    return {
      success: false,
      error: new Error("emergency:expired", "Emergency period has ended"),
    };
  }

  // Perform emergency operation
  try {
    const result = await fetchExternalUser(userId);

    // Log success
    EmergencyLogger.logEmergencyCall(
      emergencyId,
      "UserService",
      "fetchUserSuccess",
      {
        userId,
        duration: Date.now() - startTime,
      }
    );

    return { success: true, value: result };
  } catch (error) {
    // Log failure
    EmergencyLogger.logEmergencyCall(
      emergencyId,
      "UserService",
      "fetchUserFailure",
      {
        userId,
        error: error.message,
        stack: error.stack,
      }
    );

    return {
      success: false,
      error: new Error(
        "user:fetch_failed",
        "Failed to fetch user in emergency mode"
      ),
    };
  }
}
```

### Benefits

- Structured logging for post-mortem analysis
- Automatic validation of emergency status
- Monitoring of emergency code usage
- Helps identify cleanup opportunities

### Cleanup Steps

1. Remove emergency logging calls
2. Remove `EmergencyLogger` class if no other emergencies
3. Review logs to ensure no residual emergency executions
4. Archive emergency logs for compliance

---

## Pattern 7: Emergency Testing

### Use Case

Test emergency code paths without compromising normal test suite.

### Implementation

```typescript
// Emergency test utilities
describe("Emergency Code Paths", () => {
  const EMERGENCY_ID = "EMG-2026-01-09-007";

  // Setup emergency context for tests
  beforeEach(() => {
    mockEmergencyRegistry({
      id: EMERGENCY_ID,
      status: "active",
      sunset: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
    });

    // Enable emergency flags
    process.env.EMERGENCY_MODE = EMERGENCY_ID;
  });

  // Cleanup after tests
  afterEach(() => {
    delete process.env.EMERGENCY_MODE;
    resetEmergencyRegistry();
  });

  test("feature flag enables emergency path", () => {
    // Test that emergency flag switches behavior
    const result = calculateTaxWithEmergencyFallback(100, 0.2, Date.now());

    // Should use external API in emergency mode
    expect(result.meta?.emergency).toBe(true);
    expect(result.meta?.source).toBe("external-api");
  });

  test("emergency code respects sunset", () => {
    // Mock sunset in the past
    mockEmergencyRegistry({
      id: EMERGENCY_ID,
      status: "active",
      sunset: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    });

    // Should detect expired emergency
    const result = emergencyOperation("user-123");

    expect(result.success).toBe(false);
    expect(result.error?.code).toBe("emergency:expired");
  });

  test("cleanup removes emergency code", () => {
    // This test should fail if emergency code is still present after cleanup
    // Run as part of CI/CD to ensure cleanup completeness

    // Check for emergency headers in codebase
    const filesWithEmergencyHeaders = scanForEmergencyHeaders();
    expect(filesWithEmergencyHeaders).toHaveLength(0);

    // Check for emergency configuration
    const emergencyConfig = loadConfiguration();
    expect(emergencyConfig.database.timeout).toBe(5000); // Normal value
    expect(emergencyConfig.api.rateLimit).toBe(100); // Normal value

    // Check for emergency adapters in dependency injection
    const repository = createUserRepository();
    expect(repository.constructor.name).not.toBe("EmergencyUserRepository");
  });
});

// Utility to scan for emergency headers
function scanForEmergencyHeaders(): string[] {
  const sourceFiles = getAllTypeScriptFiles();
  const filesWithHeaders: string[] = [];

  for (const file of sourceFiles) {
    const content = readFileSync(file, "utf-8");
    if (content.includes("EMERGENCY: EMG-") || content.includes("VIOLATES:")) {
      filesWithHeaders.push(file);
    }
  }

  return filesWithHeaders;
}
```

### Benefits

- Tests emergency paths in isolation
- Validates sunset enforcement
- Provides cleanup verification
- Prevents emergency code from "hiding" in codebase

### Cleanup Steps

1. Run emergency tests to verify cleanup
2. Remove emergency-specific tests if no longer needed
3. Update test documentation
4. Ensure normal tests still pass

---

## Cleanup Verification Checklist

### Before Cleanup

- [ ] Emergency ticket marked as resolved
- [ ] Post-mortem completed
- [ ] All emergency code identified via headers
- [ ] Dependencies mapped (what calls emergency code)

### During Cleanup

- [ ] Emergency headers removed from files
- [ ] Feature flags disabled or removed
- [ ] Wrapper functions removed
- [ ] Configuration reset to normal values
- [ ] Emergency adapters removed
- [ ] Emergency logging reduced or removed
- [ ] Tests updated

### After Cleanup

- [ ] All tests pass (normal and emergency)
- [ ] No emergency headers found in codebase scan
- [ ] Emergency registry updated
- [ ] Documentation updated
- [ ] Team notified of completion

---

## Integration with Emergency Procedures

These patterns implement requirements from [Emergency Procedures](/docs/00-constitution/emergency-procedures.md):

### Section 2.2: Code Changes Implementation

    Emergency Procedures requires:
    - Emergency header in changed files ✓ (Pattern 1)
    - Minimal necessary changes ✓ (Patterns 2-5)
    - Sunset tracking ✓ (All patterns include sunset)

    These patterns provide concrete implementations.

### Section 4: Post-Mortem Support

    Emergency Procedures requires:
    - Evidence for post-mortem ✓ (Pattern 6 logging)
    - Cleanup verification ✓ (Pattern 7 testing)
    - Documentation of changes ✓ (All patterns include documentation)

### Section 5: Compliance Enforcement

    Emergency Procedures requires:
    - CI/CD validation ✓ (Headers detectable via static analysis)
    - Automatic sunset enforcement ✓ (Pattern 6 validation)
    - Abuse prevention ✓ (Structured patterns prevent ad-hoc changes)

---

## References

- [Emergency Procedures](/docs/00-constitution/emergency-procedures.md) - Authoritative source for emergency requirements
- [Error Handling Standard](/docs/03-standards/error-handling.md) - Error patterns used in emergency code
- [Core Purity Standard](/docs/03-standards/core-purity.md) - Standards often violated in emergencies
- [Type Safety Standard](/docs/03-standards/type-safety.md) - Type patterns for emergency code
- [AI Governance](/docs/02-principles/ai-principles.md) - AI-generated emergency code requirements

---

## Amendment History

_2026-01-09_: Initial version - Emergency code patterns for all common use cases

---

**Important:** These patterns are implementation guidance only. All emergency code must comply with the authoritative [Emergency Procedures](/docs/00-constitution/emergency-procedures.md) document. Patterns may evolve based on real-world usage and feedback.
