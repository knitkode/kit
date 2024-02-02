/**
 * @file
 *
 * Same as [is-what](https://github.com/mesqueeb/is-what) plus:
 *
 * - `isFormData`
 * - `isInt`
 * - `isFloat`
 */

export type AnyFunction = (...args: any[]) => any;
export type AnyAsyncFunction = (...args: any[]) => Promise<any>;
export type AnyClass = new (...args: any[]) => any;
export type PlainObject = Record<string | number | symbol, any>;

export type TypeGuard<A, B extends A> = (payload: A) => payload is B;

/**
 * Returns the object type of the given payload
 */
export let getType = (payload: any): string =>
  Object.prototype.toString.call(payload).slice(8, -1);
