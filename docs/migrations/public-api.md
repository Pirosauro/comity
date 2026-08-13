# Public API Migration Plan — @comity/*

This document tracks the migration of existing `@comity/*` packages toward the
normative rules defined in `docs/standards/public-api.md`.

It does **not** redefine the standard. It records which packages are not yet
compliant, the severity of each gap, and the required action.

Normative rules: see `docs/standards/public-api.md`.

---

## 1. Scope of This Document

- Catalog of non-conforming packages and their gaps
- Severity classification (P0–P6)
- Required actions per package
- Pending decisions that affect migration order

Approved architectural decisions (out of scope here):

- `@comity/storefront` is a **domain Core Module**, not an adapter
- `DefaultProductPageComposer` and similar are **canonical domain implementations**, not facades
- Public Entities follow the `Customer` pattern (entity class + value-object id + snapshot types + repository contract)
- One Adapter = one package = one technology
- Core Modules MUST NOT contain technology-specific code

---

## 2. Severity Tiers

| Tier  | Meaning                                                          |
| ----- | ---------------------------------------------------------------- |
| P0    | Empty or unusable public API. Blocks consumers immediately.      |
| P1    | Architectural violation. Misleading or unstable contract.        |
| P2    | Wrong export kind or misplaced wiring. API surface correct but leaky. |
| P3    | Dead code or partial ADR compliance.                              |
| P4–P6 | Style, documentation, naming drift.                              |

---

## 3. P0 — Immediate

| Package                      | Issue        | Action                                            |
| ---------------------------- | ------------ | ------------------------------------------------- |
| `@comity/cache-kv`           | Empty barrel | Export `KvCacheStore` from root                   |
| `@comity/cache-redis`        | Empty barrel | Export `RedisCacheStore` from root                |
| `@comity/storefront-magento` | Empty barrel | Export `CachedCatalogRepositoryContext` from root |

---

## 4. P1 — Critical

| Package               | Issue                          | Action                                                                                                                |
| --------------------- | ------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| `@comity/auth`        | 18 exports including types     | Move `CompositeAssuranceEvaluator`, `AuthGuard` to appropriate sub-entrypoint. Move types/interfaces to `export type` |
| `@comity/http`        | Client enforced implementation | Issue separate, move to adapter packages                                                                              |
| `@comity/kernel`      | Hooks path                     | Migrate to `/observers`, move wiring types to `/setup`                                                                |
| `@comity/composition` | Wiring types in root           | Move to `/setup`                                                                                                      |

---

## 5. P2 — High

| Package               | Issue                                                      | Action                                               |
| --------------------- | ---------------------------------------------------------- | ---------------------------------------------------- |
| `@comity/auth-tokens` | Topics exported as values                                  | Convert to `export type`                             |
| `@comity/cache`       | `DefaultCache`, `serializeCacheKey`, `CACHE_TOKEN` in root | Evaluate if canonical; move to `/facade` if external |
| `@comity/storage`     | `DefaultStorage`, `STORAGE_TOKEN` in root                  | Evaluate if canonical; move to `/facade` if external |

---

## 6. P3 — Medium

| Package                 | Issue                     | Action                                         |
| ----------------------- | ------------------------- | ---------------------------------------------- |
| `@comity/hydration`     | Dead code commented       | Remove or export properly                      |
| `@comity/order`         | Verify ADR-002 compliance | Ensure `OrderCommands` exists as separate port |
| `@comity/i18n-typesafe` | Wiring types in root      | Move to `/setup`                               |

---

## 7. P4–P6 — Low

| Package | Issue                        | Action                        |
| ------- | ---------------------------- | ----------------------------- |
| Various | TypeScript exports as values | Convert to `export type`      |
| Various | Missing docs/README          | Add documentation             |
| Various | Wrong sub-entrypoint names   | Rename `hooks` to `observers` |

---

## 8. Hooks → Observers Migration

Rule reference: `docs/standards/public-api.md` §5.

| Old Path       | New Path           | Status  |
| -------------- | ------------------ | ------- |
| `auth/hooks`   | `auth/observers`   | Migrate |
| `html/hooks`   | `html/observers`   | Migrate |
| `http/hooks`   | `http/observers`   | Migrate |
| `kernel/hooks` | `kernel/observers` | Migrate |

Hooks are lifecycle extension points called by the framework/kernel.
Observers are passive subscribers implemented by consumers. The migration
removes the dual semantic of `hooks/` and aligns every package with the
observer pattern.

---

## 9. Empty Barrels

| Package                      | Required root export                  |
| ---------------------------- | ------------------------------------- |
| `@comity/cache-kv`           | `KvCacheStore`                        |
| `@comity/cache-redis`        | `RedisCacheStore`                     |
| `@comity/storefront-magento` | `CachedCatalogRepositoryContext`      |

Rule reference: `docs/standards/public-api.md` §2 (Adapters MUST export the concrete implementation of the Core Module contract).

---

## 10. `export type` Conversion

| Package            | Symbol(s)                   | Current | Target         |
| ------------------ | --------------------------- | ------- | -------------- |
| `@comity/auth-tokens` | Topic types              | `export` | `export type`  |
| Various              | TypeScript-only exports   | `export` | `export type`  |

Rule reference: `docs/standards/public-api.md` §8.

---

## 11. `@comity/http` Client Task

Current state: `@comity/http` exposes an enforced client implementation
alongside the contract.

Required direction:

- Core Module `@comity/http` keeps the request/response contract only.
- Concrete client implementations move to dedicated adapter packages
  (one adapter per transport technology).

Pending decisions:

- Adapter naming (e.g. `@comity/http-fetch`, `@comity/http-node`).
- Whether existing consumers are migrated in lockstep or behind a deprecation alias.

---

## 12. Pending Decisions

| Topic                              | Decision needed                                                                 |
| ---------------------------------- | ------------------------------------------------------------------------------- |
| `@comity/http` client adapters     | Adapter naming and migration strategy for existing consumers                    |
| `@comity/cache` root exports       | Whether `DefaultCache`/`CACHE_TOKEN` are canonical or move to `/facade`         |
| `@comity/storage` root exports     | Whether `DefaultStorage`/`STORAGE_TOKEN` are canonical or move to `/facade`      |
| `@comity/order` ADR-002 compliance | Confirm `OrderCommands` exists as a separate port                              |

Each pending decision may shift the migration order in §3–§7.

---

## 13. How to Use This Document

1. Start from P0 and work upward in severity.
2. For each package, apply the action in the row before moving on.
3. When a pending decision is resolved, update §12 and adjust the relevant rows.
4. Once a package is compliant, remove its row from §3–§7.
