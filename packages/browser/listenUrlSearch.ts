import { isBrowser } from "@koine/utils";
import { on } from "@koine/dom";

type Extension = {
  /**
   * Flag that tells if `history` methods have been replaced
   */
  r?: boolean;
  h: Set<Handler>;
};

/**
 * @param prevLocationSearch The previous URL search query e.g. `?myparam=mvalue`
 * @param newLocationSearch The previous URL search query e.g. `?myparam=mvalue`
 */
type Handler = (prevLocationSearch: string, newLocationSearch: string) => void;

export type HistoryExtended = History & { __: Extension };
type HistoryPushState = (typeof window)["history"]["pushState"];
type HistoryReplaceState = (typeof window)["history"]["replaceState"];
type HistoryMethod = HistoryPushState | HistoryReplaceState;

declare const history: HistoryExtended;

let extendHistoryMethod = (
  fn: HistoryMethod,
  runHandlers: () => void,
  before?: boolean,
) => {
  return function interceptor(this: void, ...args: Parameters<HistoryMethod>) {
    if (before) {
      runHandlers();
      return fn.apply(this, args);
    }

    const result = fn.apply(this, args);
    runHandlers();
    return result;
  };
};

let prevSearch = isBrowser ? location.search : "";

let runHandlers = () => {
  const newSearch = location.search;
  // console.log(`listenUrlSearch: "${prevSearch}" vs "${newSearch}`);

  if (newSearch !== prevSearch) {
    const listeners = (history as HistoryExtended).__.h.values();
    for (const listener of listeners) {
      listener(prevSearch, newSearch);
    }
  }
  prevSearch = newSearch;
};

/**
 * Here we extend and mutate the native `window.history` object so that multiple
 * scripts can add url change handlers without interfering each other and using
 * the same single listener.
 *
 * @borrows [SO answer](https://stackoverflow.com/a/42727249/1938970)
 *
 * @category location
 * @category navigation
 * @category events
 *
 * @returns A de-register function to remove the handler
 */
export let listenUrlSearch = (handler: Handler) => {
  if (!(history as HistoryExtended).__) {
    // replace browser's history global methods
    history.pushState = extendHistoryMethod(history.pushState, runHandlers);
    history.replaceState = extendHistoryMethod(
      history.replaceState,
      runHandlers,
    );

    // listen native history events
    on(window, "popstate", runHandlers);

    // extend history object
    (history as HistoryExtended).__ = { h: new Set() };
  }

  if (!(history as HistoryExtended).__.h.has(handler)) {
    (history as HistoryExtended).__.h.add(handler);
  }

  return () => {
    (history as HistoryExtended).__.h.delete(handler);
  };
};

export default listenUrlSearch;
