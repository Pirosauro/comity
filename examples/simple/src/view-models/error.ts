/**
 * Error view model
 */
export interface ErrorViewModel extends Record<string, unknown> {
  /** HTTP status code */
  readonly status: number;

  /** Title of the error page */
  readonly title: string;

  /** Error message */
  readonly message: string;
}
