import { changeCaseNone } from "./changeCaseNone";

describe("changeCaseNone", () => {
  it.each([
    ["", ""],
    ["test", "test"],
    ["test string", "test string"],
    ["Test String", "test string"],
    ["TestV2", "test v2"],
    ["_foo_bar_", "foo bar"],
    ["foo-bar.baz", "foo bar baz"],
    ["  foo   bar  ", "foo bar"],
    ["testString", "test string"],
    ["TESTString", "test string"],
    ["XMLHttpRequest", "xml http request"],
    ["version 1.2.10", "version 1 2 10"],
    ["Ārvaigžņu Kārtība", "ārvaigžņu kārtība"],
  ])("changeCaseNone(%j) -> %j", (input, expected) => {
    expect(changeCaseNone(input)).toBe(expected);
  });

  it("supports a custom delimiter", () => {
    expect(changeCaseNone("fooBar", { delimiter: "~" })).toBe("foo~bar");
  });

  it("keeps the given prefix and suffix characters", () => {
    expect(
      changeCaseNone("--fooBar--", {
        prefixCharacters: "-",
        suffixCharacters: "-",
      }),
    ).toBe("--foo bar--");
  });

  it("supports a custom split function", () => {
    expect(
      changeCaseNone("A|B|C", { split: (value) => value.split("|") }),
    ).toBe("a b c");
  });

  it("supports separating numbers", () => {
    expect(changeCaseNone("test1foo", { separateNumbers: true })).toBe(
      "test 1 foo",
    );
  });

  it("respects the given locale", () => {
    expect(changeCaseNone("İSTANBUL", { locale: "tr" })).toBe("istanbul");
    expect(changeCaseNone("TITLE", { locale: "tr" })).toBe("tıtle");
    expect(changeCaseNone("TITLE", { locale: false })).toBe("title");
  });
});
