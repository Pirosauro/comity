import type { AnyMongoAbility } from "@casl/ability";
import type { ContentRepository } from "../../repositories/content.js";
import type { CreateContentInput } from "../../validation/content.js";
import { subject } from "@casl/ability";
import { ForbiddenError } from "@comity/core/errors";
import { createContentInputSchema } from "../../validation/content.js";

export const createContent = async (
  data: CreateContentInput,
  repository: ContentRepository,
  ability: AnyMongoAbility
): Promise<void> => {
  data = createContentInputSchema.parse(data);

  if (!ability.can("create", subject("Content", data))) {
    throw new ForbiddenError(
      `You do not have permission to create content '${data.name}' in channel '${data.channelId}'. Required permission: create Content.`
    );
  }

  await repository.create(data);
};
