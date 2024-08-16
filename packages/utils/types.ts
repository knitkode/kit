import type { Replace } from "type-fest";

// export type AssertTrue<T extends true> = T;

/**
 * Type to test types
 *
 * @example
 *
 * ```ts
 * type _Test = TestType<
 *   A extends B ? true : false,
 *   A & { intruder: 1 } extends B ? false : true
 * >;
 * // or, if you want to skip the wrong implementation test, simply
 * type _Test = TestType<A extends B ? true : false>;
 * ```
 */
export type TestType<
  RightImplementation extends true,
  WrongImplementation extends true = true,
> = RightImplementation | WrongImplementation;

/**
 * Whatever that in javascript returns `false` when checked in an `if` condition
 */
export type AnythingFalsy = null | undefined | 0 | "";

/**
 * Flatten an object bringing the first depth-level of properties to the object
 * root.
 *
 * @borrows [SO' answer by jcalz](https://stackoverflow.com/a/78779784/1938970)
 */
export type FlatObjectFirstLevel<T extends object> =
  { [K in keyof T]: (x: T[K]) => void } extends Record<
    keyof T,
    (x: infer I) => void
  >
    ? { [K in keyof I]: I[K] }
    : never;

/**
 * Pick the keys of an object `T` that starts with `S`. It produces a mapped type
 * with a subset of `T` whose keys start with `S`.
 */
export type PickStartsWith<T extends object, S extends string> = {
  [K in keyof T as K extends `${S}${string}` ? K : never]: T[K];
};

/**
 * Returns a union of all the keys of an object `T` which starts with `S`.
 */
export type KeysStartsWith<
  T extends object,
  S extends string,
> = keyof PickStartsWith<T, S>;

/**
 * Pick the keys of an object `T` that starts with `S`. It produces a mapped type
 * with a subset of `T` whose keys start with `S` *and have `S`* removed.
 */
export type PickStartsWithTails<T extends object, S extends string> = {
  [K in keyof T as K extends `${S}${string}` ? Replace<K, S, ""> : never]: T[K];
};

/**
 * Returns a union of all the keys of an object `T` which starts with `S`.
 * The strings in the produced union *have `S` removed*.
 */
export type KeysTailsStartsWith<
  T extends object,
  S extends string,
> = keyof PickStartsWithTails<T, S>;

/**
 * @borrows [SO's answer by 钵钵鸡实力代购](https://stackoverflow.com/a/64994122/1938970)
 */
export type Reverse<Tuple> = Tuple extends [infer Head, ...infer Rest]
  ? [...Reverse<Rest>, Head]
  : [];

// /**
//  * @category object
//  */
// export type ObjectHasKeys<
//   Source extends object,
//   Union,
// > = Union extends keyof Source ? true : false;

// /**
//  * @category object
//  */
// export type ObjectHasAllKeys<
//   Source extends object,
//   Union,
// > = keyof Source extends Union
//   ? Union extends keyof Source
//     ? true
//     : false
//   : false;

// /**
//  * @category object
//  */
// export type ObjectFilterValues<T extends object, Value> = {
//   [Key in ObjectFilterKeys<T, Value>]: T[Key];
// };

// /**
//  * @category object
//  */
// export type ObjectFilterKeys<T extends object, Value> = {
//   [Key in keyof T]: T[Key] extends Value ? Key : never;
// }[keyof T];
