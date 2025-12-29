import type { AnyMongoAbility } from "@casl/ability";
import type { ContentRepository } from "../../repositories/content.js";
import type { DeleteContentInput } from "../../validation/content.js";
import { subject } from "@casl/ability";
import { ForbiddenError } from "@comity/core/errors";
import { deleteContentInputSchema } from "../../validation/content.js";

export const deleteContent = async (
  input: DeleteContentInput,
  repository: ContentRepository,
  ability: AnyMongoAbility
): Promise<void> => {
  const data = deleteContentInputSchema.parse(input);

  if (!ability.can("delete", subject("Content", data))) {
    throw new ForbiddenError(
      `You do not have permission to delete content '${data.id}'. Required permission: delete Content.`
    );
  }

  await repository.delete(data.id);
};
