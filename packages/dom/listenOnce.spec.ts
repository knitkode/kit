import { getListeners } from "./getListeners";
import { listen } from "./listen";
import { listenOnce } from "./listenOnce";
import type { AnyWindowEventType } from "./types";
import { unlisten } from "./unlisten";

describe("listenOnce", () => {
  const $ = (selector: string) => {
    const el = document.querySelector<HTMLElement>(selector);
    if (!el) throw new Error(`missing fixture ${selector}`);
    return el;
  };

  beforeEach(() => {
    document.body.innerHTML = `
      <button class="btn" id="btn"><span id="label">Label</span></button>
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

  test("calls the callback once with the event and the matching element", () => {
    const callback = vi.fn();
    listenOnce("click", ".btn", callback);

    $("#label").click();
    $("#label").click();

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(expect.any(MouseEvent), $("#btn"));
  });

  test("unregisters itself and its window listener after the first run", () => {
    const removeEventListener = vi.spyOn(window, "removeEventListener");
    listenOnce("click", ".btn", vi.fn());
    expect(getListeners().click).toHaveLength(1);

    $("#btn").click();

    expect(getListeners()).toEqual({});
    expect(removeEventListener).toHaveBeenCalledWith(
      "click",
      expect.any(Function),
      true,
    );
  });

  test("keeps waiting while the events do not match the selector", () => {
    const callback = vi.fn();
    listenOnce("click", ".btn", callback);

    $("#outside").click();
    expect(callback).not.toHaveBeenCalled();
    expect(getListeners().click).toHaveLength(1);

    $("#btn").click();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test("unlistens every given type after the first run of any of them", () => {
    const callback = vi.fn();
    listenOnce("click,keydown", ".btn", callback);

    $("#btn").click();
    $("#btn").dispatchEvent(new KeyboardEvent("keydown", { bubbles: true }));

    expect(callback).toHaveBeenCalledTimes(1);
    expect(getListeners()).toEqual({});
  });

  test("passes the window as target with the `*` selector", () => {
    const callback = vi.fn();
    listenOnce("click", "*", callback);

    $("#outside").click();

    expect(callback).toHaveBeenCalledWith(expect.any(MouseEvent), window);
  });

  test("leaves the listeners registered before it untouched", () => {
    const calls: string[] = [];
    listen("click", ".btn", () => calls.push("regular"));
    listenOnce("click", ".btn", () => calls.push("once"));

    $("#btn").click();
    $("#btn").click();

    expect(calls).toEqual(["regular", "once", "regular"]);
    expect(getListeners().click).toHaveLength(1);
  });
});
