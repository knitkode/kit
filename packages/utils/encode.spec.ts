import { decode } from "./decode";
import { encode } from "./encode";

describe("encode", () => {
  it.each([
    ["", ""],
    ["a", "097"],
    ["abc", "097098099"],
    ["A Z", "065032090"],
    ["\t", "009"],
    ["~", "126"],
    ["é", "233"],
  ])("encode(%j) -> %j", (input, expected) => {
    expect(encode(input)).toBe(expected);
  });

  it("encodes every character as three digits", () => {
    const input = "Hello, World! 123";
    const output = encode(input);
    expect(output).toMatch(/^\d+$/);
    expect(output).toHaveLength(input.length * 3);
  });

  it("can be reverted with decode", () => {
    const input = "user@example.com?a=1&b=[2]";
    expect(decode(encode(input))).toBe(input);
  });

  it.each([
    ["\n", "010"],
    ["a\r\nb", "097013010098"],
    ["€", "u0008364"],
    ["日本", "u0026085u0026412"],
    ["👋", "u0128075"],
  ])(
    "encodes line breaks and characters from code 1000 up: %j",
    (input, expected) => {
      expect(encode(input)).toBe(expected);
    },
  );

  it.each([
    "a\nb",
    "price: 10€",
    "日本語のテキスト",
    "hi 👋🏽 there",
    "\u2028",
  ])("round trips with decode: %j", (input) => {
    expect(decode(encode(input))).toBe(input);
  });
});
