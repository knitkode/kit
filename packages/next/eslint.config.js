const baseConfig = require("../../eslint.config.js");

/**
 * @type {import("@eslint/config-array").ConfigArray}
 */
module.exports = [
  ...baseConfig,
  {
    files: ["packages/next/**/*.ts", "packages/next/**/*.tsx"],
    rules: {},
  },
];
