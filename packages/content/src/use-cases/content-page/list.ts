import type { ContentPageRepository } from "../../repositories/content-page.js";
import type { ListContentPageInput } from "../../validation/content-page.js";
import { listContentPageInputSchema } from "../../validation/content-page.js";

export const listContentPages = async (
  input: ListContentPageInput,
  repository: ContentPageRepository
) => {
  const opts = listContentPageInputSchema.parse(input);

  return repository.list({
    columns: opts.columns,
    filters: opts.filters,
    page: opts.page,
    limit: opts.limit,
  });
};
