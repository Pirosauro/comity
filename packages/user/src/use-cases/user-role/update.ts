import type { AnyMongoAbility } from "@casl/ability";
import type { UserRepository } from "../../repositories/user.js";
import type { UpdateUserInput } from "../../validation/user.js";
import { subject } from "@casl/ability";
import { ForbiddenError, NotFoundError } from "@comity/core/errors";
import { updateUserInputSchema } from "../../validation/user.js";

/**
 * Updates a user after validating input data and permission.
 *
 * @param data - User update input, validated against Zod schema
 * @param repository - UserRepository instance for database operations
 * @param ability - CASL ability instance for permission validation
 * @param options - Optional config:
 *   - softFail?: If true, silently skips fields without permission instead of throwing (default: false)
 *
 * @returns Promise<void>
 *
 * @throws ZodError if input data is invalid
 * @throws NotFoundError if the user does not exist
 * @throws ForbiddenError if the ability does not have permission to update the user or specific fields
 *
 * @remarks
 * - Validates input using Zod schema.
 * - Checks CASL permission for "update" action on User and for each field.
 * - Throws ForbiddenError if permission is denied for the user or any field (unless softFail is true).
 *
 * @example
 * await updateUser(
 *   { id: "user-id", name: "Alice" },
 *   userRepo,
 *   ability,
 *   { softFail: false }
 * );
 */

export async function updateUserRole(
  data: UpdateUserInput,
  repository: UserRepository,
  ability: AnyMongoAbility,
  options: {
    softFail?: boolean;
  } = {}
): Promise<void> {
  // Validate input data
  const { id, ...args } = updateUserInputSchema.parse(data);

  const [user] =
    (await repository.read(id, [
      "id",
      "identifier",
      "provider",
      "name",
      "status",
      "meta",
      "createdAt",
      "updatedAt",
    ])) ?? [];

  // Check if the user was found
  if (!user) {
    throw new NotFoundError(`User with id '${id}' not found.`);
  }

  // Check if the actor has permission to update this user
  if (!ability.can("update", subject("User", user))) {
    throw new ForbiddenError(
      `You do not have permission to update user '${id}'. Required permission: update User.`
    );
  }

  // Check field-level permissions for each field being updated
  const blacklist = Object.keys(args).filter(
    (field) => !ability.can("update", subject("USer", user), field)
  );

  if (!options.softFail && blacklist.length > 0) {
    throw new ForbiddenError(
      `You do not have permission to update fields: ${blacklist.join(
        ", "
      )} on user '${id}'. Check your role's field-level permissions.`
    );
  }

  // Perform the update with validated data
  await repository.update(
    id,
    Object.fromEntries(
      Object.entries(args).filter(([field]) => !blacklist.includes(field))
    )
  );
}
