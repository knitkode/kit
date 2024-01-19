import type { Replace } from "type-fest";
export type AnythingFalsy = null | undefined | 0 | "";
export type PickStartsWith<T extends object, S extends string> = {
    [K in keyof T as K extends `${S}${string}` ? K : never]: T[K];
};
export type KeysStartsWith<T extends object, S extends string> = keyof PickStartsWith<T, S>;
export type PickStartsWithTails<T extends object, S extends string> = {
    [K in keyof T as K extends `${S}${string}` ? Replace<K, S, ""> : never]: T[K];
};
export type KeysTailsStartsWith<T extends object, S extends string> = keyof PickStartsWithTails<T, S>;
