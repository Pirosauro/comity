# Decision: No ORM abstraction

## Context

ORMs introduce implicit behaviors, stateful abstractions, and early architectural coupling that do not align with minimal boundary contracts.

## Decision

Do not provide ORM features (entities, relations, repositories, change tracking, schema ownership) in `@comity/sql`.

## Consequences

- Keeps the core stable and focused on SQL execution
- Avoids hidden state and implicit behaviors
- Allows adapters or applications to choose their own higher-level APIs independently
