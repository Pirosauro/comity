# @comity/auth-jose — Conventions

`@comity/auth-jose` is an adapter/integration package.

## Rules

- depend on `@comity/auth` and `@comity/auth-tokens`
- keep JOSE-specific details inside the package boundary
- do not introduce a separate public domain error contract
- use the auth module semantics when translating failures

## Public API

- keep the surface limited to `JoseAuthTokenService`
- expose setup hooks only when needed for composition

