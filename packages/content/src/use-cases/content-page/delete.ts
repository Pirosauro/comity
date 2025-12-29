import type { AnyMongoAbility } from "@casl/ability";
import type { ContentPageRepository } from "../../repositories/content-page.js";
import type { DeleteContentPageInput } from "../../validation/content-page.js";
import { subject } from "@casl/ability";
import { ForbiddenError } from "@comity/core/errors";
import { deleteContentPageInputSchema } from "../../validation/content-page.js";

export const deleteContentPage = async (
  input: DeleteContentPageInput,
  repository: ContentPageRepository,
  ability: AnyMongoAbility
): Promise<void> => {
  const data = deleteContentPageInputSchema.parse(input);

  if (!ability.can("delete", subject("ContentPage", data))) {
    throw new ForbiddenError(
      `You do not have permission to delete content page '${data.id}'.`
    );
  }

  await repository.delete(data.id);
};
