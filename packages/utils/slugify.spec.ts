import { slugify } from "./slugify";

describe("slugify", () => {
  test("converts a basic string to slug format", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  test("handles accented characters and converts them properly", () => {
    expect(slugify("ÀÁÂÃÅÄ")).toBe("aaaaaae");
    expect(slugify("ÈÉÊËĒ")).toBe("eeeee");
    expect(slugify("Çćĉč")).toBe("cccc");
    expect(slugify("Ñń")).toBe("nn");
    expect(slugify("Öøœ")).toBe("oeooe");
    expect(slugify("Ü")).toBe("ue");
  });

  test("removes special characters and punctuation", () => {
    expect(slugify("Hello, World!")).toBe("hello-world");
    expect(slugify("This.is/a,test")).toBe("this-is-a-test");
  });

  test("replaces spaces with the specified separator", () => {
    expect(slugify("Custom Separator Example", "_")).toBe(
      "custom_separator_example",
    );
  });

  test("handles & character as part of slugification", () => {
    expect(slugify("Rock & Roll")).toBe("rock-roll");
  });

  test("handles multiple spaces correctly", () => {
    expect(slugify("Multiple    spaces")).toBe("multiple-spaces");
  });

  test("handles empty string input gracefully", () => {
    expect(slugify("")).toBe("");
  });

  test("handles Chinese characters", () => {
    expect(slugify("Hello 世界")).toBe("hello-世界");
  });

  test("removes leading and trailing separators", () => {
    expect(slugify("   Hello World   ")).toBe("hello-world");
  });

  test("handles a mix of accented, special characters, and punctuation", () => {
    expect(slugify("À la carte! Yes, please!")).toBe("a-la-carte-yes-please");
  });

  test("removes unsupported characters like emoji", () => {
    expect(slugify("Hello 👋 World 🌍")).toBe("hello-world");
  });

  test("removes multiple dashes in a row", () => {
    expect(slugify("Hello---World")).toBe("hello-world");
  });

  test("converts mixed-case letters to lowercase", () => {
    expect(slugify("HELLO World")).toBe("hello-world");
  });
});
