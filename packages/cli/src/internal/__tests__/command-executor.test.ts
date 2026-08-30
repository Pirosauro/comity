import type { CliCommand } from "../../contracts/command.js";
import type { CliCommandRun, CliLifecycle } from "../../contracts/hook.js";

import { DefaultHookBus } from "@comity/primitives/lifecycle";
import { describe, expect, it, vi } from "vitest";
import { CommandExecutor } from "../command-executor.js";
import { CommandRegistry } from "../command-registry.js";

interface TestContext {
  config: {
    apiUrl: string;
  };
}

function createCommand(
  name: string,
  action?: CliCommand<TestContext>["action"]
): CliCommand<TestContext> {
  return {
    name,
    action: action ?? (async () => {}),
  };
}

function createExecutor(
  registry: CommandRegistry<TestContext>,
  context: TestContext
): {
  executor: CommandExecutor<TestContext>;
  hooks: DefaultHookBus<CliLifecycle<TestContext>>;
} {
  const hooks = new DefaultHookBus<CliLifecycle<TestContext>>();

  return { executor: new CommandExecutor(registry, hooks, context), hooks };
}

const CONTEXT: TestContext = { config: { apiUrl: "https://api.example.com" } };

describe("CommandExecutor", () => {
  it("returns command_not_found for an unknown command name", async () => {
    const registry = new CommandRegistry<TestContext>();
    const { executor } = createExecutor(registry, CONTEXT);

    const result = await executor.execute("missing", {});

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.code).toBe("cli:command_not_found");
      expect(result.error.meta.details?.name).toBe("missing");
    }
  });

  it("executes the command action with parsed args and injected context", async () => {
    const action = vi.fn();
    const registry = new CommandRegistry<TestContext>();

    registry.register(createCommand("build", action));

    const { executor } = createExecutor(registry, CONTEXT);
    const args = { target: "dist", env: "prod" };

    const result = await executor.execute("build", args);

    expect(result.success).toBe(true);
    expect(action).toHaveBeenCalledWith(args, CONTEXT);
  });

  it("runs beforeCommand hooks before the action and forwards transformed args", async () => {
    const action = vi.fn();
    const registry = new CommandRegistry<TestContext>();

    registry.register(createCommand("build", action));

    const { executor, hooks } = createExecutor(registry, CONTEXT);

    hooks.define("beforeCommand", (run) => ({
      ...(run as CliCommandRun<TestContext>),
      args: { ...run.args, env: "injected" },
    }));

    const result = await executor.execute("build", { env: "cli" });

    expect(result.success).toBe(true);
    expect(action).toHaveBeenCalledWith(expect.objectContaining({ env: "injected" }), CONTEXT);
  });

  it("runs beforeCommand and afterCommand hooks around the action in order", async () => {
    const order: string[] = [];
    const action = vi.fn(async () => {
      order.push("action");
    });
    const registry = new CommandRegistry<TestContext>();

    registry.register(createCommand("build", action));

    const { executor, hooks } = createExecutor(registry, CONTEXT);

    hooks.define("beforeCommand", async (run) => {
      order.push("before");
      return run;
    });
    hooks.define("afterCommand", async (run) => {
      order.push("after");
      return run;
    });

    const result = await executor.execute("build", {});

    expect(result.success).toBe(true);
    expect(order).toEqual(["before", "action", "after"]);
  });

  it("runs afterCommand hooks even when the action fails", async () => {
    const afterHook = vi.fn(async (run: CliCommandRun<TestContext>) => run);
    const registry = new CommandRegistry<TestContext>();

    registry.register(
      createCommand("build", async () => {
        throw new Error("boom");
      })
    );

    const { executor, hooks } = createExecutor(registry, CONTEXT);

    hooks.define("afterCommand", afterHook);

    const result = await executor.execute("build", {});

    expect(result.success).toBe(false);
    expect(afterHook).toHaveBeenCalledTimes(1);

    if (!result.success) {
      expect(result.error.code).toBe("cli:command_failed");
      expect(result.error.cause).toBeInstanceOf(Error);
      expect((result.error.cause as Error).message).toBe("boom");
    }
  });

  it("reports a beforeCommand hook failure as hook_failed", async () => {
    const registry = new CommandRegistry<TestContext>();

    registry.register(createCommand("build"));

    const { executor, hooks } = createExecutor(registry, CONTEXT);

    hooks.define("beforeCommand", async () => {
      throw new Error("hook boom");
    });

    const result = await executor.execute("build", {});

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.code).toBe("cli:hook_failed");
      expect(result.error.meta.details?.hook).toBe("beforeCommand");
    }
  });

  it("reports an afterCommand hook failure as hook_failed", async () => {
    const registry = new CommandRegistry<TestContext>();

    registry.register(createCommand("build"));

    const { executor, hooks } = createExecutor(registry, CONTEXT);

    hooks.define("afterCommand", async () => {
      throw new Error("after boom");
    });

    const result = await executor.execute("build", {});

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.code).toBe("cli:hook_failed");
      expect(result.error.meta.details?.hook).toBe("afterCommand");
    }
  });

  it("attaches the afterCommand failure to a failed command result without masking it", async () => {
    const registry = new CommandRegistry<TestContext>();

    registry.register(
      createCommand("build", async () => {
        throw new Error("action boom");
      })
    );

    const { executor, hooks } = createExecutor(registry, CONTEXT);

    hooks.define("afterCommand", async () => {
      throw new Error("cleanup boom");
    });

    const result = await executor.execute("build", {});

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.code).toBe("cli:command_failed");
      expect((result.error.cause as Error).message).toBe("action boom");
      expect(result.error.meta.details?.afterCommandError).toBe("cleanup boom");
    }
  });

  it("executes multiple hooks in registration order", async () => {
    const calls: string[] = [];
    const action = vi.fn(async () => {
      calls.push("action");
    });
    const registry = new CommandRegistry<TestContext>();

    registry.register(createCommand("build", action));

    const { executor, hooks } = createExecutor(registry, CONTEXT);

    hooks.define("beforeCommand", async (run) => {
      calls.push("before-1");
      return run;
    });
    hooks.define("beforeCommand", async (run) => {
      calls.push("before-2");
      return run;
    });

    await executor.execute("build", {});

    expect(calls).toEqual(["before-1", "before-2", "action"]);
  });
});
