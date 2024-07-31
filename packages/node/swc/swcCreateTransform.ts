export type SwcTransform<LibName extends string> = Record<
  `${LibName}/?(((\\w*)?/?)*)`,
  {
    transform: `${LibName}/{{ matches.[1] }}/{{member}}`;
  }
>;

/**
 * @category swc
 * @param name e.g. `@myorg/mylib` or `@/myprojectlib`
 * @param flat Pass `true` for packages where all consumable exports are at the
 * root level (no exports from nested folders)
 */
export function swcCreateTransform<T extends string>(name: T, _flat = false) {
  // if (flat) {
  //   return { [name]: { transform: `${name}/{{member}}` } };
  // }

  return {
    [`${name}/?(((\\w*)?/?)*)`]: {
      transform: `${name}/{{ matches.[1] }}/{{member}}`,
    },
  } as SwcTransform<T>;
}

export default swcCreateTransform;
