const baseConfig = require("../../eslint.config.js");

/**
 * @type {import("@eslint/config-array").ConfigArray}
 */
module.exports = [
  ...baseConfig,
  {
    files: ["packages/react/**/*.ts", "packages/react/**/*.tsx"],
    rules: {},
  },
];
