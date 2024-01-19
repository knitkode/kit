export declare function objectPick<T extends object, Keys extends (keyof T)[]>(object: T, keys: Keys): Pick<T, Keys[number]>;
export default objectPick;
