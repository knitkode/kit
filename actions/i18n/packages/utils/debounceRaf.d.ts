export declare function debounceRaf<T extends (...args: any[]) => any>(this: unknown, fn: T): (this: unknown, ...args: Parameters<T>) => void;
export default debounceRaf;
