import { forwardRef, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { extendComponent } from "./extendComponent";

type BadgeProps = { tone?: string; children?: ReactNode };

const Badge = ({ tone = "neutral", children }: BadgeProps) => (
  <span data-tone={tone}>{children}</span>
);

describe("extendComponent", () => {
  it("returns a component that renders the original one with the given props", () => {
    const Extended = extendComponent(Badge, { tone: "info" });

    expect(renderToStaticMarkup(<Extended tone="danger">Alert</Extended>)).toBe(
      '<span data-tone="danger">Alert</span>',
    );
  });

  it("renders the original component with the default props", () => {
    const Extended = extendComponent(Badge, { tone: "info" });

    expect(renderToStaticMarkup(<Extended>Alert</Extended>)).toBe(
      '<span data-tone="info">Alert</span>',
    );
  });

  it("uses the default props in place of undefined props", () => {
    const Extended = extendComponent(Badge, { tone: "info" });

    expect(renderToStaticMarkup(<Extended tone={undefined} />)).toBe(
      '<span data-tone="info"></span>',
    );
  });

  it("returns a new component instead of mutating the original one", () => {
    const Extended = extendComponent(Badge, { tone: "info" });

    expect(Extended).not.toBe(Badge);
    expect(Object.hasOwn(Badge, "defaultProps")).toBe(false);
  });

  it("exposes the default props as `defaultProps`", () => {
    const defaults = { tone: "info" };
    const Extended = extendComponent(Badge, defaults);

    expect(Extended.defaultProps).toBe(defaults);
  });

  it("exposes each default prop as a static property", () => {
    const Extended = extendComponent(Badge, { tone: "info", size: 2 });

    expect(Extended.tone).toBe("info");
    expect(Extended.size).toBe(2);
  });

  it("supports forwardRef components", () => {
    const Field = forwardRef<HTMLInputElement, { name: string }>(
      (props, ref) => <input ref={ref} name={props.name} />,
    );
    const Extended = extendComponent(Field, {});

    expect(renderToStaticMarkup(<Extended name="email" />)).toBe(
      '<input name="email"/>',
    );
  });
});
