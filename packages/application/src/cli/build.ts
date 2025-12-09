import { build } from "vite";

/**
 * Runs the Vite build process for both SSR and client bundles.
 *
 * @param configFile - Optional path to Vite config file
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
