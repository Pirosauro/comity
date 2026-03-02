# Kernel Conventions

## API Discipline

- Kernel APIs are orchestration-only
- No domain logic is allowed
- No transport assumptions are allowed

---

## Errors

- Kernel errors are diagnostic
- They are not part of the public API
- Consumers must rely on error codes, not classes

---

## Stability

- Kernel APIs are stable once documented
- Behavior changes require justification
- Internal changes must not leak outward

---

## Summary

The kernel exists to coordinate, not to decide.
