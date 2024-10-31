import { hashAny } from "./hashAny";

describe("hashAny", () => {
  test("hashing primitive values", () => {
    expect(hashAny(42)).toBe("42");
    expect(hashAny("hello")).toBe('"hello"');
    expect(hashAny(true)).toBe("true");
    expect(hashAny(null)).toBe("null");
    expect(hashAny(undefined)).toBe("undefined"); // undefined case
    expect(hashAny(Symbol("sym"))).toMatch(/^Symbol\(sym\)$/);
  });

  test("hashing arrays", () => {
    expect(hashAny([1, 2, 3])).toMatch(/^@\d+,\d+,\d+,$/); // Checking structure
    expect(hashAny(["a", "b", "c"])).toMatch(/^@"a","b","c",$/);
    expect(hashAny([1, "b", { key: "value" }])).toMatch(
      /^@\d,"b",#key:".+",,$/,
    ); // Mixed types
  });

  test("hashing objects", () => {
    const obj = { a: 1, b: 2 };
    const obj2 = { b: 2, a: 1 }; // Same properties in different order
    expect(hashAny(obj)).toEqual(hashAny(obj2)); // Same content, different order should hash the same

    expect(hashAny({})).toBe("#"); // Empty object
    expect(hashAny({ key: "value" })).toMatch(/^#key:".+",$/); // Single key-value
  });

  test("hashing nested structures", () => {
    const nested = { a: [1, 2, { b: "c" }] };
    expect(hashAny(nested)).toMatch(/^#a:@\d+,\d+,#b:".+",,,$/); // Nested structure
  });

  test("hashing dates", () => {
    const date = new Date("2023-01-01");
    expect(hashAny(date)).toBe(date.toJSON());
  });

  test("hashing circular references", () => {
    const obj = {} as { self: any };
    obj.self = obj;
    expect(hashAny(obj)).toMatch(/^#self:\d+~,$/); // Circular reference should be handled
  });

  test("hashing non-serializable values", () => {
    const func = () => {};
    // const error = new Error("error");
    expect(hashAny(func)).toMatch(/\d+~/);
    // expect(hashAny(error)).toBe(error.toString()); // Error should hash to its string representation
  });
});
