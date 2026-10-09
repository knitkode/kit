import { parseCookie } from "./parseCookie";

describe("parseCookie", () => {
  it.each([
    ["a=1", { a: "1" }],
    ["a=1; b=2", { a: "1", b: "2" }],
    ["a=1;b=2", { a: "1", b: "2" }],
    ["  a  =  spaced  ; b=2", { a: "spaced", b: "2" }],
    ['a="quoted value"', { a: "quoted value" }],
    ["a=x=y", { a: "x=y" }],
    ["a=", { a: "" }],
    ["", {}],
  ])("parses %j", (header, expected) => {
    expect(parseCookie(header)).toEqual(expected);
  });

  it("decodes the values with decodeURIComponent by default", () => {
    expect(parseCookie("a=hello%20world; b=%C3%A8")).toEqual({
      a: "hello world",
      b: "è",
    });
  });

  it("skips pairs without an '='", () => {
    expect(parseCookie("flag; a=1; other")).toEqual({ a: "1" });
  });

  it("keeps the first value of duplicated names", () => {
    expect(parseCookie("a=first; a=second")).toEqual({ a: "first" });
  });

  it("returns the raw value when decoding fails", () => {
    expect(parseCookie("a=%E0%A4%A; b=ok")).toEqual({ a: "%E0%A4%A", b: "ok" });
  });

  it("uses the given decode function", () => {
    const decode = vi.fn((value: string) => value.toUpperCase());
    expect(parseCookie("a=one; b=two", { decode })).toEqual({
      a: "ONE",
      b: "TWO",
    });
    expect(decode).toHaveBeenCalledTimes(2);
  });

  it("returns the raw value when the given decode function throws", () => {
    const decode = () => {
      throw new Error("nope");
    };
    expect(parseCookie("a=raw", { decode })).toEqual({ a: "raw" });
  });

  it("throws a TypeError when the argument is not a string", () => {
    // @ts-expect-error testing a non string input at runtime
    expect(() => parseCookie(undefined)).toThrow(TypeError);
    // @ts-expect-error testing a non string input at runtime
    expect(() => parseCookie(42)).toThrow("argument str must be a string");
  });
});
