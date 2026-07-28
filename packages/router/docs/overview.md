# @comity/router — Overview

`@comity/router` defines the routing model used by Comity applications.

It separates routing contracts from routing implementations so that applications can swap the matching engine without changing the higher-level flow.

---

## What it models

- routes
- routers
- route matching
- URL rewriting
- router pipelines

---

## What it is not

- not a concrete routing backend
- not an HTTP response layer
- not a rendering system
