import { describe, expect, it } from "vitest";
import plugin from "../client.js";

describe("@comity/vite-client plugin", () => {
  it("should return a plugin with the correct name", () => {
    const options = { entrypoint: "src/index.ts" };
    const result = plugin(options);

    expect(result.name).toBe("@comity/vite-client");
  });

  it("should set the correct build options", () => {
    const options = { entrypoint: "src/index.ts", assetsDir: "assets" };
    const result = plugin(options);
    // @ts-ignore
    const config = result.config();

    expect(config.build.rollupOptions.input).toEqual(["src/index.ts"]);
    expect(config.build.assetsDir).toBe("assets");
    expect(config.build.manifest).toBe(true);
  });

  it("should set the default assetsDir if not provided", () => {
    const options = { entrypoint: "src/index.ts" };
    const result = plugin(options);
    // @ts-ignore
    const config = result.config();

    expect(config.build.assetsDir).toBe("static");
  });

  it("should set the correct jsxImportSource", () => {
    const options = {
      entrypoint: "src/index.ts",
      jsxImportSource: "custom/jsx",
    };
    const result = plugin(options);
    // @ts-ignore
    const config = result.config();

    expect(config.esbuild.jsxImportSource).toBe("custom/jsx");
  });

  it("should set the default jsxImportSource if not provided", () => {
    const options = { entrypoint: "src/index.ts" };
    const result = plugin(options);
    // @ts-ignore
    const config = result.config();

    expect(config.esbuild.jsxImportSource).toBe("hono/jsx/dom");
  });
});
