import { isBrowser } from "@koine/utils";

// import useHeader from "./Header/useHeader";

export let useScrollTo = (id = "", offset = 0) => {
  // FIXME: is the useHeader still needed?
  // const [, , headerHeight] = useHeader();
  if (!isBrowser) {
    return;
  }
  const headerOffset = /* headerHeight || */ 0;
  let element = document.getElementById(id);
  let top = 0;

  if (element && element.offsetParent) {
    do {
      top += element.offsetTop;
    } while ((element = element.offsetParent as HTMLElement));
  }

  top -= offset;
  top -= headerOffset;

  window.scroll(0, top);
};

export default useScrollTo;
