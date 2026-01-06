import type { AbilityClass, PureAbility } from "@casl/ability";

/**
 * Configuration options for CASL adapter.
 */
export interface CaslAdapterOptions {
  /**
   * CASL Ability class constructor.
   *
   * @remarks
   * Usually the Ability class from @casl/ability package.
   * Must be compatible with PureAbility interface.
   */
  readonly Ability: AbilityClass<PureAbility>;

  /**
   * Factory function that creates CASL abilities for subjects.
   *
   * @template A - Subject attributes type
   * @param subject - The subject requesting access
   * @returns PureAbility instance configured for the subject
   * @remarks
   * This function is called for each access request to create
   * subject-specific ability definitions. Implementations should
   * define can/cannot rules based on subject roles and attributes.
   */
  readonly defineAbility: <A extends Record<string, unknown>>(subject: {
    /** Subject unique identifier */
    readonly id: string;
    /** Subject roles (if any) */
    readonly roles?: readonly string[];
    /** Subject attributes */
    readonly attributes?: A;
  }) => PureAbility;

  /**
   * Optional policy name resolver for audit logs.
   *
   * @param params - Action and resource combination
   * @returns Human-readable policy name or undefined
   * @remarks
   * Maps technical action+resource pairs to business-friendly names.
   * Used in audit logs and error messages.
   */
  readonly resolvePolicyName?: (params: {
    /** Action being performed */
    readonly action: string;
    /** Resource type being accessed */
    readonly resource: string;
  }) => string;
}
