import type { StorageInput, StorageObject } from "./storage.js";

/**
 * Defines the interface for a stoage store.
 */
export interface StorageStore {
  /**
   * Retrieves a storage object by its key.
   *
   * @param key The key of the storage object to retrieve.
   *
   * @returns The storage object if found, otherwise undefined.
   */
  get(key: string): Promise<StorageObject | undefined>;

  /**
   * Stores a value in the storage with an optional time-to-live.
   *
   * @param key The key under which the value will be stored.
   * @param body The value to store, either as a string or a binary buffer.
   * @param options Optional storage options, including time-to-live.
   */
  put(
    key: string,
    body: StorageInput,
    options?: {
      /** The MIME type of the content being stored */
      contentType?: string;

      /** Additional metadata to associate with the stored object */
      metadata?: Record<string, string>;
    }
  ): Promise<void>;

  /**
   * Deletes a value from the storage by its key.
   *
   * @param key The key of the value to delete.
   */
  delete(key: string): Promise<void>;

  /**
   * Checks if a value exists in the storage by its key.
   *
   * @param key The key of the value to check.
   *
   * @returns True if the value exists, otherwise false.
   */
  exists(key: string): Promise<boolean>;

  /**
   * Generates a signed URL for accessing a storage object.
   *
   * @param key The key of the storage object to generate a signed URL for.
   * @param options Optional storage options, including expiration time for the signed URL.
   *
   * @returns A signed URL that can be used to access the storage object.
   */
  getSignedUrl?(
    key: string,
    options?: {
      /** The expiration time for the signed URL in seconds */
      expiresIn?: number;
    }
  ): Promise<string>;
}
