import { listenUrlSearchParams } from "./listenUrlSearchParams";

describe("listenUrlSearchParams", () => {
  const unlisteners: (() => void)[] = [];

  beforeEach(() => {
    // patch `history` first, so that the tracked URL search follows the reset
    listenUrlSearchParams("page", () => {})();
    history.replaceState(null, "", "/?page=1&sort=asc");
  });

  afterEach(() => {
    for (const unlisten of unlisteners.splice(0)) unlisten();
  });

  it("calls the handler with the new value of the param", () => {
    const handler = vi.fn();
    unlisteners.push(listenUrlSearchParams("page", handler));

    history.pushState(null, "", "/?page=2&sort=asc");

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith("2");
  });

  it("calls the handler with null when the param is removed", () => {
    const handler = vi.fn();
    unlisteners.push(listenUrlSearchParams("page", handler));

    history.pushState(null, "", "/?sort=asc");

    expect(handler).toHaveBeenCalledWith(null);
  });

  it("calls the handler when the param is added", () => {
    const handler = vi.fn();
    unlisteners.push(listenUrlSearchParams("filter", handler));

    history.pushState(null, "", "/?page=1&sort=asc&filter=new");

    expect(handler).toHaveBeenCalledWith("new");
  });

  it("does not call the handler when other params change", () => {
    const handler = vi.fn();
    unlisteners.push(listenUrlSearchParams("page", handler));

    history.pushState(null, "", "/?page=1&sort=desc");
    history.pushState(null, "", "/?sort=desc&page=1&other=1");

    expect(handler).not.toHaveBeenCalled();
  });

  it("returns a function that stops listening", () => {
    const handler = vi.fn();
    const unlisten = listenUrlSearchParams("page", handler);

    unlisten();
    history.pushState(null, "", "/?page=2");

    expect(handler).not.toHaveBeenCalled();
  });
});
