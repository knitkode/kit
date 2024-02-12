/**
 * List here the global variables used by third party scripts supported within
 * the `koine` ecosystem.
 */

declare type AssertTrue<T extends true> = T;

// as in type-fest start
declare type Simplify<T> = { [KeyType in keyof T]: T[KeyType] };
// as in type-fest end

/**
 * Tweak a model by making some properties required (not `optional` and not `nullable`)
 *
 * This is useful to tweak/correct the types generated from Swagger.
 */
declare type Tweak<
  TModel extends object,
  TRequiredKeys extends keyof TModel | never,
  TReplacements extends Partial<Record<keyof TModel, unknown>> | false = false,
> = TReplacements extends false
  ? Simplify<
      Omit<TModel, TRequiredKeys> &
        Required<{
          [K in TRequiredKeys]: NonNullable<TModel[K]>;
        }>
    >
  : Simplify<
      Omit<
        Omit<TModel, TRequiredKeys> &
          Required<{
            [K in TRequiredKeys]: NonNullable<TModel[K]>;
          }>,
        keyof TReplacements
      > &
        TReplacements
    >;
