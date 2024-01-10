/**
 * Next Pages router utility type
 */
declare type PageDataStaticPaths<
  P extends import("querystring").ParsedUrlQuery,
> = import("next").GetStaticPaths<P | never>;

/**
 * Next Pages router utility type
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare type PageDataStatic<P extends { [key: string]: any }> =
  import("next").GetStaticProps<P, import("querystring").ParsedUrlQuery>;

/**
 * Next Pages router utility type
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare type PageDataServer<P extends { [key: string]: any }> =
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
declare namespace NodeJS {
  interface ProcessEnv {
    AUTH_ROUTE_LOGIN: string;
    AUTH_ROUTE_PROFILE: string;
    AUTH_ROUTE_REGISTER: string;
    AUTH_ROUTES_SECURED: string;
  }
}
