import { build } from "vite";

/**
 * Builds the Comity application for production deployment.
 *
 * @param configFile - Optional path to a custom Vite configuration file
 *
 * @remarks
 * This command performs a complete production build of the Comity application
 * using Vite's build system. It generates optimized bundles for both server-side
 * rendering (SSR) and client-side code.
 *
 * **Build Process:**
 * 1. **SSR Build**: Compiles server-side code for fast initial page loads
 * 2. **Client Build**: Creates optimized client bundles with code splitting
 * 3. **Asset Optimization**: Minifies and compresses JavaScript, CSS, and assets
 *
 * **Configuration:**
 * Uses the Vite configuration file specified by `configFile` parameter,
 * or falls back to default Vite discovery (vite.config.ts, vite.config.js, etc.).
 *
 * @example
 * Basic build
 * ```bash
 * npx comity build
 * ```
 *
 * @example
 * Build with custom config
 * ```bash
 * npx comity build --config vite.config.prod.ts
 * ```
 *
 * @example
 * Build from package.json script
 * ```json
 * {
 *   "scripts": {
 *     "build": "comity build"
 *   }
 * }
 * ```
 */
export async function buildCommand(configFile?: string) {
  try {
    // SSR Build
    console.log("📦 Running SSR Build...");
    await build({
      configFile,
    });

    // Client Build (after SSR)
    console.log("📦 Running Client Build...");
    await build({
      configFile,
    });

    console.log("✅ Builds completed successfully.");
  } catch (error) {
    console.error("❌ Error during build:", error);
    process.exit(1);
  }
}
