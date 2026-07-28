# @comity/application — Conventions

`@comity/application` is an application-support package.

## Rules

- depend only on lower Comity layers
- keep exports small and explicit
- use the `errors` subpath for application-specific error types
- do not introduce infrastructure-specific types into the public API

## Error handling

Errors are represented as application-level errors and should remain scoped to
this package boundary.

