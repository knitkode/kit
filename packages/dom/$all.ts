/**
 * Sizzle/jQuery like DOM nodes shortcut for `document.querySelectorAll`
 * To avoid an extra function call we inline the above `escape`
 *
 * @param string selector DOM selector
 * @param parent It falls back to `window.document`
 * @param avoidEscape Whether to avoid escaping `:` in the selector string
 */
export let $all = <T extends Element = HTMLElement>(
  selector: string,
  parent?: Element | HTMLElement | Document | null,
  avoidEscape?: boolean,
) =>
  (parent ? parent : document).querySelectorAll(
    avoidEscape ? selector : selector.replace(/:/g, "\\:"),
  ) as unknown as NodeListOf<T>;

export default $all;
