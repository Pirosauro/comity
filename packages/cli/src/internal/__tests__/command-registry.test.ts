import type { CliCommand } from "../../contracts/command.js";

import { describe, expect, it } from "vitest";
import { CliError } from "../../errors/cli.js";
import { CommandRegistry } from "../command-registry.js";

function createCommand(name: string): CliCommand {
  return {
    name,
    action: async () => {},
  };
}

describe("CommandRegistry", () => {
  it("returns undefined for an unknown command", () => {
    const registry = new CommandRegistry();

    expect(registry.get("missing")).toBeUndefined();
  });

  it("registers and resolves a command by name", () => {
    const registry = new CommandRegistry();
    const command = createCommand("build");

    registry.register(command);

    expect(registry.get("build")).toBe(command);
  });

  it("returns all registered commands in registration order", () => {
    const registry = new CommandRegistry();
    const first = createCommand("first");
    const second = createCommand("second");

    registry.register(first);
    registry.register(second);

    expect(registry.all()).toEqual([first, second]);
  });

  it("throws a CliError when registering a duplicate command name", () => {
    const registry = new CommandRegistry();

    registry.register(createCommand("build"));

    expect(() => registry.register(createCommand("build"))).toThrow(CliError);

    try {
      registry.register(createCommand("build"));
    } catch (error) {
      expect(error).toBeInstanceOf(CliError);
      expect((error as CliError).code).toBe("cli:duplicate_command");
      expect((error as CliError).meta.details?.name).toBe("build");
    }
  });
});
