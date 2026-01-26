import type { ModuleMeta } from "@comity/kernel/modules";
import type { AuthJoseEventEmitter } from "../events/auth-jose.js";
import type { JoseAuthModuleOptions } from "./types.js";

import { createToken } from "@comity/kernel";
import { success } from "@comity/primitives/result";
import { JoseAuthTokenService } from "../services/auth-token.js";

export const module: ModuleMeta = {
  name: "@comity/auth-jose",
  version: "1.0.0",

  dependsOn: ["@comity/primitives", "@comity/kernel", "@comity/auth"],
  incompatibleWith: [],

  /** @inheritdoc */
  setup: async (options) => {
    const TOKEN = createToken("auth-jose");

    return success(async (ctx) => {
      const emitter: AuthJoseEventEmitter = {
        /** @inheritdoc */
        tokenVerified: (payload) => ctx.events.emit("@comity/auth-jose:token_verified", payload),

        /** @inheritdoc */
        tokenInvalid: (payload) => ctx.events.emit("@comity/auth-jose:token_invalid", payload),
      };

      const tokenService = new JoseAuthTokenService(options as JoseAuthModuleOptions, emitter);

      ctx.services.define(TOKEN, () => tokenService);

      // Emit module initialized hook
      await ctx.hooks.execute("@comity/auth-jose:initialized", { token: TOKEN });

      return success(undefined);
    });
  },
};

export default module;
