import type { PlainObject } from "./getType";
import { isObject } from "./isObject";

type GetObjectKeys<T, DeleteIfNull extends boolean = false> = keyof {
  [K in keyof T as DeleteIfNull extends true
    ? T[K] extends null
      ? never
      : K
    : K]: T[K];
};

export type ObjectMergeWithDefaults<
  Defaults,
  Overrides,
  DeleteIfNull extends boolean = false,
> = Overrides extends undefined
  ? Defaults
  : Overrides extends PlainObject
    ? {
        [K in GetObjectKeys<
          Overrides,
          DeleteIfNull
        >]-?: Overrides[K] extends undefined
          ? K extends keyof Defaults
            ? Defaults[K]
            : never
          : K extends keyof Defaults
            ? ObjectMergeWithDefaults<Defaults[K], Overrides[K], DeleteIfNull>
            : Overrides[K];
      } & (Defaults extends PlainObject
        ? {
            [K in Exclude<keyof Defaults, keyof Overrides>]: Defaults[K];
          }
        : Defaults)
    : Defaults;

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
// TODO: check https://github.com/unjs/defu more sophisticated implementation
export let objectMergeWithDefaults = <
  D extends PlainObject,
  O extends PlainObject,
  DeleteIfNull extends boolean,
>(
  defaults: D,
  overrides?: O,
  deleteKeyIfNull?: DeleteIfNull,
): ObjectMergeWithDefaults<D, O, DeleteIfNull> =>
  overrides
    ? Object.keys(overrides).reduce(
        (result, _key) => {
          const keyDefaults = _key as Extract<keyof D, string>;
          const keyOverrides = _key as Extract<keyof O, string>;
          if (deleteKeyIfNull && overrides[keyOverrides] === null) {
            delete result[keyDefaults];
          } else if (isObject(overrides[keyOverrides])) {
            if (!defaults[keyDefaults]) {
              defaults[keyDefaults] = {} as any;
            }
            result[keyDefaults] = objectMergeWithDefaults(
              defaults[keyDefaults] as D,
              overrides[keyOverrides] as O,
              deleteKeyIfNull,
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

export default objectMergeWithDefaults;
