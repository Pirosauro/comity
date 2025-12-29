import type { AnyMongoAbility } from "@casl/ability";
import type { ContentRepository } from "../../repositories/content.js";
import type { UpdateContentInput } from "../../validation/content.js";
import { subject } from "@casl/ability";
import { ForbiddenError } from "@comity/core/errors";
import { updateContentInputSchema } from "../../validation/content.js";

export const updateContent = async (
  data: UpdateContentInput,
  repository: ContentRepository,
  ability: AnyMongoAbility
): Promise<void> => {
  data = updateContentInputSchema.parse(data);

  if (!ability.can("update", subject("Content", data))) {
    throw new ForbiddenError(
      `You do not have permission to update content '${data.id}'. Required permission: update Content.`
    );
  }

  await repository.update(data.id, data);
};
