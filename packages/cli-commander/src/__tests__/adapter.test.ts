import type { CliCommandArgs } from "@comity/cli";

import { createCliExecutionFacade, CommandRegistry } from "@comity/cli";
import { Command } from "commander";
import { describe, expect, it, vi } from "vitest";
import { createCommanderAdapter } from "../adapter.js";
import { DefaultHookBus } from "@comity/primitives/lifecycle";
import { DefaultEventBus } from "@comity/primitives/lifecycle";

interface AppContext {
  config: {
    apiUrl: string;
  };
}

const CONTEXT: AppContext = { config: { apiUrl: "https://api.example.com" } };

function createProgram(): Command {
  return new Command().name("my-cli").version("1.0.0");
}

function createFacadeWithHooks(hooks?: any, commands: any[] = []) {
  const actualHooks = hooks ?? new DefaultHookBus<any>();
  const registry = new CommandRegistry<AppContext>();
  for (const command of commands) {
    registry.register(command);
  }
  const events = new DefaultEventBus<any>();
  const facade = createCliExecutionFacade(registry, actualHooks, new DefaultEventBus<any>(), CONTEXT);
  return { facade, registry, hooks: actualHooks };
}

function createFacade(commands: any[] = []) {
  const hooks = new DefaultHookBus<any>();
  return createFacadeWithHooks(hooks, commands);
}

function captureErrorOutput(program: Command): string[] {
  const lines: string[] = [];

  program.configureOutput({
    writeErr: (str) => {
      lines.push(str);
    },
  });

  return lines;
}

describe("createCommanderAdapter", () => {
  it("creates an adapter with a run function", async () => {
    const { facade } = createFacade();

    const adapter = createCommanderAdapter({ program: createProgram(), facade });

    expect(adapter).toHaveProperty("run");
    expect(typeof adapter.run).toBe("function");
  });

  it("executes a simple command and returns exit code 0", async () => {
    const action = vi.fn();
    const { facade } = createFacade([{ name: "build", action }]);

    const adapter = createCommanderAdapter({ program: createProgram(), facade });

    const exitCode = await adapter.run(["build"]);

    expect(exitCode).toBe(0);
    expect(action).toHaveBeenCalledTimes(1);
    expect(action).toHaveBeenCalledWith({}, CONTEXT);
  });

  it("translates option values into neutral Core argument keys", async () => {
    const action = vi.fn();
    const { facade } = createFacade([{
      name: "build",
      options: [{ name: "env", value: true }, { name: "verbose" }],
      action,
    }]);

    const adapter = createCommanderAdapter({ program: createProgram(), facade });

    const exitCode = await adapter.run(["build", "--env", "production", "--verbose"]);

    expect(exitCode).toBe(0);
    expect(action).toHaveBeenCalledWith(
      expect.objectContaining({ env: "production", verbose: true }),
      CONTEXT
    );
  });

  it("applies Commander option defaults and maps kebab-case names back", async () => {
    const action = vi.fn();
    const { facade } = createFacade([{
      name: "build",
      options: [
        { name: "dry-run", aliases: ["d"], value: false, default: false },
        { name: "env", value: true, default: "development" },
      ],
      action,
    }]);

    const adapter = createCommanderAdapter({ program: createProgram(), facade });

    const exitCode = await adapter.run(["build"]);

    expect(exitCode).toBe(0);
    expect(action).toHaveBeenCalledWith(
      expect.objectContaining({ "dry-run": false, env: "development" }),
      CONTEXT
    );
  });

  it("provides the short alias when only the long name is used", async () => {
    const action = vi.fn();
    const { facade } = createFacade([{
      name: "build",
      options: [{ name: "force", aliases: ["f"] }],
      action,
    }]);

    const adapter = createCommanderAdapter({ program: createProgram(), facade });

    const exitCode = await adapter.run(["build", "-f"]);

    expect(exitCode).toBe(0);
    expect(action).toHaveBeenCalledWith(expect.objectContaining({ force: true }), CONTEXT);
  });

  it("maps positional arguments under their declared names", async () => {
    const action = vi.fn();
    const { facade } = createFacade([{
      name: "build",
      arguments: [{ name: "target", required: true }, { name: "mode" }],
      options: [{ name: "env", value: true }],
      action,
    }]);

    const adapter = createCommanderAdapter({ program: createProgram(), facade });

    const exitCode = await adapter.run(["build", "dist", "release", "--env", "staging"]);

    expect(exitCode).toBe(0);
    expect(action).toHaveBeenCalledWith(
      expect.objectContaining({
        target: "dist",
        mode: "release",
        env: "staging",
      }),
      CONTEXT
    );
  });

  it("returns exit code 1 when a required argument is missing", async () => {
    const action = vi.fn();
    const { facade } = createFacade([{
      name: "build",
      arguments: [{ name: "target", required: true }],
      action,
    }]);

    const program = createProgram();
    const lines = captureErrorOutput(program);
    const adapter = createCommanderAdapter({ program, facade });

    const exitCode = await adapter.run(["build"]);

    expect(exitCode).toBe(1);
    expect(action).not.toHaveBeenCalled();
    expect(lines.some((line) => line.includes("target"))).toBe(true);
  });

  it("returns exit code 1 when a required option is missing", async () => {
    const action = vi.fn();
    const { facade } = createFacade([{
      name: "build",
      options: [{ name: "env", value: true, required: true }],
      action,
    }]);

    const program = createProgram();
    const lines = captureErrorOutput(program);
    const adapter = createCommanderAdapter({ program, facade });

    const exitCode = await adapter.run(["build"]);

    expect(exitCode).toBe(1);
    expect(action).not.toHaveBeenCalled();
    expect(lines.some((line) => line.includes("env"))).toBe(true);
  });

  it("executes Core lifecycle hooks around a command", async () => {
    const calls: string[] = [];
    const { facade, hooks } = createFacadeWithHooks();

    hooks.define("beforeCommand", async (run) => {
      calls.push(`before:${run.name}`);
      return run;
    });
    hooks.define("afterCommand", async (run) => {
      calls.push(`after:${run.name}`);
      return run;
    });
    const { facade: facadeWithHooks } = createFacadeWithHooks(hooks, [{
      name: "build",
      action: async () => {
        calls.push("action");
      },
    }]);

    const adapter = createCommanderAdapter({ program: createProgram(), facade: facadeWithHooks });

    const exitCode = await adapter.run(["build"]);

    expect(exitCode).toBe(0);
    expect(calls).toEqual(["before:build", "action", "after:build"]);
  });

  it("injects the application context into every command run", async () => {
    const action = vi.fn((_args: CliCommandArgs, ctx: AppContext) => {
      expect(ctx.config.apiUrl).toBe("https://api.example.com");
    });
    const { facade } = createFacade([{ name: "build", action }]);

    const adapter = createCommanderAdapter({ program: createProgram(), facade });

    const exitCode = await adapter.run(["build"]);

    expect(exitCode).toBe(0);
    expect(action).toHaveBeenCalledTimes(1);
  });

  it("maps a failed command action to exit code 1 and surfaces the cause", async () => {
    const { facade } = createFacade([{
      name: "build",
      action: async () => {
        throw new Error("build exploded");
      },
    }]);

    const program = createProgram();
    const lines = captureErrorOutput(program);
    const adapter = createCommanderAdapter({ program, facade });

    const exitCode = await adapter.run(["build"]);

    expect(exitCode).toBe(1);
    expect(lines.some((line) => line.includes("build exploded"))).toBe(true);
  });

  it("returns exit code 1 for an unknown command", async () => {
    const { facade } = createFacade();

    const adapter = createCommanderAdapter({ program: createProgram(), facade });

    const exitCode = await adapter.run(["nope"]);

    expect(exitCode).toBe(1);
  });

  it("returns exit code 0 for help and version (application policy)", async () => {
    const { facade } = createFacade();
    const helpAdapter = createCommanderAdapter({ program: createProgram(), facade });
    const versionAdapter = createCommanderAdapter({ program: createProgram(), facade });

    expect(await helpAdapter.run(["--help"])).toBe(0);
    expect(await versionAdapter.run(["--version"])).toBe(0);
  });

  it("maps unexpected parse errors to exit code 1", async () => {
    const { facade } = createFacade([{ name: "build", action: async () => {} }]);
    const program = new Command().name("my-cli").version("1.0.0");

    program.hook("preAction", () => {
      throw new Error("unexpected commander hook failure");
    });

    const lines = captureErrorOutput(program);
    const adapter = createCommanderAdapter({ program, facade });

    const exitCode = await adapter.run(["build"]);

    expect(exitCode).toBe(1);
    expect(lines.some((line) => line.includes("unexpected commander hook failure"))).toBe(true);
  });

  it("delegates async command actions", async () => {
    const action = vi.fn(async () => {
      await Promise.resolve();
    });
    const { facade } = createFacade([{ name: "build", action }]);

    const adapter = createCommanderAdapter({ program: createProgram(), facade });

    const exitCode = await adapter.run(["build"]);

    expect(exitCode).toBe(0);
    expect(action).toHaveBeenCalledTimes(1);
  });

  it("maps command_failed error from Core to exit code 1", async () => {
    const { facade } = createFacade([{
      name: "build",
      action: async () => {
        throw new Error("core action failed");
      },
    }]);

    const program = createProgram();
    const lines = captureErrorOutput(program);
    const adapter = createCommanderAdapter({ program, facade });

    const exitCode = await adapter.run(["build"]);

    expect(exitCode).toBe(1);
    expect(lines.some((line) => line.includes("core action failed"))).toBe(true);
  });

  it("maps hook_failed error from Core to exit code 1", async () => {
    const { facade, hooks } = createFacadeWithHooks();

    hooks.define("beforeCommand", async () => {
      throw new Error("hook exploded");
    });
    const { facade: facadeWithHooks } = createFacadeWithHooks(hooks, [{ name: "build", action: async () => {} }]);

    const program = createProgram();
    const lines = captureErrorOutput(program);
    const adapter = createCommanderAdapter({ program, facade: facadeWithHooks });

    const exitCode = await adapter.run(["build"]);

    expect(exitCode).toBe(1);
    expect(lines.some((line) => line.includes("hook exploded"))).toBe(true);
  });
});

