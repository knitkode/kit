import * as starImport from "./fixtures";
import { isPlainObject } from "./isPlainObject";

describe("isPlainObject", () => {
  it("works with plain object literal", () => {
    expect(isPlainObject({})).toEqual(true);
  });

  it("works with star import", () => {
    expect(isPlainObject(starImport)).toEqual(true);
  });
});
