import type { HttpContext } from "../contracts/context.js";

/**
 * HTTP pipeline interface.
 */
export interface HttpPipeline {
  /**
   * Execute the pipeline.
   */
  execute(ctx: HttpContext): Promise<void>;
}
