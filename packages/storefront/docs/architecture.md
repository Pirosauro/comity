# @comity/storefront — Architecture

`@comity/storefront` is organized around page composers and page models.

## Main areas

- `composers/` — default page composer implementations
- `contracts/` — page, context, and composer contracts
- `setup/` — module setup and token wiring
- `handler.ts` — entrypoint logic for storefront composition

## Architectural note

The package stays focused on storefront composition and leaves rendering or
transport rendering to separate layers.

