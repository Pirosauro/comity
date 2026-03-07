import type { ModuleMeta } from "@comity/composition";
import type { AuthFacade } from "../contracts/auth-facade.js";
import type { AuthEvaluationObserver } from "../hooks/evaluation.js";
import type { AuthRefreshEvaluationObserver } from "../hooks/refresh.js";
import type { AuthSessionObserver } from "../hooks/session.js";
import type { AuthModuleContext, AuthModuleOptions } from "./types.js";

import { success } from "@comity/primitives/result";
import { AuthGuard } from "../guard.js";
import { CreateSession } from "../use-cases/session-create.js";
import { RefreshSession } from "../use-cases/session-refresh.js";
import { RevokeSession } from "../use-cases/session-revoke.js";
import { StepUpSession } from "../use-cases/session-step-up.js";
import { AUTH_TOKEN } from "./constants.js";

export const module: ModuleMeta<AuthModuleOptions, AuthModuleContext> = {
  name: "@comity/auth",
  version: "1.0.0",

  dependsOn: {},
  incompatibleWith: [],

  /**
   * Initializes the auth module with provided configuration options.
   *
   * Sets up the facade, guard, use cases, and event observers.
   * Registers the auth facade in the kernel services.
   *
   * @param options - Module configuration object with repository and evaluator
   *
   * @returns Success result containing the auth context
   *
   * @throws {Error} - If required options (repository or evaluator) are not provided
   */
  setup: async (options) => {
    //
    if (typeof options?.repository === "undefined") {
      throw new Error("Auth module requires a session repository");
    }

    if (typeof options?.evaluator === "undefined") {
      throw new Error("Auth module requires a session assurance evaluator");
    }

    return success(async (ctx) => {
      // Events
      const observers: {
        /** Evaluation observers */
        evaluation: AuthEvaluationObserver & AuthRefreshEvaluationObserver;

        /** Session observers */
        session: AuthSessionObserver;
      } = {
        evaluation: {
          /** @inheritdoc */
          onSessionValidated: (p) => ctx.events.emit("@comity/auth:session_validated", p),

          /** @inheritdoc */
          onAssuranceRejected: (p) => ctx.events.emit("@comity/auth:assurance_rejected", p),

          /** @inheritdoc */
          onSessionInvalid: (p) => ctx.events.emit("@comity/auth:session_invalid", p),

          /** @inheritdoc */
          onRefreshValidated: (p) => ctx.events.emit("@comity/auth:refresh_validated", p),

          /** @inheritdoc */
          onRefreshRejected: (p) => ctx.events.emit("@comity/auth:refresh_rejected", p),
        },

        session: {
          /** @inheritdoc */
          onSessionCreated: (p) => ctx.events.emit("@comity/auth:session_created", p),

          /** @inheritdoc */
          onSessionRefreshed: (p) => ctx.events.emit("@comity/auth:session_refreshed", p),

          /** @inheritdoc */
          onSessionRevoked: (p) => ctx.events.emit("@comity/auth:session_revoked", p),

          /** @inheritdoc */
          onStepUpCompleted: (p) => ctx.events.emit("@comity/auth:step_up_completed", p),
        },
      };

      // Guard
      const guard = new AuthGuard({
        ...(options?.guard?.assurance ? { assurance: options.guard.assurance } : {}),
        ...(options?.guard?.revocation ? { revocation: options.guard.revocation } : {}),
        ...(options?.guard?.refresh ? { refresh: options.guard.refresh } : {}),
        observer: observers.evaluation,
      });

      // Use cases
      const create = new CreateSession(
        options.repository,
        options.evaluator,
        observers.session,
        guard
      );
      const refresh = new RefreshSession(options.repository, guard, observers.session);
      const revoke = new RevokeSession(options.repository, observers.session);
      const stepUp = new StepUpSession(
        options.repository,
        options.evaluator,
        guard,
        observers.session
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

      return success(undefined);
    });
  },
};

export default module;
