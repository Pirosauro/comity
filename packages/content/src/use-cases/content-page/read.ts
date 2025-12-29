import type { AnyMongoAbility } from "@casl/ability";
import type { ContentPageRepository } from "../../repositories/content-page.js";
import type { ContentPageId } from "../../validation/content-page.js";
import { subject } from "@casl/ability";
import { ForbiddenError, NotFoundError } from "@comity/core/errors";
import {
  contentPageIdSchema,
  contentPageColumnsSchema,
} from "../../validation/content-page.js";

export const readContentPageBy = async (
  id: ContentPageId,
  repository: ContentPageRepository,
  ability: AnyMongoAbility,
  options: { columns?: string[] } = {}
): Promise<any> => {
  id = contentPageIdSchema.parse(id);

  // simple columns handling
  options.columns = contentPageColumnsSchema.parse(options.columns as any);

  const [row] = (await repository.read(id, options.columns as any)) ?? [];

  if (!row) throw new NotFoundError(`Content page with id '${id}' not found.`);
  if (!ability.can("read", subject("ContentPage", row))) {
    throw new ForbiddenError(
      `You do not have permission to read content page '${id}'.`
    );
  }

  return row;
};
