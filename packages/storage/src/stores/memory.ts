import type { StorageInput, StorageObject } from "../contracts/storage.js";
import type { StorageStore } from "../contracts/store.js";

import { StorageError } from "../errors/storage.js";

/**
 * Internal representation of a stored entity in the memory storage store.
 */
type Entity = {
  /** */
  body: Uint8Array;

  /** */
  contentType?: string;

  /** */
  meta?: Record<string, string>;
};

/**
 * Memory-based implementation of the CacheStore interface.
 */
export class MemoryStorageStore implements StorageStore {
  #map = new Map<string, Entity>();

  /**
   * @inheritDoc
   */
  async get(key: string): Promise<StorageObject | undefined> {
    const v = this.#map.get(key);

    if (!v) return undefined;

    return {
      body: v.body,
      contentLength: v.body.length,
      ...(v.contentType ? { contentType: v.contentType } : {}),
      ...(v.meta ? { meta: v.meta } : {}),
    };
  }

  /**
   * @inheritDoc
   */
  async put(
    key: string,
    body: StorageInput,
    options?: Pick<Entity, "contentType" | "meta">
  ): Promise<void> {
    const data = await this.#toUint8Array(body);

    this.#map.set(key, {
      body: data,
      ...(options?.contentType ? { contentType: options.contentType } : {}),
      ...(options?.meta ? { meta: options.meta } : {}),
    });
  }

  /**
   * @inheritDoc
   */
  async delete(key: string): Promise<void> {
    this.#map.delete(key);
  }

  /**
   * @inheritDoc
   */
  async exists(key: string): Promise<boolean> {
    return this.#map.has(key);
  }

  /**
   * Converts the given storage input into a Uint8Array.
   *
   * @param body The storage input to convert.
   *
   * @returns A promise that resolves to a Uint8Array representation of the input.
   */
  async #toUint8Array(body: StorageInput): Promise<Uint8Array> {
    if (typeof body === "string") {
      return new TextEncoder().encode(body);
    }

    if (body instanceof Uint8Array) {
      return body;
    }

    if (body instanceof ArrayBuffer) {
      return new Uint8Array(body);
    }

    if (body instanceof ReadableStream) {
      const reader = body.getReader();
      const chunks: Uint8Array[] = [];

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        chunks.push(value);
      }

      const size = chunks.reduce((n, c) => n + c.length, 0);
      const out = new Uint8Array(size);

      let offset = 0;

      for (const c of chunks) {
        out.set(c, offset);

        offset += c.length;
      }

      return out;
    }

    throw new StorageError("internal", { details: { violation: "unsupported_body" } });
  }
}
