import { changeCaseSnake } from "./changeCaseSnake";

describe("changeCaseSnake", () => {
  it.each([
    ["", ""],
    ["test", "test"],
    ["test string", "test_string"],
    ["Test String", "test_string"],
    ["testString", "test_string"],
    ["TEST_STRING", "test_string"],
    ["TestV2", "test_v2"],
    ["_foo_bar_", "foo_bar"],
    ["foo-bar", "foo_bar"],
    ["foo.bar", "foo_bar"],
    ["foo/bar", "foo_bar"],
    ["  foo   bar  ", "foo_bar"],
    ["XMLHttpRequest", "xml_http_request"],
    ["version 1.2.10", "version_1_2_10"],
  ])("changeCaseSnake(%j) -> %j", (input, expected) => {
    expect(changeCaseSnake(input)).toBe(expected);
  });

  it("lets the delimiter option override the default one", () => {
    expect(changeCaseSnake("foo bar", { delimiter: "+" })).toBe("foo+bar");
  });

  it("keeps the given prefix and suffix characters", () => {
    expect(
      changeCaseSnake("@@fooBar!", {
        prefixCharacters: "@",
        suffixCharacters: "!",
      }),
    ).toBe("@@foo_bar!");
  });

  it("respects the given locale", () => {
    expect(changeCaseSnake("TITLE ITEM", { locale: "tr" })).toBe("tıtle_ıtem");
    expect(changeCaseSnake("TITLE ITEM", { locale: false })).toBe("title_item");
  });
});
