/**
 * Get random int (min and max included)
 *
 * @category math
 */
export let randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min);

export default randomInt;
