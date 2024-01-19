/**
 * Throttle function (e.g. for resize / scroll handlers)
 *
 * @category function
 * @borrows [Mobius1/Rangeable](https://github.com/Mobius1/Rangeable/)
 */
export function throttle<TFn extends Function, TContext>(
  fn: TFn,
  limit: number,
  context?: TContext,
) {
  let wait: boolean | undefined;
  return function (this: TContext, ...args: any[]) {
    context = context || this;
    if (!wait) {
      fn.apply(context, ...args);
      wait = true;
      return setTimeout(function () {
        wait = false;
      }, limit);
    }
    return;
  };
}

export default throttle;
