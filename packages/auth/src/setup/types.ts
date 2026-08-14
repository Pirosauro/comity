import type { ModuleSetupContext } from "@comity/composition/setup";
import type { AuthFacade } from "../contracts/auth-facade.js";
import type { AuthSessionAssuranceEvaluator } from "../contracts/session-assurance-evaluator.js";
import type { AuthSessionAssurancePolicy } from "../contracts/session-assurance-policy.js";
import type { AuthSessionRefreshPolicy } from "../contracts/session-refresh-policy.js";
import type { AuthSessionRepository } from "../contracts/session-repository.js";
import type { AuthSessionRevocationPolicy } from "../contracts/session-revocation-policy.js";
import type { AuthEvaluationObserver } from "../observers/evaluation.js";
import type { AuthRefreshEvaluationObserver } from "../observers/refresh.js";
import type { AuthSessionObserver } from "../observers/session.js";
import type { AUTH_TOKEN } from "./constants.js";

/** Hooks exposed by the module */
export type AuthModuleHooks = {
  /** Executed during module setup, allows modifying initial configuration */
  "@comity/auth:configuring": Partial<AuthModuleOptions>;

  /** Executed when the auth module is initialized. */
  "@comity/auth:initialized": undefined;
};

/** Events emitted by the module */
export type AuthModuleEvents = {
  /** Emitted when a session passes all validation checks */
  "@comity/auth:session_validated": Parameters<AuthEvaluationObserver["onSessionValidated"]>[0];

  /** Emitted when assurance requirements are not met */
  "@comity/auth:assurance_rejected": Parameters<AuthEvaluationObserver["onAssuranceRejected"]>[0];

  /** Emitted when a session fails validation */
  "@comity/auth:session_invalid": Parameters<AuthEvaluationObserver["onSessionInvalid"]>[0];

  /** Emitted when a refresh request passes validation */
  "@comity/auth:refresh_validated": Parameters<
    AuthRefreshEvaluationObserver["onRefreshValidated"]
  >[0];

  /** Emitted when a refresh request is rejected */
  "@comity/auth:refresh_rejected": Parameters<
    AuthRefreshEvaluationObserver["onRefreshRejected"]
  >[0];

  /** Emitted after a new session is successfully created */
  "@comity/auth:session_created": Parameters<AuthSessionObserver["onSessionCreated"]>[0];

  /** Emitted after a session is successfully refreshed */
  "@comity/auth:session_refreshed": Parameters<AuthSessionObserver["onSessionRefreshed"]>[0];

  /** Emitted after a session is successfully revoked */
  "@comity/auth:session_revoked": Parameters<AuthSessionObserver["onSessionRevoked"]>[0];

  /** Emitted after step-up authentication is successfully completed */
  "@comity/auth:step_up_completed": Parameters<AuthSessionObserver["onStepUpCompleted"]>[0];
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
  repository?: AuthSessionRepository;

  /** Assurance evaluator */
  evaluator?: AuthSessionAssuranceEvaluator;

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
