#!/usr/bin/env node

import { spawn } from "child_process";
import { dirname, join, relative, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const CWD = process.cwd(); // package directory

function exec(command, args, options) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: "inherit",
      cwd: CWD,
      ...options,
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Process exited with code ${code}`));
      }
    });

    child.on("error", reject);
  });
}

async function buildPackage(options = {}) {
  console.log(`🏗️  Building ${relative(ROOT, CWD)}...`);

  const tsconfig = join(CWD, "tsconfig.json");

  // 1. Type check
  await typeCheck(tsconfig);

  // 2. ESM + CJS + DTS
  await Promise.all([
    buildFormat("esm", tsconfig),
    buildFormat("cjs", tsconfig),
    buildDTS(tsconfig),
  ]);

  console.log("✅ Build completed\n");
}

async function typeCheck(tsconfig) {
  console.log("🔍 Type checking...");

  try {
    await exec("tsc", ["--noEmit", "--project", tsconfig]);
  } catch (error) {
    if (process.env.CI) {
      throw error; // Fail in CI
    }

    console.error(error);
  }
}

async function buildFormat(format, tsconfig) {
  console.log(`⚡ Building ${format.toUpperCase()}...`);

  await buildWithTSC(format, tsconfig);
}

async function buildWithTSC(format, tsconfig) {
  const args = [
    "--project",
    tsconfig,
    "--outDir",
    join(CWD, "dist", format),
    "--declaration",
    false,
    "--sourceMap",
    process.env.NODE_ENV !== "production",
    "--tsBuildInfoFile",
    join(CWD, "dist", format, ".tsbuildinfo"),
  ];

  if (format === "cjs") {
    args.push(
      "--module",
      "CommonJS",
      "--moduleResolution",
      "node",
      "--allowSyntheticDefaultImports",
      true,
      "--verbatimModuleSyntax",
      false
    );
  }

  await exec("tsc", args);
}

async function buildDTS(tsconfig) {
  console.log("📄 Generating declarations...");

  try {
    await exec("tsc", [
      "--project",
      tsconfig,
      "--outDir",
      join(CWD, "dist", "types"),
      "--emitDeclarationOnly",
      true,
      "--declaration",
      true,
      "--tsBuildInfoFile",
      join(CWD, "dist", "types", ".tsbuildinfo"),
    ]);
  } catch (error) {
    console.error(error);
  }
}

// CLI
async function main() {
  const args = process.argv.slice(2);

  // Flags parsing
  const flags = {
    swc: args.includes("--swc"),
    watch: args.includes("--watch"),
  };

  try {
    await buildPackage(flags);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();
