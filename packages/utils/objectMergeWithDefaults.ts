import type { PlainObject } from "./getType";
import { isObject } from "./isObject";

export type ObjectMergeWithDefaults<
  Defaults,
  Overrides,
  DeleteIfNull extends boolean = false,
> = Overrides extends undefined
  ? Defaults
  : Overrides extends PlainObject
    ? {
        [K in keyof Overrides]-?: Overrides[K] extends undefined | null
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
 * - `undefined` and `null` values do not override default values, a.k.a. it
 * makes it harder to remove a property defined on the defaults
 *
 * @category object
 * @param defaults
 * @param overrides
 */
// TODO: check https://github.com/unjs/defu more sophisticated implementation
export let objectMergeWithDefaults = <
  D extends PlainObject,
  O extends PlainObject,
  DeleteIfNull extends boolean,
>(
  defaults: D,
  overrides?: O,
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
            result[keyDefaults] =
              overrides[keyOverrides] === undefined ||
              overrides[keyOverrides] === null
                ? defaults[keyDefaults]
                : overrides[keyOverrides];
          }
          return result;
        },
        { ...defaults } as any,
      )
    : defaults;

export default objectMergeWithDefaults;
