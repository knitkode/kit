import { act } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import {
  createUseMediaQueryWidth,
  type MediaQueryWidth,
} from "./createUseMediaQueryWidth";

// tells React to run effects synchronously inside `act()`
(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

type ChangeListener = (event: { matches: boolean }) => void;

/** Minimal `MediaQueryList` stand-in, jsdom does not implement `matchMedia` */
class FakeMediaQueryList {
  listeners = new Set<ChangeListener>();
  addEventListener?: (type: "change", listener: ChangeListener) => void;
  removeEventListener?: (type: "change", listener: ChangeListener) => void;

  constructor(
    public media: string,
    public matches: boolean,
    legacy: boolean,
  ) {
    if (!legacy) {
      this.addEventListener = (_type, listener) => this.listeners.add(listener);
      this.removeEventListener = (_type, listener) =>
        this.listeners.delete(listener);
    }
  }

  addListener(listener: ChangeListener) {
    this.listeners.add(listener);
  }

  removeListener(listener: ChangeListener) {
    this.listeners.delete(listener);
  }

  change(matches: boolean) {
    this.matches = matches;
    for (const listener of this.listeners) listener({ matches });
  }
}

const stubMatchMedia = ({
  matches = false,
  legacy = false,
}: {
  matches?: boolean;
  legacy?: boolean;
} = {}) => {
  const lists: FakeMediaQueryList[] = [];
  const matchMedia = vi.fn((query: string) => {
    const list = new FakeMediaQueryList(query, matches, legacy);
    lists.push(list);
    return list;
  });
  vi.stubGlobal("matchMedia", matchMedia);
  return { matchMedia, lists };
};

const useMediaQueryWidth = createUseMediaQueryWidth({
  sm: 640,
  md: 768,
  lg: 1024,
});

type Media = MediaQueryWidth<"sm" | "md" | "lg">;

const results: Array<boolean | null> = [];

const Probe = ({
  media,
  serverValue,
}: {
  media: Media;
  serverValue?: boolean | null;
}) => {
  const matches = useMediaQueryWidth(media, serverValue);
  results.push(matches);
  return <i>{String(matches)}</i>;
};

const latest = () => results[results.length - 1];

describe("createUseMediaQueryWidth", () => {
  beforeEach(() => {
    results.length = 0;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe("on the server", () => {
    it("returns null by default", () => {
      expect(renderToStaticMarkup(<Probe media="@min-md" />)).toBe(
        "<i>null</i>",
      );
    });

    it("returns the given server value", () => {
      expect(
        renderToStaticMarkup(<Probe media="@min-md" serverValue={false} />),
      ).toBe("<i>false</i>");
      expect(
        renderToStaticMarkup(<Probe media="@min-md" serverValue={true} />),
      ).toBe("<i>true</i>");
    });
  });

  describe("in the browser", () => {
    it.each<[Media, string]>([
      ["@min-md", "(min-width: 768px)"],
      ["@up-sm", "(min-width: 640px)"],
      ["@max-md", "(max-width: 767.98px)"],
      ["@down-sm", "(max-width: 767.98px)"],
      ["@between-sm_lg", "(min-width: 640px) and (max-width: 1023.98px)"],
      ["@only-md", "(min-width: 768px) and (max-width: 1023.98px)"],
      ["@only-lg", "(min-width: 1024px)"],
    ])("resolves %s to the %s media query", (media, query) => {
      const { matchMedia } = stubMatchMedia();
      const root = createRoot(document.createElement("div"));

      act(() => root.render(<Probe media={media} />));

      expect(matchMedia).toHaveBeenCalledWith(query);

      act(() => root.unmount());
    });

    it("returns whether the media query matches once mounted", () => {
      stubMatchMedia({ matches: true });
      const root = createRoot(document.createElement("div"));

      act(() => root.render(<Probe media="@min-md" serverValue={false} />));

      expect(latest()).toBe(true);

      act(() => root.unmount());
    });

    it("updates when the media query match changes", () => {
      const { lists } = stubMatchMedia({ matches: false });
      const root = createRoot(document.createElement("div"));
      act(() => root.render(<Probe media="@min-md" />));

      expect(latest()).toBe(false);

      act(() => lists[0]?.change(true));
      expect(latest()).toBe(true);

      act(() => lists[0]?.change(false));
      expect(latest()).toBe(false);

      act(() => root.unmount());
    });

    it("removes the change listener on unmount", () => {
      const { lists } = stubMatchMedia();
      const root = createRoot(document.createElement("div"));
      act(() => root.render(<Probe media="@min-md" />));

      expect(lists[0]?.listeners.size).toBe(1);

      act(() => root.unmount());

      expect(lists[0]?.listeners.size).toBe(0);
    });

    it("subscribes to the new media query when it changes", () => {
      const { matchMedia, lists } = stubMatchMedia();
      const root = createRoot(document.createElement("div"));
      act(() => root.render(<Probe media="@min-md" />));
      act(() => root.render(<Probe media="@min-lg" />));

      expect(matchMedia).toHaveBeenLastCalledWith("(min-width: 1024px)");
      expect(lists[0]?.listeners.size).toBe(0);
      expect(lists[1]?.listeners.size).toBe(1);

      act(() => lists[1]?.change(true));
      expect(latest()).toBe(true);

      act(() => root.unmount());
    });

    it("does not re-subscribe when re-rendering with the same media query", () => {
      const { matchMedia } = stubMatchMedia();
      const root = createRoot(document.createElement("div"));
      act(() => root.render(<Probe media="@min-md" />));
      act(() => root.render(<Probe media="@min-md" serverValue={true} />));

      expect(matchMedia).toHaveBeenCalledTimes(1);

      act(() => root.unmount());
    });

    it("falls back to addListener/removeListener on legacy MediaQueryList", () => {
      const { lists } = stubMatchMedia({ legacy: true });
      const root = createRoot(document.createElement("div"));
      act(() => root.render(<Probe media="@max-lg" />));

      expect(lists[0]?.addEventListener).toBeUndefined();
      expect(lists[0]?.listeners.size).toBe(1);

      act(() => lists[0]?.change(true));
      expect(latest()).toBe(true);

      act(() => root.unmount());
      expect(lists[0]?.listeners.size).toBe(0);
    });
  });
});
