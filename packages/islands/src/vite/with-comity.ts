import type {
  UserConfig,
  UserConfigExport,
  UserConfigFn,
  UserConfigFnObject,
  UserConfigFnPromise,
} from 'vite';
import { defineConfig } from 'vite';

type Config =
  | UserConfig
  | Promise<UserConfig>
  | UserConfigFnObject
  | UserConfigFnPromise
  | UserConfigFn
  | UserConfigExport;

export const withComity = <T = Config>(config: T) => {
  // @ts-ignore
  return defineConfig(config);
};
