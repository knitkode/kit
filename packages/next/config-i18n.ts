import type {
  Redirect as _Redirect,
  Rewrite as _Rewrite,
} from "next/dist/lib/load-custom-routes";

const arrayUniqueByProperties = <T extends any[]>(
  array: T,
  keys: (keyof T[number])[],
) =>
  array.filter(
    (item, idx, arr) =>
      arr.findIndex((itemWith) =>
        keys.every((k) => itemWith[k] === item[k]),
      ) === idx,
  ) as T;

export type Redirect = Omit<_Redirect, "locale"> & { locale?: boolean };

export type Rewrite = Omit<_Rewrite, "locale"> & { locale?: boolean };

type Route =
  | string
  | {
      [key: string]: Route | string;
    };
type RoutesByLocale = Record<string, Route>;

export type Locale = string; // & { _branded: true };

export type Routes = Record<Locale, RoutesByLocale>;

type RoutesMap = Record<string, RoutesMapRoute>;

type RoutesMapRoute = {
  template: string;
  pathname: string;
  wildcard?: boolean;
};

function orderRoutes(routes: Routes, defaultLocale: Locale) {
  const { [defaultLocale]: routesForDefaultLocale, ...restRoutes } = routes;

  return {
    [defaultLocale]: routesForDefaultLocale,
    ...restRoutes,
  };
}

/**
 * Normalise pathname
 *
 * From a path like `/some//malformed/path///` it returns `some/malformed/path`
 *
 * - Removes subsequent slashes
 * - Removing initial and ending slashes
 * - Returns an empty string `"""` if only slashes are given
 */
function normaliseUrlPathname(pathname = "") {
  // with return pathname.replace(/\/+\//g, "/").replace(/^\/+(.*?)\/+$/, "$1");
  // we would instead return a single slash if only slashes are given
  return pathname.replace(/\/+\//g, "/").replace(/^\/*(.*?)\/*$/, "$1");
}

/**
 * Transform to path any absolute or relative URL
 *
 * Useful when setting up `rewrites` and `redirects` especally in a [multi-zones
 * setup](https://nextjs.org/docs/advanced-features/multi-zones).
 *
 * From a path like `http://localhost/some//malformed/path///` it returns `/some/malformed/path`
 *
 * @see {@link normaliseUrlPathname}
 */
function toPath(urlOrPathname = "") {
  let pathname = "";
  try {
    const parsed = new URL(urlOrPathname);
    pathname = parsed.pathname;
  } catch (e) {
    pathname = urlOrPathname;
  }
  // with return pathname.replace(/\/+\//g, "/").replace(/^\/+(.*?)\/+$/, "$1");
  // we would instead return a single slash if only slashes are given
  return pathname.replace(/\/+\//g, "/").replace(/^\/*(.*?)\/*$/, "$1");
}

/**
 * Clean a pathname and encode each part
 *
 * @see {@link normaliseUrlPathname}
 */
function encodePathname(pathname = "") {
  const parts = normaliseUrlPathname(pathname).split("/");

  return parts
    .filter((part) => !!part)
    .map((part) => encodeURIComponent(part))
    .join("/");
}

type MapPathnameParts = Record<
  string,
  {
    isDynamic?: boolean;
    hasWildcard?: boolean;
  }
>;

/**
 * Transform the route translated defintion into a `pathname` and a `template`.
 *
 * Here we add the wildcard flag maybe found in the pathname to the template
 * name too, this is because we do not want to have the wildcard in the JSON
 * keys as those are also used to produce links through the `useTo` hook and
 * having asterisks there is a bit cumbersome.
 *
 * @see https://nextjs.org/docs/messages/invalid-multi-match
 */
function transformRoute(route: RoutesMapRoute) {
  const { pathname: rawPathname, template: rawTemplate } = route;
  const pathnameParts = rawPathname.split("/").filter((part) => !!part);
  const templateParts = rawTemplate.split("/").filter((part) => !!part);
  const mapPartsByIdx: MapPathnameParts = {};

  const pathname = pathnameParts
    .map((part) => {
      const hasWildcard = part.endsWith("*");
      part = part.replace("*", "");
      const isDynamic = part.startsWith("{{") && part.endsWith("}}");
      const asValue = isDynamic
        ? part.match(/{{(.+)}}/)?.[1].trim() ?? ""
        : part.trim();
      const asPath = encodeURIComponent(asValue) + (hasWildcard ? "*" : "");

      mapPartsByIdx[asValue] = {
        isDynamic,
        hasWildcard,
      };
      return isDynamic ? `:${asPath}` : asPath;
    })
    .join("/");

  const template = templateParts
    .map((part) => {
      const isDynamic = part.startsWith("[") && part.endsWith("]");
      const asValue = isDynamic
        ? part.match(/\[(.+)\]/)?.[1].trim() ?? ""
        : part.trim();
      const hasWildcard = mapPartsByIdx[asValue]?.hasWildcard;
      const asPath = encodeURIComponent(asValue) + (hasWildcard ? "*" : "");

      return isDynamic ? `:${asPath}` : asPath;
    })
    .join("/");

  return { pathname, template };
}

/**
 * Get routes map dictionary
 */
function getRoutesMap(
  map: RoutesMap = {},
  routesByLocale: RoutesByLocale,
  pathnameBuffer = "",
  templateBuffer = "",
) {
  const isSpaRoute = Object.keys(routesByLocale).includes("[spa]");

  for (const key in routesByLocale) {
    const pathOrNestedRoutes = routesByLocale[key];
    const template = `${templateBuffer}/${key}`;
    if (typeof pathOrNestedRoutes === "string") {
      if (!isSpaRoute || (isSpaRoute && ["[spa]", "index"].includes(key))) {
        map[template] = {
          template,
          pathname: pathOrNestedRoutes,
          wildcard: pathOrNestedRoutes.includes("*"),
        };
      }
    } else {
      if (!isSpaRoute) {
        getRoutesMap(map, pathOrNestedRoutes, pathnameBuffer, template);
      }
    }
  }

  return map;
}

/**
 * Removes `/index` from a template/url path
 */
function getWithoutIndex(template: string) {
  return template.replace(/\/index$/, "");
}

export type ConfigI18nOptions = {
  locales: Locale[];
  defaultLocale: Locale;
  hideDefaultLocaleInUrl?: boolean;
  /**
   * For app router
   */
  localeParam?: string;
};

/**
 * Shared options to generate Next.js `rewrites` and `redirects`
 */
type Options = ConfigI18nOptions & {
  routes: Routes;
  debug?: boolean;
  /**
   * Set this to true once your URL structure is definitive, this will mark all
   * the generated redirects as permanent 301 instead of the default 307
   */
  permanent?: boolean;
};

/**
 * Get path redirect
 */
function getPathRedirect(
  arg: Pick<GetRedirectsOptions, "localeParam" | "permanent"> & {
    localeSource?: Locale;
    localeDestination?: Locale;
    route: RoutesMapRoute;
    usePathnameAsSource?: boolean;
  },
) {
  const {
    localeSource,
    localeDestination,
    route,
    usePathnameAsSource,
    permanent,
  } = arg;
  const { template: routeTemplate, pathname } = transformRoute(route);
  const template = usePathnameAsSource ? pathname : routeTemplate;

  const sourcePrefix = localeSource ? `${localeSource}/` : "";
  const source = getWithoutIndex(
    `/${normaliseUrlPathname(sourcePrefix + template)}`,
  );

  const destinationPrefix = localeDestination ? `${localeDestination}/` : "";
  const destination = `/${normaliseUrlPathname(destinationPrefix + pathname)}`;
  // console.log(`redirect template "${source}" to pathname "${destination}"`);

  if (source === destination) return;

  const redirect: Redirect = {
    source,
    destination,
    permanent: Boolean(permanent),
  };

  return redirect;
}

type GetRedirectsOptions = Options;

/**
 */
export function getRedirects(arg: GetRedirectsOptions) {
  const {
    routes,
    defaultLocale,
    hideDefaultLocaleInUrl,
    localeParam,
    permanent,
    debug,
  } = arg;
  const orderedRoutes = orderRoutes(routes, defaultLocale);
  const redirects: (Redirect | undefined)[] = [];

  for (const locale in orderedRoutes) {
    const routesByLocale = routes[locale];
    const routesMap = getRoutesMap({}, routesByLocale);

    for (const template in routesMap) {
      const route = routesMap[template];

      if (route.pathname !== getWithoutIndex(template)) {
        const isVisibleDefaultLocale =
          locale === defaultLocale && !hideDefaultLocaleInUrl;
        const isHiddenDefaultLocale =
          locale === defaultLocale && hideDefaultLocaleInUrl;

        if (localeParam) {
          // app router:
          if (isVisibleDefaultLocale) {
            redirects.push(
              getPathRedirect({ localeDestination: locale, route, permanent }),
            );
          } else if (isHiddenDefaultLocale) {
            redirects.push(
              getPathRedirect({ localeSource: locale, route, permanent }),
            );
          } else if (locale !== defaultLocale) {
            redirects.push(
              getPathRedirect({
                localeSource: locale,
                localeDestination: locale,
                route,
                permanent,
              }),
            );
          } else {
            redirects.push(getPathRedirect({ route, permanent }));
          }
        } else {
          // pages router:
          if (isVisibleDefaultLocale) {
            redirects.push(
              getPathRedirect({ localeDestination: locale, route, permanent }),
            );
          } else if (locale !== defaultLocale) {
            redirects.push(
              getPathRedirect({
                localeSource: locale,
                localeDestination: locale,
                route,
                permanent,
              }),
            );
          } else {
            redirects.push(getPathRedirect({ route, permanent }));
          }
        }
      }
    }
  }

  const cleaned = arrayUniqueByProperties(
    redirects.filter(Boolean) as Redirect[],
    ["source", "destination"],
  ).map((rewrite) => (localeParam ? rewrite : { ...rewrite, locale: false }));

  if (debug) console.info("[@koine/next/config:getRedirects]", cleaned);

  return cleaned;
}

/**
 * Get path rewrite
 */
function getPathRewrite(
  arg: Pick<GetRewritesOptions, "localeParam"> & {
    localeSource?: Locale;
    localeDestination?: Locale;
    route: RoutesMapRoute;
  },
) {
  const { localeSource, localeDestination, localeParam, route } = arg;
  const { pathname, template } = transformRoute(route);

  let sourcePrefix = "";
  if (localeSource) sourcePrefix = `${localeSource}/`;
  else if (localeParam) sourcePrefix = `:${localeParam}/`;

  const source = `/${normaliseUrlPathname(sourcePrefix + pathname)}`;

  let destinationPrefix = "";
  if (localeDestination) destinationPrefix = `${localeDestination}/`;
  else if (localeParam) destinationPrefix = `:${localeParam}/`;

  const destination = getWithoutIndex(
    `/${normaliseUrlPathname(destinationPrefix + template)}`,
  );
  // console.log(`rewrite pathname "${source}" to template "${destination}"`);

  if (source === destination) return;

  return {
    source,
    destination,
  };
}

type GetRewritesOptions = Options;

/**
 */
export function getRewrites(arg: GetRewritesOptions) {
  const { routes, defaultLocale, hideDefaultLocaleInUrl, localeParam, debug } =
    arg;
  const orderedRoutes = orderRoutes(routes, defaultLocale);
  const rewrites: (Rewrite | undefined)[] = [];

  for (const locale in orderedRoutes) {
    const routesByLocale = routes[locale];
    const routesMap = getRoutesMap({}, routesByLocale);

    for (const template in routesMap) {
      const route = routesMap[template];
      const isVisibleDefaultLocale =
        locale === defaultLocale && !hideDefaultLocaleInUrl;
      const isHiddenDefaultLocale =
        locale === defaultLocale && hideDefaultLocaleInUrl;

      if (localeParam) {
        // app router:
        if (isHiddenDefaultLocale) {
          rewrites.push(getPathRewrite({ localeDestination: locale, route }));
        } else {
          rewrites.push(getPathRewrite({ localeParam, route }));
        }
      } else {
        // pages router:
        // this condition only applies to the pages router as with the app one
        // even if the template matches the pathname we always need to rewrite
        // as the localeParam is always needed in the rewrite destination
        if (route.pathname !== getWithoutIndex(template)) {
          if (locale !== defaultLocale || isVisibleDefaultLocale) {
            rewrites.push(getPathRewrite({ localeSource: locale, route }));
          } else {
            rewrites.push(getPathRewrite({ route }));
          }
        }
      }
    }
  }

  const cleaned = arrayUniqueByProperties(
    rewrites.filter(Boolean) as Rewrite[],
    ["source", "destination"],
  );

  if (debug) console.info("[@koine/next/config:getRewrites]", cleaned);

  return cleaned;
}

// function getRoutesOfDefaultLocale(
//   routes: Routes | RoutesByLocale,
//   defaultLocale?: Locale,
// ) {
//   const routesByLocale = routes as RoutesByLocale;
//   if (
//     defaultLocale &&
//     routesByLocale[defaultLocale as keyof typeof routesByLocale]
//   ) {
//     return routesByLocale[defaultLocale] as Routes;
//   }

//   if (Object.keys(routes).length === 1) {
//     const routesWithOneLocale = routes as Routes;
//     let output: RoutesByLocale = {};
//     for (const onlyLocale in routesWithOneLocale) {
//       output =
//         routesWithOneLocale[onlyLocale as keyof typeof routesWithOneLocale];
//     }
//     return output;
//   }

//   return routes as Routes;
// }
