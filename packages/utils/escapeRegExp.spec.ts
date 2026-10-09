import { escapeRegExp } from "./escapeRegExp";

describe("escapeRegExp", () => {
  it.each([
    ".",
    "*",
    "+",
    "?",
    "^",
    "$",
    "{",
    "}",
    "(",
    ")",
    "|",
    "[",
    "]",
    "\\",
  ])("escapes the special character %s", (char) => {
    expect(escapeRegExp(char)).toBe(`\\${char}`);
  });

  it.each([
    ["", ""],
    ["hello world", "hello world"],
    ["a-b/c,d#e", "a-b/c,d#e"],
    ["àèì 世界", "àèì 世界"],
  ])("leaves %j untouched", (input, expected) => {
    expect(escapeRegExp(input)).toBe(expected);
  });

  it("escapes every special character of a mixed string", () => {
    expect(escapeRegExp("(1+1)*2 = $4?")).toBe("\\(1\\+1\\)\\*2 = \\$4\\?");
    expect(escapeRegExp("[a-z]{2,}|^.$")).toBe("\\[a-z\\]\\{2,\\}\\|\\^\\.\\$");
  });

  it.each([
    "file.name.ts",
    "price: $9.99 (approx.)",
    "C:\\path\\to\\file",
    "a+b=c?",
    "[x] {y} ^z|w",
  ])("produces a pattern that matches %j literally", (input) => {
    const reg = new RegExp(`^${escapeRegExp(input)}$`);
    expect(reg.test(input)).toBe(true);
  });

  it("does not match other strings once escaped", () => {
    const reg = new RegExp(`^${escapeRegExp("a.c")}$`);
    expect(reg.test("abc")).toBe(false);
  });
});
