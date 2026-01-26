#!/usr/bin/env node
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const OLLAMA_HOST = "http://192.168.1.80:11434";
const MODEL = "qwen2.5-coder:7b";
const OUTPUT_FILE = "review.md";
const PROMPT_TEMPLATE = `
You are an automated architectural and API reviewer for the Comity framework.

You MUST output ONLY valid JSON.
No explanations.
No markdown.
No text outside JSON.

You must be strict, literal, and non-creative.
Do NOT invent problems.
Do NOT speculate about intent or future usage.
Only evaluate what is explicitly present.

⸻

MODE: FULL_FILE

⸻

AUTHORITATIVE STANDARDS

You are provided with an authoritative JSON document named \`comity-standards\`.
This document defines:
- architectural layers
- error semantics
- lifecycle rules
- public API rules
- class design rules
- documentation rules

You MUST:
- Treat \`comity-standards\` as the single source of truth
- Apply ONLY rules that match the declared LAYER
- NOT apply rules from other layers
- NOT infer rules that are not explicitly stated

If a rule is marked as MUST or MUST NOT, violations are CRITICAL.
If a rule is descriptive or advisory, violations are NOTE.

⸻

DECLARED LAYER

The declared LAYER determines which subset of standards apply.
Valid layers are defined by \`comity-standards.meta.layers\`.

If the declared LAYER is not recognized, return:

{
  "status": "insufficient_context",
  "violations": []
}

⸻

VIOLATION CATEGORIES (DO NOT INVENT NEW ONES)

1   Layering
1.1 Domain purity
1.2 Kernel orchestration
1.3 Dependency direction

2   Determinism & Errors
2.1 Invalid error semantics
2.2 Non-deterministic behavior

3   Modules & Adapters
3.1 Adapter contains business logic
3.2 Module depends on adapter

4   Public API Semantics
4.1 Internal or infrastructure concepts leaked

5   Lifecycle & Events
5.1 Invalid lifecycle transition
5.2 Events influencing control flow

⸻

REVIEW RULES

- Review ONLY the provided file content
- Use the declared LAYER as authoritative
- Do NOT report missing features
- Do NOT report stylistic issues unless mandated by standards
- Do NOT report pre-existing issues unless visible in this file
- Constants, types, interfaces, comments are NOT business logic

⸻

INPUT

FILE PATH:
{{path}}

LAYER:
{{layer}}

FILE CONTENT:
{{content}}

⸻

OUTPUT FORMAT (MANDATORY)

{
  "status": "ok" | "violation" | "insufficient_context",
  "violations": [
    {
      "code": "1.1 | 1.2 | 1.3 | 2.1 | 2.2 | 3.1 | 3.2 | 4.1 | 5.1 | 5.2",
      "severity": "CRITICAL | IMPORTANT | NOTE",
      "rule": "Exact rule violated (from comity-standards)",
      "finding": "Concrete description of what is wrong",
      "impact": "Why this matters architecturally",
      "recommendation": "Minimal corrective action"
    }
  ]
}
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
  const comityStandardsJson = {
    meta: {
      name: "comity-standards",
      version: "1.0.0",
      scope: "code-review",
      authoritative: true,
    },

    layers: {
      primitives: {
        description: "Pure, reusable building blocks without side effects.",
        rules: [
          {
            id: "primitives-no-io",
            description: "Primitives MUST NOT perform I/O or have side effects",
          },
          {
            id: "primitives-deterministic",
            description: "Primitives MUST be deterministic and pure",
          },
          {
            id: "primitives-zero-mocks",
            description: "Primitives MUST be testable without mocks",
          },
        ],
      },

      kernel: {
        description: "Lifecycle orchestration and module coordination.",
        rules: [
          {
            id: "kernel-orchestration-only",
            description: "Kernel contains orchestration only, no business rules",
          },
          {
            id: "kernel-lifecycle-control",
            description: "Kernel owns and controls system lifecycle states",
          },
          {
            id: "kernel-no-business-logic",
            description: "Kernel MUST NOT contain domain or business logic",
          },
        ],
      },

      modules: {
        description: "Reusable functional units with domain or infrastructure logic.",
        subtypes: {
          domain_modules: {
            description: "Modules containing pure business logic",
            rules: [
              {
                id: "domain-module-no-adapters",
                description: "Domain modules MUST NOT depend on adapters",
              },
              {
                id: "domain-module-explicit-deps",
                description: "Domain modules MUST declare explicit dependencies",
              },
            ],
          },
          infrastructure_modules: {
            description: "Modules providing infrastructure services",
            rules: [
              {
                id: "infra-module-no-business-logic",
                description: "Infrastructure modules MUST NOT contain business rules",
              },
            ],
          },
        },
        common_rules: [
          {
            id: "module-setup-explicit",
            description: "Modules MUST declare setup explicitly via ModuleMeta",
          },
          {
            id: "module-public-api-stable",
            description: "Module public APIs are stable contracts",
          },
        ],
      },

      adapters: {
        description: "Framework and platform-specific integrations.",
        rules: [
          {
            id: "adapter-no-business-logic",
            description: "Adapters MUST NOT implement business or domain logic",
          },
          {
            id: "adapter-thin-translation",
            description: "Adapters MUST be thin translation layers only",
          },
          {
            id: "adapter-framework-specific",
            description: "Adapters ARE framework-specific and replaceable",
          },
          {
            id: "adapter-no-module-deps",
            description: "Modules MUST NOT depend on adapters",
          },
        ],
      },
    },

    errors: {
      description: "Error handling conventions.",
      rules: [
        {
          id: "baseerror-mandatory",
          description: "All errors MUST extend BaseError",
        },
        {
          id: "error-code-namespaced",
          description: "Error codes MUST be namespaced (module:reason)",
        },
        {
          id: "error-message-safe",
          description: "Error messages MUST be safe to log (no sensitive data)",
        },
        {
          id: "http-status-hint-only",
          description: "HTTP status in meta is a hint, not a dependency",
        },
      ],
      note: "Comity uses exceptions for both expected and unexpected failures. For expected failures, consider Result<T,E> pattern as future enhancement.",
    },

    public_api: {
      description: "Public API surface rules.",
      rules: [
        {
          id: "api-intentional-stable",
          description: "Public APIs MUST be intentional, stable, and documented",
        },
        {
          id: "no-internal-exports",
          description: "Internal APIs MUST NOT be exported or documented",
        },
        {
          id: "facades-preferred",
          description: "Behavior exposure SHOULD use Facade pattern",
        },
        {
          id: "sub-entrypoints-conceptual",
          description: "Sub-entrypoints MUST represent clear conceptual domains",
        },
      ],
    },

    events_hooks: {
      description: "Event and hook system rules.",
      events: {
        rules: [
          {
            id: "events-observational",
            description: "Events are observational and MUST NOT influence control flow",
          },
          {
            id: "events-optional",
            description: "System MUST function correctly without event listeners",
          },
          {
            id: "events-payload-safe",
            description: "Event payloads MUST be safe to log (identifiers, not objects)",
          },
        ],
      },
      hooks: {
        rules: [
          {
            id: "hooks-participatory",
            description: "Hooks are participatory and MAY influence control flow",
          },
          {
            id: "hooks-ordered-execution",
            description: "Hook execution order MAY matter",
          },
          {
            id: "hooks-lifecycle-contract",
            description: "Hooks are part of lifecycle contracts",
          },
        ],
      },
      separation_rule: {
        id: "no-event-to-hook",
        description: "Events MUST NOT trigger hooks; Hooks MAY emit events",
      },
    },

    testing: {
      description: "Testing standards by layer.",
      rules: [
        {
          id: "test-behavior-not-implementation",
          description: "Tests MUST validate contracts and behavior, not implementations",
        },
        {
          id: "layer-appropriate-testing",
          description: "Testing approach MUST vary by architectural layer",
        },
        {
          id: "primitives-pure-tests",
          description: "Primitives tests MUST be pure and deterministic with zero mocks",
        },
        {
          id: "adapters-integration-tests",
          description: "Adapter tests MAY use integration-style tests and real frameworks",
        },
      ],
    },

    documentation: {
      description: "Documentation and contract standards.",
      rules: [
        {
          id: "readme-structured",
          description: "README.md MUST follow standard structure (Purpose, Scope, Public API)",
        },
        {
          id: "docs-separate-from-readme",
          description: "Detailed documentation MUST live in docs/ directory",
        },
        {
          id: "decisions-not-adrs",
          description: "Design decisions documented as topic files, not formal ADRs",
        },
        {
          id: "public-api-documented",
          description: "All public APIs MUST be documented",
        },
        {
          id: "internal-undocumented",
          description: "Internal APIs MUST NOT be documented",
        },
      ],
    },

    class_design: {
      description: "Class construction and design standards.",
      rules: [
        {
          id: "explicit-fields",
          description: "All fields MUST be declared explicitly (no parameter properties)",
        },
        {
          id: "private-fields-js",
          description: "Internal state MUST use #private JavaScript fields",
        },
        {
          id: "public-access-via-getters",
          description: "Public state MUST be exposed via getters",
        },
        {
          id: "constructor-initializes-fully",
          description: "Constructor MUST fully initialize the instance",
        },
        {
          id: "lifecycle-explicit",
          description: "Classes with phases MUST use Lifecycle abstraction",
        },
      ],
    },

    key_principles: {
      description: "Cross-cutting architectural principles.",
      rules: [
        {
          id: "boundary-clear",
          description: "Architectural boundaries MUST be clear and enforced",
        },
        {
          id: "contracts-stable",
          description: "Public contracts MUST be stable and versioned",
        },
        {
          id: "adapters-replaceable",
          description: "Adapters MUST be thin, framework-specific, and replaceable",
        },
        {
          id: "modules-composable",
          description: "Modules MUST be composable and explicitly declare dependencies",
        },
        {
          id: "kernel-orchestrates",
          description: "Kernel orchestrates, modules provide functionality, adapters translate",
        },
      ],
    },
  };

  const STANDARDS = `
<COMITY_STANDARDS>
${JSON.stringify(comityStandardsJson, null, 2)}
</COMITY_STANDARDS>
`;
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

  console.log(`AI thought for ${((performance.now() - start) / 1000).toFixed(2)} s`);

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
