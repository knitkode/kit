/**
 * Sum array of numbers
 *
 * @category array
 * @category math
 */
export let arraySum = (numbers: number[]) =>
  numbers.reduce((sum, current) => sum + current, 0);

export default arraySum;
