type ComparablePrimitive = string | number | boolean;
type Comparable = ComparablePrimitive | object | Record<string, ComparablePrimitive> | Array<ComparablePrimitive>;
export declare function areEqual(a: Comparable, b?: Comparable): boolean;
export default areEqual;
