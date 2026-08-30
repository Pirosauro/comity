import { createCli } from "@comity/cli";
import { Command } from "commander";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createCommanderAdapter } from "../adapter.js";

const COMPOSITION_CWD = process.cwd();

describe("no implicit configuration discovery", () => {
  let workingDirectory: string;
  let originalCwd: string;

  beforeEach(async () => {
    workingDirectory = await mkdtemp(join(tmpdir(), "comity-cli-commander-"));

    // Poison the historical discovery locations: any file-based config
    // discovery (e.g. the removed comity.config.js search) would throw on
    // import and fail the command.
    await writeFile(
      join(workingDirectory, "comity.config.js"),
      'throw new Error("config discovery must not occur");',
      "utf8"
    );
    await writeFile(
      join(workingDirectory, "comity.config.ts"),
      'throw new Error("config discovery must not occur");',
      "utf8"
    );

    originalCwd = process.cwd();
    process.chdir(workingDirectory);
  });

  afterEach(async () => {
    process.chdir(originalCwd);
    await rm(workingDirectory, { recursive: true, force: true });
  });

  it("executes a command with application-supplied context without reading any config file", async () => {
    const action = vi.fn();
    const cli = createCli<{ config: { apiUrl: string } }>({
      context: { config: { apiUrl: "https://injected.example.com" } },
    });

    cli.command({ name: "build", action });

    const program = new Command().name("test-cli");
    const adapter = createCommanderAdapter({ program, cli });

    const exitCode = await adapter.run(["build"]);

    expect(exitCode).toBe(0);
    expect(action).toHaveBeenCalledWith({}, { config: { apiUrl: "https://injected.example.com" } });
  });

  it("never loads a config file from the working directory regardless of layout", async () => {
    const action = vi.fn();
    const cli = createCli({ context: {} });

    cli.command({ name: "build", action });

    const program = new Command().name("test-cli");
    const adapter = createCommanderAdapter({ program, cli });

    const exitCode = await adapter.run(["build"]);

    expect(exitCode).toBe(0);
    expect(action).toHaveBeenCalledTimes(1);
  });

  it("preserves the composition-time context instead of re-deriving environment state", async () => {
    const action = vi.fn();
    const cli = createCli<{ cwdAtComposition: string }>({
      context: { cwdAtComposition: COMPOSITION_CWD },
    });

    cli.command({ name: "build", action });

    const program = new Command().name("test-cli");
    const adapter = createCommanderAdapter({ program, cli });

    const exitCode = await adapter.run(["build"]);

    expect(exitCode).toBe(0);
    expect(action).toHaveBeenCalledWith({}, { cwdAtComposition: COMPOSITION_CWD });
  });
});
