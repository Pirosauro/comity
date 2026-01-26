/**
 * Hello view model
 */
export interface HelloViewModel extends Record<string, unknown> {
  /** Page title */
  readonly title: string;

  /** Greeting message */
  readonly message: string;
}
