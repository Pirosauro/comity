/**
 * Token type
 */
export type Token<T extends string> = symbol & {
  /** Token type string */
  __type?: T;
};

/**
 * Kernel state type
 */
export type KernelState = "open" | "sealed" | "running" | "stopped";
