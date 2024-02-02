import { useEffect, useMemo, useRef, useState } from "react";
import { debounce, noop } from "@koine/utils";
import {
  listenResizeDebounced,
  listenScrollDebounced,
  off,
  on,
} from "@koine/dom";

let observer: ResizeObserver | undefined;

interface RectReadOnly {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
  readonly left: number;
  [key: string]: number;
}

type HTMLOrSVGElement = HTMLElement | SVGElement;

type State = [
  /** element */
  HTMLOrSVGElement | null,
  /** scrollContainers */
  HTMLOrSVGElement[] | null,
  /** resizeObserver */
  ResizeObserver | null,
  /** lastBounds */
  RectReadOnly,
];

// Returns a list of scroll offsets
let findScrollContainers = (
  element: HTMLOrSVGElement | null,
): HTMLOrSVGElement[] => {
  const result: HTMLOrSVGElement[] = [];
  if (!element || element === document.body) return result;
  const { overflow, overflowX, overflowY } = window.getComputedStyle(element);
  if (
    [overflow, overflowX, overflowY].some(
      (prop) => prop === "auto" || prop === "scroll",
    )
  )
    result.push(element);
  return [...result, ...findScrollContainers(element.parentElement)];
};

const keys: (keyof RectReadOnly)[] = [
  "x",
  "y",
  "top",
  "bottom",
  "left",
  "right",
  "width",
  "height",
];

const areBoundsEqual = (a: RectReadOnly, b: RectReadOnly) =>
  keys.every((key) => a[key] === b[key]);

export type UseMeasureOptions = {
  scroll?: boolean;
  // offsetSize?: boolean;
};

export type UseMeasureReturn = [
  (element: HTMLOrSVGElement | null) => void,
  RectReadOnly,
  () => void,
];

/**
 * Use measure hook
 *
 * @borrows [pmndrs/react-use-measure](https://github.com/pmndrs/react-use-measure)
 */
export let useMeasure = (options?: UseMeasureOptions): UseMeasureReturn => {
  const { scroll = false /* offsetSize = false */ } = options || {};
  const [bounds, setBounds] = useState<RectReadOnly>({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    bottom: 0,
    right: 0,
    x: 0,
    y: 0,
  });

  // keep all state in a ref
  const state = useRef<State>([
    // element
    null,
    // scrollContainers
    null,
    // resizeObserver
    null,
    // lastBounds
    bounds,
  ]);

  // make sure to update state only as long as the component is truly mounted
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => void (mounted.current = false);
  }, []);

  // memoize handlers, so event-listeners know when they should update
  const [forceRefresh /* resizeChange */, , scrollChange] = useMemo(() => {
    const callback = (..._args: unknown[]) => {
      const [element, , , lastBounds] = state.current;

      if (!element) return;

      const size = element.getBoundingClientRect() as unknown as RectReadOnly;

      // if (element instanceof HTMLElement && offsetSize) {
      //   size.height = element.offsetHeight;
      //   size.width = element.offsetWidth;
      // }

      Object.freeze(size);

      if (mounted.current && !areBoundsEqual(lastBounds, size)) {
        state.current[3] = size;
        setBounds(size);
      }
    };
    const debouncedCallback = debounce(callback);
    return [callback, debouncedCallback, debouncedCallback];
  }, [setBounds /* , offsetSize */]);

  // cleanup current scroll-listeners / observers
  function removeListeners() {
    const [, scrollContainers, resizeObserver] = state.current;
    if (scrollContainers) {
      scrollContainers.forEach((element) =>
        off(element, "scroll", scrollChange),
      );
      state.current[1] = null;
    }

    if (resizeObserver) {
      resizeObserver.disconnect();
      state.current[2] = null;
    }
  }

  // add scroll-listeners / observers
  function addListeners() {
    const [element, scrollContainers] = state.current;
    if (!element) return;

    if (!observer && ResizeObserver) {
      observer = new ResizeObserver(scrollChange);
      state.current[2] = observer;
      observer.observe(element);
      if (scroll && scrollContainers) {
        scrollContainers.forEach((scrollContainer) =>
          on(scrollContainer, "scroll", scrollChange, {
            capture: true,
            passive: true,
          }),
        );
      }
    }
  }

  // the ref we expose to the user
  const ref = (node: HTMLOrSVGElement | null) => {
    if (!node || node === state.current[0]) return;
    removeListeners();
    state.current[0] = node;
    state.current[1] = findScrollContainers(node);
    addListeners();
  };

  // add general event listeners
  // useOnWindowScroll(forceRefresh, Boolean(scroll));
  // useOnWindowResize(() => {
  //   debugger;
  //   forceRefresh();
  // });

  useEffect(() => {
    if (scroll) {
      const listener = listenScrollDebounced(0, forceRefresh, 100);
      return listener;
    }
    return noop;
  }, [scroll, forceRefresh]);

  useEffect(() => {
    // const listener = listenResizeDebounced(onWindowResize);
    // return listener;
    const listener = listenResizeDebounced(0, forceRefresh, 100);
    return listener;
  }, [forceRefresh]);

  // respond to changes that are relevant for the listeners
  useEffect(() => {
    removeListeners();
    addListeners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scroll /* , scrollChange, resizeChange */]);

  useEffect(() => {
    // operate on mount, @kuus on the original version there is no call on mount?
    forceRefresh();

    // remove all listeners when the components unmounts
    return removeListeners;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [ref, bounds, forceRefresh];
};
