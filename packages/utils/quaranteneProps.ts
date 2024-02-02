/**
 * @category impl
 * @example
 *
 * ```ts
 * const { _: { onKeyDown }, myOwnProp, ...rest } = quaranteneProps([
 *   "onPointerLeave",
 *   "onPointerMove",
 *   "onClick",
 *   "onPointerDown",
 *   "onPointerUp",
 *   "onKeyDown",
 * ]);
 * ```
 */
export let quaranteneProps = <
  TProps extends Record<never, never>,
  TSupectPropsKeys extends QuaranteneProps<TProps>,
>(
  props: TProps,
  propsKeysToQuarantene: TSupectPropsKeys,
) => {
  // approach 1)
  const healthyProps = {
    _: {},
  } as Omit<TProps, TSupectPropsKeys[number]> & {
    _: Pick<TProps, TSupectPropsKeys[number]>;
  };

  for (const key in props) {
    const prop = props[key];
    if (propsKeysToQuarantene.includes(key)) {
      healthyProps._[key] = prop;
    } else {
      // @ts-expect-error nevermind
      healthyProps[key] = prop;
    }
  }

  return healthyProps;
};

// for these types see https://stackoverflow.com/a/65673414/1938970
// type HomomorphicProps<TProps extends Record<never, never>> = {
//   [K in keyof TProps]: TProps[K];
// };
// type HomomorphicPropsPartial<TProps extends Record<never, never>> = {
//   [K in keyof TProps]?: TProps[K];
// };
// type AlternativeOmit<T, K extends PropertyKey> = {
//   [P in keyof T as Exclude<P, K>]: T[P];
// };
// type QuaranteneProps<TProps extends Record<never, never>> =
//   readonly (keyof Partial<TProps>)[];
type QuaranteneProps<TProps extends Record<never, never>> = readonly (keyof {
  [K in keyof TProps]?: TProps[K];
})[];
