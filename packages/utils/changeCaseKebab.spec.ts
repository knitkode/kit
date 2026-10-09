import { changeCaseKebab } from "./changeCaseKebab";

describe("changeCaseKebab", () => {
  it.each([
    ["", ""],
    ["test", "test"],
    ["test string", "test-string"],
    ["Test String", "test-string"],
    ["testString", "test-string"],
    ["TEST_STRING", "test-string"],
    ["TestV2", "test-v2"],
    ["_foo_bar_", "foo-bar"],
    ["foo-bar", "foo-bar"],
    ["foo.bar", "foo-bar"],
    ["foo/bar", "foo-bar"],
    ["  foo   bar  ", "foo-bar"],
    ["XMLHttpRequest", "xml-http-request"],
    ["version 1.2.10", "version-1-2-10"],
  ])("changeCaseKebab(%j) -> %j", (input, expected) => {
    expect(changeCaseKebab(input)).toBe(expected);
  });

  it("lets the delimiter option override the default one", () => {
    expect(changeCaseKebab("foo bar", { delimiter: "+" })).toBe("foo+bar");
  });

  it("keeps the given prefix and suffix characters", () => {
    expect(
      changeCaseKebab("@@fooBar!", {
        prefixCharacters: "@",
        suffixCharacters: "!",
      }),
    ).toBe("@@foo-bar!");
  });

  it("respects the given locale", () => {
    expect(changeCaseKebab("TITLE ITEM", { locale: "tr" })).toBe("tıtle-ıtem");
    expect(changeCaseKebab("TITLE ITEM", { locale: false })).toBe("title-item");
  });
});
