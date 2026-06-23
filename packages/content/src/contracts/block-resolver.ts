import type { BlockModel } from "./block.js";

/**
 * Block resolvers are responsible for rendering blocks. They are used by the block renderer to render blocks. They can be registered with the block renderer to provide custom rendering logic for specific block types.
 */
export interface BlockResolver<T = unknown> {
  /**
   * Determines if the resolver can handle the given block.
   *
   * @param block - The block to check.
   *
   * @returns True if the resolver can handle the block, false otherwise.
   */
  supports(block: BlockModel): boolean;

  /**
   * Renders the given block.
   *
   * @param block - The block to render.
   *
   * @returns The rendered block.
   */
  resolve(block: BlockModel): T;
}
