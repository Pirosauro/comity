import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { createFileSystemConfigLoader } from "../adapter.js";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEST_BASE_DIR = path.join(__dirname, "..", "..", "..", ".tmp-config-test");

describe("createFileSystemConfigLoader", () => {
  let loader: ReturnType<typeof createFileSystemConfigLoader>;
  let testDir: string;

  beforeEach(async () => {
    // Create a unique test directory for each test
    testDir = path.join(TEST_BASE_DIR, `test-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    await fs.rm(testDir, { recursive: true, force: true });
    await fs.mkdir(testDir, { recursive: true });
    loader = createFileSystemConfigLoader(testDir);
  });

  afterEach(async () => {
    if (testDir) {
      await fs.rm(testDir, { recursive: true, force: true });
    }
  });

  it("should load config from comity.config.js in working directory", async () => {
    await fs.writeFile(
      path.join(testDir, "comity.config.js"),
      'export default { key: "value" };'
    );

    const config = await loader.load();
    expect(config.key).toBe("value");
  });

  it("should load config from comity.config.ts in working directory", async () => {
    await fs.writeFile(
      path.join(testDir, "comity.config.ts"),
      'export default { key: "ts-value" };'
    );

    const config = await loader.load();
    expect(config.key).toBe("ts-value");
  });

  it("should load config from config/comity.config.js", async () => {
    await fs.mkdir(path.join(testDir, "config"), { recursive: true });
    await fs.writeFile(
      path.join(testDir, "config", "comity.config.js"),
      'export default { nested: true };'
    );

    const config = await loader.load();
    expect(config.nested).toBe(true);
  });

  it("should load config from config/comity.config.ts", async () => {
    await fs.mkdir(path.join(testDir, "config"), { recursive: true });
    await fs.writeFile(
      path.join(testDir, "config", "comity.config.ts"),
      'export default { nestedTs: true };'
    );

    const config = await loader.load();
    expect(config.nestedTs).toBe(true);
  });

  it("should prefer comity.config.ts over comity.config.js in same directory", async () => {
    await fs.writeFile(
      path.join(testDir, "comity.config.js"),
      'export default { fromJs: true };'
    );
    await fs.writeFile(
      path.join(testDir, "comity.config.ts"),
      'export default { fromTs: true };'
    );

    const config = await loader.load();
    expect(config.fromTs).toBe(true);
    expect(config.fromJs).toBeUndefined();
  });

  it("should prefer working directory over config/ subdirectory", async () => {
    await fs.writeFile(
      path.join(testDir, "comity.config.js"),
      'export default { root: true };'
    );
    await fs.mkdir(path.join(testDir, "config"), { recursive: true });
    await fs.writeFile(
      path.join(testDir, "config", "comity.config.js"),
      'export default { configDir: true };'
    );

    const config = await loader.load();
    expect(config.root).toBe(true);
    expect(config.configDir).toBeUndefined();
  });

  it("should return empty config when no config file exists", async () => {
    const config = await loader.load();
    expect(config).toEqual({});
  });

  it("should return empty config when config exports non-object", async () => {
    await fs.writeFile(
      path.join(testDir, "comity.config.js"),
      'export default "not an object";'
    );

    const config = await loader.load();
    expect(config).toEqual({});
  });

  it("should return empty config when config exports null", async () => {
    await fs.writeFile(
      path.join(testDir, "comity.config.js"),
      'export default null;'
    );

    const config = await loader.load();
    expect(config).toEqual({});
  });

  it("should return empty config when config file throws on import", async () => {
    await fs.writeFile(
      path.join(testDir, "comity.config.js"),
      'throw new Error("config error");'
    );

    const config = await loader.load();
    expect(config).toEqual({});
  });
});