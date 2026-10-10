import { getListeners } from "./getListeners";
import { listen } from "./listen";
import type { AnyWindowEventType } from "./types";
import { unlisten } from "./unlisten";

describe("unlisten", () => {
  const calls: string[] = [];
  // the callbacks share their source: `unlisten` matches them by reference
  const track = (name: string) => () => calls.push(name);
  const onA = track("a");
  const onB = track("b");
  const onKey = track("key");

  const $ = (selector: string) => {
    const el = document.querySelector<HTMLElement>(selector);
    if (!el) throw new Error(`missing fixture ${selector}`);
    return el;
  };
  const keydown = (el: HTMLElement) =>
    el.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true }));

  beforeEach(() => {
    document.body.innerHTML = `
      <button class="a" id="a"></button>
      <button class="b" id="b"></button>
    `;
  });

  afterEach(() => {
    for (const type of Object.keys(getListeners()) as AnyWindowEventType[]) {
      unlisten(type, "", () => {});
    }
    calls.length = 0;
    vi.restoreAllMocks();
    document.body.innerHTML = "";
  });

  test("removes the listener matching selector and callback, keeping the others", () => {
    listen("click", ".a", onA);
    listen("click", ".b", onB);

    unlisten("click", ".a", onA);
    $("#a").click();
    $("#b").click();

    expect(calls).toEqual(["b"]);
    expect(getListeners()).toEqual({
      click: [{ selector: ".b", callback: onB }],
    });
  });

  test("removes the window listener along with the last listener of a type", () => {
    const removeEventListener = vi.spyOn(window, "removeEventListener");
    listen("click", ".a", onA);

    unlisten("click", ".a", onA);
    $("#a").click();

    expect(calls).toEqual([]);
    expect(getListeners()).toEqual({});
    expect(removeEventListener).toHaveBeenCalledWith(
      "click",
      expect.any(Function),
      true,
    );
  });

  test("allows listening again after the last listener was removed", () => {
    listen("click", ".a", onA);
    unlisten("click", ".a", onA);

    listen("click", ".a", onA);
    $("#a").click();

    expect(calls).toEqual(["a"]);
  });

  test("removes the listener from each comma separated type", () => {
    listen("click,keydown", ".a", onA);
    listen("click,keydown", ".b", onB);

    unlisten("click,keydown", ".a", onA);
    $("#a").click();
    keydown($("#a"));
    $("#b").click();
    keydown($("#b"));

    expect(calls).toEqual(["b", "b"]);
    expect(getListeners().click).toHaveLength(1);
    expect(getListeners().keydown).toHaveLength(1);
  });

  test("trims whitespace around the event types", () => {
    listen("click,keydown", ".a", onA);

    // @ts-expect-error the types only model comma separated lists without spaces
    unlisten(" click , keydown ", ".a", onA);

    expect(getListeners()).toEqual({});
  });

  test("does nothing for an event type that is not listened", () => {
    const removeEventListener = vi.spyOn(window, "removeEventListener");
    listen("click", ".a", onA);

    unlisten("keydown", ".a", onKey);

    expect(removeEventListener).not.toHaveBeenCalled();
    expect(getListeners()).toEqual({
      click: [{ selector: ".a", callback: onA }],
    });
  });

  test("does nothing when no listener matches both selector and callback", () => {
    listen("click", ".a", onA);
    listen("click", ".b", onB);

    unlisten("click", ".missing", onA);
    unlisten("click", ".a", onB);
    $("#a").click();
    $("#b").click();

    expect(calls).toEqual(["a", "b"]);
    expect(getListeners().click).toHaveLength(2);
  });

  test("does nothing when the only listener of the type does not match", () => {
    const removeEventListener = vi.spyOn(window, "removeEventListener");
    listen("click", ".a", onA);

    unlisten("click", ".b", onB);
    unlisten("click", ".a", onB);
    $("#a").click();

    expect(calls).toEqual(["a"]);
    expect(getListeners()).toEqual({
      click: [{ selector: ".a", callback: onA }],
    });
    expect(removeEventListener).not.toHaveBeenCalled();
  });

  test("does nothing without a callback", () => {
    listen("click", ".a", onA);
    listen("click", ".b", onB);

    // @ts-expect-error the callback is required
    unlisten("click", ".a", undefined);

    expect(getListeners().click).toHaveLength(2);
  });

  test("tells apart different callbacks with the same source", () => {
    const first = track("first");
    const second = track("second");
    listen("click", ".a", first);
    listen("click", ".a", second);

    unlisten("click", ".a", second);
    $("#a").click();

    expect(calls).toEqual(["first"]);
    expect(getListeners()).toEqual({
      click: [{ selector: ".a", callback: first }],
    });
  });

  test("tells apart different mock functions", () => {
    const first = vi.fn();
    const second = vi.fn();
    listen("click", ".a", first);
    listen("click", ".a", second);

    unlisten("click", ".a", second);
    $("#a").click();

    expect(first).toHaveBeenCalledTimes(1);
    expect(second).not.toHaveBeenCalled();
  });

  test("removes the first listener registered with the same selector and callback", () => {
    listen("click", ".a", onA);
    listen("click", ".a", onA);

    unlisten("click", ".a", onA);
    $("#a").click();

    expect(calls).toEqual(["a"]);
    expect(getListeners().click).toHaveLength(1);
  });

  test("removes every listener of the type when the selector is empty", () => {
    const removeEventListener = vi.spyOn(window, "removeEventListener");
    listen("click", ".a", onA);
    listen("click", ".b", onB);
    listen("keydown", ".a", onKey);

    unlisten("click", "", onA);
    $("#a").click();
    $("#b").click();
    keydown($("#a"));

    expect(calls).toEqual(["key"]);
    expect(Object.keys(getListeners())).toEqual(["keydown"]);
    expect(removeEventListener).toHaveBeenCalledWith(
      "click",
      expect.any(Function),
      true,
    );
  });
});
