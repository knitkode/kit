const baseConfig = require("../../eslint.config.js");

/**
 * @type {import("@eslint/eslintrc").ConfigArray}
 */
module.exports = [
  ...baseConfig,
  {
    files: ["packages/dom/**/*.ts"],
    rules: {},
  },
];
