import { createElement } from "react";

export type ExtendableComponent<Props = any> =
  | React.ForwardRefExoticComponent<Props>
  | React.ExoticComponent<Props>
  | React.FC<Props>
  | ((props: Props) => JSX.Element);

export let extendComponent = <
  Component extends ExtendableComponent,
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  DefaultProps extends {},
>(
  component: Component,
  defaultProps: DefaultProps,
) => {
  // FIXME: check if we need to forwardRef or not
  const NewComponent = (props: React.ComponentProps<Component>) =>
    createElement(component, props);
  // const NewComponent = forwardRef<React.ComponentProps<Component>, Component>(
  //   (props, ref) => createElement(component, { ...props, ref })
  // );
  return Object.assign(NewComponent, {
    ...defaultProps,
    defaultProps,
  });
};

export interface OverridableComponents {
  [key: string]: {
    type: React.ElementType;
    props: any;
    motionable?: boolean;
  };
}

/**
 * Type to define a component that has overridable components.
 *
 * Each of them can define its:
 * - `type`: either as a native HTMLElement (the props for that element will be
 * automatically inferred) or as a custom React component
 * - `props`: any additional custom props
 * - `motionable`: if that component has a possible implementation with `framer-motion`,
 * in that case we remove some HTMLAttributes props which collides with
 * `MotionProps` from framer.
 */
export type WithComponents<
  Props,
  Components extends OverridableComponents,
> = Props & {
  [Name in keyof Components]: NonNullable<
    Components[Name]["type"] extends keyof JSX.IntrinsicElements
      ? React.ElementType<
          Components[Name]["motionable"] extends true
            ? Omit<
                React.ComponentPropsWithoutRef<Components[Name]["type"]>,
                HtmlAttributesCollidingWithMotionProps
              > &
                Components[Name]["props"]
            : React.ComponentPropsWithoutRef<Components[Name]["type"]> &
                Components[Name]["props"]
        >
      : Components[Name]["type"]
  >;
};

type HtmlAttributesCollidingWithMotionProps =
  | "style"
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "onAnimationStart"
  | "onAnimationEnd";

export default extendComponent;
