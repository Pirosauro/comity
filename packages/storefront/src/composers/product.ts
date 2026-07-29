import type { ProductRepository } from "@comity/catalog";
import type { RepositoryError } from "@comity/primitives/errors";
import { isSuccess, success, type Result } from "@comity/primitives/result";
import type { StorefrontContext } from "../contracts/context.js";
import type {
    ProductPageComposer,
    ProductPageEnricher,
    ProductPageModel,
} from "../contracts/product-page.js";

/**
 * Default implementation of the ProductPageComposer interface.
 */
export class DefaultProductPageComposer implements ProductPageComposer {
  /** Product repository. */
  #repository: ProductRepository;

  /** Page enrichers. */
  #enrichers: ReadonlyArray<ProductPageEnricher>;

  /**
   * @param repository - Product repository used to fetch product data.
   * @param enrichers - Optional enrichers to apply after base composition.
   */
  constructor(repository: ProductRepository, enrichers?: ReadonlyArray<ProductPageEnricher>) {
    this.#repository = repository;
    this.#enrichers = enrichers ?? [];
  }

  /**
   * @inheritdoc
   */
  async compose(
    id: string,
    ctx: StorefrontContext
  ): Promise<Result<ProductPageModel, RepositoryError>> {
    const result = await this.#repository.get(id, ctx);

    if (isSuccess(result)) {
      let page: ProductPageModel = {
        type: "product",
        product: result.value,
        id: result.value?.id ?? "",
        url: result.value?.url ?? "",
        title: result.value?.name ?? "",
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
