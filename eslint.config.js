const { FlatCompat } = require("@eslint/eslintrc");
const js = require("@eslint/js");
const globals = require("globals");
const jsoncParser = require("jsonc-eslint-parser");
const tsParser = require("@typescript-eslint/parser");
const pluginNx = require("@nx/eslint-plugin");

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

/**
 * @type {import("@eslint/eslintrc").ConfigArray}
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
  ...compat.extends("plugin:@nx/javascript").map((config) => ({
    ...config,
    files: ["**/*.js", "**/*.mjs"],
  })),
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
      // files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
      rules: {
        ...config.rules,
        "no-unused-vars": "off",
        "no-restricted-globals": "off",
        "prefer-const": "off",
        // "@typescript-eslint/explicit-module-boundary-types": ["error"],
        "@typescript-eslint/no-unused-vars": [
          "warn",
          {
            args: "after-used",
            argsIgnorePattern: "^_",
            ignoreRestSiblings: true,
          },
        ],
        "@typescript-eslint/ban-types": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-namespace": "off",
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
