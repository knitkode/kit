import { off } from "./off";
import { on } from "./on";

/**
 * Native `scrollTo`, `"smooth"` and with callback
 *
 * @borrows https://stackoverflow.com/a/55686711/1938970
 *
 * @param offset - offset to scroll to
 * @param callback - callback function
 * @param [fallbackTimeout] - this appears to be needed in some hard to reproduce scenario on safari, where the callback seem to be never called
 * @param [behavior="smooth"]
 */
export let scrollTo = (
  destination: number,
  callback?: () => void,
  fallbackTimeout?: number,
  behavior?: ScrollBehavior,
) => {
  const fixedDestination = destination.toFixed();
  if (callback) {
    let callbackFired = false;

    const onScroll = function () {
      if (window.pageYOffset.toFixed() === fixedDestination) {
        off(window, "scroll", onScroll);
        callbackFired = true;
        callback();
      }
    };

    on(window, "scroll", onScroll);
    onScroll();

    if (fallbackTimeout) {
      setTimeout(() => {
        if (!callbackFired) {
          off(window, "scroll", onScroll);
          callback();
        }
      }, fallbackTimeout);
    }
  }

  window.scrollTo({
    top: destination,
    behavior: behavior || "smooth",
  });
};

export default scrollTo;
