import type { MongoAbility } from "@casl/ability";
import type { AuthorizationContext, AuthorizationDecision, Authorizer } from "@comity/acl";
import type { AuthorizationError } from "@comity/acl/errors";
import type { Result } from "@comity/primitives/result";

import { AuthorizationError as AuthorizationErrorClass } from "@comity/acl/errors";
import { failure, success } from "@comity/primitives/result";

/**
 * CASL-backed implementation of the {@link Authorizer} interface.
 *
 * This adapter wraps a CASL {@link Ability} and translates
 * {@link AuthorizationContext} into CASL's `can` evaluation.
 *
 * CASL-specific types (Ability, conditions, MongoQuery, field-level
 * permissions, etc.) remain encapsulated in this adapter and do not
 * leak into the Core ACL contracts.
 */
export class CaslAuthorizer implements Authorizer {
  readonly #ability: MongoAbility;
  readonly #subjectClassCache: Map<string, new (data: object) => object> = new Map();

  /**
   * @param ability - The CASL Ability instance to use for authorization.
   */
  constructor(ability: MongoAbility) {
    this.#ability = ability;
  }

  /**
   * @inheritdoc
   */
  async authorize(
    context: AuthorizationContext
  ): Promise<Result<AuthorizationDecision, AuthorizationError>> {
    const { subject, action, resource, context: authContext } = context;

    // Build the CASL subject from resource and context
    // CASL evaluates conditions against subject instances.
    // We create a class dynamically for the resource type and instantiate it
    // with the context fields for condition evaluation.
    const caslSubject = this.#buildCaslSubject(resource, authContext);

    try {
      const allowed = this.#ability.can(action, caslSubject);

      if (allowed) {
        return success({ allowed: true });
      }

      return success({ allowed: false, reason: "Authorization denied by policy" });
    } catch (error) {
      return failure(
        new AuthorizationErrorClass("internal_error", {
          details: {
            wrappedReason: error instanceof Error ? error.message : "unknown",
          },
          cause: error,
        })
      );
    }
  }

  /**
   * Builds a CASL subject instance from the resource and optional context.
   *
   * The resource string becomes the CASL subject type (via class name).
   * The context fields become properties on the subject for condition evaluation.
   *
   * @param resource - The resource type identifier.
   * @param context - Optional context fields for condition evaluation.
   *
   * @returns A subject instance for CASL evaluation.
   */
  #buildCaslSubject(
    resource: string,
    context: Readonly<Record<string, unknown>> | undefined
  ): object {
    const SubjectClass = this.#getOrCreateSubjectClass(resource);
    const data = context ? { ...context } : {};
    return new SubjectClass(data);
  }

  /**
   * Gets or creates a subject class for the given resource type.
   *
   * @param resource - The resource type identifier.
   *
   * @returns A class constructor for CASL subject instances.
   */
  #getOrCreateSubjectClass(resource: string): new (data: object) => object {
    const cached = this.#subjectClassCache.get(resource);
    if (cached) {
      return cached;
    }

    // Create a dynamic class with the resource as its name
    // CASL matches subject types by constructor name
    const SubjectClass = class {
      constructor(data: object) {
        Object.assign(this, data);
      }

      /**
       * The resource type name for CASL subject matching.
       *
       * @returns The resource type identifier.
       */
      static get name(): string {
        return resource;
      }
    } as new (data: object) => object;

    // Set the name property for CASL type matching
    Object.defineProperty(SubjectClass, "name", { value: resource });

    this.#subjectClassCache.set(resource, SubjectClass);
    return SubjectClass;
  }
}
