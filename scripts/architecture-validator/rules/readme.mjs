import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { REQUIRED_SECTIONS } from "../context.mjs";

const README_SOURCE =
  "docs/standards/read-me.md / architecture-validation.md §10 (docs/standards/)";

const FORBIDDEN_SECTIONS = [
  "Getting Started",
  "Installation",
  "Usage",
  "Examples",
  "API Reference",
  "Contributing",
  "License",
];

const STATUS_LABELS = new Set(["Stable", "Experimental", "Draft"]);
const STATUS_FORBIDDEN = new Set(["Beta", "Internal"]);

const CANONICAL_LINE = "No exhaustive reference; see docs for constraints.";

const MONTH_DATE_RE =
  /(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(?:st|nd|rd|th)?(?:,)?\s+\d{4}/g;
const NUMERIC_DATE_RE = /(?<!\d)\d{1,2}[\/.]\d{1,2}[\/.]\d{2,4}(?!\d)/g;

function parseHeadings(content) {
  const headings = [];
  for (const line of content.split(/\r?\n/)) {
    if (!/^## [^#]/.test(line)) continue;
    headings.push(line.replace(/^##\s+/, "").trim());
  }
  return headings;
}

function sectionContent(content, name) {
  const lines = content.split(/\r?\n/);
  let start = null;
  let end = lines.length;
  for (let i = 0; i < lines.length; i++) {
    if (/^## [^#]/.test(lines[i])) {
      const heading = lines[i].replace(/^##\s+/, "").trim();
      if (start !== null && heading !== name) {
        end = i;
        break;
      }
      if (heading === name) start = i + 1;
    }
  }
  if (start === null) return "";
  return lines.slice(start, end).join("\n");
}

function validateSections(packageName, readmePath, headings) {
  const present = headings.filter((name) => REQUIRED_SECTIONS.includes(name));
  const missing = REQUIRED_SECTIONS.filter((name) => !present.includes(name));
  const inOrder = JSON.stringify(present) === JSON.stringify(REQUIRED_SECTIONS);

  if (missing.length === 0 && inOrder) return [];

  return [
    {
      code: "ARCH-README-001",
      message: `Required README sections missing or out of order${
        missing.length > 0 ? ` (missing: ${missing.join(", ")})` : ""
      }`,
      package: packageName,
      readmePath,
      expected: REQUIRED_SECTIONS.map((name) => `## ${name}`).join("\n"),
      source: README_SOURCE,
      remediation:
        "Ensure the README contains all six required sections in the documented order.",
    },
  ];
}

function validateForbiddenSections(packageName, readmePath, headings) {
  const forbidden = headings.filter((name) => FORBIDDEN_SECTIONS.includes(name));
  if (forbidden.length === 0) return [];

  return [
    {
      code: "ARCH-README-002",
      message: `Forbidden section(s) present: ${forbidden.join(", ")}`,
      package: packageName,
      readmePath,
      expected: forbidden.map((name) => `## ${name}`).join("\n"),
      source: README_SOURCE,
      remediation:
        "Remove the forbidden section; content belongs in Documentation links instead.",
    },
  ];
}

function validateStatus(packageName, readmePath, content) {
  const statusContent = sectionContent(content, "Status");
  const body = statusContent
    .split(/\r?\n/)
    .filter((line) => !line.trim().startsWith("_") && line.trim());

  const labels = body.join(" ").match(/\b(Stable|Experimental|Draft)\b/g) ?? [];
  const distinct = [...new Set(labels)];
  const forbidden = body.join(" ").match(/\b(Beta|Internal)\b/g) ?? [];
  const compound = /(Stable|Experimental|Draft)\s*\/\s*(Stable|Experimental|Draft)/.test(
    statusContent
  );

  if (distinct.length === 1 && forbidden.length === 0 && !compound) return [];

  return [
    {
      code: "ARCH-README-003",
      message: `Status must contain exactly one vocabulary label (Stable, Experimental, Draft)${
        distinct.length > 1
          ? `; found multiple labels: ${distinct.join(", ")}`
          : distinct.length === 0
            ? "; no recognized label found"
            : ""
      }${forbidden.length > 0 ? `; forbidden label(s): ${forbidden.join(", ")}` : ""}${
        compound ? "; compound label detected" : ""
      }`,
      package: packageName,
      readmePath,
      expected: "Stable | Experimental | Draft",
      source: README_SOURCE,
      remediation:
        "Set exactly one vocabulary label from Stable, Experimental, or Draft.",
    },
  ];
}

function validateDates(packageName, readmePath, content) {
  const violations = [];

  for (const regex of [MONTH_DATE_RE, NUMERIC_DATE_RE]) {
    const matches = content.match(regex) ?? [];
    if (matches.length === 0) continue;
    violations.push({
      code: "ARCH-README-004",
      message: `Non-ISO date(s) in README metadata: ${matches.join(", ")}`,
      package: packageName,
      readmePath,
      expected: "YYYY-MM-DD",
      source: README_SOURCE,
      remediation: "Convert the date(s) to ISO format YYYY-MM-DD.",
    });
  }

  return violations;
}

function validateCanonicalLine(packageName, readmePath, content) {
  const publicApiContent = sectionContent(content, "Public API");
  if (publicApiContent.includes(CANONICAL_LINE)) return [];

  return [
    {
      code: "ARCH-README-005",
      message: "Missing canonical Public API constraint line",
      package: packageName,
      readmePath,
      expected: CANONICAL_LINE,
      source: README_SOURCE,
      remediation:
        "Add the mandatory canonical line to the Public API section.",
    },
  ];
}

export async function validate(context) {
  const { packages } = context;
  const violations = [];

  for (const pkg of packages) {
    const readmePath = join(pkg.path, "README.md");
    const content = await readFile(readmePath, "utf8").catch(() => null);

    if (content === null) {
      violations.push({
        code: "ARCH-README-001",
        message: "README file missing",
        package: pkg.name,
        readmePath,
        expected: REQUIRED_SECTIONS.map((name) => `## ${name}`).join("\n"),
        source: README_SOURCE,
        remediation: "Add the required README.md with all six mandatory sections.",
      });
      continue;
    }

    const headings = parseHeadings(content);

    violations.push(...validateSections(pkg.name, readmePath, headings));
    violations.push(...validateForbiddenSections(pkg.name, readmePath, headings));
    violations.push(...validateStatus(pkg.name, readmePath, content));
    violations.push(...validateDates(pkg.name, readmePath, content));
    violations.push(...validateCanonicalLine(pkg.name, readmePath, content));
  }

  return violations;
}

export const validateReadme = validate;
