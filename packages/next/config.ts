import type { NextConfig } from "next";
import { swcCreateTransforms, swcTransformsKoine } from "@koine/node/swc";
import {
  type WithI18nAsyncOptions,
  type WithI18nLegacyOptions,
  withI18n,
  withI18nAsync,
  withI18nLegacy,
} from "@koine/i18n/next";

/**
 * @legacy
 */
export type Routes = NonNullable<WithI18nLegacyOptions["i18nRoutes"]>["routes"];

type ModularizeShortcut = {
  /**
   * A list of the packages to modularize, if a `scope` is given that will be
   * automatically prepended before a slash e.g. `{scope}/@{lib}`.
   * @example ["components", "utils"]
   */
  libs: string[];
  /**
   * The scope of the packages to modularize, if given a slash is automatically
   * appended between the scope and the lib name
   * @example "@"
   */
  scope?: string;
};

export type WithKoineOptions = NextConfig & {
  /**
   * Set it to `true` when your _Next.js_ app is built inside a Nx monorepo
   */
  nx?: boolean;
  /**
   * Set it to `true` in order to be able importing React components directly
   * from `.svg` files.
   *
   * It automatically configure webpack taking into account the `nx` option.
   */
  svg?: boolean;
  /**
   * Shortcut option to automatically create swc transforms to feed into
   * _Next.js_' `modularizeImports`.
   *
   * Pass one or a list of {@link ModularizeShortcut shortcut object}.
   */
  modularize?: ModularizeShortcut[] | ModularizeShortcut;
} & WithI18nLegacyOptions &
  WithI18nAsyncOptions;

/**
 * Get _Next.js_ config with some extra {@link WithKoineOptions options}
 *
 * @param options
 */
export let withKoine = (options: WithKoineOptions = {}): NextConfig => {
  const { nx, svg, i18nRoutes, i18nCompiler, modularize, ...restNextConfig } =
    options;
  const nextConfig: NextConfig = {
    // @see https://www.zhoulujun.net/nextjs/advanced-features/compiler.html#modularize-imports
    modularizeImports: {
      ...(modularize
        ? Array.isArray(modularize)
          ? modularize.reduce(
              (map, single) => ({
                ...map,
                ...swcCreateTransforms(single.libs, single.scope),
              }),
              {},
            )
          : swcCreateTransforms(modularize.libs, modularize.scope)
        : {}),
      ...(restNextConfig.modularizeImports || {}),
      ...swcTransformsKoine,
    },
    ...restNextConfig,
  };

  if (svg) {
    if (nx) {
      // @see https://github.com/gregberge/svgr
      nextConfig["nx"] = { svgr: true };
    } else {
      // if falsy just remove the key
      delete nextConfig["nx"];

      nextConfig.webpack = (
        _webpackConfig,
        webpackConfigContext,
        // ...[_webpackConfig, webpackConfigContext]: Parameters<NonNullable<NextConfig['webpack']>>
      ) => {
        const webpackConfig =
          typeof restNextConfig.webpack === "function"
            ? restNextConfig.webpack(_webpackConfig, webpackConfigContext)
            : _webpackConfig;

        // @see https://dev.to/dolearning/importing-svgs-to-next-js-nna#svgr
        webpackConfig.module.rules.push({
          test: /\.svg$/,
          use: [
            {
              loader: "@svgr/webpack",
              options: {
                svgoConfig: {
                  plugins: [
                    {
                      name: "removeViewBox",
                      active: false,
                    },
                  ],
                },
              },
            },
          ],
        });

        return webpackConfig;
      };
    }
  }

  if (i18nRoutes) {
    return withI18nLegacy({ ...nextConfig, i18nRoutes });
  }

  if (i18nCompiler) {
    if (nx) {
      return withI18nAsync({ ...nextConfig, i18nCompiler });
    }
    return withI18n({ ...nextConfig, i18nCompiler });
  }

  return nextConfig;
};
