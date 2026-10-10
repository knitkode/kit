import { listenLoaded } from "./listenLoaded";

describe("listenLoaded", () => {
  const mockReadyState = (state: DocumentReadyState) =>
    vi.spyOn(document, "readyState", "get").mockReturnValue(state);

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe("while the document is loading", () => {
    beforeEach(() => {
      mockReadyState("loading");
    });

    test("calls the handler with the event when the DOM content is loaded", () => {
      const handler = vi.fn();
      const unbind = listenLoaded(handler);

      const event = new Event("DOMContentLoaded");
      document.dispatchEvent(event);
      unbind();

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith(event);
    });

    test("ignores other events", () => {
      const handler = vi.fn();
      const unbind = listenLoaded(handler);

      document.dispatchEvent(new Event("load"));
      window.dispatchEvent(new Event("DOMContentLoaded"));
      unbind();

      expect(handler).not.toHaveBeenCalled();
    });

    test("returns a function that removes the listener", () => {
      const handler = vi.fn();
      const unbind = listenLoaded(handler);

      unbind();
      document.dispatchEvent(new Event("DOMContentLoaded"));

      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe.each(["interactive", "complete"] as const)(
    "when the document is already %s",
    (state) => {
      beforeEach(() => {
        vi.useFakeTimers();
        mockReadyState(state);
      });

      test("calls the handler asynchronously with a DOMContentLoaded event", () => {
        const handler = vi.fn();
        listenLoaded(handler);

        expect(handler).not.toHaveBeenCalled();
        vi.runAllTimers();

        expect(handler).toHaveBeenCalledTimes(1);
        expect(handler).toHaveBeenCalledWith(expect.any(Event));
        expect(handler.mock.calls[0]?.[0].type).toBe("DOMContentLoaded");
      });

      test("does not wait for the DOMContentLoaded event", () => {
        const handler = vi.fn();
        listenLoaded(handler);

        vi.runAllTimers();
        document.dispatchEvent(new Event("DOMContentLoaded"));

        expect(handler).toHaveBeenCalledTimes(1);
      });

      test("returns a function that cancels the call", () => {
        const handler = vi.fn();
        const unbind = listenLoaded(handler);

        unbind();
        vi.runAllTimers();

        expect(handler).not.toHaveBeenCalled();
      });
    },
  );
});
