# Decision: Lifecycle is a public concept

## Context

Modules need a stable way to signal and react to domain lifecycle without exposing implementation details or runtime coupling.

## Decision

Lifecycle and event signaling are core primitives exposed as a single conceptual domain. Contracts and minimal implementations are public; mechanisms remain simple and environment-neutral.

## Consequences

- Consumers can subscribe/emit events without framework dependencies.
- Error handling is delegated via callbacks; no global policies are encoded.
- Complex orchestration moves to higher-level packages if needed.
