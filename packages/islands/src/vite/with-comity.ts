import type { UserConfig } from 'vite';
import { defineConfig } from 'vite';

export const withComity = (config: UserConfig): UserConfig => {
  return defineConfig(config);
};
