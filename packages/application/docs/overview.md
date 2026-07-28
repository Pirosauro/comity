# @comity/application — Overview

`@comity/application` exposes small application-level contracts used to resolve
view/application results across Comity applications.

## What it includes

- `ApplicationContract`
- `ApplicationResolver`
- `ApplicationResult`
- `resolveContract`
- `errors` subpath for application-specific errors

## What it does not include

- domain logic
- transport logic
- rendering implementations
- persistence implementations

## Role in the ecosystem

This package helps applications bridge domain results to view/rendering flows
without moving that responsibility into core modules.

