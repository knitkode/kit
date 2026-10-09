import { defaultAttributesClient } from "./cookie";

describe("cookie", () => {
  it("defaults the client cookies to the root path", () => {
    expect(defaultAttributesClient).toEqual({ path: "/" });
  });
});
