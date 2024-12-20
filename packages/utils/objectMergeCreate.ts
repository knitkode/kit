import { isPlainObject } from "./isPlainObject";

/**
 * @borrows [unjs/defu](https://github.com/unjs/defu)
 */
export type ObjectMerge<
  S extends Input,
  D extends Array<Input | IgnoredInput>,
> = D extends [infer F, ...infer Rest]
  ? F extends Input
    ? Rest extends Array<Input | IgnoredInput>
      ? ObjectMerge<MergeObjects<S, F>, Rest>
      : MergeObjects<S, F>
    : F extends IgnoredInput
      ? Rest extends Array<Input | IgnoredInput>
        ? ObjectMerge<S, Rest>
        : S
      : S
  : S;

/**
 * @borrows [unjs/defu](https://github.com/unjs/defu)
 */
export interface ObjectMergeInstance {
  <Source extends Input, Defaults extends Array<Input | IgnoredInput>>(
    source: Source | IgnoredInput,
    ...defaults: Defaults
  ): ObjectMerge<Source, Defaults>;
  fn: ObjectMergeFunction;
  arrayFn: ObjectMergeFunction;
  extend(merger?: Merger): ObjectMergeFunction;
}

type ObjectMergeFunction = <
  Source extends Input,
  Defaults extends Array<Input | IgnoredInput>,
>(
  source: Source,
  ...defaults: Defaults
) => ObjectMerge<Source, Defaults>;

type Input = Record<string | number | symbol, any>;

type IgnoredInput =
  | boolean
  | number
  | null
  | any[]
  | Record<never, any>
  | undefined;

type Merger = <T extends Input, K extends keyof T>(
  object: T,
  key: keyof T,
  value: T[K],
  namespace: string,
) => any;

type nullish = null | undefined | void;

type MergeObjects<
  Destination extends Input,
  Defaults extends Input,
> = Destination extends Defaults
  ? Destination
  : Omit<Destination, keyof Destination & keyof Defaults> &
      Omit<Defaults, keyof Destination & keyof Defaults> & {
        -readonly [Key in keyof Destination &
          keyof Defaults]: Destination[Key] extends nullish
          ? Defaults[Key] extends nullish
            ? nullish
            : Defaults[Key]
          : Defaults[Key] extends nullish
            ? Destination[Key]
            : Merge<Destination[Key], Defaults[Key]>; // eslint-disable-line no-use-before-define
      };

type MergeArrays<Destination, Source> =
  Destination extends Array<infer DestinationType>
    ? Source extends Array<infer SourceType>
      ? Array<DestinationType | SourceType>
      : Source | Array<DestinationType>
    : Source | Destination;

type Merge<Destination extends Input, Defaults extends Input> =
  // Remove explicitly null types
  Destination extends nullish
    ? Defaults extends nullish
      ? nullish
      : Defaults
    : Defaults extends nullish
      ? Destination
      : // Handle arrays
        Destination extends Array<any>
        ? Defaults extends Array<any>
          ? MergeArrays<Destination, Defaults>
          : Destination | Defaults
        : // Don't attempt to merge Functions, RegExps, Promises
          Destination extends Function
          ? Destination | Defaults
          : Destination extends RegExp
            ? Destination | Defaults
            : Destination extends Promise<any>
              ? Destination | Defaults
              : // Don't attempt to merge Functions, RegExps, Promises
                Defaults extends Function
                ? Destination | Defaults
                : Defaults extends RegExp
                  ? Destination | Defaults
                  : Defaults extends Promise<any>
                    ? Destination | Defaults
                    : // Ensure we only merge Records
                      Destination extends Input
                      ? Defaults extends Input
                        ? MergeObjects<Destination, Defaults>
                        : Destination | Defaults
                      : Destination | Defaults;

// Base function to apply defaults
function _objectMerge<T>(
  baseObject: T,
  defaults: any,
  namespace = ".",
  merger?: Merger,
): T {
  if (!isPlainObject(defaults)) {
    return _objectMerge(baseObject, {}, namespace, merger);
  }

  const object = Object.assign({}, defaults);

  for (const key in baseObject) {
    if (key === "__proto__" || key === "constructor") {
      continue;
    }

    const value = baseObject[key];

    if (value === null || value === undefined) {
      continue;
    }

    if (merger && merger(object, key, value, namespace)) {
      continue;
    }

    if (Array.isArray(value) && Array.isArray(object[key])) {
      object[key] = [...value, ...object[key]];
    } else if (isPlainObject(value) && isPlainObject(object[key])) {
      object[key] = _objectMerge(
        value,
        object[key],
        (namespace ? `${namespace}.` : "") + key.toString(),
        merger,
      );
    } else {
      object[key] = value;
    }
  }

  return object;
}

/**
 * Create wrapper with optional merger and multi arg support
 *
 * @borrows [unjs/defu](https://github.com/unjs/defu)
 */
export function objectMergeCreate(merger?: Merger): ObjectMergeFunction {
  return (...args: any[]) =>
    args.reduce((p, c) => _objectMerge(p, c, "", merger), {} as any);
}

export default objectMergeCreate;
