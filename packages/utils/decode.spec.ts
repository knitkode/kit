import { decode } from "./decode";
import { encode } from "./encode";

describe("decode", () => {
  it.each([
    ["", ""],
    ["097", "a"],
    ["097098099", "abc"],
    ["065032090", "A Z"],
    ["010", "\n"],
    ["233", "é"],
  ])("decode(%j) -> %j", (input, expected) => {
    expect(decode(input)).toBe(expected);
  });

  it.each(["Hello, World! 123", "<script>alert('x')</script>", "àèìòù ñ ç ß"])(
    "reverts the output of encode for %j",
    (input) => {
      expect(decode(encode(input))).toBe(input);
    },
  );

  it("decodes characters from code 1000 up", () => {
    expect(decode("u0008364")).toBe("€");
    expect(decode("097u0128075098")).toBe("a👋b");
  });

  it("still decodes the output of previous versions", () => {
    // line breaks used to be left as they are
    expect(decode("097\n098")).toBe("a\nb");
    expect(decode("072105\n\n033")).toBe("Hi\n\n!");
  });
});
