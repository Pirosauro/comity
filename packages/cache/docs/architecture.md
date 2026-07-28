# @comity/cache — Architecture

`@comity/cache` is organized around a small set of stable cache abstractions.

---

## Package Structure

- `contracts/` defines cache and store contracts
- `error/` defines cache errors
- `facade.ts` coordinates cache behavior
- `serialize.ts` handles cache key serialization
- `setup/` contains module metadata and wiring contracts
- `stores/` contains cache store implementations

---

## Runtime Flow

1. Application code uses the cache facade or store contract.
2. Cache keys are serialized explicitly.
3. A store performs the actual cache operation.
4. Errors are normalized into cache-specific failures.

---

## Boundary Rules

- the package does not commit to any specific backend
- backend adapters belong in separate packages
- application-specific caching policy does not belong here

