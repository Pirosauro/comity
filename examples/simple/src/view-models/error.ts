/**
 * Error view model
 */
export interface ErrorViewModel {
  /** HTTP status code */
  readonly status: number;

  /** Title of the error page */
  readonly title: string;

  /** Error message */
  readonly message: string;
}
