import { off } from "./off";
import { on } from "./on";

export let onClickOutside = <T extends HTMLElement>(
  element: T,
  callback: (event: Event) => any,
  autoUnbind = false,
) => {
  const bind = (event: Event) => {
    // if (event.target.closest(element) === null) {
    if (!element.contains(event.target as Element)) {
      callback(event);
      if (autoUnbind) unbind();
    }
  };

  const unbind = () => {
    off(document, "click", bind);
  };

  on(document, "click", bind);

  return unbind;
};
