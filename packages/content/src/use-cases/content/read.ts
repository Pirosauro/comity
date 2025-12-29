import type { AnyMongoAbility } from "@casl/ability";
import type {
  ContentRepository,
  ContentRepositoryOptions,
} from "../../repositories/content.js";
import type { ContentColumns, ContentId } from "../../validation/content.js";
import { subject } from "@casl/ability";
import { ForbiddenError, NotFoundError } from "@comity/core/errors";
import {
  contentIdSchema,
  contentColumnsSchema,
} from "../../validation/content.js";

export const readContentBy = async (
  id: ContentId,
  repository: ContentRepository,
  ability: AnyMongoAbility,
  options: Pick<ContentRepositoryOptions, "columns"> = {}
): Promise<Partial<ContentColumns>> => {
  id = contentIdSchema.parse(id);

  options.columns = contentColumnsSchema
    .parse(options.columns)
    .filter((c) => ability.can("read", "Content", c));

  const [row] = (await repository.read(id, options.columns)) ?? [];

  if (!row) {
    throw new NotFoundError(`Content with id '${id}' not found.`);
  }

  if (!ability.can("read", subject("Content", row))) {
    throw new ForbiddenError(
      `You do not have permission to read content '${id}'. Required permission: read Content.`
    );
  }

  return row;
};

export function readContentById(
  id: ContentId,
  repository: ContentRepository,
  ability: AnyMongoAbility,
  options: Pick<ContentRepositoryOptions, "columns"> = {}
): Promise<Partial<ContentColumns>> {
  return readContentBy(id, repository, ability, options);
}
