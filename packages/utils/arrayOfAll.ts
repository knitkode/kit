/**
 * Ensure an array contains all desired values
 *
 * @category array
 * @borrows [SO comment by `CertainPerformance`](https://stackoverflow.com/a/60132060/1938970)
 *
 * @usage
 * ```ts
 * type Fruit = "pear" | "apple" | "orange";
 *
 * const arrayOfAllFruits = arrayOfAll<Fruit>();
 *
 * const allFruits = arrayOfAllFruits([ "pear", "apple", "orange" ]); // ts compiler ok
 * const allFruits = arrayOfAllFruits([ "pear", "apple" ]); // ts compiler fails
 * ```
 */
export let arrayOfAll =
  <T>() =>
  <U extends T[]>(array: U & ([T] extends [U[number]] ? unknown : "Invalid")) =>
    array;

/**
 * @usage
 * ```ts
 * type Check_AreAllListed = AssertTrue<ArrayOfAll<typeof myList, MyUnion>>;
 * ```
 */
export type ArrayOfAll<
  List extends unknown[],
  Union,
> = List[number] extends Union
  ? Union extends List[number]
    ? true
    : "Incomplete"
  : "Incomplete";

export default arrayOfAll;
