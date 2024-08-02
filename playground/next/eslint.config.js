const baseConfig = require("../../eslint.config.js");

/**
 * @type {import("@eslint/config-array").ConfigArray}
 */
module.exports = [
  ...baseConfig.map(a => ({
    ...a,
    ignores: ["playground/next/i18n/"]
  })),
  {
    files: ["playground/next/**/*.ts", "playground/next/**/*.tsx"],
    rules: {},
  },
  // {
  //   ignores: ["playground/next/i18n/"]
  // }
];
