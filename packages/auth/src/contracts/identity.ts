/**
 * Identity unique identifier
 */
export type IdentityId = string;

/**
 * Identity contract
 */
export interface Identity {
  /** Identity unique identifier */
  readonly id: IdentityId;

  /** Identity roles */
  readonly roles: readonly string[];

  /** Optional claims */
  readonly claims?: Readonly<Record<string, unknown>>;
}
