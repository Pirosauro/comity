import type { Container } from "@comity/core/primitives";

export class RepositoryRegistry {
  #container: Container;

  constructor(container: Container) {
    this.#container = container;
  }

  register<T>(key: string, factory: () => T) {
    this.#container.register(key, factory);
  }

  get<T>(key: string): T {
    return this.#container.get(key);
  }
}
