import type {
  StorageDeleteOptions,
  StorageGetOptions,
  StorageOptions,
  StoragePutOptions,
  StorageSignedUrlOptions,
} from "./contracts/options.js";
import type { Storage, StorageInput, StorageObject } from "./contracts/storage.js";
import type { StorageStore } from "./contracts/store.js";

import { StorageError } from "./errors/storage.js";

/**
 * DefaultStorage is the default implementation of the Storage interface.
 */
export class DefaultStorage implements Storage {
  /**  */
  #store: StorageStore;

  /**
   * @param store - The cache store to use.
   */
  constructor(store: StorageStore) {
    this.#store = store;
  }

  /**
   * Resolves the given storage input into a Uint8Array.
   *
   * @param key The key to resolve.
   * @param namespace The optional namespace to resolve the key within.
   *
   * @returns The resolved key, potentially namespaced.
   */
  #resolveKey(key: string, namespace?: string): string {
    if (!namespace) return key;

    return `${namespace}:${key}`;
  }

  /**
   * @inheritdoc
   */
  async get(key: string, options?: StorageGetOptions): Promise<StorageObject | undefined> {
    const k = this.#resolveKey(key, options?.namespace);

    try {
      return await this.#store.get(k);
    } catch (err) {
      throw new StorageError("get_failed", {
        details: {
          key,
          ...(options?.namespace ? { namespace: options.namespace } : {}),
        },
        cause: err,
      });
    }
  }

  /**
   * @inheritdoc
   */
  async put(key: string, body: StorageInput, options?: StoragePutOptions): Promise<void> {
    const k = this.#resolveKey(key, options?.namespace);

    try {
      await this.#store.put(k, body, {
        ...(options?.contentType ? { contentType: options.contentType } : {}),
        ...(options?.meta ? { metadata: options.meta } : {}),
      });
    } catch (err) {
      throw new StorageError("put_failed", {
        details: {
          key,
          ...(options?.namespace ? { namespace: options.namespace } : {}),
        },
        cause: err,
      });
    }
  }

  /**
   * @inheritdoc
   */
  async delete(key: string, options?: StorageDeleteOptions): Promise<void> {
    const k = this.#resolveKey(key, options?.namespace);

    try {
      await this.#store.delete(k);
    } catch (cause) {
      throw new StorageError("delete_failed", {
        details: {
          key,
          ...(options?.namespace ? { namespace: options.namespace } : {}),
        },
        cause,
      });
    }
  }

  /**
   * @inheritdoc
   */
  async exists(key: string, options?: StorageOptions): Promise<boolean> {
    const k = this.#resolveKey(key, options?.namespace);

    return this.#store.exists(k);
  }

  /**
   * @inheritdoc
   */
  async getSignedUrl(key: string, options?: StorageSignedUrlOptions): Promise<string> {
    if (!this.#store.getSignedUrl) {
      throw new StorageError("signed_url_failed", { details: { key } });
    }

    const k = this.#resolveKey(key, options?.namespace);

    return this.#store.getSignedUrl(k, {
      ...(options?.expiresIn ? { expiresIn: options.expiresIn } : {}),
    });
  }
}
