#!/usr/bin/env node
import { resolve } from "node:path";
import { callOllama } from "./internal/ollama.mjs";
import { readFile } from "./internal/read-file.mjs";
import { resolveSourceFiles } from "./internal/resolve-source-files.mjs";

const OLLAMA_HOST = "http://192.168.1.80:11434";
const MODEL = "qwen2.5-coder:7b";
const TARGET = process.argv[2];
const PROFILE = process.argv[3];

if (!TARGET || !PROFILE) {
  console.error("Usage: node ai-code-review.mjs <path> <profile>");
  process.exit(1);
}

/**
 * Main function to perform architectural code review on staged changes.
 *
 * @returns {Promise<void>}
 */
async function main() {
  console.log("Starting architectural code review...");

  try {
    const standardsJson = readFile(resolve("docs/ai/code-review/standards.json"), "json");
    const standards = `
<COMITY_STANDARDS>
${JSON.stringify(standardsJson, null, 2)}
</COMITY_STANDARDS>
`;
    const profileJson = readFile(resolve(PROFILE), "json");
    const profile = `
<MODULE_PROFILE>
${JSON.stringify(profileJson, null, 2)}
</MODULE_PROFILE>
`;
    const prompt = readFile(resolve("docs/ai/code-review/prompts/full.md"), "text");
    const files = resolveSourceFiles(TARGET);

    for (const file of files) {
      const content = readFile(resolve(file), "text");
      const input = prompt
        .replace("{{global_standards_json}}", standards)
        .replace("{{module_profile_json}}", profile)
        .replace("{{file_path}}", file)
        .replace("{{file_content}}", content);

      console.log(`\n📝 Reviewing file: ${file}`);
      console.log(`📡 Sending request to ${OLLAMA_HOST} (Context size: ${input.length} chars)...`);

      const response = await callOllama(OLLAMA_HOST, {
        model: MODEL,
        prompt: input,
        stream: false,
        temperature: 0.05,
        top_p: 0.9,
      });

      console.log(response);
    }
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

main();
