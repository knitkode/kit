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

  test("hashing objects with an exact output", () => {
    expect(hashAny({ a: 1, b: "x" })).toBe('#b:"x",a:1,');
    expect(hashAny([1, "a", true, null])).toBe('@1,"a",true,null,');
  });

  test("hashing other primitives", () => {
    expect(hashAny(Number.NaN)).toBe("NaN");
    expect(hashAny(-0)).toBe("0");
    expect(hashAny(BigInt(10))).toBe("10");
    expect(hashAny(false)).toBe("false");
    expect(hashAny("")).toBe('""');
  });

  test("hashing regular expressions", () => {
    expect(hashAny(/ab+c/gi)).toBe("/ab+c/gi");
  });

  test("distinguishes numbers from numeric strings", () => {
    expect(hashAny(1)).not.toBe(hashAny("1"));
    expect(hashAny([1])).not.toBe(hashAny(["1"]));
  });

  test("hashing objects with the same content gives the same hash", () => {
    expect(hashAny({ a: [1, { b: 2 }] })).toBe(hashAny({ a: [1, { b: 2 }] }));
    expect(hashAny(new Date(0))).toBe(hashAny(new Date(0)));
  });

  test("hashing objects with different content gives different hashes", () => {
    expect(hashAny({ a: 1 })).not.toBe(hashAny({ a: 2 }));
    expect(hashAny({ a: 1 })).not.toBe(hashAny({ b: 1 }));
    expect(hashAny([1, 2])).not.toBe(hashAny([2, 1]));
  });

  test("ignores undefined object values but not undefined array items", () => {
    expect(hashAny({ a: 1, b: undefined })).toBe(hashAny({ a: 1 }));
    expect(hashAny([undefined])).toBe("@undefined,");
    expect(hashAny([1, undefined])).not.toBe(hashAny([1]));
  });

  test("returns the same hash for the same reference", () => {
    const obj = { a: 1 };
    const map = new Map([["a", 1]]);
    expect(hashAny(obj)).toBe(hashAny(obj));
    expect(hashAny(map)).toBe(hashAny(map));
  });

  test("hashing non plain objects by identity", () => {
    const fn1 = () => 1;
    const fn2 = () => 1;
    expect(hashAny(new Map())).toMatch(/^\d+~$/);
    expect(hashAny(new Set([1]))).toMatch(/^\d+~$/);
    expect(hashAny(new Set([1]))).not.toBe(hashAny(new Set([1])));
    expect(hashAny(fn1)).not.toBe(hashAny(fn2));
  });
});
