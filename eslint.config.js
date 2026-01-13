import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import boundaries from "eslint-plugin-boundaries";
import importPlugin from "eslint-plugin-import";
import jsdoc from "eslint-plugin-jsdoc";
import { defineConfig } from "eslint/config";

const IGNORED_GLOBS = [
  // Build output
  "**/dist/**",
  "**/build/**",
  "**/out/**",
  "**/coverage/**",

  // Generated artifacts
  "**/*.generated.*",
  "**/*.d.ts",

  // Package managers
  "node_modules/**",

  // Tests
  "**/*.test.ts",
  "**/*.spec.ts",
  "**/__tests__/**",
];

export default defineConfig([
  /**
   * BASE - common configuration
   */
  {
    files: ["**/*.ts"],
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
      jsdoc: jsdoc,
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

      /**
       * JSDoc Requirements
       */
      "jsdoc/require-jsdoc": [
        "warn",
        {
          require: {
            FunctionDeclaration: true,
            MethodDefinition: true,
            ClassDeclaration: true,
            ArrowFunctionExpression: true,
            FunctionExpression: true,
          },
          contexts: [
            "FunctionDeclaration",
            "MethodDefinition",
            "ClassDeclaration",
            "TSMethodSignature",
            "TSPropertySignature",
            "TSInterfaceDeclaration",
            "TSTypeAliasDeclaration",
          ],
          publicOnly: false,
          checkConstructors: false,
          checkGetters: true,
          checkSetters: true,
        },
      ],
      "jsdoc/require-param": "warn",
      "jsdoc/require-param-description": "warn",
      "jsdoc/require-param-type": "off",
      "jsdoc/require-returns": "warn",
      "jsdoc/require-returns-description": "warn",
      "jsdoc/require-returns-type": "off",
      "jsdoc/require-yields": "warn",
      "jsdoc/require-description": [
        "warn",
        {
          contexts: [
            "ClassDeclaration",
            "TSInterfaceDeclaration",
            "TSTypeAliasDeclaration",
          ],
        },
      ],
    },
    ignores: [
      ...IGNORED_GLOBS,

      // Tooling & scripts
      "scripts/**",
      "**/*.mjs",
      "**/*.cjs",

      // Package managers
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
        { type: "domain", pattern: "packages/*/*/domain/**" },
        { type: "core", pattern: "packages/*/*/core/**" },
        { type: "adapters", pattern: "packages/*/*/adapters/**" },
        { type: "shared", pattern: "packages/*/*/shared/**" },
      ],
      jsdoc: {
        mode: "typescript",
      },
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
    files: ["packages/*/*/domain/**/*.ts"],
    ignores: [...IGNORED_GLOBS],
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
    files: ["packages/*/*/core/**/*.ts"],
    ignores: [...IGNORED_GLOBS],
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
    files: ["packages/*/*/adapters/**/*.ts"],
    ignores: [...IGNORED_GLOBS],
    plugins: {
      jsdoc: jsdoc,
    },
    rules: {
      "no-console": "off",
      "no-restricted-globals": "off",

      /**
       * Still forbid throwing literals
       */
      "no-throw-literal": "error",

      /**
       * JSDoc - more permissive
       */
      "jsdoc/require-jsdoc": [
        "warn",
        {
          require: {
            FunctionDeclaration: true,
            MethodDefinition: true,
            ClassDeclaration: true,
            ArrowFunctionExpression: false,
            FunctionExpression: false,
          },
          contexts: [
            "FunctionDeclaration",
            "MethodDefinition",
            "ClassDeclaration",
            "TSMethodSignature",
            "TSPropertySignature",
            "TSInterfaceDeclaration",
            "TSTypeAliasDeclaration",
          ],
        },
      ],
    },
  },
]);
