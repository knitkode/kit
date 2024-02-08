import { isObject } from "./isObject";

type MergeWithDefaults<Defaults, Overrides> = Defaults extends object
  ? Overrides extends object
    ? Defaults & {
        [K in keyof Overrides]: Overrides[K] extends undefined
          ? never
          : K extends keyof Defaults
            ? MergeWithDefaults<Defaults[K], Required<Overrides[K]>>
            : Overrides[K];
      }
    : Overrides extends undefined
      ? Defaults
      : Overrides
  : Overrides extends undefined
    ? Defaults
    : Overrides;

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
export let objectMergeWithDefaults = <T extends object, D extends object>(
  defaults: T,
  overrides?: D,
): MergeWithDefaults<T, D> =>
  overrides === undefined
    ? defaults
    : Object.keys(overrides).reduce(
        (withDefaults, _key) => {
          const keyDefaults = _key as keyof T;
          const keyOverrides = _key as keyof D;
          if (isObject(overrides[keyOverrides])) {
            // if (!defaults[keyDefaults]) {
            //   withDefaults[keyDefaults] = {} as T[keyof T];
            // }
            withDefaults[keyDefaults] = objectMergeWithDefaults(
              defaults[keyDefaults] as unknown as T,
              overrides[keyOverrides] as unknown as T,
            );
          } else {
            withDefaults[keyDefaults] =
              overrides[keyOverrides] === undefined
                ? defaults[keyDefaults]
                : overrides[keyOverrides];
          }
          return withDefaults;
        },
        { ...defaults } as any,
      );
