# @comity/taxonomy — Overview

`@comity/taxonomy` is the shared contract package for classifications in Comity.

It exists so multiple domain modules (catalog, blog, content) can classify
their entities with a single, shared taxonomy shape instead of each owning a
category model.

## What it includes

- `CategoryModel` — id, url, name, slug, description, parentId, image
- `TaxonomyModel` — category shape plus a `kind` (`category` | `tag`)
- `TaxonomyRepository` — read-projection contract (`getById`, `getBySlug`, `search`)
- `TAXONOMY_REPOSITORY_TOKEN` and module setup types

## What it does not include

- persistence implementations
- product, pricing, or inventory models
- rendering or UI composition