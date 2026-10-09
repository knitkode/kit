/**
 * Definition of a lib to transform with SWC, it consists of:
 *
 * 1) `path`: the library path e.g. `@/components`
 * 2) `flat` flag: `true` for packages where all consumable exports are at the
 * root level (no exports from nested folders), `false` or `undefined` otherwise
 */
export type SwcTransformingLib = {
  /**
   * e.g. `@myorg/mylib` or `@/myprojectlib`
   */
  path: string;
  /**
   * Pass `true` for packages where all consumable exports are at the root
   * level (no exports from nested folders)
   */
  flat?: boolean;
};

export type SwcTransform<
  Path extends string,
  Flat extends undefined | boolean = false,
> = Record<Path, { transform: `${Path}/{{member}}` }> &
  (Flat extends true
    ? unknown
    : Record<
        `${Path}/(((\\$*\\w*)?/?)*)`,
        { transform: `${Path}/{{ matches.[1] }}/{{member}}` }
      >);

/**
 * @category swc
 *
 * @see {@link https://rregex.dev/ rust regex playground}
 * @param lib The library to transform, see {@link SwcTransformingLib}
 */
export function swcCreateTransform<TLib extends SwcTransformingLib>(lib: TLib) {
  const { path, flat } = lib;
  if (flat) {
    return { [path]: { transform: `${path}/{{member}}` } } as SwcTransform<
      typeof path,
      true
    >;
  }

  return {
    // the root import gets its own key: with an empty sub path the nested
    // template would give `path//member`
    [path]: { transform: `${path}/{{member}}` },
    [`${path}/(((\\$*\\w*)?/?)*)`]: {
      transform: `${path}/{{ matches.[1] }}/{{member}}`,
    },
  } as SwcTransform<typeof path, false>;
}

export default swcCreateTransform;
