import { defineConfig } from "eslint/config";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import importPlugin from "eslint-plugin-import";
import boundaries from "eslint-plugin-boundaries";

export default defineConfig([
  /**
   * BASE - common configuration
   */
  {
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      import: importPlugin,
    },
    rules: {
      /**
       * Global TypeScript quality rules
       */
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports" },
      ],
    },
    ignores: [
      // Build output
      "**/dist/**",
      "**/build/**",
      "**/out/**",
      "**/coverage/**",

      // Generated artifacts
      "**/*.generated.*",
      "**/*.d.ts",

      // Tooling & scripts
      "scripts/**",
      "**/*.mjs",
      "**/*.cjs",

      // Package managers
      "node_modules/**",
      ".pnpm-store/**",
    ],
  },

  /**
   * BOUNDARIES – Layer definitions
   */
  {
    plugins: {
      boundaries,
    },
    settings: {
      "boundaries/elements": [
        { type: "domain", pattern: "packages/**/domain/**" },
        { type: "core", pattern: "packages/**/core/**" },
        { type: "adapters", pattern: "packages/**/adapters/**" },
        { type: "shared", pattern: "packages/**/shared/**" },
      ],
    },
    rules: {
      "boundaries/element-types": [
        "error",
        {
          default: "disallow",
          rules: [
            { from: "domain", allow: ["domain"] },
            { from: "core", allow: ["core", "domain"] },
            {
              from: "adapters",
              allow: ["adapters", "core", "domain", "shared"],
            },
            { from: "shared", allow: ["shared"] },
          ],
        },
      ],
    },
  },

  /**
   * DOMAIN – Pure business logic
   */
  {
    files: ["packages/**/domain/**/*.ts"],
    ignores: ["**/*.test.ts", "**/*.spec.ts", "**/__tests__/**"],
    rules: {
      /**
       * Determinism
       */
      "no-restricted-globals": ["error", "Date", "performance", "crypto"],
      "no-restricted-properties": [
        "error",
        { object: "Math", property: "random" },
      ],

      /**
       * Error handling
       */
      "no-throw-literal": "error",
      "no-restricted-syntax": [
        "error",
        {
          selector: "ThrowStatement",
          message:
            "Domain must never throw. Use Result<T, E> for all failures.",
        },
      ],
    },
  },

  /**
   * CORE – Hexagon center
   */
  {
    files: ["packages/**/core/**/*.ts"],
    ignores: ["**/*.test.ts", "**/*.spec.ts", "**/__tests__/**"],
    rules: {
      /**
       * Determinism
       */
      "no-restricted-globals": ["error", "Date", "performance", "crypto"],
      "no-restricted-properties": [
        "error",
        { object: "Math", property: "random" },
      ],

      /**
       * Error handling – Result pattern
       */
      "no-throw-literal": "error",
      "no-restricted-syntax": [
        "error",
        {
          selector: "ThrowStatement",
          message:
            "Core must not throw for business logic. Use Result<T, E> instead.",
        },
      ],
    },
  },

  /**
   * ADAPTERS – Infrastructure & frameworks
   */
  {
    files: ["packages/**/adapters/**/*.ts"],
    ignores: ["**/*.test.ts", "**/*.spec.ts", "**/__tests__/**"],
    rules: {
      "no-console": "off",
      "no-restricted-globals": "off",

      /**
       * Still forbid throwing literals
       */
      "no-throw-literal": "error",
    },
  },
]);
