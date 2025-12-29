/**
 * Gets the current file path in a cross-platform manner.
 *
 * @returns The absolute path to the current file, or undefined if unable to determine
 * @remarks
 * This function handles both CommonJS (__filename) and ESM (import.meta.url) environments
 * automatically. In ESM environments, it converts the file URL to a file path using Node.js
 * URL utilities. Returns undefined only in environments where neither CommonJS nor ESM
 * detection mechanisms are available.
 *
 * @example
 * ```typescript
 * // In CommonJS environment
 * const filename = await getFilename();
 * console.log(filename); // "/path/to/file.js"
 *
 * // In ESM environment
 * const filename = await getFilename();
 * console.log(filename); // "/path/to/file.mjs"
 * ```
 */
export async function getFilename(): Promise<string | undefined> {
  // CommonJS
  if (typeof __filename !== "undefined") {
    return __filename;
  }

  // @ts-ignore ESM
  if (typeof import.meta !== "undefined") {
    const { fileURLToPath } = await import("url");

    // @ts-ignore
    return fileURLToPath(import.meta.url);
  }
}
