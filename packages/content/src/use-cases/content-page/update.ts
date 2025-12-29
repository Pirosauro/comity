import type { AnyMongoAbility } from "@casl/ability";
import type { ContentPageRepository } from "../../repositories/content-page.js";
import type { UpdateContentPageInput } from "../../validation/content-page.js";
import { subject } from "@casl/ability";
import { ForbiddenError } from "@comity/core/errors";
import { updateContentPageInputSchema } from "../../validation/content-page.js";

export const updateContentPage = async (
  data: UpdateContentPageInput,
  repository: ContentPageRepository,
  ability: AnyMongoAbility
): Promise<void> => {
  data = updateContentPageInputSchema.parse(data as any);

  if (!ability.can("update", subject("ContentPage", data))) {
    throw new ForbiddenError(
      `You do not have permission to update content page '${data.id}'.`
    );
  }

  await repository.update(data.id as string, data as any);
};
