import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * Recursively scans a directory and returns all file paths.
 *
 * @param {string} basePath - The directory to scan or the single file to read.
 * @returns {string[]} - An array of file paths.
 */
export function resolveSourceFiles(basePath) {
  // Return an empty array if the path does not exist
  if (!existsSync(basePath)) {
    return [];
  }

  const stats = statSync(basePath);

  // Return the file if it's a regular file
  if (stats.isFile()) {
    return [basePath];
  }

  // Return an empty array if it's neither a file nor a directory
  if (!stats.isDirectory()) {
    return [];
  }

  // If it's a directory with package.json, target the src subdirectory
  if (existsSync(join(basePath, "package.json"))) {
    basePath = join(basePath, "src");
  }

  // Read directory entries
  const entries = readdirSync(basePath, { withFileTypes: true });
  let files = [];

  for (const entry of entries) {
    const fullPath = join(basePath, entry.name);

    // Recurse into subdirectories, skipping test and mock folders
    if (entry.isDirectory()) {
      if (entry.name === "__tests__" || entry.name === "__mocks__") {
        continue;
      }

      files = files.concat(resolveSourceFiles(fullPath));
    } else if (entry.isFile()) {
      //
      if (
        entry.name.endsWith(".ts") &&
        !entry.name.endsWith(".test.ts") &&
        !entry.name.endsWith(".spec.ts")
      ) {
        files.push(fullPath);
      }
    }
  }

  return files;
}
