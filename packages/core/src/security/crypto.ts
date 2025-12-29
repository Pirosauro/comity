import { NotFoundError } from "../errors/not-found.js";
import { InternalError } from "../errors/internal.js";

export type WebCryptoStorage = {
  get: (key: string) => Promise<{ data: string; iv: string } | null>;
  set: (key: string, data: { data: string; iv: string }) => Promise<void>;
  delete: (key: string) => Promise<void>;
};

export type WebCryptoOptions = {
  algorithm?:
    | AesCbcParams
    | AesCtrParams
    | AesDerivedKeyParams
    | AesGcmParams
    | AesKeyAlgorithm
    | AesKeyGenParams
    | EcKeyGenParams
    | EcKeyImportParams
    | EcdhKeyDeriveParams
    | EcdsaParams
    | HkdfParams
    | HmacKeyGenParams
    | HmacImportParams
    | Pbkdf2Params
    | RsaHashedImportParams
    | RsaHashedKeyAlgorithm
    | RsaKeyGenParams
    | RsaHashedKeyGenParams
    | RsaOaepParams
    | RsaPssParams;
};

/**
 * Provides secure storage and retrieval of secrets using the Web Crypto API.
 *
 * @remarks
 * The `WebCrypto` class enables encryption and decryption of sensitive data (such as API keys or credentials)
 * using a symmetric key and a pluggable storage backend. It is designed for use in serverless, edge, or browser
 * environments where the Web Crypto API is available.
 *
 * **Features:**
 * - AES-GCM encryption by default (configurable)
 * - Pluggable storage interface for secrets (e.g., in-memory, database, cloud KV)
 * - Simple API for storing and retrieving encrypted secrets by key
 *
 * @example
 * Basic usage with in-memory storage
 * ```typescript
 * const storage: WebCryptoStorage = {
 *   get: async (key) => memory[key] ?? null,
 *   set: async (key, value) => { memory[key] = value; },
 *   delete: async (key) => { delete memory[key]; },
 * };
 *
 * const crypto = new WebCrypto(storage, 'super-secret-key');
 *
 * // Store a secret
 * await crypto.setSecretsForConnector('github', { token: 'ghp_...' });
 *
 * // Retrieve a secret
 * const secrets = await crypto.getSecretsForConnector('github', {});
 * console.log(secrets.token);
 * ```
 */
export class WebCrypto {
  #storage: WebCryptoStorage;
  #key: string;
  #options: WebCryptoOptions;

  /**
   * Creates a new WebCrypto instance.
   *
   * @param storage - Storage backend implementing the WebCryptoStorage interface
   * @param key - Symmetric key for encryption/decryption
   * @param options - Optional crypto algorithm configuration
   */
  constructor(
    storage: WebCryptoStorage,
    key: string,
    options: WebCryptoOptions = {}
  ) {
    this.#storage = storage;
    this.#key = key;
    this.#options = {
      algorithm: options.algorithm ?? { name: "AES-GCM", length: 256 },
    };
  }

  /**
   * Retrieves and decrypts secrets for a given connector.
   *
   * @param connectorName - The unique name of the connector (used as storage key)
   * @param config - Optional configuration for decryption (unused in default implementation)
   * @returns Promise resolving to the decrypted secrets object
   *
   * @throws {Error} If no secrets are found for the connector
   * @throws {Error} If decryption fails or the key is invalid
   *
   * @example
   * ```typescript
   * const secrets = await crypto.getSecretsForConnector('github', {});
   * console.log(secrets.token);
   * ```
   */
  async getSecretsForConnector(connectorName: string, config: any) {
    const encrypted = await this.#storage.get(connectorName);

    if (!encrypted) {
      throw new NotFoundError("Secrets not found", {
        connector: connectorName,
      });
    }

    try {
      const key = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(this.#key),
        { name: "AES-GCM", length: 256 },
        false,
        ["decrypt"]
      );

      const decrypted = await crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: Uint8Array.from(Buffer.from(encrypted.iv, "base64")),
        },
        key,
        Uint8Array.from(Buffer.from(encrypted.data, "base64"))
      );

      return JSON.parse(new TextDecoder().decode(decrypted));
    } catch (cause) {
      throw new InternalError("Failed to decrypt secrets", {
        connector: connectorName,
        cause,
      });
    }
  }

  /**
   * Encrypts and stores secrets for a given connector.
   *
   * @param connectorName - The unique name of the connector (used as storage key)
   * @param secrets - The secrets object to encrypt and store
   * @returns Promise that resolves when the secrets are stored
   *
   * @throws {Error} If encryption fails
   *
   * @example
   * ```typescript
   * await crypto.setSecretsForConnector('github', {
   *   token: 'ghp_...',
   *   webhookSecret: 'secret...'
   * });
   * ```
   */
  async setSecretsForConnector(
    connectorName: string,
    secrets: Record<string, any>
  ) {
    try {
      const key = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(this.#key),
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt"]
      );

      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encrypted = await crypto.subtle.encrypt(
        {
          name: "AES-GCM",
          iv,
        },
        key,
        new TextEncoder().encode(JSON.stringify(secrets))
      );

      await this.#storage.set(connectorName, {
        data: Buffer.from(encrypted).toString("base64"),
        iv: Buffer.from(iv).toString("base64"),
      });
    } catch (cause) {
      throw new InternalError("Failed to encrypt secrets", {
        connector: connectorName,
        cause,
      });
    }
  }

  /**
   * Deletes stored secrets for a given connector.
   *
   * @param connectorName - The unique name of the connector
   * @returns Promise that resolves when the secrets are deleted
   *
   * @example
   * ```typescript
   * await crypto.deleteSecretsForConnector('github');
   * ```
   */
  async deleteSecretsForConnector(connectorName: string) {
    await this.#storage.delete(connectorName);
  }
}
