/// <reference types="node" />
export declare function throttle<TFn extends Function, TContext>(fn: TFn, limit: number, context?: TContext): (this: TContext, ...args: any[]) => NodeJS.Timeout | undefined;
export default throttle;
