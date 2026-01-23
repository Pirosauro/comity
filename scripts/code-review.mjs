#!/usr/bin/env node
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const OLLAMA_HOST = "http://192.168.1.80:11434";
const MODEL = "qwen2.5-coder:7b";
const OUTPUT_FILE = "review.md";
const PROMPT_TEMPLATE = `
You are an automated architectural code reviewer.

You must output ONLY valid JSON.
No explanations.
No text outside JSON.

You must be strict, literal, and non-creative.
Do not invent problems.

⸻

MODE

MODE: {{mode}}

MODE can be:
	•	diff   (default)
	•	full   (entire file provided)

⸻

VIOLATION CODES (DO NOT INVENT NEW ONES)

1   Layering
1.1 Domain purity
1.2 Core orchestration
1.3 Dependency direction

2   Determinism & Errors
2.1 Throwing instead of Result
2.2 Non-deterministic APIs

3   Ports & Adapters
3.1 Adapter implements business logic
3.2 Core depends on adapter

4   Public API semantics
4.1 Infrastructure leaking in names

⸻

ARCHITECTURAL RULES
	•	Hexagonal Architecture
	•	Domain: pure business rules only
	•	Domain: no I/O, no adapters, no exceptions
	•	Core: orchestration only
	•	Core: depends on domain
	•	Core: no business rules
	•	Core: no exceptions for expected failures
	•	Adapters: infrastructure and protocols
	•	Adapters MAY define protocol constants and error codes
	•	Expected failures MUST use Result<T, E>
	•	Core and domain MUST be deterministic
	•	Public APIs MUST have context-aware names
	•	Constants, enums, string literals, types, interfaces, comments are NOT business logic

⸻

PRE-CHECK (MANDATORY AND TERMINAL)

If MODE is “diff”
AND the diff does NOT contain:
	•	function or method bodies
	•	conditional logic
	•	loops
	•	throw statements
	•	forbidden imports

Then output exactly:

{
“status”: “ok”,
“violations”: []
}

Stop immediately.

⸻

REVIEW RULES
	•	Review ONLY the provided input
	•	In MODE “diff”: review ONLY the diff
	•	In MODE “full”: you MAY use the full file content
	•	Do NOT infer behavior from naming alone
	•	Do NOT speculate about intent or future usage
	•	Only report violations that apply to the declared layer
	•	Do NOT report pre-existing issues unless MODE is “full”

⸻

CONSISTENCY RULES
	•	If violations array is empty, status MUST be “ok”
	•	If violations array is non-empty, status MUST be “violation”
	•	Do NOT mix these states

⸻

INPUT

FILE PATH:
{{path}}

LAYER:
{{layer}}

CONTENT:
{{content}}

GIT DIFF:
{{diff}}

⸻

OUTPUT FORMAT (MANDATORY)

{
  “status”: “ok” | “violation” | “insufficient_context”,
  “violations”: [
    {
      “code”: “1.1 | 1.2 | 1.3 | 2.1 | 2.2 | 3.1 | 3.2 | 4.1”,
      “severity”: “CRITICAL” | “IMPORTANT” | “NOTE”,
      “rule”: “string”,
      “finding”: “string”,
      “impact”: “string”,
      “recommendation”: “string”
    }
  ]
}

END.
`.trim();

/**
 * Detect the architectural layer based on the file path.
 * @param {string} filePath
 * @returns {string} - "domain", "core", "adapters", or "unknown"
 */
function detectLayer(filePath) {
  if (filePath.includes("/domain/")) return "domain";
  if (filePath.includes("/core/")) return "core";
  if (filePath.includes("/adapters/")) return "adapters";

  return "unknown";
}

/**
 * Extract the git diff of staged changes.
 * @returns {string} - The git diff string.
 */
function getGitDiff() {
  try {
    return execSync("git diff --cached", { encoding: "utf8" });
  } catch {
    console.error("Failed to read git diff");
    process.exit(1);
  }
}

/**
 * Split the git diff into separate file diffs.
 * @param {string} diff - The git diff string.
 * @returns {Array<{file: string, diff: string}>} - Array of file diffs.
 */
function splitDiffByFile(diff) {
  const files = {};
  let currentFile = null;

  for (const line of diff.split("\n")) {
    if (line.startsWith("diff --git")) {
      const match = line.match(/a\/(.+?) b\/(.+)/);

      if (match) {
        currentFile = match[2];
        files[currentFile] = [];
      }
    }

    if (currentFile) {
      files[currentFile].push(line);
    }
  }

  return Object.entries(files).map(([file, lines]) => ({
    file,
    diff: lines.join("\n"),
  }));
}

/**
 * Call the Ollama API with the given prompt.
 * @param {string} prompt - The prompt to send.
 * @returns {Promise<string>}
 */
async function callOllama(prompt) {
  console.log("Calling AI model API...");

  const start = performance.now();
  const res = await fetch(`${OLLAMA_HOST}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      prompt,
      stream: false,
      temperature: 0.05,
      top_p: 0.9,
    }),
  });

  console.log(
    `AI thought for ${((performance.now() - start) / 1000).toFixed(2)} s`
  );

  if (!res.ok) {
    const text = await res.text();

    throw new Error(`Ollama error ${res.status}: ${text}`);
  }

  const data = await res.json();

  return data.response.trim();
}

async function main() {
  const args = process.argv.slice(2);

  console.log("Starting architectural code review...");

  try {
    const diff = getGitDiff();

    if (!diff.trim()) {
      console.log("No staged changes to review.");

      return;
    }

    const files = splitDiffByFile(diff);

    console.log(`Found ${files.length} changed file(s).`);

    let hasCritical = false;
    const output = [];

    for (const { file, diff } of files) {
      const layer = detectLayer(file);
      const content = readFileSync(resolve(file), "utf8");
      const prompt = PROMPT_TEMPLATE.replace("{{path}}", file)
        .replace("{{layer}}", layer)
        .replace("{{diff}}", diff)
        .replace("{{mode}}", args.includes("--full") ? "full" : "diff")
        .replace("{{content}}", content);

      console.log(`Reviewing ${file} [layer: ${layer}]...`);

      const response = await callOllama(prompt);

      output.push(`FILE: ${file}\n${response}\n`);

      if (response.includes("Severity: CRITICAL")) {
        hasCritical = true;
      }
    }

    writeFileSync(OUTPUT_FILE, output.join("\n---\n\n"), "utf8");

    console.log(`AI review written to ${OUTPUT_FILE}`);

    if (hasCritical) {
      throw new Error("CRITICAL architectural violations found.");
    }
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

main();
