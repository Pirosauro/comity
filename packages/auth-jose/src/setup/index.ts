import type { AuthModuleContext } from "@comity/auth/setup";
import type { ModuleMeta } from "@comity/composition/setup";
import type { AuthJoseEventObserver } from "../observers/observer.js";
import type { JoseAuthTokenServiceOptions } from "../types.js";
import type { JoseAuthModuleContext, JoseAuthModuleOptions } from "./types.js";

import { AUTH_TOKEN } from "@comity/auth/setup";
import { DefaultAuthTokenFacade } from "@comity/auth-tokens";
import { CompositionError } from "@comity/composition/errors";
import { failure, success } from "@comity/primitives/result";
import { JoseAuthTokenService } from "../auth-token.js";
import { AUTH_JOSE_TOKEN } from "./constants.js";

export { AUTH_JOSE_TOKEN } from "./constants.js";
export type {
  JoseAuthModuleContext,
  JoseAuthModuleEvents,
  JoseAuthModuleHooks,
  JoseAuthModuleOptions,
  JoseAuthModuleServices,
} from "./types.js";

export const module: ModuleMeta<JoseAuthModuleOptions, JoseAuthModuleContext & AuthModuleContext> =
  {
    name: "@comity/auth-jose",
    version: "0.9.0",

    dependsOn: { "@comity/auth": { optional: false } },
    incompatibleWith: [],

    /** @inheritdoc */
    setup: async (ctx, options) => {
      const initial: JoseAuthModuleOptions = {
        ...options,
      };

      let facade: DefaultAuthTokenFacade | undefined;

      ctx.services.define(AUTH_JOSE_TOKEN, () => facade!);

      // Init
      return success(async () => {
        const cfg = (await ctx.hooks.execute("@comity/auth-jose:configuring", initial)) ?? initial;

        // validate required configuration
        if (!cfg.issuer) {
          return failure(
            new CompositionError("initialization_failed", {
              details: {
                module: "@comity/auth-jose",
                violation: "missing_issuer",
              },
            })
          );
        }

        if (!cfg.accessKey) {
          return failure(
            new CompositionError("initialization_failed", {
              details: {
                module: "@comity/auth-jose",
                violation: "missing_access_key",
              },
            })
          );
        }

        if (!cfg.refreshKey) {
          return failure(
            new CompositionError("initialization_failed", {
              details: {
                module: "@comity/auth-jose",
                violation: "missing_refresh_key",
              },
            })
          );
        }

        const observer: AuthJoseEventObserver = {
          /** @inheritdoc */
          onTokenVerified: (payload) =>
            ctx.events.emit("@comity/auth-jose:token_verified", payload),

          /** @inheritdoc */
          onTokenInvalid: (payload) => ctx.events.emit("@comity/auth-jose:token_invalid", payload),
        };

        const auth = ctx.services.resolve(AUTH_TOKEN);
        const tokenService = new JoseAuthTokenService(cfg as JoseAuthTokenServiceOptions, observer);
        facade = new DefaultAuthTokenFacade(auth, tokenService);

        await ctx.hooks.execute("@comity/auth-jose:initialized", undefined);

        return success(undefined);
      });
    },
  };

export default module;
