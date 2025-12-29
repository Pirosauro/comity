import type { AnyMongoAbility } from "@casl/ability";
import type { UserRepository } from "../../repositories/user.js";
import type { UpdateUserInput } from "../../validation/user.js";
import { subject } from "@casl/ability";
import { ForbiddenError, NotFoundError } from "@comity/core/errors";
import { updateUserInputSchema } from "../../validation/user.js";

/**
 * Updates a user after validating input data.
 * @param repository - User repository instance
 * @param id - User ID
 * @param data - User update input
 */

export async function updateUser(
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
      "email",
      "phone",
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
