import { changeCasePascalSnake } from "./changeCasePascalSnake";

describe("changeCasePascalSnake", () => {
  it.each([
    ["", ""],
    ["test", "Test"],
    ["test string", "Test_String"],
    ["Test String", "Test_String"],
    ["testString", "Test_String"],
    ["TEST_STRING", "Test_String"],
    ["TestV2", "Test_V2"],
    ["_foo_bar_", "Foo_Bar"],
    ["foo-bar", "Foo_Bar"],
    ["foo.bar", "Foo_Bar"],
    ["  foo   bar  ", "Foo_Bar"],
    ["XMLHttpRequest", "Xml_Http_Request"],
    ["version 1.2.10", "Version_1_2_10"],
  ])("changeCasePascalSnake(%j) -> %j", (input, expected) => {
    expect(changeCasePascalSnake(input)).toBe(expected);
  });

  it("lets the delimiter option override the default one", () => {
    expect(changeCasePascalSnake("foo bar", { delimiter: " " })).toBe(
      "Foo Bar",
    );
  });

  it("keeps the given prefix and suffix characters", () => {
    expect(
      changeCasePascalSnake("__fooBar__", {
        prefixCharacters: "_",
        suffixCharacters: "_",
      }),
    ).toBe("__Foo_Bar__");
  });

  it("respects the given locale", () => {
    expect(changeCasePascalSnake("istanbul ili", { locale: "tr" })).toBe(
      "İstanbul_İli",
    );
    expect(changeCasePascalSnake("istanbul ili", { locale: false })).toBe(
      "Istanbul_Ili",
    );
  });
});
