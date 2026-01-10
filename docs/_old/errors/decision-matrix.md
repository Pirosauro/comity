# Error Decision Matrix

**Status:** Authoritative
**Version:** 1.0.0
**Last updated:** 2026-01-08

---

## Purpose

This document defines **when to return a Result** and **when to throw a BaseError** in Comity.

It is normative and must be followed by all core and module code.

---

## Decision table

| Situation                           | Use Result           | Throw Error                |
| ----------------------------------- | -------------------- | -------------------------- |
| Expected domain outcome             | ✅                   | ❌                         |
| Business rule violation             | ✅                   | ❌                         |
| Authorization denied                | ✅ (reason or error) | ❌                         |
| Validation failure                  | ❌                   | ✅ ValidationError         |
| Resource not found (core invariant) | ❌                   | ✅ NotFoundError           |
| External service unavailable        | ❌                   | ✅ ServiceUnavailableError |
| Broken invariant                    | ❌                   | ✅ InternalError           |
| Programmer error                    | ❌                   | ✅ InternalError           |

---

## Rule of thumb

> If the caller is expected to branch, return a Result.
> If the system cannot safely continue, throw a BaseError.

---

## Kernel / Container / Bus policy

- Core infrastructure **may throw BaseError**
- These errors represent system invariants
- They must never return Result

Adapters may catch and adapt these errors.

---

## Forbidden patterns

- Throwing plain `Error`
- Swallowing errors silently
- Returning Result for infrastructure failures
- Mixing Result and throw for the same condition

---

## Example

### Correct

```ts
if (!user) {
  return { success: false, reason: "not_authenticated" };
}
```

```ts
if (!connection) {
  throw new ServiceUnavailableError("Service unavailable");
}
```

---

## Relationship to other documents

- See `ERROR_MODEL.md` for error definitions
- See `RESULT_MODEL.md` for Result structure

This matrix is the **tie-breaker** in case of ambiguity.
