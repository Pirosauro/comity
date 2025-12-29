import type { AnyMongoAbility } from "@casl/ability";
import type { ContentPageRepository } from "../../repositories/content-page.js";
import type { CreateContentPageInput } from "../../validation/content-page.js";
import { subject } from "@casl/ability";
import { ForbiddenError } from "@comity/core/errors";
import { createContentPageInputSchema } from "../../validation/content-page.js";

export const createContentPage = async (
  data: CreateContentPageInput,
  repository: ContentPageRepository,
  ability: AnyMongoAbility
): Promise<void> => {
  data = createContentPageInputSchema.parse(data);

  if (!ability.can("create", subject("ContentPage", data))) {
    throw new ForbiddenError(
      `You do not have permission to create page for content '${data.contentId}'. Required permission: create ContentPage.`
    );
  }

  // Cast to any to accept insert shape; repository expects the correct table insert type.
  await repository.create(data as any);
};
