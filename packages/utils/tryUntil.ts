/**
 * @category function
 * @category async
 *
 * @borrows [Javascript: Wait Until Something Happens or Timeout](https://levelup.gitconnected.com/javascript-wait-until-something-happens-or-timeout-82636839ea93)
 *
 * @param timeout in `ms`
 * @param interval in `ms`
 */
export let tryUntil = (
  test: () => boolean,
  timeout: number,
  interval: number,
  resolve: () => void,
  reject?: () => void,
) => {
  // return new Promise((resolve, reject) => {
  const timeWas = new Date();
  const wait = setInterval(function () {
    if (test()) {
      // console.log("resolved after", new Date() - timeWas, "ms");
      clearInterval(wait);
      resolve();
    } else if (
      (new Date() as unknown as number) - (timeWas as unknown as number) >
      timeout
    ) {
      // console.log("rejected after", new Date() - timeWas, "ms");
      clearInterval(wait);
      if (reject) reject();
    }
  }, interval);
  // });
};

export default tryUntil;
