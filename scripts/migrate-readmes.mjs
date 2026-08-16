#!/usr/bin/env node

import { readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const MONTH_INDEX = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
};

const CANONICAL_LINE = "No exhaustive reference; see docs for constraints.";

const MONTH_DATE_RE =
  /(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})/g;

const REQUIRED_SECTIONS = [
  "Purpose",
  "Scope",
  "Public API",
  "Documentation",
  "Related Packages",
  "Status",
];

function toIsoDate(monthName, day, year) {
  const month = String(MONTH_INDEX[monthName]).padStart(2, "0");
  const dayStr = String(Number(day)).padStart(2, "0");
  return `${year}-${month}-${dayStr}`;
}

function normalizeDates(content) {
  return content.replace(
    MONTH_DATE_RE,
    (_match, monthName, day, year) => toIsoDate(monthName, day, year)
  );
}

function findPublicApiRange(lines) {
  let start = null;
  let end = lines.length;
  for (let i = 0; i < lines.length; i++) {
    if (!/^## [^#]/.test(lines[i])) continue;
    const heading = lines[i].replace(/^##\s+/, "").trim();
    if (heading === "Public API") start = i;
    else if (start !== null) {
      end = i;
      break;
    }
  }
  return { start, end };
}

function ensureCanonicalLine(content) {
  if (content.includes(CANONICAL_LINE)) return { content, added: false };

  const lines = content.split("\n");
  const { start, end } = findPublicApiRange(lines);
  if (start === null) return { content, added: false };

  const section = lines.slice(start + 1, end);

  let insertionIndex = -1;
  for (let i = section.length - 1; i >= 0; i--) {
    if (section[i].trim() === "---") {
      insertionIndex = start + 1 + i;
      break;
    }
  }
  if (insertionIndex === -1) {
    insertionIndex = end;
  }

  lines.splice(insertionIndex, 0, "", CANONICAL_LINE);

  return { content: lines.join("\n"), added: true };
}

function hasValidStructure(content) {
  const headings = [];
  for (const line of content.split(/\r?\n/)) {
    if (!/^## [^#]/.test(line)) continue;
    headings.push(line.replace(/^##\s+/, "").trim());
  }
  const present = REQUIRED_SECTIONS.filter((name) => headings.includes(name));
  const inOrder = JSON.stringify(present) === JSON.stringify(REQUIRED_SECTIONS);
  return inOrder;
}

async function main() {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
  const packagesDir = join(root, "packages");

  let entries;
  try {
    entries = await readdir(packagesDir, { withFileTypes: true });
  } catch {
    console.error("Could not read packages directory.");
    process.exit(1);
  }

  const modifiedFiles = [];
  let dateFixes = 0;
  let canonicalAdditions = 0;

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const readmePath = join(packagesDir, entry.name, "README.md");
    const original = await readFile(readmePath, "utf8").catch(() => null);
    if (original === null) continue;

    let content = original;
    let changed = false;

    const normalized = normalizeDates(content);
    if (normalized !== content) {
      dateFixes += countDateFixes(content, normalized);
      content = normalized;
      changed = true;
    }

    if (hasValidStructure(content)) {
      const result = ensureCanonicalLine(content);
      if (result.added) {
        canonicalAdditions++;
        content = result.content;
        changed = true;
      }
    }

    if (changed) {
      await writeFile(readmePath, content, "utf8");
      modifiedFiles.push(entry.name);
    }
  }

  console.log("Modified files:");
  for (const name of modifiedFiles) {
    console.log(`  packages/${name}/README.md`);
  }
  console.log("");
  console.log(`Date fixes: ${dateFixes}`);
  console.log(`Canonical line additions: ${canonicalAdditions}`);
}

function countDateFixes(original, normalized) {
  const originalMatches = original.match(MONTH_DATE_RE) ?? [];
  return originalMatches.length;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
