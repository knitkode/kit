export declare function forin<T>(object: T, cb: <K extends keyof T>(key: K, value: T[K]) => void): void;
export default forin;
