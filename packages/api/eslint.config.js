const baseConfig = require("../../eslint.config.js");

/**
 * @type {import("@eslint/config-array").ConfigArray}
 */
module.exports = [
  ...baseConfig,
  {
    files: ["packages/api/**/*.ts", "packages/api/**/*.tsx"],
    rules: {},
  },
];
