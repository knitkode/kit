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
import { isFunction } from "@koine/utils";

/**
 * @legacy
 */
export type Routes = NonNullable<WithI18nLegacyOptions["i18nRoutes"]>["routes"];

export type WithKoineOptions<Nx extends boolean | undefined = undefined> = NextConfig & {
  /**
   * Set it to `true` when your _Next.js_ app is built inside a Nx monorepo
   */
  nx?: Nx;
  /**
   * Set it to `true` in order to be able importing React components directly
   * from `.svg` files.
   *
   * It configures turbopack/webpack taking into account `nx` option.
   */
  svg?: boolean | "turbopack" | "webpack";
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
export function withKoine(options: WithKoineOptions<undefined | false>): NextConfig;
export function withKoine(options: WithKoineOptions<true>): NextConfigFn;
export function withKoine(options: WithKoineOptions<undefined | false | true> = {}): NextConfigFn | NextConfig {
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
      (nextConfig as NextConfig & { nx?: unknown })["nx"] = { svgr: true };
    } else {
      // if falsy ensure we remove the key
      delete (nextConfig as NextConfig & { nx?: unknown })["nx"];

      if (svg === true || svg === "turbopack") {
        nextConfig.turbopack = {
          ...restNextConfig.turbopack,
          rules: {
          ...restNextConfig.turbopack?.rules,
            // '*.svg': ['@vercel/turbopack/svgr'],
            "*.svg": {
              loaders: [
                {
                  loader: "@svgr/webpack",
                  options: {
                    memo: true,
                    dimensions: false,
                    svgoConfig: {
                      multipass: true,
                      plugins: [
                        "removeDimensions",
                        "removeOffCanvasPaths",
                        "reusePaths",
                        "removeElementsByAttr",
                        "removeStyleElement",
                        "removeScriptElement",
                        "prefixIds",
                        "cleanupIds",
                        {
                          name: "cleanupNumericValues",
                          params: {
                            floatPrecision: 1,
                          },
                        },
                        {
                          name: "convertPathData",
                          params: {
                            floatPrecision: 1,
                          },
                        },
                        {
                          name: "convertTransform",
                          params: {
                            floatPrecision: 1,
                          },
                        },
                        {
                          name: "cleanupListOfValues",
                          params: {
                            floatPrecision: 1,
                          },
                        },
                      ],
                    },
                  },
                },
              ],
              as: "*.js",
            },
          },
        };
      }
      else if (svg === "webpack") {
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


type NextConfigFn = (
  phase: string,
  context?: any,
) => Promise<NextConfig> | NextConfig;


type RewriteReturn = Awaited<ReturnType<NonNullable<NextConfig["rewrites"]>>>;
type RewritesObject = RewriteReturn extends infer U
  ? U extends unknown[]
    ? never
    : U
  : never;
type RewritesArray = RewriteReturn extends infer U
  ? U extends Array<infer T>
    ? T[]
    : never
  : never;

function mergeRewritesKey<
  Key extends keyof RewritesObject,
  T extends undefined | RewritesArray | RewritesObject,
>(key: Key, defaults: T, custom: T) {
  return [
    ...(Array.isArray(defaults) ? defaults : defaults?.[key] || []),
    ...(Array.isArray(custom) ? custom : custom?.[key] || []),
  ];
}

async function nextjsConfigMergeRewrites(
  defaultRewrites?:
    | NextConfig["rewrites"]
    | Awaited<ReturnType<NonNullable<NextConfig["rewrites"]>>>,
  customRewrites?: NextConfig["rewrites"]
) {
  const defaults = isFunction(defaultRewrites)
    ? await defaultRewrites?.()
    : defaultRewrites;
  const custom = await customRewrites?.();

  const beforeFiles = mergeRewritesKey("beforeFiles", defaults, custom);
  const afterFiles = mergeRewritesKey("afterFiles", defaults, custom);
  const fallback = mergeRewritesKey("fallback", defaults, custom);

  return {
    beforeFiles,
    afterFiles,
    fallback,
  };
}

withKoine.mergeRewrites = nextjsConfigMergeRewrites;

// export { nextjsConfigMergeRewrites };
