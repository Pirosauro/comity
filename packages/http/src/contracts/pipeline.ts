import type { HttpContext } from "../contracts/context.js";

/**
 * HTTP middleware pipeline.
 *
 * @comity ai-jsdoc-skip
 */
export interface HttpPipeline {
  /**
   * Executes the pipeline.
   *
   * @param ctx - HTTP context.
   * @returns A promise that resolves when the pipeline completes.
   * @throws {Error} - If an error occurs during execution.
   */
  execute(ctx: HttpContext): Promise<void>;
}
