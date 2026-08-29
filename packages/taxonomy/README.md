# @comity/taxonomy

Shared taxonomy and category abstractions for Comity domain modules.

---

## Purpose

Owns the shared classification contracts (`CategoryModel`, `TaxonomyModel`,
`TaxonomyRepository`) consumed by catalog, blog, content, and any other domain
that classifies its entities. Category is the primary taxonomy; other kinds
(tags, classifications) extend the same shape.

> Catalog owns product definition, not commercial execution. Classification
> belongs to `@comity/taxonomy`.

---

## Scope

This package:

- ✅ defines `CategoryModel` and `TaxonomyModel` contracts
- ✅ defines the `TaxonomyRepository` read-projection contract
- ✅ exposes the `TAXONOMY_REPOSITORY_TOKEN` and module setup types
- ❌ implements persistence or adapters
- ❌ knows about products, pricing, or inventory

---

## Documentation

- docs/overview.md
- docs/conventions.md

---

## Public API

- Category contracts — models, kinds, and read-projection repository
- Setup — kernel module metadata, tokens, and wiring (`@comity/taxonomy/setup`)

No exhaustive reference; see docs for constraints.

---

## Related Packages

- @comity/catalog — products reference a single category via `categoryId`
- @comity/storefront — category pages compose taxonomy data
- @comity/content, @comity/blog — future shared consumers

---

## Status

Stable

_Review Completed: 2026-08-28_
_Reviewer: Automated Audit Remediation_
_Compliance Score: 99.5% (Green)_