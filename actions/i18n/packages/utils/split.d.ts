export type Split<S extends string, D extends string> = string extends S ? string[] : S extends "" ? [] : S extends `${infer T}${D}${infer U}` ? [T, ...Split<U, D>] : [S];
export declare const split: <T extends string, D extends string>(string: T, delimiter: D) => Split<T, D>;
export default split;
