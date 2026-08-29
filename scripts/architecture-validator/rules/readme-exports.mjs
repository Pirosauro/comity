import { readFile } from "node:fs/promises";
import { join } from "node:path";

const README_EXPORT_SOURCE = "read-me.md §Public API / public-api.md §3 (docs/standards/)";

function parsePublicApiSection(content) {
  const publicApiContent = extractSection(content, "Public API");
  if (!publicApiContent) return [];

  const lines = publicApiContent.split(/\r?\n/);
  const domains = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("-")) continue;
    const domainMatch = trimmed.match(/^-\s*(\w+):/);
    if (domainMatch) {
      domains.push(domainMatch[1].toLowerCase());
    }
  }

  return domains;
}

function extractSection(content, sectionName) {
  const lines = content.split(/\r?\n/);
  let start = null;
  let end = lines.length;

  for (let i = 0; i < lines.length; i++) {
    if (/^## [^#]/.test(lines[i])) {
      const heading = lines[i].replace(/^##\s+/, "").trim();
      if (start !== null && heading !== sectionName) {
        end = i;
        break;
      }
      if (heading === sectionName) start = i + 1;
    }
  }

  if (start === null) return "";
  return lines.slice(start, end).join("\n");
}

function getDocumentedSubpathsFromReadme(content, manifest) {
  const publicApiContent = extractSection(content, "Public API");
  if (!publicApiContent) return new Set();

  const exportedSubpaths = new Set(Object.keys(manifest.exports ?? {}));
  const documented = new Set();

  const subpathRegex = /@comity\/[a-z0-9-]+\/([a-z0-9-]+)/g;
  for (const match of publicApiContent.matchAll(subpathRegex)) {
    const subpath = `./${match[1]}`;
    if (exportedSubpaths.has(subpath)) {
      documented.add(subpath);
    }
  }

  const bulletRegex = /^-\s*(\w+):/gm;
  for (const match of publicApiContent.matchAll(bulletRegex)) {
    const domain = match[1].toLowerCase();
    const possibleSubpaths = [
      "./errors",
      "./observers",
      "./setup",
      "./policies",
      "./serializers",
      "./commands",
      "./repositories",
      "./stores",
      "./streaming",
      "./client",
      "./lifecycle",
      "./transports",
    ];
    for (const subpath of possibleSubpaths) {
      const segment = subpath.replace(/^\.\//, "");
      if (domain.includes(segment.replace("/", "")) || segment.includes(domain)) {
        if (exportedSubpaths.has(subpath)) {
          documented.add(subpath);
        }
      }
    }
  }

  return documented;
}

export async function validate(context) {
  const { packages } = context;
  const violations = [];

  for (const pkg of packages) {
    const { name, path: packagePath, manifest } = pkg;
    const readmePath = join(packagePath, "README.md");
    const content = await readFile(readmePath, "utf8").catch(() => null);

    if (!content) continue;

    const exportedSubpaths = new Set(Object.keys(manifest.exports ?? {}));
    const publicSubpaths = new Set();

    for (const subpath of exportedSubpaths) {
      if (subpath === "." || subpath === "./package.json") continue;
      publicSubpaths.add(subpath);
    }

    if (publicSubpaths.size === 0) continue;

    const documentedSubpaths = getDocumentedSubpathsFromReadme(content, manifest);

    for (const subpath of publicSubpaths) {
      const segment = subpath.replace(/^\.\//, "");
      const isDocumented = documentedSubpaths.has(subpath);

      if (!isDocumented) {
        violations.push({
          code: "ARCH-README-EXPORT-001",
          message: `Public export "${subpath}" is not documented in README Public API section`,
          package: name,
          source: README_EXPORT_SOURCE,
          remediation: `Add "${segment}" to the Public API section of README.md with a conceptual description.`,
        });
      }
    }
  }

  return violations;
}

export const validateReadmeExports = validate;
