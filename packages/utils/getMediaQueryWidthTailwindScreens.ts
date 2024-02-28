import {
  type GetMediaQueryWidthResolversBreakpoints,
  getMediaQueryWidthResolvers,
} from "./getMediaQueryWidthResolvers";

/**
 * @category responsive
 * @category tailwind
 */
export let getMediaQueryWidthTailwindScreens = (
  breakpoints: GetMediaQueryWidthResolversBreakpoints,
) => {
  const mqWidthResolvers = getMediaQueryWidthResolvers(breakpoints);
  // Object.keys(breakpoints).reduce((screens, br) => {

  const screens = Object.keys(breakpoints).reduce(
    (output, br, idx) => {
      const brNext = Object.keys(breakpoints)[idx + 1];

      for (const resolverName in mqWidthResolvers) {
        // this line is just for typescript..
        const resolver = resolverName as keyof typeof mqWidthResolvers;
        const resolverFn = mqWidthResolvers[resolver];
        const raw = resolverFn(br);
        if (raw) {
          if (resolverName === "min") {
            output[`@${br}`] = { raw };
          }
          if (resolverName === "between") {
            if (brNext) output[`@${resolverName}-${br}_${brNext}`] = { raw };
          } else {
            output[`@${resolverName}-${br}`] = { raw };
          }
        }
      }
      return output;
    },
    {} as Record<string, { raw: string }>,
  );

  return screens;
};

export default getMediaQueryWidthTailwindScreens;
