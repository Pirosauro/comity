import type {
  StorageDeleteOptions,
  StorageGetOptions,
  StorageOptions,
  StoragePutOptions,
  StorageSignedUrlOptions,
} from "./options.js";

/**
 * Storage contract definitions for the @comity/storage package.
 */
export type StorageInput = string | Uint8Array | ArrayBuffer | ReadableStream;

/**
 * Storage object returned by the `get` method, containing the value and its metadata.
 */
export interface StorageObject {
  /** The body of the storage object. */
  body: ReadableStream | Uint8Array;

  /** The content type of the storage object. */
  contentType?: string;

  /** The content length of the storage object. */
  contentLength?: number;

  /** The ETag of the storage object. */
  etag?: string;

  /** Optional metadata associated with the storage object. */
  meta?: Record<string, string>;
}

/**
 * Storage object returned by the `get` method, containing the value and its metadata.
 */
export interface Storage {
  /**
   * Retrieves a value from the storage by its key.
   *
   * @param key The key of the value to retrieve.
   * @param options Optional storage options
   *
   * @returns The storage object if found, otherwise undefined.
   */
  get(key: string, options?: StorageGetOptions): Promise<StorageObject | undefined>;

  /**
   * Stores a value in the storage with an optional time-to-live.
   *
   * @param key The key under which the value will be stored.
   * @param body The value to store, either as a string or a binary buffer.
   * @param options Optional storage options, including time-to-live.
   */
  put(key: string, body: StorageInput, options?: StoragePutOptions): Promise<void>;

  /**
   * Deletes a value from the storage by its key.
   *
   * @param key The key of the value to delete.
   * @param options Optional storage options
   */
  delete(key: string, options?: StorageDeleteOptions): Promise<void>;

  /**
   * Checks if a value exists in the storage by its key.
   *
   * @param key The key of the value to check.
   * @param options Optional storage options
   *
   * @returns True if the value exists, otherwise false.
   */
  exists(key: string, options?: StorageOptions): Promise<boolean>;

  /**
   * Generates a signed URL for accessing a storage object.
   *
   * @param key The key of the storage object to generate a signed URL for.
   * @param options Optional storage options, including expiration time for the signed URL.
   *
   * @returns A signed URL that can be used to access the storage object.
   */
  getSignedUrl?(key: string, options?: StorageSignedUrlOptions): Promise<string>;
}
