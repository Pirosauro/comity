/**
 * Extract the git diff of staged changes.
 *
 * @returns {string} - The git diff string.
 */
export function getGitDiff() {
  try {
    return execSync("git diff --cached", { encoding: "utf8" });
  } catch {
    console.error("Failed to read git diff");
    process.exit(1);
  }
}

/**
 * Split the git diff into separate file diffs.
 *
 * @param {string} diff - The git diff string.
 * @returns {Array<{file: string, diff: string}>} - Array of file diffs.
 */
export function splitDiffByFile(diff) {
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
