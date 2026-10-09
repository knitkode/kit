import { getListeners } from "./getListeners";
import { listen } from "./listen";
import type { AnyWindowEventType } from "./types";
import { unlisten } from "./unlisten";

describe("listen", () => {
  const $ = <T extends HTMLElement = HTMLElement>(selector: string) => {
    const el = document.querySelector<T>(selector);
    if (!el) throw new Error(`missing fixture ${selector}`);
    return el;
  };

  beforeEach(() => {
    document.body.innerHTML = `
      <button class="btn" id="btn"><span id="label">Label</span></button>
      <button class="btn:primary" id="primary"></button>
      <input id="input" />
      <p id="outside"></p>
    `;
  });

  afterEach(() => {
    for (const type of Object.keys(getListeners()) as AnyWindowEventType[]) {
      unlisten(type, "", () => {});
    }
    vi.restoreAllMocks();
    document.body.innerHTML = "";
  });

  test("calls the callback with the event and the element matching the selector", () => {
    const callback = vi.fn();
    listen("click", ".btn", callback);

    $("#btn").click();

    expect(callback).toHaveBeenCalledTimes(1);
    const [event, target] = callback.mock.calls[0] ?? [];
    expect(event).toBeInstanceOf(MouseEvent);
    expect(event.type).toBe("click");
    expect(target).toBe($("#btn"));
  });

  test("passes the closest matching ancestor when a descendant is the event target", () => {
    const callback = vi.fn();
    listen("click", ".btn", callback);

    $("#label").click();

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback.mock.calls[0]?.[0].target).toBe($("#label"));
    expect(callback.mock.calls[0]?.[1]).toBe($("#btn"));
  });

  test("does not call the callback for events outside the selector", () => {
    const callback = vi.fn();
    listen("click", ".btn", callback);

    $("#outside").click();

    expect(callback).not.toHaveBeenCalled();
  });

  test("does not call the callback for events on detached elements", () => {
    const callback = vi.fn();
    listen("click", ".btn", callback);
    const detached = document.createElement("button");
    detached.className = "btn";

    detached.click();

    expect(callback).not.toHaveBeenCalled();
  });

  test("escapes colons in the selector", () => {
    const callback = vi.fn();
    listen("click", ".btn:primary", callback);

    $("#primary").click();

    expect(callback).toHaveBeenCalledWith(
      expect.any(MouseEvent),
      $("#primary"),
    );
  });

  test("listens to comma separated event types", () => {
    const callback = vi.fn();
    listen("click,keydown", "#input", callback);

    $("#input").click();
    $("#input").dispatchEvent(new KeyboardEvent("keydown", { bubbles: true }));

    expect(callback.mock.calls.map(([event]) => event.type)).toEqual([
      "click",
      "keydown",
    ]);
  });

  test("trims whitespace around the event types", () => {
    const callback = vi.fn();
    // @ts-expect-error the types only model comma separated lists without spaces
    listen(" click , keydown ", "#input", callback);

    expect(Object.keys(getListeners())).toEqual(["click", "keydown"]);
    $("#input").dispatchEvent(new KeyboardEvent("keydown", { bubbles: true }));
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test("calls every listener of the same type in registration order", () => {
    const calls: string[] = [];
    listen("click", ".btn", () => calls.push("first"));
    listen("click", "#label", () => calls.push("second"));
    listen("click", "#outside", () => calls.push("never"));

    $("#label").click();

    expect(calls).toEqual(["first", "second"]);
  });

  test("delegates non bubbling events by listening in the capture phase", () => {
    const callback = vi.fn();
    listen("focus", "#input", callback);

    $("#input").dispatchEvent(new FocusEvent("focus"));

    expect(callback).toHaveBeenCalledWith(expect.any(FocusEvent), $("#input"));
  });

  test("adds a single capturing window listener per event type", () => {
    const addEventListener = vi.spyOn(window, "addEventListener");

    listen("click", ".btn", () => {});
    listen("click", "#outside", () => {});
    listen("keydown", "#input", () => {});

    expect(addEventListener).toHaveBeenCalledTimes(2);
    expect(addEventListener).toHaveBeenNthCalledWith(
      1,
      "click",
      expect.any(Function),
      true,
    );
    expect(addEventListener).toHaveBeenNthCalledWith(
      2,
      "keydown",
      expect.any(Function),
      true,
    );
  });

  test.each(["*", "window"])(
    "passes the window as target with the `%s` selector",
    (selector) => {
      const callback = vi.fn();
      listen("click", selector, callback);

      $("#outside").click();

      expect(callback).toHaveBeenCalledWith(expect.any(MouseEvent), window);
    },
  );

  test.each(["document", "document.documentElement"])(
    "passes the document as target with the `%s` selector",
    (selector) => {
      const callback = vi.fn();
      listen("click", selector, callback);

      $("#outside").click();

      expect(callback).toHaveBeenCalledWith(expect.any(MouseEvent), document);
    },
  );

  test("does not register anything without a selector", () => {
    expect(listen("click", "", vi.fn())).toBeUndefined();
    expect(getListeners()).toEqual({});
  });

  test("does not register anything without a callback", () => {
    // @ts-expect-error the callback is required
    expect(listen("click", ".btn", undefined)).toBeUndefined();
    expect(getListeners()).toEqual({});
  });

  describe("with an element or global object instead of a selector string", () => {
    test("passes the element when it is the event target", () => {
      const callback = vi.fn();
      // @ts-expect-error the selector is typed as a string only
      listen("click", $("#btn"), callback);

      $("#btn").click();

      expect(callback).toHaveBeenCalledWith(expect.any(MouseEvent), $("#btn"));
    });

    test("passes the element when the event target is one of its descendants", () => {
      const callback = vi.fn();
      // @ts-expect-error the selector is typed as a string only
      listen("click", $("#btn"), callback);

      $("#label").click();

      expect(callback).toHaveBeenCalledWith(expect.any(MouseEvent), $("#btn"));
    });

    test("ignores events outside the element", () => {
      const callback = vi.fn();
      // @ts-expect-error the selector is typed as a string only
      listen("click", $("#btn"), callback);

      $("#outside").click();

      expect(callback).not.toHaveBeenCalled();
    });

    test("passes the window or the document when given as selector", () => {
      const onWindow = vi.fn();
      const onDocument = vi.fn();
      // @ts-expect-error the selector is typed as a string only
      listen("click", window, onWindow);
      // @ts-expect-error the selector is typed as a string only
      listen("click", document, onDocument);

      $("#outside").click();

      expect(onWindow).toHaveBeenCalledWith(expect.any(MouseEvent), window);
      expect(onDocument).toHaveBeenCalledWith(expect.any(MouseEvent), document);
    });
  });
});
