#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const TARGET_DIR = process.argv[2];
const OLLAMA_HOST = "http://192.168.1.80:11434";
const MODEL = "qwen2.5-coder:7b";

if (!TARGET_DIR) {
  console.error("Usage: node ai-readme.mjs <package-path>");
  process.exit(1);
}

/**
 * Retrieves and parses the package.json file from the target directory.
 *
 * @returns {Object|null} The parsed package.json content or null if not found.
 */
function getPackageJson() {
  const path = join(TARGET_DIR, "package.json");

  return existsSync(path) ? JSON.parse(readFileSync(path, "utf-8")) : null;
}

/**
 * Retrieves information about a symbol from the source content.
 *
 * @param {string} sourceContent The content of the source file.
 * @param {string} symbol The symbol to retrieve information for.
 * @returns {Object} An object containing the category and description of the symbol.
 */
function getSymbolInfo(sourceContent, symbol) {
  // Regex to find the symbol with optional JSDoc comment
  // (\/\*\*[\s\S]*?\*\/)? -> JSDoc capture /** ... */
  // \s*export (const|function|class|type|interface|enum) symbol\b
  const pattern = new RegExp(
    `(?:\\/\\*\\*([\\s\\S]*?)\\*\\/)?\\s*export\\s+(?:const|function|class|type|interface|enum)\\s+${symbol}\\b`,
    "m"
  );

  const match = sourceContent.match(pattern);

  if (!match) return { type: "Unknown", description: "" };

  const rawJsDoc = match[1] || "";
  // Clean up the JSDoc comment
  const cleanDescription = rawJsDoc
    .replace(/\r?\n/g, " ")
    .replace(/\*/g, "")
    .replace(/\s+/g, " ")
    .trim();

  // Determine if it's a type or value
  const isType = /export\s+(type|interface)\b/.test(match[0]);

  return {
    category: isType ? "Type" : "Value",
    description: cleanDescription,
  };
}

/**
 * Cleans a raw JSDoc comment to extract the summary description.
 *
 * @param {string} rawJsDoc - The raw JSDoc comment.
 * @returns {string} - The cleaned summary description.
 * @depreacted
 */
function cleanJsDoc(rawJsDoc) {
  if (!rawJsDoc) return "";

  const lines = rawJsDoc.split("\n");
  const summaryLines = [];

  for (let line of lines) {
    // Remove leading asterisks and whitespace
    let cleanLine = line.replace(/^\s*\*+/g, "").trim();

    // Stop at tags or after the first empty line following content
    if (cleanLine.startsWith("@") || (summaryLines.length > 0 && cleanLine === "")) {
      break;
    }

    if (cleanLine !== "") {
      summaryLines.push(cleanLine);
    }
  }

  return summaryLines.join(" ");
}

/**
 * Parses the API surface from the given index file path.
 *
 * @param {string} indexRelativePath - The relative path to the index file in the types directory.
 * @returns {{ values: string[], types: string[] }|null} - The parsed API surface with values and types or null if not found.
 */
function parseApiFromIndex(indexRelativePath) {
  // Convert dist/types/setup/index.d.ts -> src/setup/index.ts
  const srcPath = indexRelativePath.replace("dist/types/", "src/").replace(".d.ts", ".ts");
  const fullPath = join(TARGET_DIR, srcPath);

  if (!existsSync(fullPath)) return null;

  const content = readFileSync(fullPath, "utf-8");
  const api = { values: [], types: [] };

  // Regex to match re-export statements
  const reExportRegex = /export {([\s\S]*?)} from ["']\.\/(.*?)(\.js)?["']/g;
  let match;

  while ((match = reExportRegex.exec(content)) !== null) {
    const symbols = match[1].split(",").map((s) => s.trim());
    const sourceFilePath = resolveSourceFile(join(dirname(fullPath), match[2]));

    if (sourceFilePath) {
      const sourceContent = readFileSync(sourceFilePath, "utf-8");

      for (const symbol of symbols) {
        const info = getSymbolInfo(sourceContent, symbol);
        const entry = info.description ? `\`${symbol}\`: ${info.description}` : `\`${symbol}\``;

        if (info.category === "Type") api.types.push(entry);
        else api.values.push(entry);
      }
    }
  }

  return api;
}

/**
 * Resolves the source file path by checking for various TypeScript extensions.
 *
 * @param {string} basePath - The base path without extension.
 * @returns {string|null} - The resolved file path or null if not found.
 */
function resolveSourceFile(basePath) {
  // Remove the possible .js extension if present in the path extracted from the regex
  const cleanPath = basePath.replace(/\.js$/, "");
  const extensions = [".ts", ".tsx", ".mts", ".cts"];

  for (const ext of extensions) {
    const fullPath = cleanPath + ext;

    if (existsSync(fullPath)) return fullPath;
  }

  return null;
}

/**
 * Main function to generate README.md using AI.
 *
 * @returns {Promise<void>}
 */
async function generate() {
  const start = performance.now();
  // 1. Read package.json
  const pkg = getPackageJson();

  if (!pkg) {
    console.error("No package.json found.");
    process.exit(1);
  }

  // 2. Extract exports from package.json
  const exportEntries = pkg.exports || {};
  const apiReport = [];

  for (const [key, config] of Object.entries(exportEntries)) {
    if (key.endsWith(".json")) continue;

    // 3. Map to types (which reflect the src structure)
    const typesPath = config.import?.types || config.require?.types;

    if (typesPath) {
      const apiData = parseApiFromIndex(typesPath);

      if (apiData) {
        apiReport.push(
          `Entrypoint "${key}":\n- Values: ${apiData.values.join(", ") || "None"}\n- Types: ${apiData.types.join(", ") || "None"}`
        );
      }
    }
  }

  // 3. Prepare prompt for AI
  const prompt = `
You are generating a README.md for a Comity package.

The README MUST follow EXACTLY this structure and NOTHING else:

# <package-name>
<ONE sentence. Plain text. NOT a heading.>

---

## Purpose
<1–2 sentences describing WHY the package exists. No implementation details.>

---

## Responsibilities
- ✅ <What the package DOES>
- ❌ <What the package DOES NOT do>

(Only bullet points. No paragraphs.)

---

## Architecture
<2–3 sentences max. Describe patterns or approach. No APIs. No libraries. No "how".>

---

## Documentation
- \`docs/overview.md\`
- \`docs/conventions.md\`
- \`docs/<other>.md\`

(Only relative paths. No external links.)

---

## Status
Stable

STRICT RULES:
- Do NOT invent sections.
- Do NOT use "##" except for the exact section titles above.
- Do NOT describe implementation details (DOM, HTTP, frameworks, adapters, etc.).
- Do NOT list exported symbols or APIs.
- Do NOT use marketing language.
- Do NOT add examples or code.
- Do NOT add external links.
- Do NOT use emojis except ✅ or ❌ in Responsibilities.
- If information is missing, be conservative and minimal.

=== CONTEXT ===
Package name:
${pkg.name}

Package description from package.json
(May be incomplete or outdated. Use cautiously):
"${pkg.description ?? ""}"

Public API surface
(Provided ONLY to infer responsibilities.
Do NOT list symbols or APIs in the README):
${(apiReport ?? ["N/A"]).join("\n\n")}
`.trim();

  console.log(`📡 Sending request to ${OLLAMA_HOST} (Context size: ${prompt.length} chars)...`);

  // 4. Send to AI model
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
  const duration = (performance.now() - start) / 1000;

  writeFileSync(join(TARGET_DIR, "README.md"), data.response.trim());
  console.log(`✅ README generated for ${pkg.name} in ${duration.toFixed(2)}s`);
}

generate().catch(console.error);
