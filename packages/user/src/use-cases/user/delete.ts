import type { AnyMongoAbility } from "@casl/ability";
import type { UserRepository } from "../../repositories/user.js";
import type { UserId } from "../../validation/user.js";
import { subject } from "@casl/ability";
import { ForbiddenError, NotFoundError } from "@comity/core/errors";
import { deleteUserInputSchema } from "../../validation/user.js";
/**
 * Deletes a user after validating input ID.
 * @param id - User ID
 * @param repository - User repository instance
 * @param ability - CASL ability instance
 */
export async function deleteUser(
  id: UserId,
  repository: UserRepository,
  ability: AnyMongoAbility
): Promise<void> {
  // Validate input
  deleteUserInputSchema.parse({ id });

  // Fetch user for permission check
  const [user] =
    (await repository.read(id, [
      "id",
      "identifier",
      "provider",
      "name",
      "status",
      "email",
      "phone",
      "meta",
      "createdAt",
      "updatedAt",
    ])) ?? [];

  if (!user) {
    throw new NotFoundError(`User with id '${id}' not found.`);
  }

  // Check delete permission
  if (!ability.can("delete", subject("User", user))) {
    throw new ForbiddenError(
      `You do not have permission to delete user '${id}'. Required permission: delete User. User status: ${user.status}`
    );
  }

  await repository.delete(id);
}
