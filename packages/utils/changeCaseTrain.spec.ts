import { changeCaseTrain } from "./changeCaseTrain";

describe("changeCaseTrain", () => {
  it.each([
    ["", ""],
    ["test", "Test"],
    ["test string", "Test-String"],
    ["Test String", "Test-String"],
    ["testString", "Test-String"],
    ["TEST_STRING", "Test-String"],
    ["TestV2", "Test-V2"],
    ["_foo_bar_", "Foo-Bar"],
    ["foo-bar", "Foo-Bar"],
    ["foo.bar", "Foo-Bar"],
    ["  foo   bar  ", "Foo-Bar"],
    ["XMLHttpRequest", "Xml-Http-Request"],
    ["version 1.2.10", "Version-1-2-10"],
  ])("changeCaseTrain(%j) -> %j", (input, expected) => {
    expect(changeCaseTrain(input)).toBe(expected);
  });

  it("lets the delimiter option override the default one", () => {
    expect(changeCaseTrain("foo bar", { delimiter: " " })).toBe("Foo Bar");
  });

  it("keeps the given prefix and suffix characters", () => {
    expect(
      changeCaseTrain("__fooBar__", {
        prefixCharacters: "_",
        suffixCharacters: "_",
      }),
    ).toBe("__Foo-Bar__");
  });

  it("respects the given locale", () => {
    expect(changeCaseTrain("istanbul ili", { locale: "tr" })).toBe(
      "İstanbul-İli",
    );
    expect(changeCaseTrain("istanbul ili", { locale: false })).toBe(
      "Istanbul-Ili",
    );
  });
});
