import { splitReverse } from "./splitReverse";

describe("splitReverse", () => {
  it.each([
    ["a,b,c", ",", ["c", "b", "a"]],
    ["path/to/file", "/", ["file", "to", "path"]],
    ["abc", "", ["c", "b", "a"]],
    ["a,,b", ",", ["b", "", "a"]],
    ["no-delimiter", ",", ["no-delimiter"]],
    ["www.example.com", ".", ["com", "example", "www"]],
  ])("splitReverse(%j, %j) -> %j", (input, delimiter, expected) => {
    expect(splitReverse(input, delimiter)).toEqual(expected);
  });

  it("infers a reversed tuple type for literal strings", () => {
    expectTypeOf(splitReverse("a/b/c", "/")).toEqualTypeOf<["c", "b", "a"]>();
  });
});
