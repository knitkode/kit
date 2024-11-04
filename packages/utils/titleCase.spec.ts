import { titleCase } from "./titleCase";

describe("titleCase", () => {
  test("converts a single word to title case", () => {
    expect(titleCase("hello")).toBe("Hello");
    expect(titleCase("world")).toBe("World");
  });

  test("converts multiple words to title case", () => {
    expect(titleCase("hello world")).toBe("Hello World");
    expect(titleCase("javaScript is awesome")).toBe("Javascript Is Awesome");
  });

  test("handles mixed casing and converts to title case", () => {
    expect(titleCase("hElLo WoRLd")).toBe("Hello World");
    expect(titleCase("JAVA script")).toBe("Java Script");
  });

  test("normalises extra whitespaces", () => {
    expect(titleCase(" hello   world  ")).toBe("Hello World");
    expect(titleCase("   javaScript   rocks")).toBe("Javascript Rocks");
  });

  test("returns an empty string when input is empty or null", () => {
    expect(titleCase("")).toBe("");
    expect(titleCase(null)).toBe("");
    expect(titleCase(undefined)).toBe("");
  });

  test("handles special characters in input", () => {
    expect(titleCase("hello-world")).toBe("Hello-world");
    expect(titleCase("java_script is cool")).toBe("Java_script Is Cool");
    expect(titleCase("c# programming")).toBe("C# Programming");
  });

  test("handles numeric values within strings", () => {
    expect(titleCase("hello world 2023")).toBe("Hello World 2023");
    expect(titleCase("the year is 2023")).toBe("The Year Is 2023");
  });
});
