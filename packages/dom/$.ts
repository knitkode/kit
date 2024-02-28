/**
 * Sizzle/jQuery like DOM nodes shortcut for `document.querySelector`
 * To avoid an extra function call we inline the above `escape`
 *
 * @param selector DOM selector
 * @param parent It falls back to `window.document`
 * @param avoidEscape Whether to avoid escaping `:` in the selector string
 * @example <caption>Basic DOM selection</caption>
 * const $container = $(".my-section:");
 * const $el = $("[data-some-attr]", $container);
 */
export let $ = <T extends Element = HTMLElement>(
  selector: string,
  parent?: HTMLElement | Document | null,
  avoidEscape?: boolean,
) =>
  (parent ? parent : document).querySelector(
    avoidEscape ? selector : selector.replace(/:/g, "\\:"),
  ) as unknown as T;

export default $;
