import { $ } from "./$";

/**
 * Inject css
 *
 * @param id The `<style>` HTMLElement's `id`
 */
export let injectCss = (
  id: string,
  cssString = "",
  root: Document = document,
) => {
  let styleblock = $<HTMLStyleElement>("#" + id);
  if (!styleblock) {
    styleblock = root.createElement("style");
    styleblock.id = id;
    root.body.appendChild(styleblock);
  }
  styleblock.innerHTML = cssString;
};
