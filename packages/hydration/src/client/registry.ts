/**
 * Island hydrate function type
 */
export type IslandHydrateFn = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: any,
  elem: HTMLElement,
) => Promise<void>;

/**
 * Island loader type
 */
export type IslandLoader = () => Promise<{
  /** Island hydrate function as default export */
  default: IslandHydrateFn;
}>

/**
 * Island registry
 */
export class IslandRegistry {
  /** Island loader map */
  #loaders = new Map<string, IslandLoader>();

  /**
   * Registers an island loader
   *
   * @param name Island name
   * @param loader Island loader
   */
  register(name: string, loader: IslandLoader): void {
    this.#loaders.set(name, loader);
  }

  /**
   * Gets an island loader by name
   *
   * @param name Island name
   * @returns Island loader or undefined if not found
   */
  get(name: string): IslandLoader | undefined {
    return this.#loaders.get(name);
  }

  /**
   * Lists all registered island loaders
   *
   * @returns Array of island loaders
   */
  list(): IslandLoader[] {
    return Array.from(this.#loaders.values());
  }

  /**
   * Clears all registered island loaders
   */
  clear(): void {
    this.#loaders.clear();
  }
}
