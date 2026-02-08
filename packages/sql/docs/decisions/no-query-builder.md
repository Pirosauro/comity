# Decision: No query builder

## Context

Query builders add non-SQL abstractions and complexity, coupling the core to specific patterns and limiting adapter flexibility.

## Decision

Do not include a query builder. Queries are either raw SQL (`text` + `params`) or opaque adapter-specific objects.

## Consequences

- Core remains stable and minimal
- Adapters can innovate independently
- Applications can choose their preferred builder externally if needed
