export type { Cache } from "./contracts/cache.js";
export type {
  CacheDeleteOptions,
  CacheGetOptions,
  CacheKeyOptions,
  CacheSetOptions,
} from "./contracts/options.js";
export type { CacheStore } from "./contracts/store.js";

export { DefaultCache } from "./facade.js";
export { serializeCacheKey } from "./serialize.js";
