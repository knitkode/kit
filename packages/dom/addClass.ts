/**
 * Add class shortcut
 */
export let addClass = <T extends Element = HTMLElement>(
  el?: T,
  className = "",
) => {
  if (process.env["NODE_ENV"] === "development") {
    if (!el) {
      console.warn("[@koine/dom:addClass] unexisting DOM element");
      return;
    }
  }
  if (el) el.classList.add(className);
};
