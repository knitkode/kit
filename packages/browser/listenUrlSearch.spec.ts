import { type HistoryExtended, listenUrlSearch } from "./listenUrlSearch";

/**
 * Change the URL bypassing the patched `history` methods, as the browser does
 * when navigating back and forward
 */
const nativeReplaceState = (url: string) => {
  History.prototype.replaceState.call(history, null, "", url);
};

describe("listenUrlSearch", () => {
  const unlisteners: (() => void)[] = [];

  const listen = (handler: Parameters<typeof listenUrlSearch>[0]) => {
    const unlisten = listenUrlSearch(handler);
    unlisteners.push(unlisten);
    return unlisten;
  };

  beforeEach(() => {
    // patch `history` first, so that the tracked URL search follows the reset
    listenUrlSearch(() => {})();
    history.replaceState(null, "", "/");
  });

  afterEach(() => {
    for (const unlisten of unlisteners.splice(0)) unlisten();
  });

  it("calls the handler when `pushState` changes the URL search", () => {
    const handler = vi.fn();
    listen(handler);

    history.pushState(null, "", "/?a=1");

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith("", "?a=1");
  });

  it("calls the handler when `replaceState` changes the URL search", () => {
    history.replaceState(null, "", "/?a=1");
    const handler = vi.fn();
    listen(handler);

    history.replaceState(null, "", "/?a=2");

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith("?a=1", "?a=2");
  });

  it("calls the handler on `popstate` events", () => {
    history.replaceState(null, "", "/?a=1");
    const handler = vi.fn();
    listen(handler);

    nativeReplaceState("/?a=back");
    window.dispatchEvent(new PopStateEvent("popstate"));

    expect(handler).toHaveBeenCalledWith("?a=1", "?a=back");
  });

  it("does not call the handler when the URL search does not change", () => {
    history.replaceState(null, "", "/page?a=1");
    const handler = vi.fn();
    listen(handler);

    history.pushState(null, "", "/other?a=1");
    history.replaceState(null, "", "/other?a=1#hash");
    window.dispatchEvent(new PopStateEvent("popstate"));

    expect(handler).not.toHaveBeenCalled();
  });

  it("keeps track of the previous URL search across changes", () => {
    const handler = vi.fn();
    listen(handler);

    history.pushState(null, "", "/?a=1");
    history.pushState(null, "", "/?a=2");
    history.pushState(null, "", "/");

    expect(handler.mock.calls).toEqual([
      ["", "?a=1"],
      ["?a=1", "?a=2"],
      ["?a=2", ""],
    ]);
  });

  it("calls all the registered handlers", () => {
    const handler1 = vi.fn();
    const handler2 = vi.fn();
    listen(handler1);
    listen(handler2);

    history.pushState(null, "", "/?a=1");

    expect(handler1).toHaveBeenCalledWith("", "?a=1");
    expect(handler2).toHaveBeenCalledWith("", "?a=1");
  });

  it("registers the same handler only once", () => {
    const handler = vi.fn();
    listen(handler);
    listen(handler);

    history.pushState(null, "", "/?a=1");

    expect(handler).toHaveBeenCalledTimes(1);
    expect((history as HistoryExtended).__.h.size).toBe(1);
  });

  it("returns a function that removes the handler", () => {
    const handler = vi.fn();
    const otherHandler = vi.fn();
    const unlisten = listen(handler);
    listen(otherHandler);

    history.pushState(null, "", "/?a=1");
    unlisten();
    history.pushState(null, "", "/?a=2");

    expect(handler).toHaveBeenCalledTimes(1);
    expect(otherHandler).toHaveBeenCalledTimes(2);
  });

  it("patches the `history` methods only once", () => {
    listen(vi.fn());
    const { pushState, replaceState } = history;
    const addEventListener = vi.spyOn(window, "addEventListener");

    listen(vi.fn());

    expect(history.pushState).toBe(pushState);
    expect(history.replaceState).toBe(replaceState);
    expect(addEventListener).not.toHaveBeenCalled();
    addEventListener.mockRestore();
  });

  it("keeps the `history` methods working", () => {
    listen(vi.fn());

    expect(history.pushState({ a: 1 }, "", "/pushed?a=1")).toBeUndefined();
    expect(location.pathname).toBe("/pushed");
    expect(history.state).toEqual({ a: 1 });

    history.replaceState({ b: 2 }, "", "/replaced?b=2");
    expect(location.pathname).toBe("/replaced");
    expect(history.state).toEqual({ b: 2 });
  });
});
