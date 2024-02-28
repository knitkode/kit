import { useState } from "react";
import {
  type GetMediaQueryWidthResolversBreakpoints,
  type Split,
  getMediaQueryWidthResolvers,
  isUndefined,
} from "@koine/utils";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";

type _MediaQuerWidthDefExplicit<TBreakpoint extends string> =
  | `min-${TBreakpoint}`
  | `max-${TBreakpoint}`
  | `up-${TBreakpoint}`
  | `down-${TBreakpoint}`
  | `between-${TBreakpoint}_${TBreakpoint}`
  | `only-${TBreakpoint}`;

export type MediaQuerWidthDef<TBreakpoint extends string> =
  | `${TBreakpoint}`
  | _MediaQuerWidthDefExplicit<TBreakpoint>;

export type MediaQueryWidth<TBreakpoint extends string> =
  `@${MediaQuerWidthDef<TBreakpoint>}`;

/**
 * Use `null` instead of `false` as default value, @see https://observablehq.com/@werehamster/avoiding-hydration-mismatch-when-using-react-hooks
 *
 * @param customBreakpoints
 * @returns
 */
export let createUseMediaQueryWidth = <
  TBreakpointsConfig extends GetMediaQueryWidthResolversBreakpoints,
>(
  customBreakpoints: TBreakpointsConfig,
) => {
  const queryResolvers = getMediaQueryWidthResolvers(customBreakpoints);

  return function useMediaQueryWidth<
    TBreakpoints extends Extract<keyof TBreakpointsConfig, string>,
  >(media: MediaQueryWidth<TBreakpoints>, serverValue?: null | boolean) {
    const definition = media.substring(
      1,
    ) as _MediaQuerWidthDefExplicit<TBreakpoints>;
    let [rule, ruleBreakpoint] = definition.split("-") as Split<
      _MediaQuerWidthDefExplicit<TBreakpoints>,
      "-"
    >;
    if (isUndefined(ruleBreakpoint)) {
      ruleBreakpoint = rule;
    }
    if (isUndefined(rule)) {
      rule = "min";
    }
    // with the hook creator approach these breakpoint types cannot be deduced
    // const [br1, br2] = ruleBreakpoint.split("-") as Split<
    //   typeof ruleBreakpoint,
    //   "-"
    // >;
    const [br1, br2] = ruleBreakpoint.split("_") as [
      TBreakpoints,
      TBreakpoints,
    ];

    const query = queryResolvers[rule](br1, br2);
    const [matches, setMatches] = useState<boolean | null>(
      isUndefined(serverValue) ? null : serverValue,
    );

    useIsomorphicLayoutEffect(() => {
      const mq = window.matchMedia(query);
      const handleChange = (event: MediaQueryListEvent) => {
        setMatches(event.matches);
      };

      setMatches(mq.matches);

      // Safari < 14 can't use addEventListener on a MediaQueryList
      // https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList#Browser_compatibility
      if (!mq.addEventListener) {
        // Update the state whenever the media query match state changes
        mq.addListener(handleChange);

        // Clean up on unmount and if the query changes
        return () => {
          mq.removeListener(handleChange);
        };
      }
      mq.addEventListener("change", handleChange);

      return () => {
        mq.removeEventListener("change", handleChange);
      };
    }, [query]);

    return matches;
  };
};

//// without creator it would be:
//// ---------------------------------------------------------------------------

// import { useState, useIsomorphicLayoutEffect, useMemo } from "react";
// import { type Split, isBrowser } from "@koine/utils";
// import { breakpoints as themeBreakpoints } from "@/config/theme/breakpoints";
// import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect"

// type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl";

// type Breakpoints = Record<Breakpoint, number>;

// type MediaQuery =
//   | `max:${Breakpoint}`
//   | `min:${Breakpoint}`
//   | `down:${Breakpoint}`
//   | `up:${Breakpoint}`
//   | `between:${Breakpoint}-${Breakpoint}`
//   | `only:${Breakpoint}`;

// const breakpoints: Breakpoints = {
//   xs: 0,
//   ...themeBreakpoints,
// };

// const sortedBreakpointsNames = (
//   Object.keys(breakpoints).map((key) => {
//     const br = key as keyof typeof breakpoints;
//     return [br, breakpoints[br]];
//   }) as [Breakpoint, number][]
// )
//   .sort((a, b) => a[1] - b[1])
//   .map((item) => item[0]);

// const getNextBreakpoint = (breakpoint: Breakpoint) => {
//   const index = sortedBreakpointsNames.indexOf(breakpoint);
//   return sortedBreakpointsNames[index + 1];
// };

// /**
//  * It behaves the same as `(min-width: ${value}px)`
//  * where value is the given breakpoint value.
//  * For ease of use this can be used both as a function `min("md")` and as an
//  * object literal `min.md`.
//  */
// const min = (br: Breakpoint) => `(min-width: ${breakpoints[br]}px)`;

// /**
//  * It behaves the same as `(max-width: ${value}px)`
//  * where value is the given breakpoint value.
//  * For ease of use this can be used both as a function `max("md")` and as an
//  * object literal `max.md`.
//  */
// const max = (br: Breakpoint) => `(max-width: ${breakpoints[br] - 0.02}px)`;

// /**
//  * It behaves the same as `min`
//  * @inheritdoc {max}
//  */
// const up = min;

// /**
//  * It behaves similarly to `max` but you will use the "next" breakpoint,
//  * specifying CSS that will apply from the given breakpoint and down.
//  */
// const down = (br: Breakpoint) => {
//   const brNext = getNextBreakpoint(br);
//   // TODO: if br does not exists otherwise throw Error
//   return brNext && `(max-width: ${breakpoints[brNext] - 0.02}px)`;
// };

// /**
//  * Media query between the two given breakpoints
//  */
// const between = (br1: Breakpoint, br2?: Breakpoint) => {
//   return br2
//     ? `(min-width: ${breakpoints[br1]}px) and (max-width: ${
//         breakpoints[br2] - 0.02
//       }px)`
//     : min(br1);
// };

// /**
//  * Media query to apply from the given breakpoint until the next, just for its
//  * full range
//  */
// const only = (br: Breakpoint) => {
//   const brNext = getNextBreakpoint(br);
//   return brNext ? between(br, brNext) : min(br);
// };

// const queryResolvers = {
//   max,
//   min,
//   down,
//   up,
//   between,
//   only,
// };

// export function useMqWidth(media: MediaQuery) {
//   const [rule = "min", ruleBreakpoint] = media.split(":") as Split<
//     MediaQuery,
//     ":"
//   >;
//   const [br1, br2] = ruleBreakpoint.split("-") as Split<
//     typeof ruleBreakpoint,
//     "-"
//   >;

//   const query = queryResolvers[rule](br1, br2);
//   const mq = useMemo(
//     () => (isBrowser ? window.matchMedia(query) : { matches: false }),
//     [query]
//   );
//   const [matches, setMatches] = useState(mq.matches);

//   useIsomorphicLayoutEffect(() => {
//     const mq = window.matchMedia(query);
//     const handleChange = (event: MediaQueryListEvent) => {
//       setMatches(event.matches);
//     };

//     setMatches(mq.matches);

//     // Safari < 14 can't use addEventListener on a MediaQueryList
//     // https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList#Browser_compatibility
//     if (!mq.addEventListener) {
//       // Update the state whenever the media query match state changes
//       mq.addListener(handleChange);

//       // Clean up on unmount and if the query changes
//       return () => {
//         mq.removeListener(handleChange);
//       };
//     }
//     mq.addEventListener("change", handleChange);

//     return () => {
//       mq.removeEventListener("change", handleChange);
//     };
//   }, [query]);

//   return matches;
// }

export default createUseMediaQueryWidth;
