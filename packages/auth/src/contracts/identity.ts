/**
 * Identity unique identifier.
 *
 * @remarks
 * `IdentityId` is a primitive alias because `Identity` is an authorization
 * projection over an externally-owned principal (`@comity/identity.User`).
 * Comity does not own the identity lifecycle; the identifier is used here
 * solely to reference an external identity inside an auth context. This
 * matches the read-projection exception in `domain-modeling.md §3`.
 */
export type IdentityId = string;

/**
 * Identity contract.
 *
 * @remarks
 * `Identity` is a read projection used for authorization. The principal it
 * references is owned by `@comity/identity.User`; this projection carries
 * only the auth-relevant claims and roles derived from that principal.
 */
export interface Identity {
  /** Identity unique identifier */
  readonly id: IdentityId;

  /** Identity roles */
  readonly roles: readonly string[];

  /** Optional claims */
  readonly claims?: Readonly<Record<string, unknown>>;
}
