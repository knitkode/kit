import {
  act,
  type ComponentProps,
  createRef,
  memo,
  type ReactNode,
  type Ref,
} from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { classed } from "./classed";

// tells React to run effects synchronously inside `act()`
(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const toElement = (markup: string) => {
  const template = document.createElement("template");
  template.innerHTML = markup;
  return template.content.firstElementChild;
};

describe("classed", () => {
  let consoleError: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleError = vi.spyOn(console, "error");
  });

  afterEach(() => {
    // no React warnings (e.g. unknown DOM props) should be logged
    expect(consoleError).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });

  it("renders the given native element with the template classes", () => {
    const Box = classed("div")`p-4 m-2`;
    const el = toElement(renderToStaticMarkup(<Box>content</Box>));

    expect(el?.tagName).toBe("DIV");
    expect(el?.className).toBe("p-4 m-2");
    expect(el?.textContent).toBe("content");
  });

  it("forwards the native props", () => {
    const Button = classed("button")`btn`;
    const el = toElement(
      renderToStaticMarkup(
        <Button type="submit" id="send" aria-label="Send" disabled />,
      ),
    );

    expect(el?.getAttribute("type")).toBe("submit");
    expect(el?.id).toBe("send");
    expect(el?.getAttribute("aria-label")).toBe("Send");
    expect(el?.hasAttribute("disabled")).toBe(true);
  });

  it("appends the className prop to the template classes", () => {
    const Box = classed("div")`p-4`;
    const el = toElement(renderToStaticMarkup(<Box className="text-red" />));

    expect(el?.className).toBe("p-4 text-red");
  });

  it("resolves function interpolations against the props", () => {
    type Props = { $active?: boolean };
    const Tab = classed<Props, "button">("button")`tab ${(props) =>
      props.$active ? "tab-active" : "tab-idle"}`;

    expect(toElement(renderToStaticMarkup(<Tab $active />))?.className).toBe(
      "tab tab-active",
    );
    expect(toElement(renderToStaticMarkup(<Tab />))?.className).toBe(
      "tab tab-idle",
    );
  });

  it("joins multiple interpolations with the static parts in between", () => {
    type Props = { $size: "sm" | "lg"; $tone: string };
    const Text = classed<Props, "span">("span")`text-${(props) =>
      props.$size} color-${(props) => props.$tone}`;
    const el = toElement(renderToStaticMarkup(<Text $size="lg" $tone="red" />));

    expect(el?.className).toBe("text-lg color-red");
  });

  it("keeps the static part after the last interpolation", () => {
    type Props = { $tone: string };
    const Text = classed<Props, "span">("span")`a ${(props) => props.$tone} b`;

    expect(toElement(renderToStaticMarkup(<Text $tone="X" />))?.className).toBe(
      "a X b",
    );
  });

  it('keeps the static part after the last interpolation in the `< class="..."` syntax', () => {
    type Props = { $gap: number };
    const Box = classed<Props, "div">("div")`< class="flex gap-${(props) =>
      String(props.$gap)} grow">`;

    expect(toElement(renderToStaticMarkup(<Box $gap={2} />))?.className).toBe(
      "flex gap-2 grow",
    );
  });

  it("accepts string interpolations", () => {
    const base = "rounded";
    const Box = classed("div")`border ${base}`;

    expect(toElement(renderToStaticMarkup(<Box />))?.className).toBe(
      "border rounded",
    );
  });

  it('extracts the classes from the `< class="..."` syntax', () => {
    const Box = classed("section")`< class="flex gap-2">`;
    const el = toElement(renderToStaticMarkup(<Box />));

    expect(el?.tagName).toBe("SECTION");
    expect(el?.className).toBe("flex gap-2");
  });

  it("does not render a class attribute for an empty template", () => {
    const Span = classed("span")``;
    const el = toElement(renderToStaticMarkup(<Span />));

    expect(el?.hasAttribute("class")).toBe(false);
  });

  it("drops the `$` transient props on native elements", () => {
    type Props = { $variant?: string };
    const Box = classed<Props, "div">("div")`box ${(props) =>
      props.$variant ?? ""}`;
    const el = toElement(renderToStaticMarkup(<Box $variant="primary" />));

    expect(el?.className).toBe("box primary");
    expect(el?.getAttributeNames()).toEqual(["class"]);
  });

  it("forwards every prop, transient ones included, to custom components", () => {
    const received: Record<string, unknown>[] = [];
    const Custom = (props: {
      $tone?: string;
      className?: string;
      children?: ReactNode;
    }) => {
      received.push(props);
      return <p className={props.className}>{props.children}</p>;
    };
    const Styled = classed<
      { $tone?: string; children?: ReactNode },
      typeof Custom
    >(Custom)`lead`;
    const el = toElement(
      renderToStaticMarkup(<Styled $tone="muted">text</Styled>),
    );

    expect(el?.tagName).toBe("P");
    expect(el?.className).toBe("lead");
    expect(received[0]).toMatchObject({
      $tone: "muted",
      className: "lead",
      children: "text",
    });
  });

  it("uses the inner type of components exposing a `type` (e.g. memo)", () => {
    const Inner = (props: { className?: string }) => (
      <em className={props.className}>inner</em>
    );
    const Styled = classed(memo(Inner))`italic`;
    const el = toElement(renderToStaticMarkup(<Styled />));

    expect(el?.tagName).toBe("EM");
    expect(el?.className).toBe("italic");
  });

  it("forwards the ref to the rendered element", () => {
    const Input = classed("input")`field`;
    const ref = createRef<HTMLInputElement>();
    const container = document.createElement("div");
    const root = createRoot(container);

    act(() => root.render(<Input ref={ref} defaultValue="hello" />));

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current?.className).toBe("field");
    expect(ref.current?.value).toBe("hello");

    act(() => root.unmount());
    expect(ref.current).toBeNull();
  });

  it("types the ref and the event handlers with the element type", () => {
    const Input = classed("input")`field`;
    const values: string[] = [];
    // focus only works on elements attached to the document
    const container = document.body.appendChild(document.createElement("div"));
    const root = createRoot(container);

    expectTypeOf<ComponentProps<typeof Input>["ref"]>().toEqualTypeOf<
      Ref<HTMLInputElement> | undefined
    >();

    act(() =>
      root.render(
        <Input
          defaultValue="hello"
          onFocus={(event) => values.push(event.currentTarget.value)}
        />,
      ),
    );
    act(() => container.querySelector("input")?.focus());

    expect(values).toEqual(["hello"]);

    act(() => root.unmount());
    container.remove();
  });
});
