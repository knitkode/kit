import { changeCaseCapital } from "./changeCaseCapital";

describe("changeCaseCapital", () => {
  it.each([
    ["", ""],
    ["test", "Test"],
    ["test string", "Test String"],
    ["TestV2", "Test V2"],
    ["_foo_bar_", "Foo Bar"],
    ["foo-bar", "Foo Bar"],
    ["testString", "Test String"],
    ["TEST_STRING", "Test String"],
    ["XMLHttpRequest", "Xml Http Request"],
    ["version 1.2.10", "Version 1 2 10"],
    ["Ölçek ölçü", "Ölçek Ölçü"],
  ])("changeCaseCapital(%j) -> %j", (input, expected) => {
    expect(changeCaseCapital(input)).toBe(expected);
  });

  it("supports a custom delimiter", () => {
    expect(changeCaseCapital("foo bar", { delimiter: "+" })).toBe("Foo+Bar");
  });

  it("keeps the given prefix and suffix characters", () => {
    expect(
      changeCaseCapital("_foo_bar_", {
        prefixCharacters: "_",
        suffixCharacters: "_",
      }),
    ).toBe("_Foo Bar_");
  });

  it("respects the given locale", () => {
    expect(changeCaseCapital("istanbul", { locale: "tr" })).toBe("İstanbul");
    expect(changeCaseCapital("istanbul", { locale: false })).toBe("Istanbul");
  });
});
