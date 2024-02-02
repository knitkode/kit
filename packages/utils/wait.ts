/**
 * A promisified `setTimeout`
 *
 * @category async
 */
export let wait = (milliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));
