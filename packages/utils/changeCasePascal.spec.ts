import { changeCasePascal } from "./changeCasePascal";

describe("changeCasePascal", () => {
  it.each([
    ["", ""],
    ["test", "Test"],
    ["test string", "TestString"],
    ["Test String", "TestString"],
    ["TestV2", "TestV2"],
    ["_foo_bar_", "FooBar"],
    ["foo-bar", "FooBar"],
    ["testString", "TestString"],
    ["TESTString", "TestString"],
    ["TEST_STRING", "TestString"],
    ["XMLHttpRequest", "XmlHttpRequest"],
    ["version 1.2.10", "Version_1_2_10"],
    ["1st place", "1stPlace"],
    ["Ārvaigžņu Kārtība", "ĀrvaigžņuKārtība"],
  ])("changeCasePascal(%j) -> %j", (input, expected) => {
    expect(changeCasePascal(input)).toBe(expected);
  });

  it("merges ambiguous characters when asked to", () => {
    expect(
      changeCasePascal("version 1.2.10", { mergeAmbiguousCharacters: true }),
    ).toBe("Version1210");
  });

  it("keeps the given prefix and suffix characters", () => {
    expect(
      changeCasePascal("$foo bar$", {
        prefixCharacters: "$",
        suffixCharacters: "$",
      }),
    ).toBe("$FooBar$");
  });

  it("supports a custom delimiter", () => {
    expect(changeCasePascal("foo bar", { delimiter: "-" })).toBe("Foo-Bar");
  });

  it("respects the given locale", () => {
    expect(changeCasePascal("istanbul", { locale: "tr" })).toBe("İstanbul");
    expect(changeCasePascal("istanbul", { locale: false })).toBe("Istanbul");
  });
});
