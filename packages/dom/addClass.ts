/**
 * Add class shortcut
 */
export let addClass = <T extends Element = HTMLElement>(
  el?: T,
  className?: string,
) => {
  if (process.env["NODE_ENV"] === "development") {
    if (!el) {
      console.warn("[@knitkode/dom:addClass] unexisting DOM element");
      return;
    }
  }
  if (el && className) el.classList.add(className);
};

export default addClass;
