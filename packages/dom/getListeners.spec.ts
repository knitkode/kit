import { getListeners } from "./getListeners";
import { listen } from "./listen";
import type { AnyWindowEventType } from "./types";
import { unlisten } from "./unlisten";

describe("getListeners", () => {
  const onButtonClick = () => {};
  const onLinkClick = () => {};
  const onInputKeydown = () => {};

  afterEach(() => {
    for (const type of Object.keys(getListeners()) as AnyWindowEventType[]) {
      unlisten(type, "", () => {});
    }
  });

  test("returns an empty object when nothing is listened", () => {
    expect(getListeners()).toEqual({});
  });

  test("lists the active listeners by event type in registration order", () => {
    listen("click", ".button", onButtonClick);
    listen("click", ".link", onLinkClick);
    listen("keydown", "input", onInputKeydown);

    expect(getListeners()).toEqual({
      click: [
        { selector: ".button", callback: onButtonClick },
        { selector: ".link", callback: onLinkClick },
      ],
      keydown: [{ selector: "input", callback: onInputKeydown }],
    });
  });

  test("lists a listener registered for multiple types under each type", () => {
    listen("click,keydown", ".button", onButtonClick);

    const listeners = getListeners();
    expect(Object.keys(listeners)).toEqual(["click", "keydown"]);
    expect(listeners.click).toEqual([
      { selector: ".button", callback: onButtonClick },
    ]);
    expect(listeners.keydown).toEqual([
      { selector: ".button", callback: onButtonClick },
    ]);
  });

  test("reflects listeners removed with unlisten", () => {
    listen("click", ".button", onButtonClick);
    listen("click", ".link", onLinkClick);

    unlisten("click", ".button", onButtonClick);
    expect(getListeners()).toEqual({
      click: [{ selector: ".link", callback: onLinkClick }],
    });

    unlisten("click", ".link", onLinkClick);
    expect(getListeners()).toEqual({});
  });

  test("returns a new object on every call, detached from the registry", () => {
    listen("click", ".button", onButtonClick);

    const first = getListeners();
    expect(getListeners()).not.toBe(first);

    delete first.click;
    expect(getListeners().click).toEqual([
      { selector: ".button", callback: onButtonClick },
    ]);
  });

  test("returns copies of the listeners, detached from the registry", () => {
    listen("click", ".button", onButtonClick);

    const listeners = getListeners();
    listeners.click?.push({ selector: ".link", callback: onLinkClick });
    if (listeners.click?.[0]) listeners.click[0].selector = ".changed";

    expect(getListeners()).toEqual({
      click: [{ selector: ".button", callback: onButtonClick }],
    });
  });
});
