#!/usr/bin/env node

import { spawn } from "node:child_process";
import { dirname, join, relative, resolve } from "node:path";
import { access, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, ".."); // monorepo root
const CWD = process.cwd(); // package directory

/**
 * Execute a command as a child process.
 * @param {string} command - The command to execute.
 * @param {string[]} args - The command arguments.
 * @param {Object} options - Additional options for spawn.
 * @returns {Promise<void>} - A promise that resolves when the command completes.
 */
function exec(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    // console.debug(`${command} ${args.filter(a => a).join(' ')}`);
    
    const child = spawn(command, args.filter(a => a !== ''), {
      stdio: 'inherit',
      cwd: options.cwd || CWD,
      // shell: true,
      ...options
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${command} exited with code ${code}`));
      }
    });

    child.on('error', reject);
  });
}

/**
 * Check if a file exists.
 * @param {string} path - The file path.
 * @returns {Promise<boolean>} - A promise that resolves to true if the file exists, false otherwise.
 */
async function fileExists(path) {
  try {
    await access(path);

    return true;
  } catch {
    return false;
  }
}

/**
 * Clean the dist directory.
 */
async function clean() {
  const distDir = join(CWD, 'dist');

  if (await fileExists(distDir)) {
    console.log('Cleaning...');
    await rm(distDir, { recursive: true, force: true });
  }
}

/**
 * Build the package in the current working directory.
 * @param {Object} options - Build options.
 */
async function buildPackage(options = {}) {
  const tsconfig = join(CWD, "tsconfig.json");

  if (!await fileExists(tsconfig)) {
    console.warn("tsconfig.json not found, skipping build.");
    return;
  }

  // Watch mode
  if (options.watch) {
    console.log(`👀 Starting watch mode on ${relative(ROOT, CWD)}...`);
    
    await typeCheck(tsconfig);

    if (options.swc) {
      return watchBuildWithSWC(tsconfig);
    }

    return watchBuildWithTSC(tsconfig);
  }

  console.log(`🏗️  Building ${relative(ROOT, CWD)}...`);

  // 1. Cleanup
  await clean();
  // 2. Type check
  await typeCheck(tsconfig);

  // 3. ESM + CJS + DTS build
  if (options.swc) {
    await buildWithSWC(tsconfig);
  } else {
    await buildWithTSC(tsconfig);
  }

  console.log("Build completed\n");
}

/**
 * Type check the project using tsc.
 * @param {string} tsconfig - Path to the tsconfig.json file.
 */
async function typeCheck(tsconfig) {
  console.log("Type checking...");

  await exec("tsc", ["--noEmit", "--project", tsconfig]);
}

/**
 * Build the project using tsc with specific options.
 * @param {string} tsconfig - Path to the tsconfig.json file.
 */
async function buildWithTSC(tsconfig) {
  console.log('Building ESM...');
  await exec('tsc', [
    "--project", tsconfig,
    "--outDir", join(CWD, "dist", 'esm'),
    "--declaration", false,
    "--sourceMap", process.env.NODE_ENV !== "production",
  ]);

  console.log('Building CJS...');
  await exec('tsc', [
    "--project", tsconfig,
    "--outDir", join(CWD, "dist", 'cjs'),
    "--declaration", false,
    "--sourceMap", process.env.NODE_ENV !== "production",
    "--module", "CommonJS",
    "--moduleResolution", "node",
    "--allowSyntheticDefaultImports", true,
  ]);

  console.log('Building types...');
  await exec('tsc', [
    "--project", tsconfig,
    "--outDir", join(CWD, "dist", 'types'),
    "--declaration", true,
    "--emitDeclarationOnly", true,
    "--sourceMap", process.env.NODE_ENV !== "production",
  ]);
}

async function buildWithSWC(tsconfig) {
  console.log('SWC build is not yet implemented.');
}

/**
 * Watch mode build using tsc.
 * @param {string} tsconfig - Path to the tsconfig.json file.
 */
async function watchBuildWithTSC(tsconfig) {
  const processes = [];
  
  // Function to start a watch process
  function startWatchProcess(label, args) {
    console.log(`Starting ${label} watch...`);
    
    const child = spawn('tsc', args.filter(a => a), {
      stdio: 'inherit',
      cwd: CWD,
      // shell: true
    });
    
    processes.push(child);

    return child;
  }
  
  try {
    startWatchProcess('ESM', [
      '--watch', 
      '--preserveWatchOutput',
      "--project", tsconfig,
      "--outDir", join(CWD, "dist", 'esm'),
      "--declaration", false,
      "--sourceMap", true,
    ]);
    startWatchProcess('CJS', [
      '--watch', 
      '--preserveWatchOutput',
      "--project", tsconfig,
      "--outDir", join(CWD, "dist", 'cjs'),
      "--declaration", false,
      "--sourceMap", true,
      "--module", "CommonJS",
      "--moduleResolution", "node",
      "--allowSyntheticDefaultImports", true,
    ]);
    startWatchProcess('Types', [
      '--watch', 
      '--preserveWatchOutput',
      "--project", tsconfig,
      "--outDir", join(CWD, "dist", 'types'),
      "--declaration", true,
      "--emitDeclarationOnly", true,
      "--sourceMap", true,
    ]);
    
    // Handle graceful shutdown on SIGINT
    await new Promise((resolve) => {
      process.on('SIGINT', () => {
        console.log('\nStopping watch processes...');
        processes.forEach(p => p.kill('SIGINT'));
        resolve();
      });
    });
    
  } catch (error) {
    console.error(error);
    processes.forEach(p => p.kill());
    throw error;
  }
}

async function watchBuildWithSWC(tsconfig) {
  console.log('SWC watch build is not yet implemented.');
}

// CLI entry point
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
