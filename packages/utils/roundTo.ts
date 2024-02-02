/**
 * Round to given number of the given number of decimals
 *
 * @category math
 * @see https://stackoverflow.com/a/15762794/1938970
 */
export let roundTo = (num: number, decimals = 2): string => {
  if (isFinite(num) && !isNaN(num)) {
    // method 1
    // return Number(num).toFixed(decimals);

    // method 2: @see https://stackoverflow.com/a/43532829/1938970
    const multiplicator = Math.pow(10, decimals);
    return Math.round(num * multiplicator) / multiplicator + "";

    // method 3: @see https://stackoverflow.com/a/15762794/1938970
    // let negative = false;
    // if (num < 0) {
    //   negative = true;
    //   num = num * -1;
    // }
    // const multiplicator = Math.pow(10, decimals);
    // const outputStr = parseFloat((num * multiplicator).toFixed(11));
    // let outputNum = (Math.round(outputStr) / multiplicator).toFixed(decimals);
    // if (negative) {
    //   return (Number(outputNum) * -1).toFixed(decimals);
    // }
    // return outputNum;
  }

  if (process.env["NODE_ENV"] === "development") {
    console.warn(
      "[@koine/utils] math:roundTo -> given not a finite number as first arg",
    );
  }
  return "";
};
