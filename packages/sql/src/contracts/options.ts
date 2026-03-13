/**
 * SQL client options.
 *
 * @remarks
 * Runtime-agnostic configuration. No driver-specific fields are allowed.
 */
export interface SqlClientOptions {
  /**
   * Optional timeout for operations in milliseconds.
   */
  readonly timeout?: number;

  /**
   * Optional contextual values propagated to the client/adapter.
   */
  readonly context?: Readonly<Record<string, unknown>>;
}
