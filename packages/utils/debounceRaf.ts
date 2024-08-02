/**
 * Debounce function (with `requestAnimationFrame`)
 *
 * @category function
 * @borrows [vanillajstoolkit/debounce by Chris Ferdinandi](https://vanillajstoolkit.com/helpers/debounce/)
 */
export function debounceRaf<T extends (...args: any[]) => any>(
  this: unknown,
  fn: T,
) {
  let timeout: number;

  return function (this: unknown, ...args: Parameters<T>) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const context = this;

    // If there's a timer, cancel it
    if (timeout) {
      window.cancelAnimationFrame(timeout);
    }

    // Setup the new requestAnimationFrame()
    timeout = window.requestAnimationFrame(function () {
      fn.apply(context, args);
    });
  };
}

export default debounceRaf;
