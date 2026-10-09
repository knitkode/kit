import type { Locale } from "date-fns";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { useDateLocale } from "./useDateLocale";

// tells React to run effects synchronously inside `act()`
(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const renderUseDateLocale = async (locale?: string, defaultLocale?: string) => {
  const results: Array<Locale | undefined> = [];
  const Probe = ({ locale }: { locale?: string }) => {
    results.push(useDateLocale(locale, defaultLocale));
    return null;
  };
  const root = createRoot(document.createElement("div"));
  await act(async () => root.render(<Probe locale={locale} />));
  // let the dynamic import settle
  await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
  return {
    results,
    latest: () => results[results.length - 1],
    rerender: async (nextLocale?: string) => {
      await act(async () => root.render(<Probe locale={nextLocale} />));
      await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
    },
    unmount: () => act(() => root.unmount()),
  };
};

// the hook dynamically imports the date-fns locale, preload it so that it
// resolves within the `act()` scopes of the tests
beforeAll(async () => {
  await import("date-fns/locale/en-US");
});

describe("useDateLocale", () => {
  it("returns undefined until the locale is loaded", async () => {
    const { results, unmount } = await renderUseDateLocale("en-US");

    expect(results[0]).toBeUndefined();
    unmount();
  });

  it("loads the requested date-fns locale", async () => {
    const { latest, unmount } = await renderUseDateLocale("en-US");

    expect(latest()?.code).toBe("en-US");
    expect(latest()?.localize.month(0)).toBe("January");
    unmount();
  });

  it("loads the locale when none is requested", async () => {
    const { latest, unmount } = await renderUseDateLocale(undefined);

    expect(latest()?.code).toBe("en-US");
    unmount();
  });

  it("does not load the locale again on re-render", async () => {
    const { latest, rerender, results, unmount } =
      await renderUseDateLocale("en-US");
    const loaded = latest();
    const rendersBefore = results.length;

    await rerender("en-US");

    expect(latest()).toBe(loaded);
    expect(results).toHaveLength(rendersBefore + 1);
    unmount();
  });
});
