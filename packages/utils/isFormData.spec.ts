import { isFormData } from "./isFormData";

describe("isFormData", () => {
  it("returns true for a FormData instance", () => {
    const formData = new FormData();
    formData.append("a", "1");
    expect(isFormData(new FormData())).toBe(true);
    expect(isFormData(formData)).toBe(true);
  });

  it.each([
    ["URLSearchParams", new URLSearchParams("a=1")],
    ["a plain object", { a: "1" }],
    ["a query string", "a=1"],
    ["undefined", undefined],
    ["null", null],
  ])("returns false for %s", (_label, payload) => {
    expect(isFormData(payload)).toBe(false);
  });
});
