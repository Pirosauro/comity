# @comity/storefront — Overview

`@comity/storefront` provides storefront page composition capabilities for Comity.

## What it includes

- page composer contracts (category, content, product, search)
- page model contracts (category, content, product, search)
- storefront context contracts (locale, currency, tenant)
- default page composer implementations
- setup token definitions and module wiring

## What it does not include

- checkout orchestration or workflows (Application/Integration Adapter responsibility)
- payment, inventory, order, or pricing operations
- customer or address loading
- application-level security concepts (Principal, Permission, Scope)
- rendering implementations
- persistence logic
- transport-specific behavior