import type { NextConfig } from "next";
import {
  type WithI18nAsyncOptions,
  type WithI18nLegacyOptions,
  withI18n,
  withI18nAsync,
  withI18nLegacy,
} from "@koine/i18n/next";

export type WithKoineOptions = NextConfig & {
  nx?: boolean;
  svg?: boolean;
} & WithI18nLegacyOptions &
  WithI18nAsyncOptions;

/**
 * Get Next.js config with some basic opinionated defaults
 *
 * @param {object} options
 * @property {boolean} [options.nx=false] Nx monorepo setup
 * @property {boolean} [options.svg=false] SVG to react components
 */
export let withKoine = (options: WithKoineOptions = {}): NextConfig => {
  const { nx, svg, i18nRoutes, i18nCompiler, ...restNextConfig } = options;
  const nextConfig: NextConfig = {
    // @see https://nextjs.org/docs/api-reference/next.config.js/custom-page-extensions#including-non-page-files-in-the-pages-directory
    eslint: {
      ignoreDuringBuilds: true, // we have this strict check on each commit
    },
    typescript: {
      ignoreBuildErrors: true, // we have this strict check on each commit
    },
    poweredByHeader: false,
    experimental: {
      // @see https://github.com/vercel/vercel/discussions/5973#discussioncomment-472618
      // @see critters error https://github.com/vercel/next.js/issues/20742
      // optimizeCss: true,
      // @see https://github.com/vercel/next.js/discussions/30174#discussion-3643870
      scrollRestoration: true,
      ...(restNextConfig.experimental || {}),
    },
    modularizeImports: {
      ...(restNextConfig.modularizeImports || {}),
      // @see https://www.zhoulujun.net/nextjs/advanced-features/compiler.html#modularize-imports
      "@koine/api": { transform: "@koine/api/{{member}}" },
      "@koine/browser": { transform: "@koine/browser/{{member}}" },
      "@koine/dom": { transform: "@koine/dom/{{member}}" },
      "@koine/node": { transform: "@koine/node/{{member}}" },
      "@koine/i18n/?(((\\w*)?/?)*)": {
        transform: "@koine/i18n/{{ matches.[1] }}/{{member}}",
      },
      "@koine/react/?(((\\w*)?/?)*)": {
        transform: "@koine/react/{{ matches.[1] }}/{{member}}",
      },
      "@koine/next/?(((\\w*)?/?)*)": {
        transform: "@koine/next/{{ matches.[1] }}/{{member}}",
      },
      "@koine/utils": { transform: "@koine/utils/{{member}}" },
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
        _config,
        options,
        // ...[_config, options]: Parameters<NonNullable<NextConfig['webpack']>>
      ) => {
        const webpackConfig =
          typeof nextConfig.webpack === "function"
            ? nextConfig.webpack(_config, options)
            : _config;

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
