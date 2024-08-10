const baseConfig = require("../../eslint.config.js");

/**
 * @type {import("@eslint/config-array").ConfigArray}
 */
module.exports = [
  ...baseConfig,
  {
    languageOptions: {
      ...baseConfig.languageOptions,
      globals: {
        ...baseConfig.languageOptions.globals,
        i18n: false,
      },
    },
  },
  {
    ignores: [
      "playground/next/i18n/",
      "playground/next/.next/",
      // "dist/",
      // "actions/",
      // "packages/",
      // ".nx/",
    ],
  },
];
