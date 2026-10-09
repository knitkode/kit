import { quaranteneProps } from "./quaranteneProps";

describe("quaranteneProps", () => {
  it("moves the given props under the '_' key", () => {
    const onClick = () => {};
    const onKeyDown = () => {};
    const result = quaranteneProps({ id: "a", onClick, onKeyDown, size: 2 }, [
      "onClick",
      "onKeyDown",
    ] as const);

    expect(result).toEqual({ _: { onClick, onKeyDown }, id: "a", size: 2 });
    expect(result._.onClick).toBe(onClick);
  });

  it("keeps all the props when none is quarantined", () => {
    expect(quaranteneProps({ a: 1, b: 2 }, [])).toEqual({ _: {}, a: 1, b: 2 });
  });

  it("ignores quarantined keys missing from the props", () => {
    const props: { a: number; b?: number } = { a: 1 };
    expect(quaranteneProps(props, ["b"] as const)).toEqual({ _: {}, a: 1 });
  });

  it("does not mutate the given props", () => {
    const props = { a: 1, b: 2 };
    quaranteneProps(props, ["a"] as const);
    expect(props).toEqual({ a: 1, b: 2 });
  });

  it("types the healthy and the quarantined props", () => {
    const result = quaranteneProps({ a: 1, b: "b" }, ["a"] as const);
    expectTypeOf(result._).toEqualTypeOf<{ a: number }>();
    expectTypeOf(result.b).toEqualTypeOf<string>();
  });
});
