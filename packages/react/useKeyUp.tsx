import { useEffect } from "react";
import { on } from "@koine/dom";

export let useKeyUp = (
  callback: (event: KeyboardEvent) => void,
  deps: unknown[] = [],
) => {
  useEffect(() => {
    const listener = on(window, "keyup", (event: KeyboardEvent) => {
      // const { key } = event;
      // be sure we do not intercept keys combinations maybe used for other
      // actions like native browser navigation shortcuts
      // @see https://stackoverflow.com/a/37559790/1938970
      if (
        !event.ctrlKey &&
        !event.altKey &&
        !event.shiftKey &&
        !event.metaKey
      ) {
        callback(event);
      }
    });

    return listener;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callback, ...deps]);
};

export default useKeyUp;
