/**
 * Cache module contracts.
 */
export interface StorageOptions {
  /** Optional namespace for the cache key */
  namespace?: string;
}

/**
 * Options for storage get operations.
 */
export interface StorageGetOptions extends StorageOptions {}

/**
 * Options for storage delete operations.
 */
export interface StorageDeleteOptions extends StorageOptions {}

/**
 * Options for storage put operations.
 */
export interface StoragePutOptions extends StorageOptions {
  /** The MIME type of the content being stored */
  contentType?: string;

  /** Additional metadata to associate with the stored object */
  meta?: Record<string, string>;
}

/**
 *
 */
export interface StorageSignedUrlOptions extends StorageOptions {
  /**
   *
   */
  expiresIn?: number;
}
