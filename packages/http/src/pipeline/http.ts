import type { HttpContext } from "../core/context.js";
import type { HttpResult } from "../core/result.js";

/**
 * HTTP pipeline interface.
 */
export interface HttpPipeline {
  /**
   * Execute the pipeline.
   */
  execute(ctx: HttpContext): Promise<HttpResult>;
}