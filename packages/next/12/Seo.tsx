import type { NextSeoProps } from "next-seo/lib/types";
import Head from "next/head";
import { type LinkTag, type MetaTag, seoBuildTags } from "./seoBuildTags";

export type SeoData = {
  hidden?: boolean;
  title?: string;
  description?: string;
  keywords?: string | string[];
  ogimage?: string;
};

type SeoPropsOpenGraph = NextSeoProps["openGraph"] & {
  image?: string;
};

/**
 * @see https://github.com/garmeeh/next-seo/blob/master/src/types.ts#L395
 */
export type SeoProps = Omit<
  NextSeoProps,
  | "additionalMetaTags"
  | "additionalLinkTags"
  | "mobileAlternate"
  | "robotsProps"
> & {
  metaTags?: ReadonlyArray<MetaTag>;
  linkTags?: ReadonlyArray<LinkTag>;
  seo?: SeoData;
  hidden?: SeoData["hidden"];
  keywords?: SeoData["keywords"];
  openGraph?: SeoPropsOpenGraph;
  og?: SeoPropsOpenGraph;
};

/**
 * Adapted from [garmeeh/next-seo](https://github.com/garmeeh/next-seo)
 *
 * See also:
 * - https://github.com/catnose99/next-head-seo
 * - https://nextjs.org/docs/api-reference/next/head
 *
 * NB: on the homepage you usually want to customize the `titleTemplate` to avoid
 * doubled app name. Assuming your default seo configuration is something like:
 *
 * ```js
 * {
 *   titleTemplate: "%s | MyApp"
 * }
 * ```
 *
 * On the homepage you migh want to override it, e.g.:
 * ```js
 * <Seo title="MyApp | Some description" titleTemplate="%s" />
 * ```
 *
 * @deprecated
 */
export let Seo = (props: SeoProps) => <Head>{seoBuildTags(props)}</Head>;

export default Seo;
