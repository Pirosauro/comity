import type { ModuleMeta } from "@comity/composition/setup";
import type { AuthFacade } from "../contracts/auth-facade.js";
import type { AuthEvaluationObserver } from "../observers/evaluation.js";
import type { AuthRefreshEvaluationObserver } from "../observers/refresh.js";
import type { AuthSessionObserver } from "../observers/session.js";
import type { AuthModuleContext, AuthModuleOptions } from "./types.js";

import { CompositionError } from "@comity/composition/errors";
import { failure, success } from "@comity/primitives/result";
import { AuthGuard } from "../guard.js";
import { CreateSession } from "../use-cases/session-create.js";
import { RefreshSession } from "../use-cases/session-refresh.js";
import { RevokeSession } from "../use-cases/session-revoke.js";
import { StepUpSession } from "../use-cases/session-step-up.js";
import { AUTH_TOKEN } from "./constants.js";

const composition: ModuleMeta<AuthModuleOptions, AuthModuleContext> = {
  name: "@comity/auth",
  version: "0.9.0",

  dependsOn: {},
  incompatibleWith: [],

  /** @inheritdoc */
  setup: async (ctx, options) => {
    const initial: AuthModuleOptions = {
      ...options,
    };

    let auth: AuthFacade | undefined;

    ctx.services.define(AUTH_TOKEN, () => auth!);

    return success(async () => {
      const cfg = (await ctx.hooks.execute("@comity/auth:configuring", initial)) ?? initial;

      if (!cfg.repository) {
        return failure(
          new CompositionError("initialization_failed", {
            details: {
              module: "@comity/auth",
              violation: "missing_repository",
            },
          })
        );
      }

      if (!cfg.evaluator) {
        return failure(
          new CompositionError("initialization_failed", {
            details: {
              module: "@comity/auth",
              violation: "missing_evaluator",
            },
          })
        );
      }

      const observers: {
        evaluation: AuthEvaluationObserver & AuthRefreshEvaluationObserver;
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

      const guard = new AuthGuard({
        ...(cfg.guard?.assurance ? { assurance: cfg.guard.assurance } : {}),
        ...(cfg.guard?.revocation ? { revocation: cfg.guard.revocation } : {}),
        ...(cfg.guard?.refresh ? { refresh: cfg.guard.refresh } : {}),
        observer: observers.evaluation,
      });

      const create = new CreateSession(cfg.repository!, cfg.evaluator!, observers.session, guard);
      const refresh = new RefreshSession(cfg.repository!, guard, observers.session);
      const revoke = new RevokeSession(cfg.repository!, observers.session);
      const stepUp = new StepUpSession(cfg.repository!, cfg.evaluator!, guard, observers.session);

      auth = {
        createSession: create.execute.bind(create),
        assertSession: guard.assert.bind(guard),
        refreshSession: refresh.execute.bind(refresh),
        revokeSession: revoke.execute.bind(revoke),
        stepUpSession: stepUp.execute.bind(stepUp),
      };

      await ctx.hooks.execute("@comity/auth:initialized", undefined);

      return success(undefined);
    });
  },
};

export default composition;