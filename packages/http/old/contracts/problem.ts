/**
 * HTTP Problem Details (adapter-level).
 */
export interface HttpProblem {
  /**
   *
   */
  status: number;
  /**
   *
   */
  type?: string;
  /**
   *
   */
  title: string;
  /**
   *
   */
  detail?: string;
  /**
   *
   */
  instance?: string;
  /**
   *
   */
  headers?: Record<string, string>;
}
