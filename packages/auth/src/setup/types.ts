import type { ModuleSetupContext } from "@comity/composition";
import type { AuthFacade } from "../contracts/auth-facade.js";
import type { AuthSessionAssuranceEvaluator } from "../contracts/session-assurance-evaluator.js";
import type { AuthSessionAssurancePolicy } from "../contracts/session-assurance-policy.js";
import type { AuthSessionRefreshPolicy } from "../contracts/session-refresh-policy.js";
import type { AuthSessionRepository } from "../contracts/session-repository.js";
import type { AuthSessionRevocationPolicy } from "../contracts/session-revocation-policy.js";
import type { AuthEvaluationEmitter } from "../lifecycle/evaluation.js";
import type { AuthRefreshEvaluationEmitter } from "../lifecycle/refresh.js";
import type { AuthSessionEmitter } from "../lifecycle/session.js";

import type { AUTH_TOKEN } from "./constants.js";

/** Hooks exposed by the module */
export type AuthModuleHooks = {
  /** Executed when the auth module is initialized. */
  "@comity/auth:initialized": {
    /** Token of the initialized auth facade */
    token: typeof AUTH_TOKEN;
  };
};

/** Events emitted by the module */
export type AuthModuleEvents = {
  /** Emitted when a session passes all validation checks */
  "@comity/auth:session_validated": Parameters<AuthEvaluationEmitter["onSessionValidated"]>[0];

  /** Emitted when assurance requirements are not met */
  "@comity/auth:assurance_rejected": Parameters<AuthEvaluationEmitter["onAssuranceRejected"]>[0];

  /** Emitted when a session fails validation */
  "@comity/auth:session_invalid": Parameters<AuthEvaluationEmitter["onSessionInvalid"]>[0];

  /** Emitted when a refresh request passes validation */
  "@comity/auth:refresh_validated": Parameters<
    AuthRefreshEvaluationEmitter["onRefreshValidated"]
  >[0];

  /** Emitted when a refresh request is rejected */
  "@comity/auth:refresh_rejected": Parameters<AuthRefreshEvaluationEmitter["onRefreshRejected"]>[0];

  /** Emitted after a new session is successfully created */
  "@comity/auth:session_created": Parameters<AuthSessionEmitter["onSessionCreated"]>[0];

  /** Emitted after a session is successfully refreshed */
  "@comity/auth:session_refreshed": Parameters<AuthSessionEmitter["onSessionRefreshed"]>[0];

  /** Emitted after a session is successfully revoked */
  "@comity/auth:session_revoked": Parameters<AuthSessionEmitter["onSessionRevoked"]>[0];

  /** Emitted after step-up authentication is successfully completed */
  "@comity/auth:step_up_completed": Parameters<AuthSessionEmitter["onStepUpCompleted"]>[0];
};

/**
 * Services exposed by the module
 */
export type AuthModuleServices = {
  /** Auth facade token */
  [AUTH_TOKEN]: AuthFacade;
};

/**
 * Context provided to the auth module setup function.
 */
export interface AuthModuleContext extends ModuleSetupContext<
  AuthModuleServices,
  AuthModuleEvents,
  AuthModuleHooks
> {}

/** Auth module setup options */
export type AuthModuleOptions = {
  /** Session repository */
  repository: AuthSessionRepository;

  /** Assurance evaluator */
  evaluator: AuthSessionAssuranceEvaluator;

  /** Guard policies */
  guard?: {
    /** Assurance policy */
    assurance?: AuthSessionAssurancePolicy;

    /** Refresh policy */
    refresh?: AuthSessionRefreshPolicy;

    /** Revocation policy */
    revocation?: AuthSessionRevocationPolicy;
  };
};
