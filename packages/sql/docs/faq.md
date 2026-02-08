# FAQ

## Why does this module exist?

To prevent SQL concerns from leaking into domain and framework layers.

## Why not Prisma / Kysely / Drizzle directly?

Those are adapters. This module defines the semantic boundary.

## Does this support non-SQL databases?

No. This module is intentionally SQL-specific.
