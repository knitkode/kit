import type { Simplify } from "type-fest";
import type { PlainObject } from "./getType";
import { isObject } from "./isObject";

export type ObjectMergeWithDefaults<Defaults, Overrides> = Simplify<
  Overrides extends undefined
    ? Defaults
    : Overrides extends PlainObject
      ? {
          [K in keyof Overrides]-?: Overrides[K] extends undefined
            ? K extends keyof Defaults
              ? Defaults[K]
              : never
            : K extends keyof Defaults
              ? ObjectMergeWithDefaults<Defaults[K], Overrides[K]>
              : Overrides[K];
        } /*  & (Defaults extends PlainObject
          ? {
              [K in Exclude<keyof Defaults, keyof Overrides>]: Defaults[K];
            }
          : Defaults) */
      : Overrides
>;

/**
 * Merge object _overrides_ onto object _defaults_, immutably
 *
 * Simple object merging utility, by design:
 * - no `array` support
 * - `undefined` values do not override default values, a.k.a. it makes it harder
 * to remove a property defined on the defaults
 *
 * @category object
 */
export let objectMergeWithDefaults = <
  D extends PlainObject,
  O extends PlainObject,
>(
  defaults: D,
  overrides?: O,
): ObjectMergeWithDefaults<D, O> =>
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
            result[keyDefaults] =
              overrides[keyOverrides] === undefined
                ? defaults[keyDefaults]
                : overrides[keyOverrides];
          }
          return result;
        },
        { ...defaults } as any,
      )
    : defaults;
