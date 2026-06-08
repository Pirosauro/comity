import type { PageRepository } from "@comity/content";
import type { RepositoryError } from "@comity/primitives/error";
import { isSuccess, success, type Result } from "@comity/primitives/result";
import type {
  ContentPageComposer,
  ContentPageEnricher,
  ContentPageModel,
} from "../contracts/content-page.js";
import type { StorefrontContext } from "../contracts/context.js";

/**
 * Default implementation of the ContentPageComposer interface.
 */
export class DefaultContentPageComposer implements ContentPageComposer {
  /** Page repository. */
  #repository: PageRepository;

  /** Page enrichers. */
  #enrichers: ReadonlyArray<ContentPageEnricher>;

  /**
   * @param repository - Page repository used to fetch content page data.
   * @param enrichers - Optional enrichers to apply after base composition.
   */
  constructor(repository: PageRepository, enrichers?: ReadonlyArray<ContentPageEnricher>) {
    this.#repository = repository;
    this.#enrichers = enrichers ?? [];
  }

  /**
   * @inheritdoc
   */
  async compose(
    id: string,
    ctx: StorefrontContext
  ): Promise<Result<ContentPageModel, RepositoryError>> {
    const result = await this.#repository.get(id, ctx);

    if (isSuccess(result)) {
      let page: ContentPageModel = {
        type: "content",
        id: result.value?.id ?? "",
        url: result.value?.url ?? "",
        title: result.value?.title ?? "",
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
