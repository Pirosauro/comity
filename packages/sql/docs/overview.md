# @comity/sql — Overview

`@comity/sql` defines the minimal, stable abstraction used by Comity to interact with SQL databases.

It is a **boundary module**, not an ORM, not a query builder, and not a persistence framework.

Its responsibility is to define:

- how SQL queries are executed
- how results are represented
- how failures are classified
- how transactional boundaries are expressed

It deliberately does NOT define:

- schemas
- migrations
- entities or repositories
- query builders
- connection pooling policies

## Design Principles

- Explicit over implicit
- Errors are data, not exceptions
- Transactions are capabilities
- No global state
- No framework or runtime assumptions
- Adapters translate, core defines semantics
