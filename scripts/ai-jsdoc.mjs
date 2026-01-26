#!/usr/bin/env node
import { existsSync, readdirSync, statSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const TARGET = process.argv[2];
const OLLAMA_HOST = "http://192.168.1.80:11434";
const MODEL = "qwen2.5-coder:7b";

if (!TARGET) {
  console.error("Usage: node ai-jsdoc.mjs <path>");
  process.exit(1);
}

/**
 * Recursively scans a directory and returns all file paths.
 *
 * @param {string} basePath - The directory to scan or the single file to read.
 * @returns {string[]} - An array of file paths.
 */
function resolveSourceFiles(basePath) {
  if (!existsSync(basePath)) {
    return [];
  }

  // If it's a file, return it directly
  const stats = statSync(basePath);

  if (stats.isFile()) {
    return [basePath];
  }

  if (!stats.isDirectory()) {
    return [];
  }

  if (existsSync(join(basePath, "package.json"))) {
    basePath = join(basePath, "src");
  }

  const entries = readdirSync(basePath, { withFileTypes: true });
  let files = [];

  for (const entry of entries) {
    const fullPath = join(basePath, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === "__tests__" || entry.name === "__mocks__") {
        continue;
      }

      files = files.concat(resolveSourceFiles(fullPath));
    } else if (entry.isFile()) {
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

/**
 * Cleans the source content extracted from a code block.
 * @param {string} content - The raw source content.
 * @returns {string|null} - The cleaned source content or null if not found.
 */
function cleanSourceContent(content) {
  if (typeof content !== "string") {
    return null;
  }

  const normalized = content.replace(/\r\n/g, "\n");

  // Capture content between an opening four-backtick fence (optionally with language)
  // and the corresponding closing four-backtick fence. Return null if not present.
  const match = normalized.match(/^```[^\n]*\n([\s\S]*?)\n?```$/);

  if (!match) {
    return null;
  }

  return match[1].trim();
}

/**
 * Checks if the content is allowed to be processed by the AI.
 *
 * @param {string} content - The content to check.
 * @returns {boolean} - True if the content is allowed, false otherwise.
 */
export function shouldProcessJsDoc(content) {
  // Look for @comity tag followed by any content that includes ai-jsdoc-skip
  const comityRegex = /@comity[^\n\r]*ai-jsdoc-skip/;

  return !comityRegex.test(content);
}

/**
 * Main function to generate README.md using AI.
 *
 * @returns {Promise<void>}
 */
async function generate() {
  const start = performance.now();
  // 1. Read files
  const files = resolveSourceFiles(TARGET);

  // 2.
  for (const filePath of files) {
    const content = await readFile(filePath, "utf-8");

    if (!shouldProcessJsDoc(content)) {
      console.log(`\n🚫 Skipping file: ${filePath} (ai-jsdoc-skip)`);
      continue;
    }

    const prompt = `
You are a JSDoc review specialist for TypeScript projects. Output ONLY the revised TypeScript file—no explanations, no markdown, no extra text.

HARD RULES

  NEVER add @param, @returns, @throws, @typeParam, or @example to interfaces or type aliases. These tags are for functions/methods only.
  Interfaces are not functions—do not document them as if they have parameters.

INTERFACE & TYPE RULES

  Top-level comment: one general sentence ending with a period. Use single-line (/** Description. */) or multi-line if needed—but no block tags.
  Each property: /** Description. */ on its own line above the property.
  One blank line between properties.
  Descriptions must be concise and end with a period.

FUNCTION & METHOD RULES

  1–2 sentence description, then blank line, then block tags in order:
  @inheritdoc → @typeParam → @param → @returns → @throws → (@remarks?) → (@example?)
  @param name - Description. (hyphen, no type, ends with period)
  @returns Description. (if not void)
  @throws {ErrorType} - Description.
  Only add @remarks or @example if they provide essential, non-obvious value.

FORMATTING

  All sentences end with a period.
  Multi-line JSDoc: /**\n * ...\n */, with * (space after asterisk).
  Blank line before first @tag in functions.
  Normalize everything—ignore input style.

CONSTRUCTORS

  No description. Only @param, @throws, etc.

Now process the file and return only the corrected code.

=== CONTENT ===
${content.trim()}
`.trim();

    console.log(`\n📝 Processing file: ${filePath}`);
    console.log(`📡 Sending request to ${OLLAMA_HOST} (Context size: ${prompt.length} chars)...`);

    const response = await fetch(`${OLLAMA_HOST}/api/generate`, {
      method: "POST",
      body: JSON.stringify({
        model: MODEL,
        prompt: prompt,
        stream: false,
        options: { num_thread: 6, temperature: 0.1 },
      }),
    });

    const data = await response.json();
    const sourceContent = cleanSourceContent(data.response.trim());

    if (!sourceContent) {
      console.warn(`⚠️  No valid source content returned for ${filePath}, skipping.`);
      continue;
    }

    await writeFile(filePath, sourceContent + "\n");
  }

  const duration = (performance.now() - start) / 1000;

  console.log(`✅ JSDoc generated in ${duration.toFixed(2)}s`);
}

generate().catch(console.error);
