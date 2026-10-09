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
> = Record<
  `${Path}/?(((\\$*\\w*)?/?)*)`,
  {
    transform: Flat extends true
      ? `${Path}/{{member}}`
      : `${Path}/{{ matches.[1] }}/{{member}}`;
  }
>;

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
    [`${path}/?(((\\$*\\w*)?/?)*)`]: {
      transform: `${path}/{{ matches.[1] }}/{{member}}`,
    },
  } as SwcTransform<typeof path, false>;
}

export default swcCreateTransform;
