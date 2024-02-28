/**
 * Remove class shortcut
 */
export let removeClass = <T extends Element>(el?: T, className = "") => {
  if (process.env["NODE_ENV"] === "development") {
    if (!el) {
      ("[@koine/dom:removeClass] unexisting DOM element");
      return;
    }
  }
  if (el) el.classList.remove(className);
};

export default removeClass;
