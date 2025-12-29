import type { InferInsertModel, SQL } from "drizzle-orm";
import type { SelectedFields } from "drizzle-orm/pg-core";
import { eq } from "drizzle-orm";
import { DatabaseRepository } from "@comity/database";
import { contentPage } from "../database/content-page.js";
import { content } from "../database/content.js";

export type ContentPageColumns = {
  id: string;
  contentId: string;
  meta: any;
  createdAt: Date;
  updatedAt: Date;
};

export type ContentPageRepositoryOptions = {
  columns?: (keyof ContentPageColumns | `content.${string}`)[];
  filters?: SQL;
  limit?: number;
  page?: number;
};

/**
 * Repository for managing content pages.
 *
 * Features:
 * - Dynamic column selection and optional join with the parent `content`.
 * - Methods return Drizzle query builders for further chaining or execution.
 *
 * This mirrors the `@comity/channel` repository style for consistency.
 */
export class ContentPageRepository extends DatabaseRepository {
  /**
   * Build a base select query for pages and optional joined content fields.
   *
   * @param columns - Optional columns to select. Use `content.<col>` to include
   *                  parent content fields and trigger an INNER JOIN.
   */
  private init(columns: ContentPageRepositoryOptions["columns"] = []) {
    const pageColumns: SelectedFields = {};
    const contentColumns: SelectedFields = {};

    // Process column requests
    (columns || []).forEach((column) => {
      if (typeof column === "string" && column.startsWith("content.")) {
        const field = column.slice("content.".length);

        (contentColumns as any)[field] = (content as any)[field];
      } else if (typeof column === "string") {
        (pageColumns as any)[column] = (contentPage as any)[column];
      }
    });

    const joinContent = Object.keys(contentColumns).length > 0;
    const select: any = {
      ...pageColumns,
    };
    if (joinContent) select.content = { ...contentColumns };

    const query = this.db.select(select).from(contentPage);

    if (joinContent)
      query.innerJoin(content, eq(contentPage.contentId, content.id));

    return query as any;
  }

  /**
   * Read a content page by id.
   *
   * Returns a Drizzle query builder which must be executed by the caller.
   */
  public read(
    id: string,
    columns: ContentPageRepositoryOptions["columns"] = []
  ) {
    return this.init(columns).where(eq(contentPage.id, id));
  }

  /**
   * List pages belonging to a specific content id.
   *
   * @example
   * ```ts
   * const pages = await repo.readByContent('content-1', ['id','meta']).execute();
   * ```
   */
  public readByContent(
    contentId: string,
    columns: ContentPageRepositoryOptions["columns"] = []
  ) {
    return this.init(columns).where(eq(contentPage.contentId, contentId));
  }

  /**
   * List pages with optional filters and pagination.
   */
  public list(options: ContentPageRepositoryOptions = {}) {
    const { columns, filters, page = 1, limit = 100 } = options;

    return this.init(columns)
      .where(filters)
      .offset((page - 1) * limit)
      .limit(limit);
  }

  /**
   * Create one or more pages.
   */
  public create(
    data:
      | InferInsertModel<typeof contentPage>
      | InferInsertModel<typeof contentPage>[]
  ) {
    if (!Array.isArray(data)) data = [data];

    return this.db.insert(contentPage).values(data);
  }

  /**
   * Update a page by id.
   */
  public update(
    id: string,
    data: Partial<InferInsertModel<typeof contentPage>>
  ) {
    if (data.id) data.id = id;

    return this.db.update(contentPage).set(data).where(eq(contentPage.id, id));
  }

  /** Permanently delete a page. */
  public delete(id: string) {
    return this.db.delete(contentPage).where(eq(contentPage.id, id));
  }
}
