import type { AnyMongoAbility } from "@casl/ability";
import type { ContentRepository } from "../../repositories/content.js";
import type { ListContentInput } from "../../validation/content.js";
import { listContentInputSchema } from "../../validation/content.js";

export const listContent = async (
  input: ListContentInput,
  repository: ContentRepository,
  ability: AnyMongoAbility
) => {
  const opts = listContentInputSchema.parse(input);

  // For now we don't filter columns by ability here; higher-level handlers may do that
  return repository.list({
    columns: opts.columns,
    filters: opts.filters,
    page: opts.page,
    limit: opts.limit,
  });
};
