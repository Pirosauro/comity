import type { ModuleMeta } from "@comity/kernel/modules";
import type { AuthJoseEventEmitter } from "../events/auth-jose.js";
import type { JoseAuthModuleOptions } from "./types.js";

import { success } from "@comity/core/result";
import { JoseAuthTokenService } from "../services/auth-token.js";

export const module: ModuleMeta = {
  name: "@comity/auth-jose",
  version: "1.0.0",

  dependsOn: ["@comity/kernel", "@comity/auth"],
  incompatibleWith: [],

  /** @inheritdoc */
  setup: async (options) => {
    return success(async (ctx) => {
      const emitter: AuthJoseEventEmitter = {
        /** @inheritdoc */
        tokenVerified: (payload) => ctx.events.emit("@comity/auth-jose:token_verified", payload),

        /** @inheritdoc */
        tokenInvalid: (payload) => ctx.events.emit("@comity/auth-jose:token_invalid", payload),
      };

      const tokenService = new JoseAuthTokenService(options as JoseAuthModuleOptions, emitter);

      ctx.services.define("auth.token", () => tokenService);

      return success(undefined);
    });
  },
};

export default module;
