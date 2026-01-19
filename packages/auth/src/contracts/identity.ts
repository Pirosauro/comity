/**
 * Identity contract
 */
export interface Identity {
  /** Identity unique identifier */
  id: string;

  /** Identity roles */
  roles: readonly string[];

  /** Optional claims */
  claims?: Record<string, unknown>;
}
