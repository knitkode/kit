import type { MergeDeep, SimplifyDeep } from "type-fest";
import type { PlainObject } from "./getType";
import { isObject } from "./isObject";

type PrepareMergeableObject<
  Source extends PlainObject,
  WhereToCheckValues extends PlainObject,
  ExcludeType = never,
> = {
  [K in Extract<keyof Source, string> as NonNullable<Source[K]> extends never
    ? never
    : K extends keyof WhereToCheckValues
      ? WhereToCheckValues[K] extends ExcludeType | never
        ? never
        : K
      : K]-?: Exclude<Source[K], undefined> extends infer NewSource
    ? NewSource extends Array<any> | Readonly<Array<any>>
      ? NewSource
      : NewSource extends PlainObject
        ? NonNullable<WhereToCheckValues[K]> extends PlainObject
          ? PrepareMergeableObject<
              NewSource,
              WhereToCheckValues[K],
              ExcludeType
            >
          : PrepareMergeableObject<NewSource, {}>
        : NewSource
    : never;
} extends infer O
  ? O
  : never;

// type X = PrepareMergeableObject<{ a: ["a1"]; }, {}>;

// type X = PrepareMergeableObject<
//   PartialDeep<{
//     a?: "a1";
//     b?: null;
//     c?: string | undefined;
//     d: { da: ["da"]; db: "db" };
//     e: { ea: "ea" };
//   }>,
//   { a: null },
//   null | undefined
// >;

/**
 * Type representation of {@link objectMergeWithDefaults}
 */
export type ObjectMergeWithDefaults<
  Defaults extends PlainObject,
  Overrides extends PlainObject,
  DeleteIfNull extends boolean = false,
> = SimplifyDeep<
  MergeDeep<
    // we apply here the removal of keys defined as null on the Overrides
    DeleteIfNull extends true
      ? PrepareMergeableObject<Defaults, Overrides, null>
      : Defaults,
    // and here we just clean up all null and undefined values
    PrepareMergeableObject<Overrides, Overrides, null | undefined>
  >
>;

// type a = ObjectMergeWithDefaults<
//   { a: "a"; b?: "b" },
//   { a: "a1"; b: null | "b1" | "b2" }
// >;
// type b = ObjectMergeWithDefaults<
//   { a: "a"; b: "b"; c: { ca: "ca"; cb: "cb" } },
//   PartialDeep<{ a?: "a1"; b?: null; c: { ca?: "ca"; cb: null } }>,
//   true
// >;
// type c = ObjectMergeWithDefaults<
//   { a: "a"; b: "b"; c: { ca: "ca"; cb: "cb" }; d: "d" },
//   PartialDeep<{ a?: "a1"; b?: null; c?: string | undefined; d: { da: ["da"] } }>
// >;
// type d = ObjectMergeWithDefaults<
//   { a: readonly ["a1"] },
//   { a: readonly ["a2"] }
// >;

/**
 * Merge object _overrides_ onto object _defaults_, immutably
 *
 * Simple object merging utility, by design:
 * - no `array` support
 * - `undefined` and `null` values do not override default values, a.k.a. it
 * makes it harder to remove a property defined on the defaults
 *
 * @category object
 * @param defaults The default values
 * @param overrides The values to override and/or extend the defaults
 * @param deleteIfNull When `true` the overrides' object keys whose value is an explicit `null` will delete the keys of the output merge object
 */
export let objectMergeWithDefaults = <
  D extends PlainObject,
  O extends PlainObject,
  DeleteIfNull extends boolean = false,
>(
  defaults: D,
  overrides?: O,
  deleteIfNull?: DeleteIfNull,
): ObjectMergeWithDefaults<D, O, DeleteIfNull> =>
  overrides
    ? Object.keys(overrides).reduce(
        (result, _key) => {
          const keyDefaults = _key as Extract<keyof D, string>;
          const keyOverrides = _key as Extract<keyof O, string>;

          if (isObject(overrides[keyOverrides])) {
            if (!defaults[keyDefaults]) {
              defaults[keyDefaults] = {} as any;
            }
            result[keyDefaults] = objectMergeWithDefaults(
              defaults[keyDefaults] as D,
              overrides[keyOverrides] as O,
            );
          } else {
            const overrideValue = overrides[keyOverrides];
            if (overrideValue === null && deleteIfNull) {
              delete result[keyDefaults];
            } else {
              result[keyDefaults] =
                overrideValue === undefined || overrideValue === null
                  ? defaults[keyDefaults]
                  : overrideValue;
            }
          }
          return result;
        },
        { ...defaults } as any,
      )
    : defaults;

export default objectMergeWithDefaults;
