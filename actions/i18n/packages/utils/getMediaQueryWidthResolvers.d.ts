export type GetMediaQueryWidthResolversBreakpoints = Record<string, number>;
export declare function getMediaQueryWidthResolvers<TBreakpointsConfig extends GetMediaQueryWidthResolversBreakpoints>(customBreakpoints: TBreakpointsConfig): {
    max: (br: Extract<keyof TBreakpointsConfig, string>) => string;
    min: (br: Extract<keyof TBreakpointsConfig, string>) => string;
    down: (br: Extract<keyof TBreakpointsConfig, string>) => string;
    up: (br: Extract<keyof TBreakpointsConfig, string>) => string;
    between: (br1: Extract<keyof TBreakpointsConfig, string>, br2?: Extract<keyof TBreakpointsConfig, string> | undefined) => string;
    only: (br: Extract<keyof TBreakpointsConfig, string>) => string;
};
export default getMediaQueryWidthResolvers;
