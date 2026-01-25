import type { HttpContext } from "../contracts/context.js";

/** HTTP middleware pipeline. */
export interface HttpPipeline {
  /**
   * Executes the pipeline.
   * @param ctx - HTTP context.
   * @returns - Promise that resolves when pipeline completes.
   */
  execute(ctx: HttpContext): Promise<void>;
}
