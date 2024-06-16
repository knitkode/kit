//@ts-check

const { composePlugins, withNx } = require("@nx/next");
const webpack = require("webpack");
// const { withI18nAsync } = require("@koine/i18n/next");
// const { withI18nAsync } = require("../../dist/packages/i18n/next.cjs");
const { join, resolve } = require("path");
// const debounce = require("lodash.debounce");

let debounce = (fn, wait, immediate) => {
  let timeout;

  return function (...args) {
    const context = this;

    const later = function () {
      timeout = null;
      if (!immediate) fn.apply(context, args);
    };

    const callNow = immediate && !timeout;

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (callNow) fn.apply(context, args);
  };
};


const PLUGIN_NAME = "I18nWebpackPlugin";
class I18nWebpackPlugin {
  opts;

  constructor(opts) {
    this.opts = opts;
  }

  /**
   * @see https://webpack.js.org/api/compiler-hooks/
   * 
   * @param {import("webpack").Compiler} compiler
   */
  apply(compiler) {
    const i18nInputFolder = resolve(__dirname, "./locales");
    const logger = compiler.infrastructureLogger;


    if (compiler.hooks) {
      const addI18nFolderDeps = debounce(
        /**
         * @param {import("webpack").Compilation} compilation
         */
        (compilation) => {
        if (!compilation.contextDependencies.has(i18nInputFolder)) {
          compilation.contextDependencies.add(i18nInputFolder);
          logger?.("i18nCompiler input folder added to context deps", "info", []);
        } else {
          logger?.(
            "i18nCompiler input folder already added to context deps", "info", []
          );
        }
      }, 1000, true);

      compiler.hooks.thisCompilation.tap(PLUGIN_NAME, addI18nFolderDeps);

      const maybeRunI18n = debounce(
        /**
         * @param {import("webpack").Compiler} compiler
         */
        async (compiler, callback) => {
          const isI18nInputFile = compiler.modifiedFiles?.has(i18nInputFolder);
          if (isI18nInputFile) {
            logger?.("i18nCompiler should compile now.", "info", []);
          }

          callback();
          // compiler.modifiedFiles?.forEach((filepath, _, filesSet/* , v2, s */) => {
          //   console.log({ filepath })
          // })
      }, 100, true);

      compiler.hooks.watchRun.tapAsync(PLUGIN_NAME, maybeRunI18n);
    } else {
      // compiler.plugin('done', done);
    }
  }
}

/**
 * @type {import('../../dist/packages/i18n/next').WithI18nAsyncOptions}
 **/
const nextConfig = {
  // i18nCompiler: {
  //   defaultLocale: "en",
  //   baseUrl: "https://playground.koine.io",
  //   input: {
  //     source: "./locales",
  //   },
  //   code: {
  //     adapter: {
  //       name: "next",
  //       options: {
  //         router: "app"
  //       }
  //     },
  //   }
  // },
  nx: {
    // Set this to true if you would like to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
  webpack: (webpackConfig /* , options */) => {
    webpackConfig.plugins.push(
      new I18nWebpackPlugin({}),
      new webpack.DefinePlugin({
        testVar: webpack.DefinePlugin.runtimeValue(
          (/* ctx */) => {
            return `"ciao"`;
          },
          {
            // fileDependencies: [fileDep],
          },
        ),
        testFn: webpack.DefinePlugin.runtimeValue((/* ctx */) => {
          return `(name) => "ciao " + name`;
        }),
      }),
    );

    return webpackConfig;
  },
};

// const { i18nCompiler } = require("../../dist/packages/i18n/compiler.cjs");

// const compiler = i18nCompiler({
//   defaultLocale: "en",
//   fs: {
//     cwd: join(__dirname, "locales"),
//   },
// });

// compiler.write.code({
//   adapter: "next",
//   output: "i18n",
//   skipTsCompile: true,
//   skipTranslations: true,
// });

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
  // withI18nAsync,
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
