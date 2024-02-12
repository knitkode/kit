/**
 * Nx types
 *
 * Allow to embed SVGs as both URLs string and as React components
 */
declare module "*.svg" {
  const content: unknown;
  export const ReactComponent: import("react").FC<
    import("react").ComponentProps<"svg">
  >;
  export default content;
}

/**
 * [`next.js` pages router](https://nextjs.org/docs/pages) utility type
 */
type NextGetStaticPathsResult<Params extends { [key: string]: any }> = Omit<
  import("next").GetStaticPathsResult,
  "paths"
> & {
  paths: Array<string | { params: Params; locale?: string }>;
};

/**
 * [`next.js` pages router](https://nextjs.org/docs/pages) utility type
 */
declare type NextPageDataStaticPaths<Params extends { [key: string]: any }> = (
  context: import("next").GetStaticPathsContext,
) =>
  | Promise<NextGetStaticPathsResult<Params>>
  | NextGetStaticPathsResult<Params>;

/**
 * [`next.js` pages router](https://nextjs.org/docs/pages) utility type
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare type NextPageDataStatic<P extends { [key: string]: any }> =
  import("next").GetStaticProps<P, import("querystring").ParsedUrlQuery>;

/**
 * [`next.js` pages router](https://nextjs.org/docs/pages) utility type
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare type NextPageDataServer<P extends { [key: string]: any }> =
  import("next").GetServerSideProps<P, import("querystring").ParsedUrlQuery>;

/**
 * Workaround to re-create the type `RouteProperties` that is not exported by
 * `next.js`
 */
declare type NextRouteProperties = Parameters<
  import("next/router").Router["getRouteInfo"]
>[0]["routeProps"];

/**
 * Extend NodeJS `process.env` with variables used by @koine
 */
// declare namespace NodeJS {
//   interface ProcessEnv {
//   }
// }
