const baseConfig = require("../../eslint.config.js");

/**
 * @type {import("@eslint/eslintrc").ConfigArray}
 */
module.exports = [
  ...baseConfig,
  {
    files: ["packages/utils/**/*.ts"],
    rules: {
      "no-restricted-globals": "off",
    },
  },
];
