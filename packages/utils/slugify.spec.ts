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

  test.each([
    ["Crème Brûlée", "creme-brulee"],
    ["Straße", "strasse"],
    ["Ĳssel", "ijssel"],
    ["smørrebrød", "smorrebrod"],
  ])("removes accents from %j", (input, expected) => {
    expect(slugify(input)).toBe(expected);
  });

  test.each([
    ["foo/bar:baz;qux", "foo-bar-baz-qux"],
    ["it's", "it-s"],
    ["a·b", "a-b"],
    ["50% off", "50-off"],
    ["email@example.com", "email-example-com"],
    ["tabs\tand\nnewlines", "tabs-and-newlines"],
  ])(
    "replaces punctuation and whitespace in %j with dashes",
    (input, expected) => {
      expect(slugify(input)).toBe(expected);
    },
  );

  test("keeps numbers", () => {
    expect(slugify("Top 10 Tips for 2024")).toBe("top-10-tips-for-2024");
  });

  test("trims dashes and spaces from both ends", () => {
    expect(slugify("  --Hello World--  ")).toBe("hello-world");
    expect(slugify("...Hello...")).toBe("hello");
  });

  test("returns an empty string when there is nothing to keep", () => {
    expect(slugify("!!!")).toBe("");
    expect(slugify("   ")).toBe("");
  });

  test("supports any separator, including an empty one", () => {
    expect(slugify("Hello World Again", "")).toBe("helloworldagain");
    expect(slugify("Hello World Again", ".")).toBe("hello.world.again");
    expect(slugify("Hello, World!", "__")).toBe("hello__world");
  });

  test("is idempotent", () => {
    const slug = slugify("À la carte! Yes, please!");
    expect(slugify(slug)).toBe(slug);
  });

  it.each([
    ["foo_bar", "foo-bar"],
    ["snake_case_title", "snake-case-title"],
    ["a·b/c,d:e;f'g", "a-b-c-d-e-f-g"],
  ])(
    "replaces punctuation and underscores with dashes: %j",
    (input, expected) => {
      expect(slugify(input)).toBe(expected);
    },
  );
});
