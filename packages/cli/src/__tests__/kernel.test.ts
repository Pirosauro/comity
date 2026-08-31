import type { CliCommand, CliCommandArgs, CliCommandContext } from "../contracts/command.js";
import type { CliLifecycle, CliCommandRun, CliHookHandler } from "../contracts/hook.js";
import type { Result } from "@comity/primitives/result";

import { describe, expect, it, vi } from "vitest";
import { CliError } from "../errors/cli.js";
import { CommandRegistry } from "../internal/command-registry.js";
import { CommandExecutor } from "../internal/command-executor.js";
import { CliRegistration } from "../internal/registration.ts";
import { CliExecutionFacade, createCliExecutionFacade } from "../internal/cli-execution-facade.js";
import { DefaultHookBus } from "@comity/primitives/lifecycle";
import { DefaultEventBus } from "@comity/primitives/lifecycle";

interface AppContext {
  config: {
    apiUrl: string;
  };
}

const CONTEXT: AppContext = { config: { apiUrl: "https://api.example.com" } };

describe("CommandRegistry", () => {
  it("registers commands and exposes them in registration order", () => {
    const registry = new CommandRegistry<AppContext>();
    const first: CliCommand<AppContext> = { name: "first", action: async () => {} };
    const second: CliCommand<AppContext> = { name: "second", action: async () => {} };

    registry.register(first);
    registry.register(second);

    expect(registry.all()).toEqual([first, second]);
  });

  it("throws an Error when the same command name is registered twice", () => {
    const registry = new CommandRegistry<AppContext>();

    registry.register({ name: "build", action: async () => {} });

    expect(() => registry.register({ name: "build", action: async () => {} })).toThrow(Error);
  });

  it("returns undefined for unknown commands", () => {
    const registry = new CommandRegistry<AppContext>();
    expect(registry.get("unknown")).toBeUndefined();
  });
});

describe("CliRegistration", () => {
  it("provides a registration facade", () => {
    const registry = new CommandRegistry<AppContext>();
    const registration = new CliRegistration(registry);

    expect(registration).toHaveProperty("registerCommand");
    expect(registration).toHaveProperty("commands");
  });

  it("registers commands through the facade", () => {
    const registry = new CommandRegistry<AppContext>();
    const registration = new CliRegistration(registry);
    const command: CliCommand<AppContext> = { name: "build", action: async () => {} };

    registration.registerCommand(command);

    expect(registry.all()).toContain(command);
  });

  it("throws when registering duplicate command names", () => {
    const registry = new CommandRegistry<AppContext>();
    const registration = new CliRegistration(registry);

    registration.registerCommand({ name: "build", action: async () => {} });

    expect(() => registration.registerCommand({ name: "build", action: async () => {} })).toThrow(Error);
  });

  it("exposes registered commands", () => {
    const registry = new CommandRegistry<AppContext>();
    const registration = new CliRegistration(registry);
    const first: CliCommand<AppContext> = { name: "first", action: async () => {} };
    const second: CliCommand<AppContext> = { name: "second", action: async () => {} };

    registration.registerCommand(first);
    registration.registerCommand(second);

    expect(registration.commands()).toEqual([first, second]);
  });
});

describe("CommandExecutor", () => {
  it("executes a command with injected context and parsed arguments", async () => {
    const registry = new CommandRegistry<AppContext>();
    const hooks = new DefaultHookBus<any>();
    const events = new DefaultEventBus<any>();
    const action = vi.fn();
    const command: CliCommand<AppContext> = { name: "build", action };

    const registry2 = new CommandRegistry<AppContext>();
    registry2.register(command);

    const executor = new CommandExecutor<AppContext>(registry2, new DefaultHookBus<any>(), CONTEXT);

    const result = await executor.execute("build", { target: "dist" });

    expect(result.success).toBe(true);
    expect(action).toHaveBeenCalledWith({ target: "dist" }, CONTEXT);
  });

  it("returns command_not_found error for unknown command", async () => {
    const registry = new CommandRegistry<AppContext>();
    const executor = new CommandExecutor<AppContext>(registry, new DefaultHookBus<any>(), CONTEXT);

    const result = await executor.execute("unknown", {});

    expect(result.success).toBe(false);
    expect(result.error.code).toBe("cli:command_not_found");
  });

  it("executes registered hooks through the lifecycle", async () => {
    const calls: string[] = [];
    const registry = new CommandRegistry<AppContext>();
    const hooks = new DefaultHookBus<any>();

    hooks.define("beforeCommand", async (run: any) => {
      calls.push(`before:${run.name}`);
      return run;
    });
    hooks.define("afterCommand", async (run: any) => {
      calls.push(`after:${run.name}`);
      return run;
    });
    registry.register({
      name: "build",
      action: async () => {
        calls.push("action");
      },
    });

    const executor = new CommandExecutor<AppContext>(registry, hooks, CONTEXT);

    const result = await executor.execute("build", {});

    expect(result.success).toBe(true);
    expect(calls).toEqual(["before:build", "action", "after:build"]);
  });

  it("returns hook_failed error when beforeCommand hook throws", async () => {
    const registry = new CommandRegistry<AppContext>();
    const hooks = new DefaultHookBus<any>();

    hooks.define("beforeCommand", async () => {
      throw new Error("hook failed");
    });
    registry.register({ name: "build", action: async () => {} });

    const executor = new CommandExecutor<AppContext>(registry, hooks, CONTEXT);

    const result = await executor.execute("build", {});

    expect(result.success).toBe(false);
    expect(result.error.code).toBe("cli:hook_failed");
    expect(result.error.meta?.details?.hook).toBe("beforeCommand");
  });

  it("returns hook_failed error when afterCommand hook throws", async () => {
    const registry = new CommandRegistry<AppContext>();
    const hooks = new DefaultHookBus<any>();

    hooks.define("afterCommand", async () => {
      throw new Error("after hook failed");
    });
    registry.register({ name: "build", action: async () => {} });

    const executor = new CommandExecutor<AppContext>(registry, hooks, CONTEXT);

    const result = await executor.execute("build", {});

    expect(result.success).toBe(false);
    expect(result.error.code).toBe("cli:hook_failed");
    expect(result.error.meta?.details?.hook).toBe("afterCommand");
  });

  it("returns command_failed error when action throws", async () => {
    const registry = new CommandRegistry<AppContext>();

    registry.register({
      name: "build",
      action: async () => {
        throw new Error("action failed");
      },
    });

    const executor = new CommandExecutor<AppContext>(registry, new DefaultHookBus<any>(), CONTEXT);

    const result = await executor.execute("build", {});

    expect(result.success).toBe(false);
    expect(result.error.code).toBe("cli:command_failed");
  });

  it("still runs afterCommand hooks when action fails", async () => {
    const calls: string[] = [];
    const registry = new CommandRegistry<AppContext>();
    const hooks = new DefaultHookBus<any>();

    hooks.define("afterCommand", async (run) => {
      calls.push(`after:${run.name}`);
      return run;
    });
    registry.register({
      name: "build",
      action: async () => {
        throw new Error("action failed");
      },
    });

    const executor = new CommandExecutor<AppContext>(registry, hooks, CONTEXT);

    const result = await executor.execute("build", {});

    expect(result.success).toBe(false);
    expect(calls).toEqual(["after:build"]);
  });
});

describe("CliExecutionFacade", () => {
  it("creates a facade with registry, hooks, events, and context", () => {
    const registry = new CommandRegistry<AppContext>();
    const hooks = new DefaultHookBus<any>();
    const events = new DefaultEventBus<any>();

    const facade = createCliExecutionFacade(registry, hooks, events, CONTEXT);

    expect(facade).toBeDefined();
  });

  it("exposes registered commands", () => {
    const registry = new CommandRegistry<AppContext>();
    const hooks = new DefaultHookBus<any>();
    const events = new DefaultEventBus<any>();

    const command: CliCommand<AppContext> = { name: "build", action: async () => {} };
    registry.register(command);

    const facade = createCliExecutionFacade(registry, hooks, events, CONTEXT);

    expect(facade.commands()).toContain(command);
  });

  it("executes a command with injected context and parsed arguments", async () => {
    const registry = new CommandRegistry<AppContext>();
    const hooks = new DefaultHookBus<any>();
    const events = new DefaultEventBus<any>();
    const action = vi.fn();

    registry.register({ name: "build", action });

    const facade = createCliExecutionFacade(registry, hooks, events, CONTEXT);

    const result = await facade.execute("build", { target: "dist" });

    expect(result.success).toBe(true);
    expect(action).toHaveBeenCalledWith({ target: "dist" }, CONTEXT);
  });

  it("returns command_not_found error for unknown command", async () => {
    const registry = new CommandRegistry<AppContext>();
    const hooks = new DefaultHookBus<any>();
    const events = new DefaultEventBus<any>();

    const facade = createCliExecutionFacade(registry, hooks, events, CONTEXT);

    const result = await facade.execute("unknown", {});

    expect(result.success).toBe(false);
    expect(result.error.code).toBe("cli:command_not_found");
  });

  it("executes registered hooks through the lifecycle", async () => {
    const calls: string[] = [];
    const registry = new CommandRegistry<AppContext>();
    const hooks = new DefaultHookBus<any>();
    const events = new DefaultEventBus<any>();

    const facade = createCliExecutionFacade(registry, hooks, events, CONTEXT);

    hooks.define("beforeCommand", async (run: any) => {
      calls.push(`before:${run.name}`);
      return run;
    });
    hooks.define("afterCommand", async (run: any) => {
      calls.push(`after:${run.name}`);
      return run;
    });
    registry.register({
      name: "build",
      action: async () => {
        calls.push("action");
      },
    });

    const result = await facade.execute("build", {});

    expect(result.success).toBe(true);
    expect(calls).toEqual(["before:build", "action", "after:build"]);
  });

  it("emits events for observability", async () => {
    const events: string[] = [];
    const registry = new CommandRegistry<AppContext>();
    const hooks = new DefaultHookBus<any>();
    const eventsBus = new DefaultEventBus<any>();

    const facade = createCliExecutionFacade(registry, hooks, eventsBus, CONTEXT);

    registry.register({ name: "build", action: async () => {} });

    eventsBus.subscribe("cli.command.started", () => events.push("started"));
    eventsBus.subscribe("cli.command.completed", () => events.push("completed"));
    eventsBus.subscribe("cli.command.failed", () => events.push("failed"));

    await facade.execute("build", {});

    expect(events).toContain("started");
    expect(events).toContain("completed");
    expect(events).not.toContain("failed");
  });

  it("emits failed event when command fails", async () => {
    const events: string[] = [];
    const registry = new CommandRegistry<AppContext>();
    const hooks = new DefaultHookBus<any>();
    const eventsBus = new DefaultEventBus<any>();

    const facade = createCliExecutionFacade(registry, hooks, eventsBus, CONTEXT);

    registry.register({
      name: "build",
      action: async () => {
        throw new Error("boom");
      },
    });

    eventsBus.subscribe("cli.command.failed", () => events.push("failed"));

    await facade.execute("build", {});

    expect(events).toContain("failed");
  });
});