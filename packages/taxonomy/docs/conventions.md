# @comity/taxonomy — Conventions

This document defines the conventions for `@comity/taxonomy`.

---

## 1. Scope

The package is contract-only.

It MUST NOT grow into a persistence, content, or catalog module.

---

## 2. Shared Ownership

- the taxonomy shape is shared across modules
- changes to the model are contract changes affecting every consumer
- domain-specific taxonomies (e.g. product category) refine the shared shape;
  they do not fork it

---

## 3. Repository

- `TaxonomyRepository` is a read-projection port
- it returns `Result<T, RepositoryError>` and `null` for missing items
- no write or domain-command surface is exposed