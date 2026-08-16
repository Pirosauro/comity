import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

export async function readJson(path) {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch {
    return null;
  }
}

export async function readText(path) {
  return readFile(path, "utf8").catch(() => "");
}

export async function listSourceFiles(dir) {
  const files = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return files;
  }
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (
        ["__tests__", "__mocks__", "coverage", "node_modules", "dist", ".turbo"].includes(
          entry.name
        )
      )
        continue;
      files.push(...(await listSourceFiles(join(dir, entry.name))));
    } else if (
      /\.(ts|tsx)$/.test(entry.name) &&
      !/(\.test|\.spec)\.(ts|tsx)$/.test(entry.name)
    ) {
      files.push(join(dir, entry.name));
    }
  }
  return files;
}
