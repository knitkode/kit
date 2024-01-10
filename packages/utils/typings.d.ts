/**
 * List here the global variables used by third party scripts supported within
 * the `koine` ecosystem.
 */
/**
 * List here the global variables used by third party scripts supported within
 * the `koine` ecosystem.
 */

// as in type-fest start
type Simplify<T> = { [KeyType in keyof T]: T[KeyType] };
type IsEqual<A, B> = (<G>() => G extends A ? 1 : 2) extends <G>() => G extends B
  ? 1
  : 2
  ? true
  : false;
type Filter<KeyType, ExcludeType> = IsEqual<KeyType, ExcludeType> extends true
  ? never
  : KeyType extends ExcludeType
    ? never
    : KeyType;
type Except<ObjectType, KeysType extends keyof ObjectType> = {
  [KeyType in keyof ObjectType as Filter<
    KeyType,
    KeysType
  >]: ObjectType[KeyType];
};
// as in type-fest end

/**
 * Tweak a model by making some properties required (not `optional` and not `nullable`)
 *
 * This is useful to tweak/correct the types generated from Swagger.
 */
declare type Tweak<
  TModel extends object,
  TRequiredKeys extends keyof TModel | false,
  TReplacements extends Partial<Record<keyof TModel, unknown>> | false = false,
> = TReplacements extends false
  ? Simplify<
      TRequiredKeys extends false
        ? TModel
        : Except<TModel, TRequiredKeys> &
            Required<{
              [K in TRequiredKeys]: NonNullable<TModel[K]>;
            }>
    >
  : Simplify<
      TRequiredKeys extends false
        ? TModel & TReplacements
        : Omit<
            Except<TModel, TRequiredKeys> &
              Required<{
                [K in TRequiredKeys]: NonNullable<TModel[K]>;
              }>,
            keyof TReplacements
          > &
            TReplacements
    >;
