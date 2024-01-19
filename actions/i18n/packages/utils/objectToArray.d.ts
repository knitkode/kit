export declare const objectToArray: <T extends object, R>(obj: T, iterator: (key: keyof T, index: number) => R) => R[];
export default objectToArray;
