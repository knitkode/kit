import React, { createElement, forwardRef } from "react";

// FIXME: use
// React.ComponentProps<typeof Component>
// ? @see https://react-typescript-cheatsheet.netlify.app/docs/advanced/patterns_by_usecase/#props-extracting-prop-types-of-a-component

// type ClassedComponent<Props = {}> =
//   | React.ElementType<Props>
//   | OverridableComponent<any>
//   | React.Component<Props>
//   | React.FunctionComponent<Props>
//   | React.ReactElement<Props>
//   | React.ReactHTMLElement<any>
//   | string // | JSX.IntrinsicElements
//   | ((props: Props) => JSX.Element);

type ClassedAugmentedProps<Props> = Props & {
  className?: string;
  ref?: React.Ref<any>;
};

type ClassedFinalProps<Props, Component> = Component extends React.ReactHTML
  ? React.HTMLProps<Component> & ClassedAugmentedProps<Props>
  : ClassedAugmentedProps<Props>;

/**
 * This utility allows to extend a component a là `styled-components` but for
 * a className based styling solution like Tailwind,
 *
 * It also plays nicely with tailwind intellisense:
 * - https://github.com/tailwindlabs/tailwindcss-intellisense#tailwindcssclassattributes
 *
 * For references about tagged functions:
 * - https://javascript.plainenglish.io/how-css-in-js-libraries-work-da4145b1b6c7
 * - https://makersden.io/blog/reverse-engineering-styled-components
 * - https://typesafe.blog/article/the-logic-behind-javascript-tag-functions
 * - https://flaming.codes/posts/typescript-and-javascript-tagged-template-strings
 *
 * Similar projects:
 * - https://reactjsexample.com/style-radix-ui-components-with-tailwindcss/
 *
 * Discussions and Q/A:
 * - https://stackoverflow.com/q/73055695/1938970
 */
export let classed = <Props, Component extends React.ElementType = any>(
  component: Component,
) => {
  // @ts-expect-error nevermind for now...
  const type = component.type || component;

  return function (
    strings: TemplateStringsArray,
    ...args: ((props: Props) => string)[] | string[]
  ) {
    const WrappedComponent = forwardRef<
      Component,
      // Props
      ClassedFinalProps<Props, Component>
    >(function (props, ref) {
      const argResolved = args
        .map((arg, index) => {
          let result = "";

          if (typeof arg === "function") {
            result = arg(props);
          } else if (typeof arg !== "undefined") {
            result = arg.toString();
          }

          return strings[index] + result;
        })
        .join("");

      const isNativeHtmlElement = typeof type === "string";

      const propsToForward: { [key: string]: any } = isNativeHtmlElement
        ? {}
        : props;

      if (isNativeHtmlElement) {
        for (const key in props) {
          // like styled-components `transient` props
          if (!key.startsWith("$")) {
            // FIXME: for react 18 we need: @ts-expect-error
            propsToForward[key] = props[key];
          }
        }
      }

      // get the tagged function string outcome
      let className = argResolved || strings[0];
      // check if we need to clean it or not from the optional structure `< class="..."`
      className = className.match(/class="([^"]*)/)?.[1] || className;
      // add the custom classes from props
      className += props?.className ? " " + props?.className : "";

      return createElement(type, {
        // ...props,
        ...propsToForward,
        // only add ot props if it is not an empty string
        className: className || undefined,
        // add ref to props
        ref,
      });
    });

    // FIXME: not sure if this is needed
    // WrappedComponent.displayName = type.toString();

    return WrappedComponent; // as unknown as React.ReactElement<typeof props>;
  };
};

export default classed;
