import { describe, it, expect, vi, beforeEach } from "vitest";
import { WebCrypto, type WebCryptoStorage } from "../crypto.js";

// Mock crypto.subtle for Node.js
globalThis.crypto = {
  subtle: {
    importKey: vi.fn(async () => ({})),
    decrypt: vi.fn(async () => new Uint8Array([123, 34, 97, 34, 58, 49, 125])), // {"a":1}
  },
} as any;

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
    webCrypto = new WebCrypto(backend, "test-key");
  });

  it("should throw if no secrets are found", async () => {
    await expect(
      webCrypto.getSecretsForConnector("missing", {})
    ).rejects.toThrow(/No secrets found/);
  });

  it("should call crypto.subtle.importKey and decrypt", async () => {
    storage["service"] = {
      data: Buffer.from(
        new Uint8Array([123, 34, 97, 34, 58, 49, 125])
      ).toString("base64"),
      iv: Buffer.from(new Uint8Array([1, 2, 3, 4])).toString("base64"),
    };

    const result = await webCrypto.getSecretsForConnector("service", {});

    expect(globalThis.crypto.subtle.importKey).toHaveBeenCalled();
    expect(globalThis.crypto.subtle.decrypt).toHaveBeenCalled();
    expect(result).toEqual({ a: 1 });
  });
});
