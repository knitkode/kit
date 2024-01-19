import { type TypeGuard } from "./getType";
export declare function isOneOf<A, B extends A, C extends A>(a: TypeGuard<A, B>, b: TypeGuard<A, C>): TypeGuard<A, B | C>;
export declare function isOneOf<A, B extends A, C extends A, D extends A>(a: TypeGuard<A, B>, b: TypeGuard<A, C>, c: TypeGuard<A, D>): TypeGuard<A, B | C | D>;
export declare function isOneOf<A, B extends A, C extends A, D extends A, E extends A>(a: TypeGuard<A, B>, b: TypeGuard<A, C>, c: TypeGuard<A, D>, d: TypeGuard<A, E>): TypeGuard<A, B | C | D | E>;
export declare function isOneOf<A, B extends A, C extends A, D extends A, E extends A, F extends A>(a: TypeGuard<A, B>, b: TypeGuard<A, C>, c: TypeGuard<A, D>, d: TypeGuard<A, E>, e: TypeGuard<A, F>): TypeGuard<A, B | C | D | E | F>;
export default isOneOf;
