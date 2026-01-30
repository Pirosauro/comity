# Decision: Errors are semantic, not transport-bound

## Context

Consumers need error primitives that express failure semantics consistently across environments without coupling to transport or infrastructure concerns.

## Decision

Error primitives express semantic failure states. They may include suggested HTTP status codes as metadata, but they do not depend on HTTP or any transport.

## Consequences

- Errors are reusable across environments (server, CLI, workers).
- Metadata remains transport-agnostic and stable.
- Transport-specific behavior (responses, logging) is excluded from primitives.
