import type { NextConfig } from "next";
import {
  type ConfigI18nOptions,
  type Routes,
  getRedirects,
  getRewrites,
} from "./config-i18n.js";

interface KoineNextConfig {
  /** @default true Nx monorepo setup */
  nx?: boolean;
  /** @default true  Svg to react components */
  svg?: boolean;
  /**
   * A JSON file containing the routes definition mapping template folders
   * to localised slugs. It supports slugs's dynamic portions.
   * All translated slugs needs to be defined starting from root `/`.
   * The `require("...json")` file for each locale should look like:
   *
   * ```json
   * {
   *   "home": "/",
   *   "products": {
   *     "list": "/products",
   *     "[category]": "/products/{{ category }}",
   *     "[tag]": {
   *       "view": "/products/{{ category }}/{{ tag }}",
   *       "related": "/products/{{ category }}/{{ tag }}/related"
   *     }
   *   },
   *   "company": {
   *     "about": "/about",
   *     "contact": "/contact"
   *   }
   * }
   * ```
   *
   * Here we also account for wildcards, those should only be defined in the
   * pathname part of the JSON file, e.g.:
   *
   * ```json
   * {
   *   "category": {
   *     "[slug]": {
   *       "[id]": "/categories/{{ slug }}/{{ id }}*"
   *     }
   *   }
   * }
   * ```
   * This might be desired when we want to have param-based pagination, e.g. when
   * we have the following folder structure:
   *
   * ```yml
   * |__/category
   *    |__/[slug]
   *      |__/[id]
   *         |__/[[...page]].tsx
   * ```
   *
   * NOTE1:
   * You cannot name your dynamic template file "index.tsx" when they have nested
   * segments or the rewrites won't work. So while this is allowed:
   * `/pages/cats/[category]/index.tsx` it is not when you also have e.g.:
   * `/pages/cats/[category]/reviews.tsx`
   * TODO: This might be fixable? Is this fixed now?
   *
   * NOTE2:
   * When `routes` is used be sure to pass before than the `i18n.defaultLocale`
   * configuration. That is used for localised routing. By default we set `i18n`
   * as such:
   * ```js
   * {
   *   // ...nextConfig,
   *   i18n: {
   *     defaultLocale: "en",
   *     locales: ["en"],
   *     hideDefaultLocaleInUrl: false
   *   }
   * }
   * ```
   */
  routes?: Routes;
  /**
   * Whether the routes redirecting should be permanent. Switch this on once you
   * go live and the routes structure is stable.
   */
  permanent?: boolean;
  debug?: boolean;
  i18n: ConfigI18nOptions & { loader?: any };
}

interface MergedConfig extends KoineNextConfig, Omit<NextConfig, "i18n"> {}

/**
 * Get Next.js config with some basic opinionated defaults
 *
 * @param {object} options
 * @property {boolean} [options.nx=false] Nx monorepo setup
 * @property {boolean} [options.svg=false] Svg to react components
 */
export let withKoine = (
  {
    nx = true,
    svg = true,
    page,
    routes,
    permanent,
    debug,
    ...custom
  }: MergedConfig = {
    i18n: {
      locales: ["en"],
      defaultLocale: "en",
      hideDefaultLocaleInUrl: false,
    },
  },
) => {
  const nextConfig: NextConfig = {
    // @see https://nextjs.org/docs/api-reference/next.config.js/custom-page-extensions#including-non-page-files-in-the-pages-directory
    eslint: {
      ignoreDuringBuilds: true, // we have this strict check on each commit
    },
    typescript: {
      ignoreBuildErrors: true, // we have this strict check on each commit
    },
    poweredByHeader: false,
    modularizeImports: {
      "@koine/i18n": { transform: "@koine/i18n/{{member}}" },
      "@koine/next/?(((\\w*)?/?)*)": {
        transform: "@koine/next/{{ matches.[1] }}/{{member}}",
      },
      ...(custom["modularizeImports"] || {}),
    },
    experimental: {
      // @see https://github.com/vercel/vercel/discussions/5973#discussioncomment-472618
      // @see critters error https://github.com/vercel/next.js/issues/20742
      // optimizeCss: true,
      // @see https://github.com/vercel/next.js/discussions/30174#discussion-3643870
      scrollRestoration: true,
      ...(custom["experimental"] || {}),
    },
    ...custom,
  };

  if (svg) {
    if (nx) {
      // @see https://github.com/gregberge/svgr
      nextConfig["nx"] = {
        svgr: true,
      };
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

  if (custom.i18n) {
    const { locales, defaultLocale, localeParam } = custom.i18n;
    if (localeParam) {
      // app router:
      // NOTE: after thousands attempts turns out that passing the i18n settings
      // to the app router messes up everything, just rely on our internal i18n
      // mechanisms
      delete nextConfig.i18n;
    } else {
      // pages routes:
      nextConfig.i18n = { locales, defaultLocale };
    }
  }

  if (routes) {
    return {
      ...nextConfig,
      async redirects() {
        const defaults = getRedirects({
          routes,
          permanent,
          debug,
          ...custom.i18n,
        });
        if (nextConfig.redirects) {
          const customs = await nextConfig.redirects();
          return [...defaults, ...customs];
        }
        return defaults;
      },
      async rewrites() {
        const defaults = getRewrites({
          routes,
          debug,
          ...custom.i18n,
        });

        if (nextConfig.rewrites) {
          const customs = await nextConfig.rewrites();

          if (Array.isArray(customs)) {
            return {
              beforeFiles: defaults,
              afterFiles: customs,
              fallback: [],
            };
          }

          return {
            ...customs,
            beforeFiles: [...defaults, ...(customs.beforeFiles || [])],
          };
        }
        return {
          beforeFiles: defaults,
          afterFiles: [],
          fallback: [],
        };
      },
    };
  }

  return nextConfig;
};
