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

export class WebCrypto {
  #storage: WebCryptoStorage;
  #key: string;
  #options: WebCryptoOptions;

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

  async getSecretsForConnector(connectorName: string, config: any) {
    const encrypted = await this.#storage.get(connectorName);

    if (!encrypted) {
      throw new Error(`No secrets found for connector: ${connectorName}`);
    }

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
  }
}
