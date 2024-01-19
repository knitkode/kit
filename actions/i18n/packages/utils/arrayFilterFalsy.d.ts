export declare function arrayFilterFalsy<T extends unknown[]>(list?: null | T): Exclude<NonNullable<T>[number], false | "" | 0 | undefined>[];
export default arrayFilterFalsy;
