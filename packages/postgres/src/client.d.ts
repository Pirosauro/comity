import type {
  QueryResult,
  QueryConfig,
  QueryConfigValues,
  QueryArrayResult,
} from "pg";

interface EventData {
  id: string;
  timestamp: number;
}

declare interface Client {
  on(
    event: "query-start",
    listener: (
      data: EventData & {
        query: QueryConfig<any[]> | string;
        params?: QueryConfigValues<any>;
      }
    ) => void
  ): this;
  on(
    event: "query-end",
    listener: (
      data: EventData & {
        result: QueryResult<any> | QueryArrayResult<any> | void;
        duration: number;
      }
    ) => void
  ): this;
  on(
    event: "query-error",
    listener: (data: EventData & { error: Error; duration: number }) => void
  ): this;
  //
  on(event: string | symbol, listener: (...args: any[]) => void): this;
}
