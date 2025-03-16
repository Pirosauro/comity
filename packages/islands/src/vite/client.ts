import type { Plugin } from 'vite';

type Options = {
  entrypoint: string;
  jsxImportSource?: string;
  assetsDir?: string;
};

/**
 * Vite plugin for client-side configuration
 *
 * This plugin configures the Vite build process for client-side applications,
 * including setting the entry point, assets directory, and JSX import source.
 *
 * @param {Options} options - The plugin options.
 * @return {Plugin} - The Vite plugin object.
 */
export default (options: Options): Plugin => {
  if (!options.entrypoint) {
    throw new Error('Entrypoint is required for the Vite client plugin.');
  }

  return {
    name: '@comity/vite-client',

    /**
     * Configure Vite build options
     *
     * This function configures the Vite build options, including the Rollup input,
     * assets directory, and JSX import source.
     *
     * @inheritdoc
     */
    config: () => {
      return {
        build: {
          rollupOptions: {
            input: [options.entrypoint],
          },
          assetsDir: options.assetsDir ?? 'static',
          manifest: true,
        },
        esbuild: {
          jsxImportSource: options.jsxImportSource ?? 'hono/jsx/dom',
        },
      };
    },
  };
};
