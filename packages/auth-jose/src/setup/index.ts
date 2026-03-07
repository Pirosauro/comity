import type { ModuleMeta } from "@comity/composition";
import type { AuthJoseEventObserver } from "../hooks/observer.js";
import type { JoseAuthTokenServiceOptions } from "../types.js";
import type { JoseAuthModuleContext, JoseAuthModuleOptions } from "./types.js";

import { success } from "@comity/primitives/result";
import { JoseAuthTokenService } from "../auth-token.js";
import { AUTH_JOSE_TOKEN } from "./constants.js";

export const module: ModuleMeta<JoseAuthModuleOptions, JoseAuthModuleContext> = {
  name: "@comity/auth-jose",
  version: "1.0.0",

  dependsOn: { "@comity/auth": { optional: false } },
  incompatibleWith: [],

  /** @inheritdoc */
  setup: async (options) => {
    return success(async (ctx) => {
      const emitter: AuthJoseEventObserver = {
        /** @inheritdoc */
        onTokenVerified: (payload) => ctx.events.emit("@comity/auth-jose:token_verified", payload),

        /** @inheritdoc */
        onTokenInvalid: (payload) => ctx.events.emit("@comity/auth-jose:token_invalid", payload),
      };

      const tokenService = new JoseAuthTokenService(
        options as JoseAuthTokenServiceOptions,
        emitter
      );

      ctx.services.define(AUTH_JOSE_TOKEN, () => tokenService);

      return success(undefined);
    });
  },
};

export default module;
