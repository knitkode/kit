const baseConfig = require("../../eslint.config.js");
// const { FlatCompat } = require("@eslint/eslintrc");

// const compat = new FlatCompat({
//   baseDirectory: __dirname,
//   recommendedConfig: js.configs.recommended,
// });

/**
 * @type {import("@eslint/config-array").ConfigArray}
 */
module.exports = [
  ...baseConfig.map((a) => ({
    ...a,
    ignores: [
      "playground/next/i18n/",
      "playground/next/.next/",
      "actions/",
      "dist/",
      "packages/",
      ".nx/",
    ],
  })),
  // {
  //   files: ["playground/next/**/*.ts", "playground/next/**/*.tsx"],
  //   rules: {},
  //   ignores: [
  //     "playground/next/i18n/",
  //     "playground/next/.next/",
  //     ".next/",
  //   ],
  // },
  // ...compat.extends("plugin:next", "plugin:next/core-web-vitals"),
  // {
  //   ignores: ["playground/next/i18n/"]
  // }
];
