import type { NextConfig } from "next";
import {
  type SwcTransformingLib,
  swcCreateTransform,
  swcCreateTransforms,
  swcTransformsKoine,
} from "@koine/node/swc";
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
   * Pass _one_ or an _array_ of {@link SwcTransformingLib lib transform object}.
   */
  modularize?: SwcTransformingLib[] | SwcTransformingLib;
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
          ? swcCreateTransforms(modularize)
          : swcCreateTransform(modularize)
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
