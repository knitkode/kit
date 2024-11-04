import { truncate } from "./truncate";

describe("truncate", () => {
  test("returns the full string if it is shorter than the specified length", () => {
    const result = truncate("Hello", 10);
    expect(result).toBe("Hello");
  });

  test("truncates the string and adds ellipsis if it exceeds the specified length", () => {
    const result = truncate("Hello, world!", 5);
    expect(result).toBe("Hello...");
  });

  test("returns an empty string if the input is undefined", () => {
    const result = truncate(undefined, 5);
    expect(result).toBe("");
  });

  test("returns an empty string if the input is null", () => {
    const result = truncate(null, 5);
    expect(result).toBe("");
  });

  test("returns an empty string if the input is an empty string", () => {
    const result = truncate("", 5);
    expect(result).toBe("");
  });

  test("returns the full string if length is exactly the string length", () => {
    const result = truncate("Hello", 5);
    expect(result).toBe("Hello");
  });

  test("handles very short length properly", () => {
    const result = truncate("Hello, world!", 1);
    expect(result).toBe("H...");
  });

  test('adds ellipsis only once when input already includes "..."', () => {
    const result = truncate("Hello...", 5);
    expect(result).toBe("Hello...");
  });
});
