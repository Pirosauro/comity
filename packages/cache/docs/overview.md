# @comity/cache — Overview

`@comity/cache` defines the cache abstraction used across Comity.

It separates cache contracts from cache backend implementations so that stores can be replaced without changing application logic.

---

## What it models

- cache entries and operations
- cache stores
- cache key serialization
- module setup and wiring

---

## What it is not

- not a Redis client
- not a persistence engine
- not a business-policy module
