# @comity/order — Overview

`@comity/order` provides order contracts and models for Comity commerce flows.

## What it includes

- order, item, and product models with status lifecycle
- order repository contracts
- order-specific errors

## What it does not include

- persistence implementations
- checkout orchestration
- transport-specific behavior

## Design

An order unifies the cart and order concepts. A cart is an order in `"draft"` status.
The status lifecycle is:

```
draft → pending → confirmed → fulfilled
  ↓        ↓          ↓
  └────────┴──────────┴── cancelled
```

Any order in `draft`, `pending`, or `confirmed` status can be cancelled.

Open question: `OrderRepository` currently mirrors the legacy `CartRepository` interface.
Future operations may include `create`, `submit` (draft → pending), `confirm`, `fulfill`,
`updateStatus`, and `list` for order history.