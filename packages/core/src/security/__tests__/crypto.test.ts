import type { WebCryptoStorage } from "../crypto.js";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { WebCrypto } from "../crypto.js";

if (!globalThis.crypto) {
  // Mock crypto.subtle for Node.js
  globalThis.crypto = {
    subtle: {
      importKey: vi.fn(async () => ({})),
      decrypt: vi.fn(
        async () => new Uint8Array([123, 34, 97, 34, 58, 49, 125])
      ), // {"a":1}
    },
  } as any;
}

describe("WebCrypto", () => {
  let storage: Record<string, { data: string; iv: string }>;
  let backend: WebCryptoStorage;
  let webCrypto: WebCrypto;

  beforeEach(() => {
    storage = {};
    backend = {
      get: async (key) => storage[key] ?? null,
      set: async (key, value) => {
        storage[key] = value;
      },
      delete: async (key) => {
        delete storage[key];
      },
    };
    webCrypto = new WebCrypto(backend, "01234567890123456789012345678901"); // 32-byte key
  });

  it("should throw if no secrets are found", async () => {
    await expect(
      webCrypto.getSecretsForConnector("missing", {})
    ).rejects.toThrow(/No secrets found/);
  });

  it("should call crypto.subtle.importKey and decrypt", async () => {
    // Mock the storage to return encrypted data
    storage["service"] = {
      data: "encrypted-data",
      iv: "iv-data",
    };

    // Mock crypto.subtle methods
    const mockImportKey = vi.fn(async () => ({} as CryptoKey));
    const mockDecrypt = vi.fn(async () => new ArrayBuffer(7)); // Mock ArrayBuffer

    // Mock JSON.parse to return the expected object
    const originalParse = JSON.parse;
    JSON.parse = vi.fn(() => ({ a: 1 }));

    (globalThis.crypto.subtle as any).importKey = mockImportKey;
    (globalThis.crypto.subtle as any).decrypt = mockDecrypt;

    const result = await webCrypto.getSecretsForConnector("service", {});

    expect(mockImportKey).toHaveBeenCalledWith(
      "raw",
      new TextEncoder().encode("01234567890123456789012345678901"),
      { name: "AES-GCM", length: 256 },
      false,
      ["decrypt"]
    );
    expect(mockDecrypt).toHaveBeenCalled();
    expect(result).toEqual({ a: 1 });

    // Restore original JSON.parse
    JSON.parse = originalParse;
  });
});
