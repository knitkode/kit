import type { Replace, Simplify, Exact } from "type-fest";

// export type AssertTrue<T extends true> = T;

/**
 * Chceck that a type is exactly as another type
 */
export type ExactlyAs<Type> = ReturnType<
  <T extends Exact<Type, T>>(values: T) => T
>;

/**
 * Type to test types
 *
 * @category type
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
 *
 * @category type
 */
export type AnythingFalsy = null | undefined | 0 | "";

/**
 * Flatten an object bringing the first depth-level of properties to the object
 * root.
 *
 * @borrows [SO' answer by jcalz](https://stackoverflow.com/a/78779784/1938970)
 * @category type
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
 *
 * @category type
 */
export type PickStartsWith<T extends object, S extends string> = {
  [K in keyof T as K extends `${S}${string}` ? K : never]: T[K];
};

/**
 * Returns a union of all the keys of an object `T` which starts with `S`.
 *
 * @category type
 */
export type KeysStartsWith<
  T extends object,
  S extends string,
> = keyof PickStartsWith<T, S>;

/**
 * Pick the keys of an object `T` that starts with `S`. It produces a mapped type
 * with a subset of `T` whose keys start with `S` *and have `S`* removed.
 *
 * @category type
 */
export type PickStartsWithTails<T extends object, S extends string> = {
  [K in keyof T as K extends `${S}${string}` ? Replace<K, S, ""> : never]: T[K];
};

/**
 * Returns a union of all the keys of an object `T` which starts with `S`.
 * The strings in the produced union *have `S` removed*.
 *
 * @category type
 */
export type KeysTailsStartsWith<
  T extends object,
  S extends string,
> = keyof PickStartsWithTails<T, S>;

/**
 * @borrows [Matt Pocock's _Get Keys of an Object Where Values Are of a Given Type_](https://www.totaltypescript.com/get-keys-of-an-object-where-values-are-of-a-given-type)
 * @category type
 */
export type KeysOfValue<T, TCondition> = {
  [K in keyof T]: T[K] extends TCondition ? K : never;
}[keyof T];

/**
 * @borrows [SO's answer by 钵钵鸡实力代购](https://stackoverflow.com/a/64994122/1938970)
 */
export type Reverse<Tuple> = Tuple extends [infer Head, ...infer Rest]
  ? [...Reverse<Rest>, Head]
  : [];

/**
 * Make _nullable_ all properties of objec T (deeply)
 * @use `{ key: $ | null }`
 *
 * @category type
 */
export type NullableObjectDeep<T extends object> = {
  [K in keyof T]: T[K] extends object
    ? NullableObjectDeep<T[K]> | null
    : T[K] | null;
};

/**
 * Make _non nullable_ all properties of objec T (deeply)
 * @use `{ key: NonNullable<$> }`
 *
 * @category type
 */
export type NonNullableObjectDeep<T extends object> = {
  [K in keyof T]: T[K] extends object
    ? NonNullableObjectDeep<NonNullable<T[K]>>
    : NonNullable<T[K]>;
};

/**
 * Make _required_ all properties of objec T (deeply)
 * @use `{ key-?: Exclude<$, undefined> }`
 *
 * @category type
 */
export type RequiredObjectDeep<T extends object> = Simplify<{
  [K in keyof T]-?: T[K] extends object
    ? Exclude<RequiredObjectDeep<T[K]>, undefined>
    : Exclude<T[K], undefined>;
}>;

/**
 * Make _required_ and _non nullable_ all properties of objec T (deeply)
 * @use `{ key-?: NonNullable<$> }`
 *
 * @category type
 */
export type RequiredNonNullableObjectDeep<T extends object> = Simplify<{
  [K in keyof T]-?: T[K] extends object
    ? NonNullable<RequiredNonNullableObjectDeep<T[K]>>
    : NonNullable<T[K]>;
}>;

/**
 * Construct a type with the properties of T except for those whose value is `never`
 * 
 * @category type
 * 
@example
```ts
type A = OmitNever<"a" | never>; // A = "a"
type B = OmitNever<{ a: never; b: 1 }> // B = { b: 1; }
```
 */
export type OmitNever<T> = {
  [K in keyof T as T[K] extends never ? never : K]: T[K];
};

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

export type OverloadsToTuple<T> = OverloadsToTuple5<T>;

// prettier-ignore
type OverloadsToTuple5<T> = T extends { (...args: infer P1): infer R1; (...args: infer P2): infer R2; (...args: infer P3): infer R3; (...args: infer P4): infer R4; (...args: infer P5): infer R5; } ? [(...args: P1) => R1, (...args: P2) => R2, (...args: P3) => R3, (...args: P4) => R4, (...args: P5) => R5] : OverloadsToTuple4<T>;
// prettier-ignore
type OverloadsToTuple4<T> = T extends { (...args: infer P1): infer R1; (...args: infer P2): infer R2; (...args: infer P3): infer R3; (...args: infer P4): infer R4; } ? [(...args: P1) => R1, (...args: P2) => R2, (...args: P3) => R3, (...args: P4) => R4] : OverloadsToTuple3<T>;
// prettier-ignore
type OverloadsToTuple3<T> = T extends { (...args: infer P1): infer R1; (...args: infer P2): infer R2; (...args: infer P3): infer R3; } ? [(...args: P1) => R1, (...args: P2) => R2, (...args: P3) => R3] : OverloadsToTuple2<T>;
// prettier-ignore
type OverloadsToTuple2<T> = T extends { (...args: infer P1): infer R1; (...args: infer P2): infer R2; } ? [(...args: P1) => R1, (...args: P2) => R2] : OverloadsToTuple1<T>;
// prettier-ignore
type OverloadsToTuple1<T> = T extends { (...args: infer P1): infer R1; } ? [(...args: P1) => R1] : never;
