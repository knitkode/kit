export declare function debounce<T extends (...args: any[]) => any>(fn: T, wait?: number, immediate?: boolean): (this: unknown, ...args: Parameters<T>) => void;
export default debounce;
