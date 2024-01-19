// import type { Replace } from "@koine/utils";
import type { Replace } from "type-fest";

/**
 * Whatever that in javascript returns `false` when checked in an `if` condition
 */
export type AnythingFalsy = null | undefined | 0 | "";

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
