import type { CliCommand } from "../contracts/command.js";

import { describe, expect, it, vi } from "vitest";
import { createCli } from "../cli.js";
import { CliError } from "../errors/cli.js";

interface AppContext {
  config: {
    apiUrl: string;
  };
}

const CONTEXT: AppContext = { config: { apiUrl: "https://api.example.com" } };

describe("createCli", () => {
  it("composes commands and exposes them in registration order", () => {
    const cli = createCli<AppContext>({ context: CONTEXT });
    const first: CliCommand<AppContext> = { name: "first", action: async () => {} };
    const second: CliCommand<AppContext> = { name: "second", action: async () => {} };

    cli.command(first);
    cli.command(second);

    expect(cli.commands()).toEqual([first, second]);
  });

  it("throws a CliError when the same command name is registered twice", () => {
    const cli = createCli<AppContext>({ context: CONTEXT });

    cli.command({ name: "build", action: async () => {} });

    expect(() => cli.command({ name: "build", action: async () => {} })).toThrow(CliError);
  });

  it("executes a command with injected context and parsed arguments", async () => {
    const action = vi.fn();
    const cli = createCli<AppContext>({ context: CONTEXT });

    cli.command({ name: "build", action });

    const result = await cli.execute("build", { target: "dist" });

    expect(result.success).toBe(true);
    expect(action).toHaveBeenCalledWith({ target: "dist" }, CONTEXT);
  });

  it("registers plugins by invoking them with the composing facade", () => {
    const cli = createCli<AppContext>({ context: CONTEXT });
    const command: CliCommand<AppContext> = { name: "plugin-cmd", action: async () => {} };

    cli.plugin((composingCli) => {
      composingCli.command(command);
      composingCli.hook("beforeCommand", (run) => run);
    });

    expect(cli.commands()).toContain(command);
  });

  it("allows plugins to compose further plugins", () => {
    const cli = createCli<AppContext>({ context: CONTEXT });
    const command: CliCommand<AppContext> = { name: "nested", action: async () => {} };

    cli.plugin((inner) => {
      inner.plugin((outer) => {
        outer.command(command);
      });
    });

    expect(cli.commands()).toContain(command);
  });

  it("executes registered hooks through the lifecycle", async () => {
    const calls: string[] = [];
    const cli = createCli<AppContext>({ context: CONTEXT });

    cli.hook("beforeCommand", async (run) => {
      calls.push(`before:${run.name}`);
      return run;
    });
    cli.hook("afterCommand", async (run) => {
      calls.push(`after:${run.name}`);
      return run;
    });
    cli.command({
      name: "build",
      action: async () => {
        calls.push("action");
      },
    });

    const result = await cli.execute("build", {});

    expect(result.success).toBe(true);
    expect(calls).toEqual(["before:build", "action", "after:build"]);
  });

  it("runs the generic context through execution without environment dependencies", async () => {
    const cli = createCli({ context: {} });
    const action = vi.fn();

    cli.command({ name: "generic", action });

    const result = await cli.execute("generic", {});

    expect(result.success).toBe(true);
    expect(action).toHaveBeenCalledWith({}, {});
  });
});
