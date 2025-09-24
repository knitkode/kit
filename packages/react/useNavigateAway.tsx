import { useEffect, useRef } from "react";
import { on } from "@koine/dom";

/**
 * @return A custom error message (most browser will ignore it), or just a
 * boolean to signal whether we want to prompt the user
 *
 * We might instead return an array with the above as first element and two
 * callbacks, but the callback technique is too cumbersome and unreliable
 * probably:
 * 2) A callback on confirmed leaving
 * 3) A callback on cancel, user stays on page
 */
export type UseNavigateAwayHandler = (
  event: BeforeUnloadEvent,
) => string | boolean;
// type UseNavigateAwayHandler = (event: BeforeUnloadEvent) => [
//   string | boolean,
//   (() => unknown) | undefined,
//   (() => unknown) | undefined,
// ];

type UseNavigateAwayBeforeunload = (event: BeforeUnloadEvent) => unknown;
// type UseNavigateAwayPagehideHandler = (event: PageTransitionEvent) => unknown;

/**
 * @resources
 *
 * About browser's specs see:
 * - https://developer.mozilla.org/en-US/docs/Web/API/Window/pagehide_event
 * - https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/HandlingEvents/HandlingEvents.html#//apple_ref/doc/uid/TP40006511-SW5
 * - https://stackoverflow.com/questions/58009424/pagehide-event-on-google-chrome
 *
 * About react see:
 * - https://github.com/jacobbuck/react-beforeunload
 * - https://github.com/dioscarey/react-beforeunload-component
 *
 * About next.js see:
 * - https://github.com/vercel/next.js/issues/2476
 * - https://github.com/vercel/next.js/issues/2694
 *
 * For the callback technique see:
 * - https://stackoverflow.com/a/11835394/1938970
 */
export let useNavigateAway = (handler: UseNavigateAwayHandler) => {
  const beforeUnloadHandlerRef = useRef<
    UseNavigateAwayBeforeunload | undefined
  >(null);
  // const pagehideHandlerRef = useRef<UseNavigateAwayPagehideHandler | undefined>();

  useEffect(() => {
    beforeUnloadHandlerRef.current = (event) => {
      const customMessageOrCondition = handler(event);
      if (customMessageOrCondition) {
        event.preventDefault();
      }

      // Handle legacy `event.returnValue` property
      // https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event
      if (typeof customMessageOrCondition === "string") {
        return (event.returnValue = customMessageOrCondition);
      }
      // Chrome doesn't support `event.preventDefault()` on `BeforeUnloadEvent`,
      // instead it requires `event.returnValue` to be set
      // https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onbeforeunload#browser_compatibility
      if (event.defaultPrevented) {
        return (event.returnValue = "");
      }

      return;
    };

    // pagehideHandlerRef.current = (event) => {
    //   const returnValue = handler?.(event);
    //   if (event.persisted) {
    //     // If the event's persisted property is `true` the page is about
    //     // to enter the Back-Forward Cache, which is also in the frozen state.
    //   } else {
    //     // If the event's persisted property is not `true` the page is
    //     // about to be unloaded.
    //   }
    // };
  }, [handler]);

  useEffect(() => {
    const listenerBeforeunload = on(window, "beforeunload", (event) =>
      beforeUnloadHandlerRef.current?.(event),
    );
    // const listenerPagehide = on(window, "pagehide", (event) =>
    //   pagehideHandlerRef.current?.(event)
    // );

    return listenerBeforeunload;
    // return () => {
    //   listenerBeforeunload();
    //   // listenerPagehide();
    // };
  }, []);
};

export default useNavigateAway;
