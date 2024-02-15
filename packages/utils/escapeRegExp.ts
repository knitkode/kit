/**
 * @borrows [MDN Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)
 * @borrows [SO's answer by Mathias Bynens](https://stackoverflow.com/a/9310752/1938970)
 *
 * @category escape
 * @category RegExp
 */
export let escapeRegExp = (text: string) =>
  text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
// text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
