import { getDependencyVersion } from "./getDependencyVersion";

describe("getDependencyVersion", () => {
  // console.log("next", getDependencyVersion("next"));

  it("returns correct full dependency version", () => {
    expect(getDependencyVersion("next").join(".")).toBe("15.1.2");
  });

  it("returns correct major dependency version", () => {
    expect(getDependencyVersion("next", "major")).toBe(15);
  });

  it("returns correct minor dependency version", () => {
    expect(getDependencyVersion("next", "minor")).toBe(1);
  });

  it("returns correct patch dependency version", () => {
    expect(getDependencyVersion("next", "patch")).toBe(2);
  });
});
