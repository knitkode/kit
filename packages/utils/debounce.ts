/**
 * Debounce function (with `setTimeout`)
 *
 * @category function
 * @borrows [davidwalsh/debounce](https://davidwalsh.name/javascript-debounce-function)
 */
export let debounce = <T extends (...args: any[]) => any>(
  fn: T,
  wait?: number,
  immediate?: boolean,
) => {
  let timeout: null | number | NodeJS.Timeout;

  return function (this: unknown, ...args: Parameters<T>) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const context = this;

    const later = function () {
      timeout = null;
      if (!immediate) fn.apply(context, args);
    };

    const callNow = immediate && !timeout;

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (callNow) fn.apply(context, args);
  };
};

export default debounce;
