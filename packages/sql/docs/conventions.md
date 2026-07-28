# @comity/sql — Conventions

`@comity/sql` is a boundary Core Module.

## Rules

- keep SQL semantics explicit and driver-agnostic
- represent failures with the module error type
- model transactions as capabilities
- keep hooks and observability separate from query contracts
- do not introduce ORM- or driver-specific types into the public surface

