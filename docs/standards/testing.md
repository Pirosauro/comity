# Comity Coding Standards — Testing

> **Note:** This is the Community-specific transitional copy. The canonical Comity-wide version is maintained in `comity-development/docs/standards/testing.md`
This document defines how testing is approached across the Comity ecosystem.

Testing in Comity is **structural**, **layer-aware**, and **boundary-conscious**.

---

## 1. Core Philosophy

> Test behavior, not implementations.

Tests must validate:

- Contracts between layers
- Invariants within layers
- Public behavior at layer boundaries

Tests must NOT:

- Lock internal implementations
- Assert incidental details
- Duplicate production logic
- Cross layer boundaries unnecessarily

---

## 2. Testing Pyramid

Comity adopts a layer-specific testing pyramid:

```
    ⬆️  End-to-End (few)
   ⬆️⬆️  Integration (some)
  ⬆️⬆️⬆️  Layer Boundary (many)
 ⬆️⬆️⬆️⬆️  Unit with Boundaries (many)
⬆️⬆️⬆️⬆️⬆️  Pure Unit (most)
```

---

## 3. Testing by Layer

### 3.1 Kernel

**Goal:** Verify primitives and mechanisms in isolation.

**Approach:** Pure unit tests.

```ts
test("BaseError creates correct code", () => {
  const error = new TestError("test_reason");
  expect(error.code).toBe("test:test_reason");
  expect(error.meta.reason).toBe("test_reason");
});
```

**Mocks:** Never. Kernel is pure foundation.

---

### 3.2 Core Modules

**Goal:** Verify module contracts without infrastructure.

**Approach:** Unit tests with **boundary mocks** for declared dependencies.

```ts
test("auth module with http dependency", () => {
  // Mock HTTP module (declared dependency)
  const http = createMockHttpModule({
    getCookie: () => "session-token",
  });

  const auth = createAuthModule({ http });
  const result = auth.verify({ cookie: "test" });

  expect(result.isValid).toBe(true);
});
```

**Mocks:** ✅ Only for modules declared as dependencies.

---

### 3.3 Adapters

**Goal:** Verify translation between Comity contracts and external frameworks.

**Approach:** Integration tests with real frameworks.

```ts
test("Hono adapter translates response correctly", async () => {
  const app = new Hono();
  const adapter = createHonoAdapter(app);

  adapter.route("/test", () => new HttpResult(200, { ok: true }));

  const res = await app.request("/test");
  expect(res.status).toBe(200);
  expect(await res.json()).toEqual({ ok: true });
});
```

**Mocks:** ❌ Never. Adapters exist to test real integration.

---

### 3.4 Extensions

**Goal:** Verify policy behavior composes correctly.

**Approach:** Layer boundary tests with mocked modules.

```ts
test("rate limiter extension", async () => {
  // Mock HTTP module (natural boundary)
  const http = createMockHttpModule({
    handle: vi.fn().mockResolvedValue(new HttpResult(200)),
  });

  const withRateLimit = createRateLimiter({ max: 2 });
  const extended = withRateLimit(http);

  // First request: passes
  await extended.handle(createRequest());
  expect(http.handle).toHaveBeenCalledTimes(1);

  // Third request: blocked
  await extended.handle(createRequest());
  await extended.handle(createRequest());
  await expect(extended.handle(createRequest())).rejects.toThrow(RateLimitError);
});
```

**Mocks:** ✅ Necessary and welcome. Extensions exist to compose behavior.

---

### 3.5 Application Layer

**Goal:** Verify business logic and orchestration.

**Approach:**

- **Unit tests** for single use cases (with mocked modules)
- **Integration tests** for complete flows (with real modules)

```ts
// Unit test with boundary mocks
test("create user use case", async () => {
  const db = createMockDbModule({
    users: { create: vi.fn().mockResolvedValue({ id: 1 }) },
  });
  const email = createMockEmailModule();

  const useCase = new CreateUserUseCase(db, email);
  const result = await useCase.execute({ email: "test@example.com" });

  expect(result.success).toBe(true);
  expect(db.users.create).toHaveBeenCalled();
  expect(email.send).toHaveBeenCalled();
});

// Integration test with real modules
test("full user registration flow", async () => {
  const kernel = createTestKernel()
    .use(realDbModule({ database: ":memory:" }))
    .use(realHttpModule({ port: 0 }))
    .use(realEmailModule({ transport: "test" }));

  await kernel.boot();

  const response = await kernel.http.request("POST", "/register", {
    body: { email: "test@example.com" },
  });

  expect(response.status).toBe(201);
  expect(kernel.email.sent[0].to).toBe("test@example.com");
});
```

**Mocks:**

- ✅ Unit tests: mocks at boundaries (modules, database, external services)
- ✅ Integration: real implementations with lightweight test doubles

---

## 4. Mocking Policy

### 4.1 When to Mock

Mock only when crossing a **layer boundary**:

```
Application → Mock → Core Module ✓
Core Module → Mock → Another Core Module ✓ (if declared dependency)
Extension → Mock → Core Module ✓
Adapter → ✗ Never mock the framework
Kernel → ✗ Never mock (foundation)
```

### 4.2 What to Mock

Mock **contracts**, not implementations:

```ts
// ✅ Correct: mock public interface
const http = {
  handle: vi.fn(),
  use: vi.fn(),
  routes: [],
};

// ❌ Wrong: mock internal details
const http = {
  _internalRouter: {/* ... */},
  _middlewareStack: [],
};
```

### 4.3 Mock Hierarchy

Preferred order:

1. **Test doubles** (in-memory implementations, test containers)
2. **Fakes** (simplified but working implementations)
3. **Mocks** (at layer boundaries)
4. **Spies** (observation only, never control)

```ts
// 1. Test double (best)
const db = new InMemoryDatabase();

// 2. Fake (acceptable)
const db = new FakeDatabase();

// 3. Mock (necessary at boundaries)
const db = { query: vi.fn() };

// 4. Spy (use with caution)
const spy = vi.spyOn(db, "query");
```

---

## 5. Layer Boundary Test Pattern

Official pattern for testing across boundaries:

```ts
describe("HTTP → Auth boundary", () => {
  // 1. Setup: mock downstream module
  const auth = createMockAuthModule({
    verify: vi.fn().mockResolvedValue({ userId: 123 }),
  });

  // 2. Subject: upstream module with mocked dependency
  const http = createHttpModule({ auth });

  // 3. Stimulus through public boundary
  const result = await http.handle(
    createRequest({
      headers: { Authorization: "Bearer token" },
    })
  );

  // 4. Verify downstream was called correctly
  expect(auth.verify).toHaveBeenCalledWith({ token: "Bearer token" });

  // 5. Verify result is correct
  expect(result.status).toBe(200);
});
```

---

## 6. Test Data Factories

Keep tests clean and resilient:

```ts
// test/factories/http.ts
export const createTestRequest = (overrides = {}) => ({
  method: "GET",
  path: "/",
  headers: {},
  body: null,
  ...overrides,
});

// test/factories/errors.ts
export const createTestError = (reason: string, meta = {}) => new TestError(reason, meta);

// Usage
test("something", () => {
  const req = createTestRequest({
    method: "POST",
    body: { email: "test@example.com" },
  });
});
```

---

## 7. Testing Anti-Patterns

### ❌ Chain Mocking

```ts
// Bad: mock of mock of mock
const mockDb = { query: vi.fn() };
const mockRepo = { find: vi.fn().mockResolvedValue(mockDb) };
const mockService = { process: vi.fn().mockResolvedValue(mockRepo) };
```

### ❌ Tests Crossing Too Many Layers

```ts
// Bad: test goes from HTTP to SQL without boundaries
test("full stack", async () => {
  // This test is fragile and slow
});
```

### ❌ Mocking Immutables

```ts
// Bad: mocking primitives
vi.spyOn(Array.prototype, "map"); // Never do this
```

---

## 8. Snapshot Testing

Snapshots are:

- ✅ **Allowed** for adapter output (responses, generated HTML)
- ⚠️ **Acceptable** for extension configuration
- ❌ **Forbidden** for kernel state or business logic

```ts
// ✅ Good: adapter response
test("Hono adapter response", async () => {
  const res = await app.request("/api/user");
  expect(await res.json()).toMatchSnapshot();
});

// ❌ Bad: business logic
test("price calculation", () => {
  expect(calculatePrice(100)).toMatchSnapshot(); // Not clear!
});
```

---

## 9. Naming Conventions

```
describe('ComponentOrLayer', () => {
  describe('method or boundary', () => {
    it('should [expected behavior] when [condition]', () => {
      // test
    });
  });
});

// Example
describe('HttpModule with Auth', () => {
  describe('handle authenticated request', () => {
    it('should call auth.verify when Authorization header present', () => {
      // ...
    });

    it('should return 401 when auth.verify throws AuthError', () => {
      // ...
    });
  });
});
```

---

## 10. Summary: When to Mock

| Layer       | Mock Policy                   | Example                                |
| ----------- | ----------------------------- | -------------------------------------- |
| Kernel      | ❌ Never                      | `new BaseError()`                      |
| Core Module | ✅ Only declared dependencies | `createHttpModule({ auth: mockAuth })` |
| Extension   | ✅ Mock extended module       | `withRateLimit(mockHttp)`              |
| Adapter     | ❌ Never                      | Test with real Hono/Fastify            |
| Application | ✅ Mocks at boundaries        | `new UseCase(mockDb, mockEmail)`       |

---

## 11. Error Testing

All error tests MUST:

- Assert error type
- Assert error code
- Assert semantic meaning

```ts
expect(error).toBeInstanceOf(BaseError);
expect(error.code).toBe("auth:invalid_credentials");
expect(error.meta.reason).toBe("invalid_credentials");
```

Do NOT:

- Assert exact error messages
- Depend on stack traces

---

## Final Principle

> Mocks are not evil. Mocks are a tool to isolate layers.
>
> The problem is not the mock, but **where** and **what** is being mocked.

A test that uses mocks at layer boundaries is a good test.
A test that mocks internal details is a fragile test.
A test that never uses mocks is an integration test (and that's fine, if intentional).
