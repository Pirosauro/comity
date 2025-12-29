/**
 * Gets the current directory path in a cross-platform manner.
 *
 * @returns The absolute path to the current directory
 * @remarks
 * This function handles both CommonJS (__dirname) and ESM (import.meta.url) environments
 * automatically. In ESM environments, it converts the file URL to a file path and extracts
 * the directory. Falls back to process.cwd() if neither CommonJS nor ESM detection works,
 * ensuring the function always returns a valid directory path.
 *
 * @example
 * ```typescript
 * // In CommonJS environment
 * const dirname = await getDirname();
 * console.log(dirname); // "/path/to/directory"
 *
 * // In ESM environment
 * const dirname = await getDirname();
 * console.log(dirname); // "/path/to/directory"
 *
 * // Fallback in unknown environment
 * const dirname = await getDirname();
 * console.log(dirname); // Current working directory
 * ```
 */
export async function getDirname(): Promise<string> {
  // CommonJS
  if (typeof __dirname !== "undefined") {
    return __dirname;
  }

  // @ts-ignore ESM
  if (typeof import.meta !== "undefined") {
    const { fileURLToPath } = await import("url");
    const { dirname } = await import("path");

    // @ts-ignore
    return dirname(fileURLToPath(import.meta.url));
  }

  // Fallback
  return process.cwd();
}
