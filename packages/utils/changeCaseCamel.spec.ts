import { changeCaseCamel } from "./changeCaseCamel";

describe("changeCaseCamel", () => {
  it.each([
    ["", ""],
    ["test", "test"],
    ["test string", "testString"],
    ["Test String", "testString"],
    ["TestV2", "testV2"],
    ["_foo_bar_", "fooBar"],
    ["foo-bar", "fooBar"],
    ["foo.bar", "fooBar"],
    ["  foo   bar  ", "fooBar"],
    ["testString", "testString"],
    ["TESTString", "testString"],
    ["TEST_STRING", "testString"],
    ["XMLHttpRequest", "xmlHttpRequest"],
    ["version 1.2.10", "version_1_2_10"],
    ["Ölçek ölçü", "ölçekÖlçü"],
  ])("changeCaseCamel(%j) -> %j", (input, expected) => {
    expect(changeCaseCamel(input)).toBe(expected);
  });

  it("merges ambiguous characters when asked to", () => {
    expect(
      changeCaseCamel("version 1.2.10", { mergeAmbiguousCharacters: true }),
    ).toBe("version1210");
  });

  it("keeps the given prefix and suffix characters", () => {
    expect(
      changeCaseCamel("__foo_bar__", {
        prefixCharacters: "_",
        suffixCharacters: "_",
      }),
    ).toBe("__fooBar__");
  });

  it("supports a custom delimiter", () => {
    expect(changeCaseCamel("foo bar baz", { delimiter: "." })).toBe(
      "foo.Bar.Baz",
    );
  });

  it("supports separating numbers", () => {
    expect(changeCaseCamel("foo2bar", { separateNumbers: true })).toBe(
      "foo_2Bar",
    );
  });

  it("respects the given locale", () => {
    expect(changeCaseCamel("TITLE in istanbul", { locale: "tr" })).toBe(
      "tıtleİnİstanbul",
    );
    expect(changeCaseCamel("TITLE in istanbul", { locale: false })).toBe(
      "titleInIstanbul",
    );
  });
});
