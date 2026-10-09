import { changeCaseSentence } from "./changeCaseSentence";

describe("changeCaseSentence", () => {
  it.each([
    ["", ""],
    ["test", "Test"],
    ["test string", "Test string"],
    ["Test String", "Test string"],
    ["TestV2", "Test v2"],
    ["_foo_bar_", "Foo bar"],
    ["testString", "Test string"],
    ["TEST_STRING", "Test string"],
    ["XMLHttpRequest", "Xml http request"],
    ["version 1.2.10", "Version 1 2 10"],
    ["Ölçek Ölçü", "Ölçek ölçü"],
  ])("changeCaseSentence(%j) -> %j", (input, expected) => {
    expect(changeCaseSentence(input)).toBe(expected);
  });

  it("supports a custom delimiter", () => {
    expect(changeCaseSentence("foo bar baz", { delimiter: "_" })).toBe(
      "Foo_bar_baz",
    );
  });

  it("keeps the given prefix and suffix characters", () => {
    expect(
      changeCaseSentence("¿fooBar?", {
        prefixCharacters: "¿",
        suffixCharacters: "?",
      }),
    ).toBe("¿Foo bar?");
  });

  it("respects the given locale", () => {
    expect(changeCaseSentence("istanbul ILI", { locale: "tr" })).toBe(
      "İstanbul ılı",
    );
    expect(changeCaseSentence("istanbul ILI", { locale: false })).toBe(
      "Istanbul ili",
    );
  });
});
