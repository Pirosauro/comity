import type { DiContainer } from "@comity/primitives/di";
import type { BaseError } from "@comity/primitives/errors";
import type { EventBus, HookBus } from "@comity/primitives/lifecycle";
import type { Result } from "@comity/primitives/result";

import type { ModuleSetupContext } from "@comity/composition/setup";

import type { PaymentProvider } from "../contracts/payment-provider.js";
import type { PAYMENT_PROVIDER_TOKEN } from "./constants.js";

/** Hooks exposed by the module */
export interface PaymentModuleHooks {
  /** Called when the payment module is being configured. */
  "@comity/payment:configuring": PaymentModuleOptions;

  /** Called when the payment module has been initialized. */
  "@comity/payment:initialized": undefined;

  [key: string]: unknown;
}

/** Events emitted by the module */
export type PaymentModuleEvents = {};

/**
 * Services exposed by the module
 */
export type PaymentModuleServices = {
  /** Payment provider resolver token */
  [PAYMENT_PROVIDER_TOKEN]: PaymentProvider;
};

/**
 * Context provided to the payment module setup function.
 */
export interface PaymentModuleContext extends ModuleSetupContext<
  PaymentModuleServices,
  PaymentModuleEvents,
  PaymentModuleHooks
> {}

export type PaymentModuleOptions = {
  /** The payment provider to use. Required for production. */
  provider?: import("../contracts/payment-provider").PaymentProvider;
};