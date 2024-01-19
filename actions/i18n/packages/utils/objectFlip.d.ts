export declare function objectFlip<T extends PropertyKey, U extends PropertyKey>(input: Record<T, U>, keyTransformer?: (key: string) => T): Record<U, T>;
export default objectFlip;
