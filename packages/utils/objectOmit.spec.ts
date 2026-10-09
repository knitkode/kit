import { objectOmit } from "./objectOmit";

describe("objectOmit", () => {
  const input = { id: 1, name: "Alice", age: 30 };

  it("omits the given keys", () => {
    expect(objectOmit(input, ["age"])).toEqual({ id: 1, name: "Alice" });
    expect(objectOmit(input, ["id", "name"])).toEqual({ age: 30 });
  });

  it("returns a copy when no keys are given", () => {
    const result = objectOmit(input, []);
    expect(result).toEqual(input);
    expect(result).not.toBe(input);
  });

  it("returns an empty object when all keys are omitted", () => {
    expect(objectOmit(input, ["id", "name", "age"])).toEqual({});
  });

  it("ignores keys that do not exist on the object", () => {
    expect(objectOmit(input, ["missing" as "id"])).toEqual(input);
  });

  it("does not mutate the input", () => {
    const original = { a: 1, b: 2 };
    objectOmit(original, ["a"]);
    expect(original).toEqual({ a: 1, b: 2 });
  });

  it("keeps nested values by reference", () => {
    const nested = { deep: true };
    expect(objectOmit({ a: 1, nested }, ["a"]).nested).toBe(nested);
  });

  it("removes the omitted keys from the type", () => {
    expectTypeOf(objectOmit(input, ["age"])).toEqualTypeOf<{
      id: number;
      name: string;
    }>();
  });
});
