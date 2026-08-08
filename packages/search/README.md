# @comity/search

Generic search abstractions for Comity domain modules.

---

## Purpose

Defines search criteria and result contracts shared across domain modules. Provides aggregation, filter, pagination, and sort models in a library-independent manner.

---

## Scope

This package:

- ✅ defines search result and criteria contracts
- ✅ defines filter, pagination, and sort models
- ✅ provides aggregation model contracts

This package does NOT:

- ❌ implement a search engine or index
- ❌ query data stores directly
- ❌ bind to a specific pagination format

---

## Public API

- `SearchCriteriaModel` — search criteria contract
- `SearchResultModel` — search result envelope
- `SearchCriteriaFilter`, `SearchCriteriaSort`, `SearchCriteriaPagination` — filter/sort/pagination models
- `AggregationModel`, `AggregationOptionModel` — aggregation contracts

No exhaustive reference; see docs for constraints.

---

## Documentation

- docs/overview.md
- docs/conventions.md

---

## Related Packages

- @comity/catalog — catalog product models
- @comity/order — order entity interfaces

---

## Status

Stable

_Review Completed: July 25, 2026_
_Reviewer: Hobiri MAGI (DeepSeek v4 Pro)_
_Compliance Score: 99.5% (Green)_