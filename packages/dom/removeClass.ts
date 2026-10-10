/**
 * Remove class shortcut
 */
export let removeClass = <T extends Element>(el?: T, className?: string) => {
  if (process.env["NODE_ENV"] === "development") {
    if (!el) {
      console.warn("[@knitkode/dom:removeClass] unexisting DOM element");
      return;
    }
  }
  if (el && className) el.classList.remove(className);
};

export default removeClass;
