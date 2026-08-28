/**
 * Context required to evaluate an authorization decision.
 *
 * The ACL module is intentionally generic: it does not interpret the
 * meaning of subject, action, resource, or context. It only provides
 * the semantic structure for the authorization question:
 *
 *   "Can <subject> perform <action> on <resource> [under <context>]?"
 *
 * All commercial, organizational, and policy-specific interpretation
 * belongs to the Application Layer.
 */
export interface AuthorizationContext {
  /** The subject requesting authorization. */
  readonly subject: string;

  /** The action being requested. */
  readonly action: string;

  /** The resource being accessed. */
  readonly resource: string;

  /** Optional opaque contextual data for policy evaluation. */
  readonly context?: Readonly<Record<string, unknown>>;
}