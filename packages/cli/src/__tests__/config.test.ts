import { describe, expect, it } from "vitest";
import { defineConfig } from "../config.js";
import type { CliConfig } from "../types.js";

describe("defineConfig", () => {
  it("should return the config as-is", () => {
    const config: CliConfig = {
      logger: undefined,
      plugins: [],
      hooks: {},
    };

    const result = defineConfig(config);
    expect(result).toBe(config);
  });

  it("should preserve type information", () => {
    interface ExtendedConfig extends CliConfig {
      apiKey: string;
      debug: boolean;
    }

    const config = defineConfig<ExtendedConfig>({
      apiKey: "test-key",
      debug: true,
      plugins: [],
      hooks: {},
    });

    expect(config.apiKey).toBe("test-key");
    expect(config.debug).toBe(true);
  });

  it("should work with nested configuration", () => {
    interface NestedConfig extends CliConfig {
      server: {
        port: number;
        host: string;
      };
      features: {
        analytics: boolean;
        cache: boolean;
      };
    }

    const config = defineConfig<NestedConfig>({
      server: {
        port: 3000,
        host: "localhost",
      },
      features: {
        analytics: true,
        cache: false,
      },
      plugins: [],
      hooks: {},
    });

    expect(config.server.port).toBe(3000);
    expect(config.server.host).toBe("localhost");
    expect(config.features.analytics).toBe(true);
    expect(config.features.cache).toBe(false);
  });

  it("should work with environment-based configuration", () => {
    interface EnvConfig extends CliConfig {
      apiKey: string;
      port: number;
    }

    const originalEnv = process.env.API_KEY;
    process.env.API_KEY = "env-key";

    try {
      const config = defineConfig<EnvConfig>({
        apiKey: process.env.API_KEY!,
        port: parseInt(process.env.PORT || "3000", 10),
        plugins: [],
        hooks: {},
      });

      expect(config.apiKey).toBe("env-key");
      expect(config.port).toBe(3000);
    } finally {
      if (originalEnv) {
        process.env.API_KEY = originalEnv;
      } else {
        delete process.env.API_KEY;
      }
    }
  });
});