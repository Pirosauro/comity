import { readFileSync } from "node:fs";

/**
 * Reads a file and parses its content based on the specified format.
 *
 * @param {string} path - The file path to read.
 * @param {"json"|"text"} format - The format to parse the file as.
 * @returns {unknown} - The parsed content of the file.
 */
export function readFile(path, format) {
  const content = readFileSync(path, "utf8");

  switch (format) {
    case "json":
      return JSON.parse(content);

    case "text":
    default:
      return content;
  }
}
