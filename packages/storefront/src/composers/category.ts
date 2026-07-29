import type { CategoryRepository } from "@comity/catalog";
import type { RepositoryError } from "@comity/primitives/errors";
import { isSuccess, success, type Result } from "@comity/primitives/result";
import type {
    CategoryPageComposer,
    CategoryPageEnricher,
    CategoryPageModel,
} from "../contracts/category-page.js";
import type { StorefrontContext } from "../contracts/context.js";

/**
 * Default implementation of the CategoryPageComposer interface, responsible for presenting category pages in the storefront.
 */
export class DefaultCategoryPageComposer implements CategoryPageComposer {
  #repository: CategoryRepository;
  #enrichers: ReadonlyArray<CategoryPageEnricher>;

  /**
   * @param repository - The category repository to use for fetching category data.
   * @param enrichers - Optional array of enrichers to apply to the category page model.
   */
  constructor(repository: CategoryRepository, enrichers?: ReadonlyArray<CategoryPageEnricher>) {
    this.#repository = repository;
    this.#enrichers = enrichers ?? [];
  }

  /**
   * @inheritdoc
   */
  async compose(
    id: string,
    ctx: StorefrontContext
  ): Promise<Result<CategoryPageModel, RepositoryError>> {
    const result = await this.#repository.get(id, ctx);

    if (isSuccess(result)) {
      let page: CategoryPageModel = {
        type: "category",
        category: result.value,
        id: result.value?.id ?? "",
        url: result.value?.url ?? "",
        title: result.value?.name ?? "",
        products: [],
      };

      for (const enricher of this.#enrichers) {
        const enriched = await enricher.enrich(page, ctx);

        if (isSuccess(enriched)) {
          page = enriched.value;
        }
      }

      return success(page);
    }

    return result;
  }
}
