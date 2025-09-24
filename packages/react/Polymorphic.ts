import type { JSX } from "react";

/**
 * React Polymorphic components type utilities
 *
 * @resources
 * - [Polymorphic types from Radix UI in Wanda System](https://github.com/wonderflow-bv/wanda/blob/main/packages/react-components/src/types/polymorphic/index.ts)
 * - [TypeScript + React: Typing Generic forwardRefs](https://fettblog.eu/typescript-react-generic-forward-refs/)
 * - [React with Typescript -- Generics while using React.forwardRef](https://stackoverflow.com/a/58473012/1938970)
 * - [How to write a generic that extracts the prop types of the component that passed in](https://stackoverflow.com/a/57846897/1938970)
 * - [React TS Generic component to pass generic props to children](https://stackoverflow.com/a/68442669/1938970)
 * - [About custom ref prop](https://gist.github.com/gaearon/1a018a023347fe1c2476073330cc5509)
 * - [forwardRef performance](https://github.com/facebook/react/issues/13456)
 * - [React docs: Exposing DOM Refs to Parent Components](https://github.com/facebook/react/issues/13456)
 */

export namespace Polymorphic {
  type Merge<P1 = Record<string, never>, P2 = Record<string, never>> = Omit<
    P1,
    keyof P2
  > &
    P2;

  type ComponentTypes =
    | React.ComponentClass<any>
    | React.FunctionComponent<any>
    | keyof JSX.IntrinsicElements;

  type InferProps<TComponent extends ComponentTypes> =
    TComponent extends React.ComponentClass<infer Props>
      ? Props
      : TComponent extends React.FunctionComponent<infer Props>
        ? Props
        : TComponent extends React.ForwardRefExoticComponent<infer Props>
          ? Props
          : TComponent extends keyof JSX.IntrinsicElements
            ? React.ComponentPropsWithoutRef<TComponent>
            : never;

  type AsProp<TComponent extends React.ElementType> = {
    as?: TComponent;
  };

  export type Ref<TComponent extends React.ElementType> =
    React.ComponentPropsWithRef<TComponent>["ref"];

  export type Props<
    TComponent extends React.ElementType,
    Props = Record<string, never>,
  > = Omit<InferProps<TComponent>, keyof Props> & AsProp<TComponent> & Props;

  export type PropsWithRef<
    TComponent extends React.ElementType,
    TProps = Record<string, never>,
  > = Props<TComponent, TProps> & {
    ref?: Ref<TComponent>;
  };

  type ForwardRefExoticComponent<TComponent, OwnProps> =
    React.ForwardRefExoticComponent<
      Merge<
        TComponent extends React.ElementType
          ? React.ComponentPropsWithRef<TComponent>
          : never,
        OwnProps & { as?: TComponent }
      >
    >;

  export type ComponentForwarded<
    TComponent,
    TProps = Record<string, never>,
  > = ForwardRefExoticComponent<TComponent, TProps> & {
    <As = TComponent>(
      props: As extends ""
        ? { as: keyof JSX.IntrinsicElements }
        : As extends React.ComponentType<infer P>
          ? Merge<P, TProps & { as: As }>
          : As extends keyof JSX.IntrinsicElements
            ? Merge<JSX.IntrinsicElements[As], TProps & { as: As }>
            : never,
    ): React.ReactElement | null;
  };
}
