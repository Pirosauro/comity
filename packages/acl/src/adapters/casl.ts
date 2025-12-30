import type { AnyAbility } from "@casl/ability";
import type { AclAdapter, AclEntityLike } from "../types.js";
import { subject } from "@casl/ability";

/**
 * Create an `AclAdapter` backed by a CASL `Ability` instance.
 *
 * @remarks
 * The returned adapter forwards subject-level checks to the provided
 * `ability` using CASL's `subject()` helper. Field-level checks call
 * `ability.can(action, subject, field)` which lets CASL rules express
 * per-field permissions.
 *
 * @typeParam E - Entity type
 * @param options.ability - CASL `Ability` instance
 * @param options.subject - CASL subject name (resource type)
 * @returns `AclAdapter` implementation using CASL
 *
 * @example
 * const adapter = createCaslAclAdapter({ ability, subject: 'Post' });
 */
export function createCaslAclAdapter<E extends AclEntityLike>(options: {
  ability: AnyAbility;
  subject: string;
}): AclAdapter<E> {
  return {
    resourceType: options.subject,

    filterReadableFields(action, resource, fields) {
      return fields.filter((field) =>
        options.ability.can(action, subject(options.subject, resource), field)
      );
    },

    filterWritableFields(action, resource, fields) {
      return fields.filter((field) =>
        options.ability.can(action, subject(options.subject, resource), field)
      );
    },

    can(action, resource) {
      return options.ability.can(action, subject(options.subject, resource));
    },
  };
}
