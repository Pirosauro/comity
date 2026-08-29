import type { ModuleMeta } from "@comity/composition/setup";
import { success } from "@comity/primitives/result";
import type { PaymentProvider } from "../contracts/payment-provider.js";

import { PAYMENT_PROVIDER_TOKEN } from "./constants.js";
import type { PaymentModuleContext, PaymentModuleServices } from "./types.js";

export type PaymentModuleOptions = {
  /** The payment provider to use. Required for production. */
  provider?: PaymentProvider;
};

export default {
  name: "@comity/payment",
  version: "0.1.0",

  dependsOn: {},
  incompatibleWith: [],

  /** @inheritdoc */
  setup: async (ctx: PaymentModuleContext, options?: PaymentModuleOptions) => {
    const initial: PaymentModuleOptions = {
      ...(options ?? {}),
    };

    let provider: PaymentModuleServices[typeof PAYMENT_PROVIDER_TOKEN] | undefined;

    ctx.services.define(PAYMENT_PROVIDER_TOKEN, () => provider!);

    return success(async () => {
      const cfg = (await ctx.hooks.execute("@comity/payment:configuring", initial)) ?? initial;

      if (!cfg.provider) {
        // No provider configured; the service will throw if resolved without one.
        // This is intentional: the Application must wire a provider.
      } else {
        provider = cfg.provider;
      }

      await ctx.hooks.execute("@comity/payment:initialized", undefined);

      return success(undefined);
    });
  },
} satisfies ModuleMeta<PaymentModuleOptions, PaymentModuleContext>;
