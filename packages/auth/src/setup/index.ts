import type { ModuleMeta } from "@comity/kernel/modules";
import type { AuthFacade } from "../contracts/auth-facade.js";
import type { AuthEvaluationEmitter } from "../events/evaluation.js";
import type { AuthRefreshEvaluationEmitter } from "../events/refresh.js";
import type { AuthSessionEmitter } from "../events/session.js";
import type { AuthModuleOptions } from "./types.js";

import { success } from "@comity/core/result";
import { createToken } from "@comity/kernel";
import { AuthGuard } from "../services/guard.js";
import { CreateSession } from "../use-cases/session-create.js";
import { RefreshSession } from "../use-cases/session-refresh.js";
import { RevokeSession } from "../use-cases/session-revoke.js";
import { StepUpSession } from "../use-cases/session-step-up.js";

export const module: ModuleMeta<AuthModuleOptions> = {
  name: "@comity/auth",
  version: "1.0.0",

  dependsOn: ["@comity/core", "@comity/kernel"],
  incompatibleWith: [],

  /**
   * Initializes the auth module with provided configuration options.
   *
   * Sets up the facade, guard, use cases, and event emitters.
   * Registers the auth facade in the kernel services.
   *
   * @param options - Module configuration object with repository and evaluator
   * @returns Success result containing the auth context
   * @throws {Error} - If required options (repository or evaluator) are not provided
   */
  setup: async (options) => {
    const AUTH_TOKEN = createToken("auth");

    //
    if (typeof options?.repository === "undefined") {
      throw new Error("Auth module requires a session repository");
    }

    if (typeof options?.evaluator === "undefined") {
      throw new Error("Auth module requires a session assurance evaluator");
    }

    return success(async (ctx) => {
      // Event emitters
      const emitters: {
        /** Evaluation emitters */
        evaluation: AuthEvaluationEmitter & AuthRefreshEvaluationEmitter;

        /** Session emitters */
        session: AuthSessionEmitter;
      } = {
        evaluation: {
          /** @inheritdoc */
          sessionValidated: (p) => ctx.events.emit("@comity/auth:session_validated", p),

          /** @inheritdoc */
          assuranceRejected: (p) => ctx.events.emit("@comity/auth:assurance_rejected", p),

          /** @inheritdoc */
          sessionInvalid: (p) => ctx.events.emit("@comity/auth:session_invalid", p),

          /** @inheritdoc */
          refreshValidated: (p) => ctx.events.emit("@comity/auth:refresh_validated", p),

          /** @inheritdoc */
          refreshRejected: (p) => ctx.events.emit("@comity/auth:refresh_rejected", p),
        },

        session: {
          /** @inheritdoc */
          sessionCreated: (p) => ctx.events.emit("@comity/auth:session_created", p),

          /** @inheritdoc */
          sessionRefreshed: (p) => ctx.events.emit("@comity/auth:session_refreshed", p),

          /** @inheritdoc */
          sessionRevoked: (p) => ctx.events.emit("@comity/auth:session_revoked", p),

          /** @inheritdoc */
          stepUpCompleted: (p) => ctx.events.emit("@comity/auth:stepup_completed", p),
        },
      };

      // Guard
      const guard = new AuthGuard({
        ...(options?.guard?.assurance ? { assurance: options.guard.assurance } : {}),
        ...(options?.guard?.revocation ? { revocation: options.guard.revocation } : {}),
        ...(options?.guard?.refresh ? { refresh: options.guard.refresh } : {}),
        emitter: emitters.evaluation,
      });

      // Use cases
      const create = new CreateSession(
        options.repository,
        options.evaluator,
        emitters.session,
        guard
      );
      const refresh = new RefreshSession(options.repository, guard, emitters.session);
      const revoke = new RevokeSession(options.repository, emitters.session);
      const stepUp = new StepUpSession(
        options.repository,
        options.evaluator,
        guard,
        emitters.session
      );

      // Facade
      const auth: AuthFacade = {
        createSession: create.execute.bind(create),
        assertSession: guard.assert.bind(guard),
        refreshSession: refresh.execute.bind(refresh),
        revokeSession: revoke.execute.bind(revoke),
        stepUpSession: stepUp.execute.bind(stepUp),
      };

      // Register facade
      ctx.services.define(AUTH_TOKEN, () => auth);

      // Emit module initialized hook
      await ctx.hooks.execute("@comity/auth:initialized", { token: AUTH_TOKEN });

      return success(undefined);
    });
  },
};

export default module;
