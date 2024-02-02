/**
 * @category responsive
 */
export type GetMediaQueryWidthResolversBreakpoints = Record<string, number>;

/**
 * @category responsive
 */
export let getMediaQueryWidthResolvers = <
  TBreakpointsConfig extends GetMediaQueryWidthResolversBreakpoints,
>(
  customBreakpoints: TBreakpointsConfig,
) => {
  type Breakpoint = Extract<keyof TBreakpointsConfig, string>;

  const breakpoints = {
    xs: 0,
    ...customBreakpoints,
  } as TBreakpointsConfig;

  const sortedBreakpointsNames = (
    Object.keys(breakpoints).map((key) => {
      const br = key as Breakpoint;
      return [br, breakpoints[br]];
    }) as [Breakpoint, number][]
  )
    .sort((a, b) => a[1] - b[1])
    .map((item) => item[0]);

  const getNextBreakpoint = (breakpoint: Breakpoint) => {
    const index = sortedBreakpointsNames.indexOf(breakpoint);
    return sortedBreakpointsNames[index + 1];
  };

  /**
   * It behaves the same as `(min-width: ${value}px)`
   * where value is the given breakpoint value.
   * For ease of use this can be used both as a function `min("md")` and as an
   * object literal `min.md`.
   */
  const min = (br: Breakpoint) => `(min-width: ${breakpoints[br]}px)`;

  /**
   * It behaves the same as `(max-width: ${value}px)`
   * where value is the given breakpoint value.
   * For ease of use this can be used both as a function `max("md")` and as an
   * object literal `max.md`.
   */
  const max = (br: Breakpoint) => `(max-width: ${breakpoints[br] - 0.02}px)`;

  /**
   * It behaves the same as `min`
   * @inheritdoc {max}
   */
  const up = min;

  /**
   * It behaves similarly to `max` but you will use the "next" breakpoint,
   * specifying CSS that will apply from the given breakpoint and down.
   */
  const down = (br: Breakpoint) => {
    const brNext = getNextBreakpoint(br);
    // TODO: if br does not exists otherwise throw Error
    return brNext && `(max-width: ${breakpoints[brNext] - 0.02}px)`;
  };

  /**
   * Media query between the two given breakpoints
   */
  const between = (br1: Breakpoint, br2?: Breakpoint) => {
    br2 = br2 || getNextBreakpoint(br1);

    return br2
      ? `(min-width: ${breakpoints[br1]}px) and (max-width: ${
          breakpoints[br2] - 0.02
        }px)`
      : min(br1);
  };

  /**
   * Media query to apply from the given breakpoint until the next, just for its
   * full range
   */
  const only = (br: Breakpoint) => {
    const brNext = getNextBreakpoint(br);
    return brNext ? between(br, brNext) : min(br);
  };

  return {
    max,
    min,
    down,
    up,
    between,
    only,
  };
};
