import { expectTypeOf } from "expect-type";
import { describe, expect, it } from "vitest";
import * as starImport from "./fixtures";
import isArray from "./isArray";
import { objectMerge } from "./objectMerge";
import { objectMergeArrayFn } from "./objectMergeArrayFn";
import { objectMergeCreate } from "./objectMergeCreate";
import { objectMergeFn } from "./objectMergeFn";

// Part of tests brought from jonschlinkert/defaults-deep (MIT)
const nonObject = [null, undefined, [], false, true, 123];

describe("objectMerge", () => {
  it("should copy only missing properties defaults", () => {
    const result = objectMerge({ a: "c" }, { a: "bbb", d: "c" });
    expect(result).toEqual({ a: "c", d: "c" });
    expectTypeOf(result).toMatchTypeOf<{ a: string; d: string }>();
  });

  it("should fill in values that are null", () => {
    const result1 = objectMerge({ a: null as null }, { a: "c", d: "c" });
    expect(result1).toEqual({ a: "c", d: "c" });
    expectTypeOf(result1).toMatchTypeOf<{ a: string; d: string }>();

    const result2 = objectMerge({ a: "c" }, { a: null as null, d: "c" });
    expect(result2).toEqual({ a: "c", d: "c" });
    expectTypeOf(result2).toMatchTypeOf<{ a: string; d: string }>();
  });

  it("should copy nested values", () => {
    const result = objectMerge({ a: { b: "c" } }, { a: { d: "e" } });
    expect(result).toEqual({
      a: { b: "c", d: "e" },
    });
    expectTypeOf(result).toMatchTypeOf<{ a: { b: string; d: string } }>();
  });

  it("should concat array values by default", () => {
    const result = objectMerge({ array: ["a", "b"] }, { array: ["c", "d"] });
    expect(result).toEqual({
      array: ["a", "b", "c", "d"],
    });
    expectTypeOf(result).toMatchTypeOf<{ array: string[] }>();
  });

  it("should correctly type differing array values", () => {
    const item1 = { name: "Name", age: 21 };
    const item2 = { name: "Name", age: "42" };
    const result = objectMerge({ items: [item1] }, { items: [item2] });
    expect(result).toEqual({ items: [item1, item2] });
    expectTypeOf(result).toMatchTypeOf<{
      items: Array<
        { name: string; age: number } | { name: string; age: string }
      >;
    }>();
  });

  it("should avoid merging objects with custom constructor", () => {
    class Test {
      constructor(public value: string) {}
    }
    const result = objectMerge(
      { test: new Test("a") },
      { test: new Test("b") },
    );
    expect(result).toEqual({ test: new Test("a") });
  });

  it("should assign date properly", () => {
    const date1 = new Date("2020-01-01");
    const date2 = new Date("2020-01-02");
    const result = objectMerge({ date: date1 }, { date: date2 });
    expect(result).toEqual({ date: date1 });
  });

  it("should correctly merge different object types", () => {
    const fn = () => 42;
    const re = /test/i;

    const result = objectMerge({ a: fn }, { a: re });
    expect(result).toEqual({ a: fn });
    expectTypeOf(result).toMatchTypeOf<{ a: (() => number) | RegExp }>();
  });

  it("should handle non object first param", () => {
    for (const val of nonObject) {
      expect(objectMerge(val, { d: true })).toEqual({ d: true });
    }
  });

  it("should handle non object second param", () => {
    for (const val of nonObject) {
      expect(objectMerge({ d: true }, val)).toEqual({ d: true });
    }
  });

  it("multi defaults", () => {
    const result = objectMerge(
      { a: 1 },
      { b: 2, a: "x" },
      { c: 3, a: "x", b: "x" },
    );
    expect(result).toEqual({
      a: 1,
      b: 2,
      c: 3,
    });
    expectTypeOf(result).toMatchTypeOf<{
      a: string | number;
      b: string | number;
      c: number;
    }>();
  });

  it("should not override Object prototype", () => {
    const payload = JSON.parse(
      '{"constructor": {"prototype": {"isAdmin": true}}}',
    );
    objectMerge({}, payload);
    objectMerge(payload, {});
    objectMerge(payload, payload);
    // @ts-ignore
    expect({}.isAdmin).toBe(undefined);
  });

  it("should ignore non-object arguments", () => {
    expect(objectMerge(null, { foo: 1 }, false, 123, { bar: 2 })).toEqual({
      foo: 1,
      bar: 2,
    });
  });

  it("should merge types of more than two objects", () => {
    interface SomeConfig {
      foo: string;
    }
    interface SomeOtherConfig {
      bar: string[];
    }
    interface ThirdConfig {
      baz: number[];
    }
    interface ExpectedMergedType {
      foo: string;
      bar: string[];
      baz: number[];
    }
    expectTypeOf(
      objectMerge({} as SomeConfig, {} as SomeOtherConfig, {} as ThirdConfig),
    ).toMatchTypeOf<ExpectedMergedType>();
  });

  it("should allow partials within merge chain", () => {
    interface SomeConfig {
      foo: string[];
    }
    interface SomeOtherConfig {
      bar: string[];
    }
    interface ExpectedMergedType {
      foo: string[];
      bar: string[];
    }
    let options: (SomeConfig & SomeOtherConfig) | undefined;

    expectTypeOf(
      objectMerge(options ?? {}, { foo: ["test"] }, { bar: ["test2"] }, {}),
    ).toMatchTypeOf<ExpectedMergedType>();

    expectTypeOf(
      objectMerge({ foo: ["test"] }, {}, { bar: ["test2"] }, {}),
    ).toMatchTypeOf<ExpectedMergedType>();
  });

  it("custom merger", () => {
    const ext = objectMergeCreate((obj, key, val) => {
      if (typeof val === "number") {
        (obj as any)[key] += val;
        return true;
      }
    });
    expect(ext({ cost: 15 }, { cost: 10 })).toEqual({ cost: 25 });
  });

  it("objectMergeFn()", () => {
    const num = () => 20;
    expect(
      objectMergeFn(
        {
          ignore: (val: any) => val.filter((i: any) => i !== "dist"),
          num,
          ignored: num,
        },
        {
          ignore: ["node_modules", "dist"],
          num: 10,
        },
      ),
    ).toEqual({
      ignore: ["node_modules"],
      num: 20,
      ignored: num,
    });
  });

  it("objectMergeArrayFn()", () => {
    const num = () => 20;
    expect(
      objectMergeArrayFn(
        {
          arr: () => ["c"],
          num,
        },
        {
          arr: ["a", "b"],
          num: 10,
        },
      ),
    ).toEqual({
      arr: ["c"],
      num,
    });
  });

  it("custom merger with namespace", () => {
    const ext = objectMergeCreate((obj, key, val, namespace) => {
      // console.log({ obj, key, val, namespace })
      if (key === "modules") {
        // TODO: It is not possible to override types with extend()
        // @ts-ignore
        obj[key] = namespace + ":" + [...val, ...obj[key]].sort().join(",");
        return true;
      }
    });

    const obj1 = { modules: ["A"], foo: { bar: { modules: ["X"] } } };
    const obj2 = { modules: ["B"], foo: { bar: { modules: ["Y"] } } };
    expect(ext(obj1, obj2)).toEqual({
      modules: ":A,B",
      foo: { bar: { modules: "foo.bar:X,Y" } },
    });
  });

  it("custom merge flat arrays without duplicates", () => {
    const objectMerge = objectMergeCreate((object, key, currentValue) => {
      if (isArray(object[key]) && isArray(currentValue)) {
        // @ts-expect-error nevermind
        object[key] = [...new Set([...currentValue, ...object[key]])];
        return true;
      }
      return false;
    });

    expect(objectMerge({ a: ["a", "b"] }, { a: ["b", "c"] })).toEqual({
      a: ["a", "b", "c"],
    });
  });

  it("works with asterisk-import", () => {
    expect(
      objectMerge(starImport, {
        a: 2,
        exp: {
          anotherNested: 2,
        },
      }),
    ).toStrictEqual({
      a: 2,
      exp: {
        anotherNested: 2,
        nested: 1,
      },
    });
  });
});
