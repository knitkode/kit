export type DebounceOptions<Result> = {
    isImmediate?: boolean;
    maxWait?: number;
    callback?: (data: Result) => void;
};
export interface DebouncedFunction<Args extends any[], F extends (...args: Args) => any> {
    (this: ThisParameterType<F>, ...args: Args & Parameters<F>): Promise<ReturnType<F>>;
    cancel: (reason?: any) => void;
}
export declare function debouncePromise<Args extends any[], F extends (...args: Args) => any>(func: F, waitMilliseconds?: number, options?: DebounceOptions<ReturnType<F>>): DebouncedFunction<Args, F>;
export default debouncePromise;
