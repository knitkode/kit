import { onClickOutside } from "./onClickOutside";

describe("onClickOutside", () => {
  const $ = (selector: string) => {
    const el = document.querySelector<HTMLElement>(selector);
    if (!el) throw new Error(`missing fixture ${selector}`);
    return el;
  };
  let unbind: () => void = () => {};

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="dropdown"><button id="inside">toggle</button></div>
      <button id="outside">elsewhere</button>
    `;
  });

  afterEach(() => {
    unbind();
    unbind = () => {};
    document.body.innerHTML = "";
  });

  test("calls the callback with the event on clicks outside the element", () => {
    const callback = vi.fn();
    unbind = onClickOutside($("#dropdown"), callback);

    $("#outside").click();

    expect(callback).toHaveBeenCalledTimes(1);
    const [event] = callback.mock.calls[0] ?? [];
    expect(event).toBeInstanceOf(MouseEvent);
    expect(event.target).toBe($("#outside"));
  });

  test("ignores clicks on the element and its descendants", () => {
    const callback = vi.fn();
    unbind = onClickOutside($("#dropdown"), callback);

    $("#dropdown").click();
    $("#inside").click();

    expect(callback).not.toHaveBeenCalled();
  });

  test("keeps listening after an outside click by default", () => {
    const callback = vi.fn();
    unbind = onClickOutside($("#dropdown"), callback);

    $("#outside").click();
    document.body.click();

    expect(callback).toHaveBeenCalledTimes(2);
  });

  test("stops listening after the first outside click when autoUnbind is true", () => {
    const callback = vi.fn();
    unbind = onClickOutside($("#dropdown"), callback, true);

    $("#inside").click();
    expect(callback).not.toHaveBeenCalled();

    $("#outside").click();
    $("#outside").click();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test("returns a function that stops listening", () => {
    const callback = vi.fn();
    onClickOutside($("#dropdown"), callback)();

    $("#outside").click();

    expect(callback).not.toHaveBeenCalled();
  });
});
