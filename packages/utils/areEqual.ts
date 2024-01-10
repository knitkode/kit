import { isArray } from "./isArray";
import { isObject } from "./isObject";

type ComparablePrimitive = string | number | boolean;

type Comparable =
  | ComparablePrimitive
  | object
  | Record<string, ComparablePrimitive>
  | Array<ComparablePrimitive>;

/**
 */
function areEqualArrays(
  a: Array<ComparablePrimitive>,
  b?: Array<ComparablePrimitive>,
) {
  if (!b) return false;
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; i++) {
    if (!areEqual(a[i], b[i])) return false;
  }
  return true;
}

/**
 * NOTE: Since we do not care about `undefined` values we do not check for equal
 * `Object.keys().length` equality
 */
function areEqualObjects(
  a: object | Record<string, unknown>,
  b?: object | Record<string, unknown>,
) {
  if (!b) return false;

  const aKeys = Object.keys(a);
  // const bKeys = Object.keys(b);

  // if (aKeys.length !== bKeys.length) {
  //   return false;
  // }

  for (const _key of aKeys) {
    const key = _key as keyof typeof a;
    if (!areEqual(a[key], b[key])) {
      return false;
    }
  }

  return true;
}

/**
 * A simple and quick deep equal objects utility. This is meant to be used
 * solely to deduplicate requests payload and perform comparison on JSON ready
 * objects made of primitives `string`, `number` and `boolean`s.
 *
 * It support nested `object`s and `array`s only.
 *
 * NB: `undefined` and `null` values do not count in the comparison as they are
 * usually meant to be ignored in JSON requestBody payloads.
 *
 * According to very rudimentary tests this function takes on average between
 * 0.15 ms and 2ms to compare two averaged sizes requet body payloads.
 *
 * @category object
 */
export function areEqual(a: Comparable, b?: Comparable) {
  if (!a && !b) {
    // console.log(`areEqual took ${performance.now() - t0} ms`);
    return true;
  }
  // const t0 = performance.now();
  if (!b && a !== b) {
    // console.log(`areEqual took ${performance.now() - t0} ms`);
    return false;
  }

  const areObjects = isObject(a) && isObject(b);
  if (areObjects && !areEqualObjects(a, b)) {
    // console.log(`areEqual took ${performance.now() - t0} ms`);
    return false;
  }

  const areArrays = isArray(a) && isArray(b);
  if (areArrays && !areEqualArrays(a, b)) {
    // console.log(`areEqual took ${performance.now() - t0} ms`);
    return false;
  }

  if (!areObjects && !areArrays && a !== b) {
    // console.log(`areEqual took ${performance.now() - t0} ms`);
    return false;
  }

  // console.log(`areEqual took ${performance.now() - t0} ms`);
  return true;
}

export default areEqual;
