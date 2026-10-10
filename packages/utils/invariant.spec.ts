import { vitestSetNodeEnv } from "@knitkode/test/vitest";
import { invariant } from "./invariant";

describe("invariant", () => {
  describe("in development", () => {
    vitestSetNodeEnv("development");

    it.each([true, 1, "a", {}, []])("does not throw for %j", (condition) => {
      expect(() => invariant(condition, "message")).not.toThrow();
    });

    it.each([false, 0, "", null, undefined])("throws for %j", (condition) => {
      expect(() => invariant(condition, "message")).toThrow(Error);
    });

    it("throws the given message", () => {
      expect(() => invariant(false, "Something is wrong")).toThrow(
        new Error("Something is wrong"),
      );
    });

    it("throws the message returned by the given function", () => {
      const message = vi.fn(() => "Lazy message");
      expect(() => invariant(false, message)).toThrow(
        new Error("Lazy message"),
      );
      expect(message).toHaveBeenCalledTimes(1);
    });

    it("does not compute the message when the condition holds", () => {
      const message = vi.fn(() => "Lazy message");
      expect(() => invariant(true, message)).not.toThrow();
      expect(message).not.toHaveBeenCalled();
    });

    it("prefixes the message with the lib name", () => {
      expect(() => invariant(false, "msg", "my-lib")).toThrow(
        new Error("[my-lib]: msg"),
      );
    });

    it("prefixes the message with the lib name and the prefix", () => {
      expect(() => invariant(false, "msg", "my-lib", "fn")).toThrow(
        new Error("[my-lib:fn]: msg"),
      );
    });

    it("prefixes the message with the prefix when there is no lib name", () => {
      expect(() => invariant(false, "msg", undefined, "fn")).toThrow(
        new Error("[fn]: msg"),
      );
      expect(() => invariant(false, "msg", "", "fn")).toThrow(
        new Error("[fn]: msg"),
      );
    });

    it("throws a default message when none is given", () => {
      expect(() => invariant(false)).toThrow(new Error("Invariant failed"));
      expect(() => invariant(false, "", "my-lib")).toThrow(
        new Error("[my-lib]: Invariant failed"),
      );
      expect(() => invariant(false, () => "")).toThrow(
        new Error("Invariant failed"),
      );
    });

    it("narrows the type of the condition when called as a statement", () => {
      const value = "a" as string | undefined;
      invariant(value, "value is required");
      expectTypeOf(value).toEqualTypeOf<string>();

      const node = { el: { id: "x" } } as { el: { id: string } | null };
      invariant(node.el);
      expect(node.el.id).toBe("x");
    });
  });

  describe("outside development", () => {
    vitestSetNodeEnv("production");

    it("never throws", () => {
      expect(() => invariant(false, "message", "lib", "prefix")).not.toThrow();
      expect(() => invariant(false)).not.toThrow();
    });

    it("does not compute the message", () => {
      const message = vi.fn(() => "Lazy message");
      expect(() => invariant(false, message)).not.toThrow();
      expect(message).not.toHaveBeenCalled();
    });
  });
});
