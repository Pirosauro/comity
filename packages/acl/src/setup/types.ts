import type { AccessRequest } from "../core/types.js";
import type { AccessControlProvider } from "../ports/access-control-provider.js";

/**
 * Hooks emitted by the ACL module during lifecycle events.
 */
export type AclModuleHooks = {
  /**
   * Emitted when ACL service is fully initialized and ready for use.
   */
  "@comity/acl:initialized": AccessControlProvider;
};

/**
 * Events emitted by the ACL module for audit and monitoring.
 */
export type AclModuleEvents = {
  /**
   * Emitted when access is granted to a request.
   */
  "@comity/acl:access-allowed": {
    /** The access request that was allowed */
    readonly request: AccessRequest;

    /** Name of the policy that granted access (if available) */
    readonly policy?: string;

    /** Timestamp when access was granted (seconds since epoch) */
    readonly timestamp: number;
  };

  /**
   * Emitted when access is denied to a request.
   */
  "@comity/acl:access-denied": {
    /** The access request that was denied */
    readonly request: AccessRequest;

    /** Reason for denial (see ACL_ACCESS_DENY_REASONS) */
    readonly reason: string;

    /** Name of the policy that denied access (if available) */
    readonly policy?: string;

    /** Timestamp when access was denied (seconds since epoch) */
    readonly timestamp: number;
  };
};

/**
 * Configuration options for the ACL module.
 *
 * @template S - Subject attribute type
 * @template R - Resource attribute type
 * @template C - Context attribute type
 */
export interface AclModuleOptions<
  S extends Record<string, unknown> = Record<string, unknown>,
  R extends Record<string, unknown> = Record<string, unknown>,
  C extends Record<string, unknown> = Record<string, unknown>
> {
  /**
   * Core access control provider implementation.
   *
   * @remarks
   * This is the heart of the ACL system. Choose from adapters (CASL, custom, etc.)
   * or provide your own implementation.
   *
   * Provider must be thread-safe for concurrent environments.
   * Implementations handle their own connection pooling and error recovery.
   */
  provider: AccessControlProvider<S, R, C>;

  /**
   * Optional policy name resolver for human-readable audit logs.
   *
   * @param input - Action and resource type combination
   * @returns Human-readable policy name, or undefined to use policy IDs
   * @remarks
   * Maps technical action+resource pairs to business-friendly names.
   * If not provided, raw policy identifiers will be used in logs.
   */
  resolvePolicyName?: (input: { action: string; resource: string }) => string;
}

/**
 * Context extensions provided by the ACL module.
 */
export interface AclModuleContext {
  /** Access control service for evaluating permissions */
  acl: AccessControlProvider;
}
