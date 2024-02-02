import type { AnyFunction, TypeGuard } from "./getType";

/**
 * @category is
 */
export function isOneOf<A, B extends A, C extends A>(
  a: TypeGuard<A, B>,
  b: TypeGuard<A, C>,
): TypeGuard<A, B | C>;
export function isOneOf<A, B extends A, C extends A, D extends A>(
  a: TypeGuard<A, B>,
  b: TypeGuard<A, C>,
  c: TypeGuard<A, D>,
): TypeGuard<A, B | C | D>;
export function isOneOf<A, B extends A, C extends A, D extends A, E extends A>(
  a: TypeGuard<A, B>,
  b: TypeGuard<A, C>,
  c: TypeGuard<A, D>,
  d: TypeGuard<A, E>,
): TypeGuard<A, B | C | D | E>;
export function isOneOf<
  A,
  B extends A,
  C extends A,
  D extends A,
  E extends A,
  F extends A,
>(
  a: TypeGuard<A, B>,
  b: TypeGuard<A, C>,
  c: TypeGuard<A, D>,
  d: TypeGuard<A, E>,
  e: TypeGuard<A, F>,
): TypeGuard<A, B | C | D | E | F>;
export function isOneOf(
  a: AnyFunction,
  b: AnyFunction,
  c?: AnyFunction,
  d?: AnyFunction,
  e?: AnyFunction,
): (value: unknown) => boolean {
  return (value) =>
    a(value) ||
    b(value) ||
    (!!c && c(value)) ||
    (!!d && d(value)) ||
    (!!e && e(value));
}
