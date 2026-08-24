# @comity/order — Conventions

`@comity/order` is a Core Module that defines domain contracts for the order domain.

## Rules

- keep contracts and models explicit
- keep error types inside the `error` subpath
- depend only on the packages already declared in `package.json`
- do not add persistence or transport logic
- do not add checkout orchestration
- do not mutate order status except through the entity's transition methods
- do not validate coupons or apply promotion rules inside this package
- keep the Repository as a persistence boundary: no business commands on `OrderRepository`

## Status Lifecycle

The order status follows a linear lifecycle. No status can transition backwards.
See `docs/overview.md` for the full transition diagram.