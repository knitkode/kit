import { changeCasePath } from "./changeCasePath";

describe("changeCasePath", () => {
  it.each([
    ["", ""],
    ["test", "test"],
    ["test string", "test/string"],
    ["Test String", "test/string"],
    ["testString", "test/string"],
    ["TEST_STRING", "test/string"],
    ["TestV2", "test/v2"],
    ["_foo_bar_", "foo/bar"],
    ["foo-bar", "foo/bar"],
    ["foo.bar", "foo/bar"],
    ["foo/bar", "foo/bar"],
    ["  foo   bar  ", "foo/bar"],
    ["XMLHttpRequest", "xml/http/request"],
    ["version 1.2.10", "version/1/2/10"],
  ])("changeCasePath(%j) -> %j", (input, expected) => {
    expect(changeCasePath(input)).toBe(expected);
  });

  it("lets the delimiter option override the default one", () => {
    expect(changeCasePath("foo bar", { delimiter: "+" })).toBe("foo+bar");
  });

  it("keeps the given prefix and suffix characters", () => {
    expect(
      changeCasePath("@@fooBar!", {
        prefixCharacters: "@",
        suffixCharacters: "!",
      }),
    ).toBe("@@foo/bar!");
  });

  it("respects the given locale", () => {
    expect(changeCasePath("TITLE ITEM", { locale: "tr" })).toBe("tıtle/ıtem");
    expect(changeCasePath("TITLE ITEM", { locale: false })).toBe("title/item");
  });
});
