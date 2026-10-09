import { noop } from "./noop";

describe("noop", () => {
  it("returns undefined", () => {
    expect(noop()).toBeUndefined();
  });

  it("ignores any argument", () => {
    // @ts-expect-error noop does not declare parameters
    expect(noop(1, "a", {})).toBeUndefined();
  });
});
