const baseConfig = require("../../eslint.config.js");

/**
 * @type {import("@eslint/eslintrc").ConfigArray}
 */
module.exports = [
  ...baseConfig,
  {
    files: ["playground/next/**/*.ts", "playground/next/**/*.tsx"],
    rules: {},
  },
];
