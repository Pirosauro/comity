# Decision: Transactions as capabilities

## Context

Implicit connection state obscures transactional boundaries and encourages accidental nesting, making concurrency reasoning harder.

## Decision

Model transactions as an explicit capability (`SqlTransaction`) with `query`, `commit`, and `rollback`.

## Consequences

- Prevents accidental nested transactions
- Clarifies boundaries and lifecycles
- Simplifies concurrent reasoning and error handling
