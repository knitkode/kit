import { useEffect, useState } from "react";
import { debounce as _debounce } from "@koine/utils";
import { listenResize, listenResizeDebounced } from "@koine/dom";

/**
 * # Use `window` size
 *
 * @param args Optionally pass {@link _debounce} arguments (`wait` and `immediate`)
 *
 * @returns An array with:
 * 1) _width_: using `window.innerWidth`
 * 2) _height_: using `window.innerHeight`
 */
export let useWindowSize = (
  wait?: Parameters<typeof _debounce>[1],
  immediate?: Parameters<typeof _debounce>[2],
) => {
  const [width, widthSet] = useState(0);
  const [height, heightSet] = useState(0);

  useEffect(() => {
    const updateSize = () => {
      widthSet(window.innerWidth);
      heightSet(window.innerHeight);
    };
    const listener = wait
      ? listenResizeDebounced(0, updateSize, wait, immediate)
      : listenResize(updateSize);
    updateSize();
    return listener;
  }, [wait, immediate]);

  return [width, height] as const;
};

export default useWindowSize;
