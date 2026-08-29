# @comity/storefront — Conventions

`@comity/storefront` is a Core capability module for storefront page composition.

## Rules

- keep page composition contracts explicit
- keep setup tokens and services in the public boundary when needed
- do not move rendering logic into the core package
- keep dependencies limited to the packages already declared in `package.json`
- checkout orchestration belongs to Applications and Integration Adapters, not this Core module