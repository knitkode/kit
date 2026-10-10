import { type ArrayOfAll, arrayOfAll } from "./arrayOfAll";

type Fruit = "pear" | "apple" | "orange";

describe("arrayOfAll", () => {
  it("returns the same array it is given", () => {
    const arrayOfAllFruits = arrayOfAll<Fruit>();
    const fruits = ["pear", "apple", "orange"] as Fruit[];
    expect(arrayOfAllFruits(fruits)).toBe(fruits);
  });

  it("accepts readonly arrays", () => {
    const arrayOfAllFruits = arrayOfAll<Fruit>();
    const fruits = ["orange", "pear", "apple"] as const;
    expect(arrayOfAllFruits(fruits)).toEqual(["orange", "pear", "apple"]);
  });

  it("rejects incomplete arrays at the type level", () => {
    const arrayOfAllFruits = arrayOfAll<Fruit>();
    // @ts-expect-error "orange" is missing
    expect(arrayOfAllFruits(["pear", "apple"] as const)).toEqual([
      "pear",
      "apple",
    ]);
  });

  it("ArrayOfAll type checks the list against the union", () => {
    expectTypeOf<
      ArrayOfAll<["pear", "apple", "orange"], Fruit>
    >().toEqualTypeOf<true>();
    expectTypeOf<
      ArrayOfAll<["pear", "apple", "kiwi"], Fruit>
    >().toEqualTypeOf<"Incomplete">();
  });

  it("ArrayOfAll resolves to 'Incomplete' for a list missing some members", () => {
    expectTypeOf<
      ArrayOfAll<["pear", "apple"], Fruit>
    >().toEqualTypeOf<"Incomplete">();
    expectTypeOf<ArrayOfAll<[], Fruit>>().toEqualTypeOf<"Incomplete">();
    expectTypeOf<
      ArrayOfAll<readonly ["orange", "pear", "apple", "pear"], Fruit>
    >().toEqualTypeOf<true>();
  });
});
