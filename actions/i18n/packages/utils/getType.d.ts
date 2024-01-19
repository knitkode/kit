export type AnyFunction = (...args: any[]) => any;
export type AnyAsyncFunction = (...args: any[]) => Promise<any>;
export type AnyClass = new (...args: any[]) => any;
export type PlainObject = Record<string | number | symbol, any>;
export type TypeGuard<A, B extends A> = (payload: A) => payload is B;
export declare function getType(payload: any): string;
export default getType;
