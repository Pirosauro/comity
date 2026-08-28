# @comity/payment

Payment domain abstractions for Comity.

---

## Purpose

Defines the payment domain contracts: payment requests, outcomes, provider interfaces, and module setup. Provides the foundation for integrating payment providers without binding to specific payment gateways.

---

## Scope

This package:

- ✅ defines `PaymentRequest`, `PaymentOutcome`, `PaymentStatus` contracts
- ✅ exposes the `PaymentProvider` contract for payment execution
- ✅ provides domain error types for payment failures
- ✅ supplies module setup tokens and metadata for kernel integration

This package does NOT:

- ❌ implement specific payment gateways (Stripe, Adyen, etc.)
- ❌ manage payment method storage or tokenization
- ❌ handle refunds, disputes, or reconciliation
- ❌ encode business rules for payment flows

---

## Public API

- Payment contracts — request, outcome, status, and provider interfaces
- Error types — payment failure reasons and metadata
- Setup tokens — module wiring and configuration

No exhaustive reference; see docs for constraints.

---

## Documentation

- docs/overview.md
- docs/conventions.md

---

## Related Packages

- @comity/pricing — price and money contracts
- @comity/order — order domain (consumes payment outcomes)
- @comity/storefront — storefront checkout (consumes payment provider)
- @comity/composition — module metadata and setup

---

## Status

Stable

_Review Completed: 2026-08-28_
_Reviewer: Automated Audit Remediation_
_Compliance Score: 100% (Green)_