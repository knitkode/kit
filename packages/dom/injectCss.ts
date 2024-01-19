/**
 * Inject css
 */
export function injectCss(
  id: string,
  cssString = "",
  root: Document = document,
) {
  let styleblock;
  styleblock = root.getElementById(id);
  if (!styleblock) {
    styleblock = root.createElement("style");
    styleblock.id = id;
    root.body.appendChild(styleblock);
  }
  styleblock.innerHTML = cssString;
}

export default injectCss;
