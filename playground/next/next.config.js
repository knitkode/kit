//@ts-check

const { composePlugins, withNx } = require("@nx/next");
const webpack = require("webpack");
// const { withI18nAsync } = require("@koine/i18n/next");
// const { withI18nAsync } = require("../../dist/packages/i18n/next.cjs");
const { join, resolve, relative } = require("path");
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

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

const NullFactory = require("webpack/lib/NullFactory");
// const WebpackError = require("webpack/lib/WebpackError");
const ConstDependency = require("webpack/lib/dependencies/ConstDependency");
// const ParserHelpers = require("webpack/lib/javascript/JavascriptParserHelpers");

const PLUGIN_NAME2 = "I18nWebpackPlugin2";

class I18nWebpackPlugin2 {
  constructor(options) {
    options = options || {};

    this.tName = "t";
  }

  /**
   * @see https://webpack.js.org/api/compiler-hooks/
   *
   * @param {import("webpack").Compiler} compiler
   */
  apply(compiler) {
    compiler.hooks.normalModuleFactory.tap(
      PLUGIN_NAME2,
      /**
       *
       * @param {import("webpack").NormalModuleFactory} factory
       */
      (factory) => {
        factory.hooks.parser.for("javascript/auto").tap(
          PLUGIN_NAME2,
          /**
           * @param {import("webpack").javascript.JavascriptParser} parser
           * @param {import("webpack").javascript...} options
           */
          (parser, options) => {
            parser.hooks.callMemberChain.for("i18n").tap(
              PLUGIN_NAME2,
              /**
               *
               * @param {import("estree").SimpleCallExpression} expression
               * @param {*} properties
               * @returns
               */
              (expression, properties) => {
                const property = properties[0];

                if (property === "t") {
                  console.log(PLUGIN_NAME2, {
                    expression,
                    properties,
                    callee: expression.callee,
                  });
                }
              },
            );

            parser.hooks.call.for("t").tap(PLUGIN_NAME2, (expression) => {
              console.log(PLUGIN_NAME2, { expression });
            });

            // parser.hooks.program.tap(
            //   PLUGIN_NAME2,
            //   /**
            //    * @param {import("estree").Program} program
            //    * @param {import("estree").Comment[]} comments
            //    */
            //   (program, comments) => {
            //     program.body.map((value, index, array) => {
            //       // value.type
            //       switch (value.type) {
            //         case "FunctionDeclaration":
            //           console.log("found FunctionDeclaration", value);
            //       }
            //       return value;
            //     })
            //     // console.log(PLUGIN_NAME2, { program });
            //   },
            // );
          },
        );
      },
    );
  }
}

// module.exports = I18nWebpackPlugin2;

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

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
    const i18nInputFolder = resolve(__dirname, "./translations");
    const logger = compiler.infrastructureLogger;

    if (compiler.hooks) {
      const addI18nFolderDeps = debounce(
        /**
         * @param {import("webpack").Compilation} compilation
         */
        (compilation) => {
          if (!compilation.contextDependencies.has(i18nInputFolder)) {
            compilation.contextDependencies.add(i18nInputFolder);
            logger?.(
              "i18nCompiler input folder added to context deps",
              "info",
              [],
            );
          } else {
            logger?.(
              "i18nCompiler input folder already added to context deps",
              "info",
              [],
            );
          }
        },
        1000,
        true,
      );

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
        },
        100,
        true,
      );

      compiler.hooks.watchRun.tapAsync(PLUGIN_NAME, maybeRunI18n);
    } else {
      // compiler.plugin('done', done);
    }
  }
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

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
  redirects: async () => {
    return require("./i18n/next-redirects");
  },
  rewrites: async () => {
    return require("./i18n/next-rewrites");
  },
  modularizeImports: {
    // TODO: automatically add through koine/i18n plugin based on output path
    // and reading tsconfig.json?
    // "@/i18n/?(((\\w*)?/?)*)": {
    //   transform: "@/i18n/{{ matches.[1] }}/{{member}}",
    // },
    "@koine/i18n/?(((\\w*)?/?)*)": {
      transform: "@koine/i18n/{{ matches.[1] }}/{{member}}",
    },
  },
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  webpack: (webpackConfig /* , options */) => {
    // webpackConfig.module.rules.push({
    //   test: /\.tsx/,
    //   use: [
    //     // webpackConfig.defaultLoaders.babel,
    //     {
    //       loader: resolve('./webpack-loader.mjs'),
    //       options: {},
    //     },
    //   ],
    // });

    // const I18nWebpackPlugin2 = require("./webpack-plugin.js");

    // webpackConfig.resolve = {
    //   alias: {
    //     "@/i18n": resolve(__dirname, './i18n'),
    //   },
    // };

    webpackConfig.plugins.push(
      // new I18nWebpackPlugin({}),
      // new I18nWebpackPlugin2({}),

      new webpack.ProvidePlugin({
        // _useLocale: ["@/i18n", "useLocale"],
        // _getLocale: ["@/i18n", "getLocale"],
        // _getT: ["@/i18n", "getT"],
      }),
      /**
       * @see similar projects:
       * - https://github.com/yanivkalfa/i18n-gettext-webpack-plugin
       * - https://github.com/zainulbr/i18n-webpack-plugin
       * - https://github.com/privatenumber/webpack-localize-assets-plugin
       * - https://github.com/juanluispaz/gettext-webpack-plugin
       * - https://github.com/webpack-contrib/i18n-webpack-plugin
       * - https://github.com/runreflect/webpack-react-component-name
       */
      new webpack.DefinePlugin({
        T: webpack.DefinePlugin.runtimeValue(
          (/* ctx */) => {
            return `(function(name) { return "ciao " + name;})`;
          },
          {
            // fileDependencies: [fileDep],
          },
        ),
        i18n: webpack.DefinePlugin.runtimeValue((ctx) => {
            const i18nDir = resolve(__dirname, "./i18n");
            const { context, layer, resource } = ctx.module;
            const requirePath = relative(resource, i18nDir);
            // console.log({
            //   i18nDir,
            //   // module: ctx.module,
            //   context,
            //   layer,
            //   resource,
            //   requirePath
            // });
            
            return {
              // testVar: `"ciao mate"`,
              // testFn: `(function(name) { return "ciao " + name;})`,
              // testRequireT: `(function(name) {
              //   const $t = require("${i18nDir}/$t");
              //   const locale = global.__i18n_locale;
              //   return "ciao " + name + " " + $t.$404_seo_title(locale);
              // })`,

              t: `(function(i18nKey, ...args) {
                  const $t = require("${i18nDir}/$t");
                  const locale = global.__i18n_locale;

                  /**
                   * Normalise translation key
                   */
                  const normaliseTranslationKey = (key) => {
                    const sep = "/";
                    const slashRegex = new RegExp(sep, "g");
                    const replaced = key
                      // replace tilde with dollar
                      .replace(/~/g, "$")
                      // replace dash with underscore
                      .replace(/-/g, "_")
                      .replace(slashRegex, "_")
                      // collapse consecutive underscores
                      .replace(/_+/g, "_")
                      // ensure valid js identifier, allow only alphanumeric characters and few symbols
                      .replace(/[^a-zA-Z0-9_$]/gi, "");
                  
                    // ensure the key does not start with a number (invalid js)
                    return /^[0-9]/.test(replaced) ? "$" + replaced : replaced;
                  };
                  const fnName = normaliseTranslationKey(
                    i18nKey.replace(/:/, ".").split(".")
                      .filter(Boolean)
                      .map(normaliseTranslationKey)
                      .join("_")
                  );
                  // console.log({ fnName });
                  return $t["$t_" + fnName](locale, ...args);
                })`,

              // ...["$404_title", "$404_seo_title"].reduce((map, tPath) => {
              //   map[tPath] = `(function(...args) {
              //     // const $t = require("${i18nDir}/$t");
              //     // const locale = global.__i18n_locale;
              //     // return $t.${tPath}(locale, ...args);
              //     const $t = require("${i18nDir}/$t/$t_${tPath}");
              //     const locale = global.__i18n_locale;
              //     return $t(locale, ...args);
              //   })`
              //   return map;
              // }, {}),
            };
          },
          {
            // fileDependencies: [fileDep],
          },
        ),
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
