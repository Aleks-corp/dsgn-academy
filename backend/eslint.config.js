import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import importPlugin from "eslint-plugin-import";
import promisePlugin from "eslint-plugin-promise";
import nPlugin from "eslint-plugin-n";
import prettierConfig from "eslint-config-prettier";

export default [
  prettierConfig,

  {
    files: ["**/*.ts"],
    ignores: [],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        sourceType: "module",
        ecmaVersion: "latest",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      import: importPlugin,
      promise: promisePlugin,
      n: nPlugin,
    },
    rules: {
      "@typescript-eslint/explicit-function-return-type": "warn",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/consistent-type-imports": "error",

      "import/order": [
        "warn",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
        },
      ],
      "import/no-unresolved": "off",
      "import/no-extraneous-dependencies": "off",

      "n/no-missing-import": [
        "error",
        {
          tryExtensions: [".ts", ".js", ".mjs", ".cjs", ".json"],
        },
      ],
      "n/no-unsupported-features/es-syntax": "off",
      "n/no-process-exit": "off",

      "promise/always-return": "off",
      "promise/catch-or-return": "warn",

      "no-unused-vars": "off",
      "no-useless-catch": "off",
    },
    settings: {
      "import/resolver": {
        node: {
          extensions: [".js", ".ts"],
        },
      },
    },
  },
];
