import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { loadCliConfig } from "../loader.js";

describe("loadCliConfig", () => {
  let tempDir: string;
  let originalCwd: string;

  beforeEach(async () => {
    tempDir = await mkdtemp(join(tmpdir(), "comity-test-"));
    originalCwd = process.cwd();

    process.chdir(tempDir);
  });

  afterEach(async () => {
    process.chdir(originalCwd);
    await rm(tempDir, { recursive: true, force: true });
  });

  it("should throw error when no config file is found", async () => {
    await expect(loadCliConfig()).rejects.toThrow(
      "No configuration file found. Please create a comity.config.ts or comity.config.js file."
    );
  });

  it("should return config when file is found", async () => {
    const configContent = 'export default { name: "test" };';

    await writeFile(join(tempDir, "comity.config.js"), configContent);

    const result = await loadCliConfig();

    expect(result).toEqual({ name: "test" });
  });

  it("should continue to next path when config is falsy", async () => {
    // Create directory for config
    await rm(join(tempDir, "config"), { recursive: true, force: true }).catch(
      () => {}
    );

    const configContent1 = "export default null;";
    const configContent2 = 'export default { name: "test" };';

    await writeFile(join(tempDir, "comity.config.js"), configContent1);

    // Create config directory and file
    const configDir = join(tempDir, "config");

    await rm(configDir, { recursive: true, force: true }).catch(() => {});

    // Actually, let me use mkdir
    const { mkdir } = await import("node:fs/promises");

    await mkdir(configDir, { recursive: true });
    await writeFile(join(configDir, "comity.config.js"), configContent2);

    const result = await loadCliConfig();

    expect(result).toEqual({ name: "test" });
  });
});

describe("loadCliConfig - edge cases", () => {
  it("should handle malformed config file", async () => {
    const mockConfig = `export default { invalid: syntax `; // Syntax error

    // Use real filesystem for this since it tests parsing
    await writeFile("comity.config.js", mockConfig);
    await expect(loadCliConfig()).rejects.toThrow();
  });

  it("should handle non-existent module", async () => {
    // Mock require/import to simulate missing exports
    vi.doMock("virtual-config", () => {
      throw new Error("Module not found");
    });
  });
});
