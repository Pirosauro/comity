import type { CliConfig } from "../types.js";
import { describe, it, expect, vi } from "vitest";
import { defineConfig } from "../config.js";

describe("defineConfig", () => {
  it("should return the config object as-is", () => {
    const config: CliConfig = {
      plugins: [],
      hooks: {},
    };

    const result = defineConfig(config);

    expect(result).toBe(config);
  });

  it("should preserve all config properties", () => {
    const config: CliConfig = {
      logger: { info: vi.fn() } as any,
      plugins: [
        {
          name: "test-plugin",
          version: "1.0.0",
          commands: [
            {
              name: "test",
              description: "Test command",
              action: vi.fn(),
            },
          ],
          hooks: {
            beforeCommand: vi.fn(),
          },
        },
      ],
      hooks: {
        afterCommand: vi.fn(),
      },
    };

    const result = defineConfig(config);

    expect(result).toEqual(config);
    expect(result.logger).toBe(config.logger);
    expect(result.plugins).toBe(config.plugins);
    expect(result.hooks).toBe(config.hooks);
  });

  it("should work with empty config", () => {
    const config: CliConfig = {};

    const result = defineConfig(config);

    expect(result).toEqual({});
  });

  it("should work with minimal config", () => {
    const config: CliConfig = {
      logger: { info: vi.fn() } as any,
    };

    const result = defineConfig(config);

    expect(result).toEqual(config);
  });

  it("should maintain type safety with generic parameter", () => {
    interface CustomConfig extends CliConfig {
      customProperty: string;
    }

    const config: CustomConfig = {
      customProperty: "test",
      plugins: [],
    };

    const result = defineConfig(config);

    expect(result.customProperty).toBe("test");
    expect(result).toEqual(config);
  });
});
