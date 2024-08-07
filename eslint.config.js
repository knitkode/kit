// @ts-check
const { FlatCompat } = require("@eslint/eslintrc");
const js = require("@eslint/js");
const globals = require("globals");
const jsoncParser = require("jsonc-eslint-parser");
// @ts-ignore
const tsParser = require("@typescript-eslint/parser");
const pluginNx = require("@nx/eslint-plugin");

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

/**
 * @type {import("@eslint/config-array").ConfigArray}
 */
module.exports = [
  js.configs.recommended,
  { plugins: { "@nx": pluginNx } },
  {
    languageOptions: {
      parser: tsParser,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: ["*.json"],
    languageOptions: {
      parser: jsoncParser,
    },
    rules: {},
  },
  {
    files: ["package.json"],
    languageOptions: {
      parser: jsoncParser,
    },
    rules: {
      "@nx/dependency-checks": "error",
    },
  },
  ...compat.config({ env: { jest: true } }).map((config) => ({
    ...config,
    files: ["**/*.spec.ts", "**/*.spec.tsx"],
  })),
  // ...compat.extends("plugin:@nx/javascript").map((config) => ({
  //   ...config,
  //   files: ["**/*.js", "**/*.mjs"],
  // })),
  {
    ignores: ["**/*.js"],
  },
  ...compat
    .extends(
      "plugin:@nx/javascript",
      "plugin:@nx/typescript",
      "plugin:@nx/react",
      "plugin:@nx/react-base",
      "plugin:@nx/react-jsx",
      "plugin:@nx/react-typescript",
    )
    .map((config) => ({
      ...config,
      files: ["**/*.ts", "**/*.tsx"],
      ignores: ["**/*.d.ts"],
      // files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
      rules: {
        ...config.rules,
        "import/no-amd": "off",
        "no-restricted-globals": "off",
        "prefer-const": "off",
        // "@typescript-eslint/explicit-module-boundary-types": ["error"],
        "@typescript-eslint/no-unused-vars": [
          "warn",
          {
            args: "after-used",
            argsIgnorePattern: "^_",
            caughtErrors: "all",
            caughtErrorsIgnorePattern: "^_",
            destructuredArrayIgnorePattern: "^_",
            varsIgnorePattern: "^_",
            ignoreRestSiblings: true
          },
        ],
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-namespace": "off",
        "react-hooks/exhaustive-deps": "off", // FIXME: eslint rule https://github.com/eslint/eslint/issues/18746
        "@nx/enforce-module-boundaries": [
          "error",
          {
            enforceBuildableLibDependency: true,
            allow: [],
            depConstraints: [
              {
                sourceTag: "*",
                onlyDependOnLibsWithTags: ["*"],
              },
            ],
          },
        ],
      },
    })),
];
