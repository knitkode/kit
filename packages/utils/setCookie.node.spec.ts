// @vitest-environment node
import { setCookie } from "./setCookie";

describe("setCookie outside of the browser", () => {
  it("does nothing where `document` is not declared, like in Node.js", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    expect(() => setCookie("name", "value")).not.toThrow();

    warn.mockRestore();
  });
});
