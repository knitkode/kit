import { off, on } from "./index";

export function onClickOutside(
  element: HTMLElement,
  callback: (event: Event) => any,
  autoUnbind = false,
) {
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
}
