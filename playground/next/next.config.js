//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require("@nx/next");
const webpack = require("webpack");
// const { withI18n } = require("@koine/i18n/next");
const { withI18n } = require("../../dist/packages/i18n/next.cjs");
const { join } = require("path");

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    // Set this to true if you would like to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
  webpack: (webpackConfig, options) => {
    webpackConfig.plugins.push(
      new webpack.DefinePlugin({
        testVar: webpack.DefinePlugin.runtimeValue(
          (ctx) => {
            return `"ciao"`;
          },
          {
            // fileDependencies: [fileDep],
          },
        ),
        testFn: webpack.DefinePlugin.runtimeValue((ctx) => {
          return `(name) => "ciao " + name`;
        }),
      }),
    );

    return webpackConfig;
  },
};

const { i18nCompiler } = require("../../dist/packages/i18n/compiler.cjs");

const compiler = i18nCompiler({
  defaultLocale: "en",
  fs: {
    cwd: join(__dirname, "locales"),
  },
});

compiler.write.code({
  adapter: "next",
  output: "i18n",
  skipTsCompile: true,
  skipTranslations: true,
});

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
];

module.exports = composePlugins(...plugins)(
  // withI18n({
  //   defaultLocale: "it",
  //   fs: {
  //     cwd: join(__dirname, "locales"),
  //   },
  // })(nextConfig),
  nextConfig,
);
