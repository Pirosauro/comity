#!/usr/bin/env node

import { readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");
const PACKAGES_DIR = join(REPO_ROOT, "packages");

const CANONICAL_TOP_LEVEL_ORDER = [
  "name",
  "version",
  "description",
  "type",
  "private",
  "author",
  "license",
  "homepage",
  "repository",
  "bugs",
  "engines",
  "keywords",
  "scripts",
  "files",
  "main",
  "module",
  "types",
  "exports",
  "typesVersions",
  "publishConfig",
  "sideEffects",
  "peerDependencies",
  "dependencies",
  "optionalDependencies",
  "devDependencies",
];

const CANONICAL_SCRIPTS_ORDER = ["build", "prepublishOnly", "dev", "test", "type-check", "lint"];

const CANONICAL_KEYWORD_PRIORITY = ["comity", "comityjs"];

function sortDependencies(deps) {
  if (!deps || typeof deps !== "object") return deps;

  const comity = {};
  const scoped = {};
  const unscoped = {};

  for (const [key, value] of Object.entries(deps)) {
    if (key.startsWith("@comity/")) {
      comity[key] = value;
    } else if (key.startsWith("@")) {
      scoped[key] = value;
    } else {
      unscoped[key] = value;
    }
  }

  const sortObj = (obj) =>
    Object.fromEntries(Object.entries(obj).sort(([a], [b]) => a.localeCompare(b)));

  return { ...sortObj(comity), ...sortObj(scoped), ...sortObj(unscoped) };
}

function sortKeywords(keywords) {
  if (!Array.isArray(keywords)) return keywords;

  const priority = new Set(CANONICAL_KEYWORD_PRIORITY);
  const priorityKeywords = [];
  const otherKeywords = [];

  for (const kw of keywords) {
    if (priority.has(kw)) {
      priorityKeywords.push(kw);
    } else {
      otherKeywords.push(kw);
    }
  }

  return [...priorityKeywords.sort(), ...otherKeywords.sort()];
}

function sortExports(exports) {
  if (!exports || typeof exports !== "object") return exports;

  const result = {};

  if (exports["."] !== undefined) {
    result["."] = exports["."];
  }

  const subpaths = Object.keys(exports)
    .filter((k) => k !== "." && k !== "./package.json")
    .sort();

  for (const subpath of subpaths) {
    result[subpath] = exports[subpath];
  }

  if (exports["./package.json"] !== undefined) {
    result["./package.json"] = exports["./package.json"];
  }

  for (const [key, value] of Object.entries(result)) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      const conditionOrder = ["import", "require", "types", "default"];
      const sortedConditions = {};
      for (const cond of conditionOrder) {
        if (value[cond] !== undefined) {
          sortedConditions[cond] = value[cond];
        }
      }
      for (const [cond, val] of Object.entries(value)) {
        if (!conditionOrder.includes(cond)) {
          sortedConditions[cond] = val;
        }
      }
      result[key] = sortedConditions;
    }
  }

  return result;
}

function sortTypesVersions(typesVersions) {
  if (!typesVersions || typeof typesVersions !== "object") return typesVersions;

  const result = {};

  for (const [version, mapping] of Object.entries(typesVersions)) {
    if (mapping && typeof mapping === "object") {
      result[version] = Object.fromEntries(
        Object.entries(mapping).sort(([a], [b]) => a.localeCompare(b))
      );
    }
  }

  return result;
}

function sortScripts(scripts) {
  if (!scripts || typeof scripts !== "object") return scripts;

  const result = {};

  for (const script of CANONICAL_SCRIPTS_ORDER) {
    if (scripts[script] !== undefined) {
      result[script] = scripts[script];
    }
  }

  for (const [key, value] of Object.entries(scripts)) {
    if (!CANONICAL_SCRIPTS_ORDER.includes(key)) {
      result[key] = value;
    }
  }

  return result;
}

function normalizePackageJson(pkgJson) {
  const normalized = {};

  for (const key of CANONICAL_TOP_LEVEL_ORDER) {
    if (pkgJson[key] !== undefined) {
      let value = pkgJson[key];

      if (
        ["peerDependencies", "dependencies", "optionalDependencies", "devDependencies"].includes(
          key
        )
      ) {
        value = sortDependencies(value);
      } else if (key === "keywords") {
        value = sortKeywords(value);
      } else if (key === "exports") {
        value = sortExports(value);
      } else if (key === "typesVersions") {
        value = sortTypesVersions(value);
      } else if (key === "scripts") {
        value = sortScripts(value);
      }

      normalized[key] = value;
    }
  }

  for (const [key, value] of Object.entries(pkgJson)) {
    if (!CANONICAL_TOP_LEVEL_ORDER.includes(key)) {
      normalized[key] = value;
    }
  }

  return normalized;
}

async function readPackageJson(pkgPath) {
  const content = await readFile(pkgPath, "utf8");
  return JSON.parse(content);
}

async function writePackageJson(pkgPath, pkgJson) {
  const content = JSON.stringify(pkgJson, null, 2) + "\n";
  await writeFile(pkgPath, content, "utf8");
}

async function findPackageJsons() {
  const packageJsons = [];

  let entries;
  try {
    entries = await readdir(PACKAGES_DIR, { withFileTypes: true });
  } catch {
    return packageJsons;
  }

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const pkgPath = join(PACKAGES_DIR, entry.name, "package.json");
    try {
      const pkgJson = await readPackageJson(pkgPath);
      if (pkgJson.name?.startsWith("@comity/")) {
        packageJsons.push({ path: pkgPath, name: pkgJson.name, json: pkgJson });
      }
    } catch {
      continue;
    }
  }

  return packageJsons;
}

async function main() {
  const args = process.argv.slice(2);
  const checkMode = args.includes("--check");

  const packageJsons = await findPackageJsons();
  let hasChanges = false;
  const changedFiles = [];

  for (const { path, name, json } of packageJsons) {
    const normalized = normalizePackageJson(json);
    const originalContent = JSON.stringify(json, null, 2) + "\n";
    const normalizedContent = JSON.stringify(normalized, null, 2) + "\n";

    if (originalContent !== normalizedContent) {
      hasChanges = true;
      changedFiles.push(name);

      if (!checkMode) {
        await writePackageJson(path, normalized);
        console.log(`Normalized: ${name}`);
      } else {
        console.log(`Would normalize: ${name}`);
      }
    }
  }

  if (checkMode) {
    if (hasChanges) {
      console.log(`\n${changedFiles.length} package.json file(s) would be changed:`);
      for (const name of changedFiles) {
        console.log(`  - ${name}`);
      }
      process.exit(1);
    } else {
      console.log("All package.json files are already normalized.");
      process.exit(0);
    }
  } else {
    if (hasChanges) {
      console.log(`\nNormalized ${changedFiles.length} package.json file(s).`);
    } else {
      console.log("All package.json files are already normalized.");
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
