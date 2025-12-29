import type { InferInsertModel, SQL } from "drizzle-orm";
import type { SelectedFields } from "drizzle-orm/pg-core";
import { eq } from "drizzle-orm";
import { DatabaseRepository } from "@comity/database";
import { content } from "../database/content.js";
import { channel } from "@comity/channel/database";

export type ContentColumns = {
  id: string;
  channelId: string;
  name: string;
  template: string;
  meta: any;
  createdAt: Date;
  updatedAt: Date;
};

export type ContentRepositoryOptions = {
  columns?: (keyof ContentColumns | `channel.${string}`)[];
  filters?: SQL;
  limit?: number;
  page?: number;
};

/**
 * Repository for managing content entities.
 *
 * Features:
 * - Dynamic column selection to return only requested columns for performance.
 * - Optional INNER JOIN with the `channel` table when any `channel.*` column is
 *   requested (e.g. `['id','name','channel.name']`).
 * - Methods return a Drizzle query builder so callers may chain additional
 *   filters, ordering, or execution (.execute()).
 *
 * The pattern mirrors `@comity/channel`'s `ChannelRepository` so usages are
 * consistent across repositories.
 */
export class ContentRepository extends DatabaseRepository {
  /**
   * Build a base select query for content with optional joined channel fields.
   *
   * @param columns - Optional list of columns to select. Use `channel.<col>` to
   *                  request channel fields and trigger an INNER JOIN.
   */
  private init(columns: ContentRepositoryOptions["columns"] = []) {
    const contentColumns: SelectedFields = {};
    const channelColumns: SelectedFields = {};

    // Collect channel fields to join if requested
    (columns || []).forEach((column) => {
      if (typeof column === "string" && column.startsWith("channel.")) {
        const field = column.slice("channel.".length);

        (channelColumns as any)[field] = (channel as any)[field];
      } else if (typeof column === "string") {
        (contentColumns as any)[column] = (content as any)[column];
      }
    });

    const joinChannel = Object.keys(channelColumns).length > 0;

    const select: any = {
      ...contentColumns,
    };

    if (joinChannel) select.channel = { ...channelColumns };

    const query = this.db.select(select).from(content);

    if (joinChannel)
      query.innerJoin(channel, eq(content.channelId, channel.id));

    return query as any;
  }

  /**
   * Retrieve a single content row by id.
   *
   * @remarks
   * Returns a Drizzle query builder that must be executed by the caller.
   *
   * @example
   * ```ts
   * const row = await repo.read('content-1', ['id','name','channel.name']).execute();
   * ```
   */
  public read(id: string, columns: ContentRepositoryOptions["columns"] = []) {
    return this.init(columns).where(eq(content.id, id));
  }

  /**
   * Find a content row by channelId and name.
   *
   * @example
   * ```ts
   * const item = await repo.readByName('channel-1','home', ['id','meta']).execute();
   * ```
   */
  public readByName(
    channelId: string,
    name: string,
    columns: ContentRepositoryOptions["columns"] = []
  ) {
    return this.init(columns)
      .where(eq(content.channelId, channelId))
      .where(eq(content.name, name));
  }

  /**
   * List content rows with optional filters and pagination.
   *
   * @param options - Pagination, filtering and selected columns.
   * @returns A Drizzle query builder for further chaining or execution.
   */
  public list(options: ContentRepositoryOptions = {}) {
    const { columns, filters, page = 1, limit = 100 } = options;

    return this.init(columns)
      .where(filters)
      .offset((page - 1) * limit)
      .limit(limit);
  }

  /**
   * Insert one or more content rows.
   *
   * Normalizes single object input into an array for batch insertion.
   */
  public create(
    data: InferInsertModel<typeof content> | InferInsertModel<typeof content>[]
  ) {
    if (!Array.isArray(data)) data = [data];

    return this.db.insert(content).values(data);
  }

  /**
   * Update a content row by id. The id parameter takes precedence over
   * any provided id in `data` to avoid primary key modification.
   */
  public update(id: string, data: Partial<InferInsertModel<typeof content>>) {
    if (data.id) data.id = id;

    return this.db.update(content).set(data).where(eq(content.id, id));
  }

  /** Permanently delete a content row. */
  public delete(id: string) {
    return this.db.delete(content).where(eq(content.id, id));
  }
}
