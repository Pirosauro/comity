#!/usr/bin/env node

import { readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve, relative } from "node:path";
import { fileURLToPath } from "node:url";
import * as ts from "typescript";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");
const PACKAGES_DIR = join(REPO_ROOT, "packages");

const EXCLUDED_DIRS = new Set([
  "node_modules",
  "dist",
  ".turbo",
  "coverage",
  "__tests__",
  "__mocks__",
]);

const EXCLUDED_PACKAGES = new Set([
  "@comity/customer",
  "@comity/validation",
]);

function shouldProcessFile(filePath) {
  const relPath = relative(REPO_ROOT, filePath);
  const parts = relPath.split("/");
  for (const part of parts) {
    if (EXCLUDED_DIRS.has(part)) return false;
  }
  return true;
}

function getPackageName(filePath) {
  const relPath = relative(PACKAGES_DIR, filePath);
  const pkgDir = relPath.split("/")[0];
  return `@comity/${pkgDir}`;
}

function isExcludedPackage(pkgName) {
  return EXCLUDED_PACKAGES.has(pkgName);
}

function isSetupIndex(filePath) {
  return filePath.includes("/src/setup/index.ts");
}

async function findTypeScriptFiles(dir) {
  const files = [];

  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return files;
  }

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (!shouldProcessFile(fullPath)) continue;

    if (entry.isDirectory()) {
      files.push(...(await findTypeScriptFiles(fullPath)));
    } else if (entry.name === "index.ts" && fullPath.includes("/src/")) {
      files.push(fullPath);
    }
  }

  return files;
}

function getSourceFile(filePath, content) {
  return ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true);
}

function getExportDeclarations(sourceFile) {
  const exports = [];

  function visit(node) {
    if (ts.isExportDeclaration(node)) {
      exports.push(node);
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return exports;
}

function getExportInfo(exportDecl, sourceFile) {
  const text = exportDecl.getText(sourceFile);
  const isTypeOnly = exportDecl.isTypeOnly === true;
  const moduleSpecifier = exportDecl.moduleSpecifier?.getText(sourceFile) ?? "";
  const start = exportDecl.getStart(sourceFile);
  const end = exportDecl.getEnd();

  return {
    text,
    isTypeOnly,
    moduleSpecifier: moduleSpecifier.replace(/^["']|["']$/g, ""),
    start,
    end,
    node: exportDecl,
  };
}

function getSortKey(info) {
  return info.moduleSpecifier || "zzz-local";
}

function normalizeExports(content, sourceFile) {
  const exportDecls = getExportDeclarations(sourceFile);
  if (exportDecls.length === 0) return content;

  const exportInfos = exportDecls.map((decl) => getExportInfo(decl, sourceFile));

  const typeExports = exportInfos.filter((info) => info.isTypeOnly);
  const runtimeExports = exportInfos.filter((info) => !info.isTypeOnly);

  if (typeExports.length === 0 && runtimeExports.length === 0) {
    return content;
  }

  typeExports.sort((a, b) => getSortKey(a).localeCompare(getSortKey(b)));
  runtimeExports.sort((a, b) => getSortKey(a).localeCompare(getSortKey(b)));

  const lines = content.split(/\r?\n/);

  const firstExport = exportInfos[0];
  const lastExport = exportInfos[exportInfos.length - 1];

  const startLine = sourceFile.getLineAndCharacterOfPosition(firstExport.start).line;
  const endLine = sourceFile.getLineAndCharacterOfPosition(lastExport.end).line;

  const beforeExports = lines.slice(0, startLine);
  const afterExports = lines.slice(endLine + 1);

  const newExportLines = [];

  if (typeExports.length > 0) {
    newExportLines.push(...typeExports.map((info) => info.text));
  }

  if (typeExports.length > 0 && runtimeExports.length > 0) {
    newExportLines.push("");
  }

  if (runtimeExports.length > 0) {
    newExportLines.push(...runtimeExports.map((info) => info.text));
  }

  const newContent = [
    ...beforeExports,
    ...newExportLines,
    ...afterExports,
  ].join("\n");

  return newContent;
}

async function processFile(filePath) {
  const content = await readFile(filePath, "utf8");
  const sourceFile = getSourceFile(filePath, content);
  const newContent = normalizeExports(content, sourceFile);

  return { filePath, original: content, normalized: newContent, changed: content !== newContent };
}

async function main() {
  const args = process.argv.slice(2);
  const checkMode = args.includes("--check");

  const files = await findTypeScriptFiles(PACKAGES_DIR);
  console.log(`Found ${files.length} index.ts files to process`);

  let hasChanges = false;
  const changedFiles = [];

  for (const filePath of files) {
    if (!shouldProcessFile(filePath)) continue;

    const pkgName = getPackageName(filePath);
    if (isExcludedPackage(pkgName)) continue;

    const result = await processFile(filePath);
    if (result.changed) {
      hasChanges = true;
      changedFiles.push({ path: result.filePath, pkg: pkgName });

      if (!checkMode) {
        await writeFile(result.filePath, result.normalized, "utf8");
        console.log(`Normalized: ${relative(REPO_ROOT, result.filePath)}`);
      } else {
        console.log(`Would normalize: ${relative(REPO_ROOT, result.filePath)}`);
      }
    }
  }

  if (checkMode) {
    if (hasChanges) {
      console.log(`\n${changedFiles.length} file(s) would be changed:`);
      for (const f of changedFiles) {
        console.log(`  - ${f.pkg}: ${relative(REPO_ROOT, f.path)}`);
      }
      process.exit(1);
    } else {
      console.log("All export declarations are already normalized.");
      process.exit(0);
    }
  } else {
    if (hasChanges) {
      console.log(`\nNormalized ${changedFiles.length} file(s).`);
    } else {
      console.log("All export declarations are already normalized.");
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});