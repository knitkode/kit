export declare function swapMap<T extends Record<string, string | number | symbol> = Record<string, string | number | symbol>>(map?: T): Record<T[keyof T], keyof T>;
export default swapMap;
