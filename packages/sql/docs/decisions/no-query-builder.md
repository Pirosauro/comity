# Decision: No query builder

@comity/sql does not provide a query builder.

Queries are:

- raw SQL (text + values)
- or opaque adapter-specific objects

This keeps the core stable and allows adapters to innovate independently.
