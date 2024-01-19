export declare function removeDuplicatesByKey<T extends Record<string | number | symbol, any>>(array: T[] | undefined, key: keyof T): T[];
export default removeDuplicatesByKey;
