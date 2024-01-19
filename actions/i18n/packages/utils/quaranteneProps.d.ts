export declare function quaranteneProps<TProps extends Record<never, never>, TSupectPropsKeys extends QuaranteneProps<TProps>>(props: TProps, propsKeysToQuarantene: TSupectPropsKeys): Omit<TProps, TSupectPropsKeys[number]> & {
    _: Pick<TProps, TSupectPropsKeys[number]>;
};
export default quaranteneProps;
type QuaranteneProps<TProps extends Record<never, never>> = readonly (keyof {
    [K in keyof TProps]?: TProps[K];
})[];
