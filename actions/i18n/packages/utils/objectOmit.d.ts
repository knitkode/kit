export declare function objectOmit<T extends object, Keys extends (keyof T)[]>(object: T, keys: Keys): Omit<T, Keys[number]>;
export default objectOmit;
