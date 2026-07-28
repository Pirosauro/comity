# @comity/cache — Conventions

This document defines the normative conventions for `@comity/cache`.

---

## 1. Scope

The package defines cache abstractions and the default cache facade.

It MUST NOT bind to a specific backend.

---

## 2. Public API

- contracts live under `contracts/`
- setup metadata lives under `setup/`
- cache errors remain package-scoped

---

## 3. Store Rules

- stores implement the cache contract
- stores MUST remain replaceable
- stores MUST NOT expose backend-specific behavior through the contract

---

## 4. Cache Keys

- cache keys are serialized explicitly
- cache key serialization is part of the package behavior
- key serialization MUST stay deterministic

---

## 5. Error Handling

- cache errors are typed and finite
- errors represent cache-level failure modes, not application policy
