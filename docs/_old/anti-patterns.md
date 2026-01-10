# Comity Anti-patterns – Do & Don’t

This document defines **explicit anti-patterns** in Comity. These are not stylistic preferences: they are **violations of the architecture**.

The goal is to:

- prevent architectural drift
- reduce implicit coupling
- make code AI-generable and reviewable

Each section shows a **Don’t** (what must not exist) and a **Do** (the Comity-correct alternative).

---

## 1. Business Logic in Adapters

### ❌ Don’t

```ts
export async function loginHandler(req, res) {
  const user = await db.users.findByEmail(req.body.email);
  if (!user) return res.status(401).end();

  if (!verifyPassword(req.body.password, user.hash)) {
    return res.status(401).end();
  }

  const token = signJwt({ sub: user.id });
  res.json({ token });
}
```

**Why it’s wrong**

- Adapter owns business rules
- Not reusable
- Impossible to test without HTTP

### ✅ Do

```ts
const result = await authService.login(credentials);

if (!result.ok) {
  return httpError(result.error);
}

return httpOk({ token: result.value.token });
```

**Rule**: adapters translate _inputs/outputs_, never decide.

---

## 2. Throwing Errors for Domain Failures

### ❌ Don’t

```ts
if (!session) {
  throw new Error("SESSION_NOT_FOUND");
}
```

**Why it’s wrong**

- Control flow via exceptions
- Forces try/catch everywhere
- Breaks composability

### ✅ Do

```ts
if (!session) {
  return Err(AuthErrors.sessionNotFound());
}
```

**Rule**: domain failures are **values**, not exceptions.

---

## 3. Boolean Flags Instead of Models

### ❌ Don’t

```ts
function validate(token, { require2FA }: { require2FA: boolean }) {
  if (require2FA && !token.v) return false;
}
```

### ✅ Do

```ts
function validate(token, policy: AuthPolicy) {
  return policy.evaluate(token);
}
```

**Rule**: behavior lives in **policy objects**, never flags.

---

## 4. Time Calculations Spread Everywhere

### ❌ Don’t

```ts
if (Date.now() / 1000 > token.iat + 3600) {
  return false;
}
```

### ✅ Do

```ts
if (!policy.isSessionValid(session, now)) {
  return Invalid("session_expired");
}
```

**Rule**: time logic is centralized and configurable.

---

## 5. Leaking Infrastructure Types

### ❌ Don’t

```ts
function authenticate(req: Request) {
  const auth = req.headers.get("authorization");
}
```

### ✅ Do

```ts
function authenticate(input: AuthInput) {
  return authService.verify(input.token);
}
```

**Rule**: core never knows HTTP, headers, cookies, or frameworks.

---

## 6. Overloaded "Utils"

### ❌ Don’t

```
utils/
  auth.ts
  db.ts
  helpers.ts
```

### ✅ Do

```
core/
  validate.ts
  policy.ts
  refresh.ts

internal/
  time.ts
  crypto.ts
```

**Rule**: files express _capability_, not convenience.

---

## 7. Middleware-Centric Architecture

### ❌ Don’t

```ts
app.use(authMiddleware);
```

### ✅ Do

```ts
const auth = createAuthService(deps);
const result = auth.verify(input);
```

**Rule**: middleware is optional sugar, never the core abstraction.

---

## 8. Dynamic, Untyped Event Payloads

### ❌ Don’t

```ts
emit("auth", { data: anything });
```

### ✅ Do

```ts
emit<AuthEvents["auth:validated"]>("auth:validated", payload);
```

**Rule**: every event has a name, a contract, and a meaning.

---

## 9. Silent Fallbacks

### ❌ Don’t

```ts
const ttl = config.ttl || 3600;
```

### ✅ Do

```ts
assertPolicyComplete(policy);
```

**Rule**: missing configuration is a _design-time_ failure.

---

## 10. Mixing Read and Write Models

### ❌ Don’t

```ts
session.lastSeen = now;
store.save(session);
```

### ✅ Do

```ts
store.recordUsage(session.id, now);
```

**Rule**: mutation is explicit, never incidental.

---

## Summary Rules (Non-Negotiable)

- Core returns values, not side effects
- Adapters translate, never decide
- Policies encode behavior
- Errors are typed values
- Time, crypto, IO are centralized
- Explicit beats clever

If code violates one of these, it is **not Comity**, even if it works.
