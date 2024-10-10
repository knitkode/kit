/* eslint-disable */
// @ts-check

const { composePlugins, withNx } = require("@nx/next");
const webpack = require("webpack");
const { withKoine } = require("@koine/next/config");
// const { withI18nAsync } = require("../../dist/packages/i18n/next.cjs");
const { resolve, relative } = require("path");

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * @type {import('../../dist/packages/next/config').WithKoineOptions}
 **/
const nextConfig = {
  i18nCompiler: {
    baseUrl: "http://localhost:4200",
    // baseUrl: "https://playground.koine.io",
    defaultLocale: "en",
    hideDefaultLocaleInUrl: true,
    input: {
      source: "./translations",
    },
    code: {
      adapter: {
        name: "next",
        options: {
          router: "app"
        }
      },
      write: {
        output: "./i18n",
        tsconfig: {
          alias: "@/i18n",
          path: "./tsconfig.json"
        }
        // typescriptCompilation: true,
      },
    }
  },
  // redirects: async () => {
  //   return require("./i18n/next-redirects");
  // },
  // rewrites: async () => {
  //   return require("./i18n/next-rewrites");
  // },
  // modularizeImports: {
  //   // TODO: automatically add through koine/i18n plugin based on output path
  //   // and reading tsconfig.json?
  //   // "@/i18n/?(((\\w*)?/?)*)": {
  //   //   transform: "@/i18n/{{ matches.[1] }}/{{member}}",
  //   // },
  //   "@koine/i18n/?(((\\w*)?/?)*)": {
  //     transform: "@koine/i18n/{{ matches.[1] }}/{{member}}",
  //   },
  // },
  // typescript: {
  //   ignoreBuildErrors: true
  // },
  // eslint: {
  //   ignoreDuringBuilds: true
  // },
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

    // webpackConfig.resolve = {
    //   alias: {
    //     "@/i18n": resolve(__dirname, './i18n'),
    //   },
    // };

    webpackConfig.plugins.push(
      // new I18nWebpackPlugin2({}),

      // new webpack.ProvidePlugin({
      //   // _useLocale: ["@/i18n", "useLocale"],
      //   // _getLocale: ["@/i18n", "getLocale"],
      //   // _getT: ["@/i18n", "getT"],
      // }),
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
              t: `(function(trace, ...args) {
                  const $t = require("${i18nDir}/$t");
                  const locale = globalThis.__i18n_locale;

                  const translationKeyToFnName = (key) => {
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
                  const fnName = translationKeyToFnName(
                    trace.replace(/:/, ".").split(".")
                      .filter(Boolean)
                      .map(translationKeyToFnName)
                      .join("_")
                  );
                  // console.log({ fnName });
                  return $t["$t_" + fnName](locale, ...args);
                })`,
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

const plugins = [
  withNx,
  withKoine,
  // withI18nAsync,
];

module.exports = composePlugins(...plugins)(
  nextConfig,
);
