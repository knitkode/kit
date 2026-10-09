import { changeCaseConstant } from "./changeCaseConstant";

describe("changeCaseConstant", () => {
  it.each([
    ["", ""],
    ["test", "TEST"],
    ["test string", "TEST_STRING"],
    ["TestV2", "TEST_V2"],
    ["_foo_bar_", "FOO_BAR"],
    ["foo-bar.baz", "FOO_BAR_BAZ"],
    ["testString", "TEST_STRING"],
    ["TEST_STRING", "TEST_STRING"],
    ["XMLHttpRequest", "XML_HTTP_REQUEST"],
    ["version 1.2.10", "VERSION_1_2_10"],
    ["Ārvaigžņu Kārtība", "ĀRVAIGŽŅU_KĀRTĪBA"],
  ])("changeCaseConstant(%j) -> %j", (input, expected) => {
    expect(changeCaseConstant(input)).toBe(expected);
  });

  it("supports a custom delimiter", () => {
    expect(changeCaseConstant("foo bar", { delimiter: "-" })).toBe("FOO-BAR");
  });

  it("keeps the given prefix and suffix characters", () => {
    expect(
      changeCaseConstant("_fooBar_", {
        prefixCharacters: "_",
        suffixCharacters: "_",
      }),
    ).toBe("_FOO_BAR_");
  });

  it("respects the given locale", () => {
    expect(changeCaseConstant("istanbul", { locale: "tr" })).toBe("İSTANBUL");
    expect(changeCaseConstant("istanbul", { locale: false })).toBe("ISTANBUL");
  });
});
