import { split } from "./split";

describe("split", () => {
  it.each([
    ["a,b,c", ",", ["a", "b", "c"]],
    ["a, b, c", ", ", ["a", "b", "c"]],
    ["abc", "", ["a", "b", "c"]],
    ["a,,b", ",", ["a", "", "b"]],
    [",a,", ",", ["", "a", ""]],
    ["no-delimiter", ",", ["no-delimiter"]],
    ["path/to/file", "/", ["path", "to", "file"]],
  ])("split(%j, %j) -> %j", (input, delimiter, expected) => {
    expect(split(input, delimiter)).toEqual(expected);
  });

  it("infers a tuple type for literal strings", () => {
    expectTypeOf(split("a,b,c", ",")).toEqualTypeOf<["a", "b", "c"]>();
    expectTypeOf(split("a-b", ",")).toEqualTypeOf<["a-b"]>();
  });

  it("falls back to string[] for non literal strings", () => {
    const input: string = "a,b";
    expectTypeOf(split(input, ",")).toEqualTypeOf<string[]>();
    expect(split(input, ",")).toEqual(["a", "b"]);
  });

  it("types empty strings and trailing delimiters like the runtime", () => {
    expect(split("", ",")).toEqual([""]);
    expectTypeOf(split("", ",")).toEqualTypeOf<[""]>();
    expect(split("a,", ",")).toEqual(["a", ""]);
    expectTypeOf(split("a,", ",")).toEqualTypeOf<["a", ""]>();
  });
});
