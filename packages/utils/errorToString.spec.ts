import { errorToString } from "./errorToString";

class CustomError extends Error {}

describe("errorToString", () => {
  it.each([
    [new Error("boom"), "boom"],
    [new TypeError("type boom"), "type boom"],
    [new CustomError("custom boom"), "custom boom"],
    [new Error(), ""],
    ["already a string", "already a string"],
    ["", ""],
    [undefined, ""],
    [null, ""],
    [42, ""],
    [{ message: "not an Error instance" }, ""],
  ])("turns %o into %j", (input, expected) => {
    expect(errorToString(input)).toBe(expected);
  });
});
