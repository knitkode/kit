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
 * Types specifically related to `@koine/next` exposed on the global unique
 * namespace `Koine`. Most of the types here should be prefixed by `Next`, e.g.
 * `NextSomeFeature` accessible anywhere from `Koine.NextSomeFeature`
 */
declare namespace Koine {
  /**
   * Default SEO data structure expected by the `<Seo>` component's prop `seo`
   */
  type NextSeo = import("./12/types-seo").SeoData;
}

/**
 * List here the global variables used by third party scripts supported within
 * the `koine` ecosystem. For instance Google Analytics globally available
 * variables.
 */
declare interface Window {
  gtag: (...args: Record<string, unknown>[]) => Record<string, unknown>;
}
