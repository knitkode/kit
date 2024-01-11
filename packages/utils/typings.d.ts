/**
 * List here the global variables used by third party scripts supported within
 * the `koine` ecosystem.
 */

// as in type-fest start
type Simplify<T> = { [KeyType in keyof T]: T[KeyType] };
// as in type-fest end

type NotNullProperties<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};

type RequiredNotNullable<T, K extends keyof T> = T &
  Required<NotNullProperties<Pick<T, K>>>;

/**
 * Tweak a model by making some properties required (not `optional` and not `nullable`)
 *
 * This is useful to tweak/correct the types generated from Swagger.
 */
declare type Tweak<
  TModel extends object,
  TRequiredKeys extends keyof TModel | false,
  TReplacements extends Partial<Record<keyof TModel, unknown>> | false,
> = Simplify<
  TReplacements extends Partial<Record<keyof TModel, unknown>>
    ? Omit<RequiredNotNullable<TModel, TRequiredKeys>, keyof TReplacements> &
        TReplacements
    : RequiredNotNullable<TModel, TRequiredKeys>
>;
