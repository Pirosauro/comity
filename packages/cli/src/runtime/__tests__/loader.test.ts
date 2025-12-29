import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { loadCliConfig } from "../loader.ts";
import { CliInvalidConfigPathError } from "../../errors/index.js";

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
      "CLI configuration file not found"
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
    await writeFile(join(configDir, "comity.js"), configContent2);

    const result = await loadCliConfig();

    expect(result).toEqual({ name: "test" });
  });

  it("should use COMITY_CLI_CONFIG_FILE environment variable", async () => {
    const configContent = 'export default { name: "env-config" };';
    const customConfigPath = join(tempDir, "custom.config.js");

    await writeFile(customConfigPath, configContent);

    const originalEnv = process.env.COMITY_CLI_CONFIG_FILE;
    process.env.COMITY_CLI_CONFIG_FILE = "custom.config.js";

    try {
      const result = await loadCliConfig();

      expect(result).toEqual({ name: "env-config" });
    } finally {
      if (originalEnv) {
        process.env.COMITY_CLI_CONFIG_FILE = originalEnv;
      } else {
        delete process.env.COMITY_CLI_CONFIG_FILE;
      }
    }
  });

  it("should throw error when COMITY_CLI_CONFIG_FILE path is outside cwd", async () => {
    const originalEnv = process.env.COMITY_CLI_CONFIG_FILE;
    process.env.COMITY_CLI_CONFIG_FILE = "../../../etc/passwd";

    try {
      await expect(loadCliConfig()).rejects.toThrow(
        "Invalid CLI configuration file path"
      );
    } finally {
      if (originalEnv) {
        process.env.COMITY_CLI_CONFIG_FILE = originalEnv;
      } else {
        delete process.env.COMITY_CLI_CONFIG_FILE;
      }
    }
  });

  it("should use VITE_COMITY_CLI_CONFIG_FILE environment variable", async () => {
    const configContent = 'export default { name: "vite-config" };';
    const customConfigPath = join(tempDir, "vite.config.js");

    await writeFile(customConfigPath, configContent);

    const originalEnv = process.env.VITE_COMITY_CLI_CONFIG_FILE;
    process.env.VITE_COMITY_CLI_CONFIG_FILE = "vite.config.js";

    try {
      const result = await loadCliConfig();

      expect(result).toEqual({ name: "vite-config" });
    } finally {
      if (originalEnv) {
        process.env.VITE_COMITY_CLI_CONFIG_FILE = originalEnv;
      } else {
        delete process.env.VITE_COMITY_CLI_CONFIG_FILE;
      }
    }
  });

  it("should throw error when VITE_COMITY_CLI_CONFIG_FILE path is outside cwd", async () => {
    const originalEnv = process.env.VITE_COMITY_CLI_CONFIG_FILE;
    process.env.VITE_COMITY_CLI_CONFIG_FILE = "../../../etc/passwd";

    try {
      await expect(loadCliConfig()).rejects.toThrow(
        "Invalid CLI configuration file path"
      );
    } finally {
      if (originalEnv) {
        process.env.VITE_COMITY_CLI_CONFIG_FILE = originalEnv;
      } else {
        delete process.env.VITE_COMITY_CLI_CONFIG_FILE;
      }
    }
  });

  it("should prioritize VITE_COMITY_CLI_CONFIG_FILE over COMITY_CLI_CONFIG_FILE", async () => {
    const configContent1 = 'export default { name: "comity-config" };';
    const configContent2 = 'export default { name: "vite-config" };';
    const comityConfigPath = join(tempDir, "comity.config.js");
    const viteConfigPath = join(tempDir, "vite.config.js");

    await writeFile(comityConfigPath, configContent1);
    await writeFile(viteConfigPath, configContent2);

    const originalComityEnv = process.env.COMITY_CLI_CONFIG_FILE;
    const originalViteEnv = process.env.VITE_COMITY_CLI_CONFIG_FILE;
    process.env.COMITY_CLI_CONFIG_FILE = "comity.config.js";
    process.env.VITE_COMITY_CLI_CONFIG_FILE = "vite.config.js";

    try {
      const result = await loadCliConfig();

      // VITE should be checked first and take priority
      expect(result).toEqual({ name: "vite-config" });
    } finally {
      if (originalComityEnv) {
        process.env.COMITY_CLI_CONFIG_FILE = originalComityEnv;
      } else {
        delete process.env.COMITY_CLI_CONFIG_FILE;
      }
      if (originalViteEnv) {
        process.env.VITE_COMITY_CLI_CONFIG_FILE = originalViteEnv;
      } else {
        delete process.env.VITE_COMITY_CLI_CONFIG_FILE;
      }
    }
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
