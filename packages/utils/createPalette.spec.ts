import { createPalette } from "./createPalette";

describe("createPalette", () => {
  const shades = [
    [100, "#eef"],
    [500, "#33f"],
    [900, "#002"],
  ] as const;

  it("returns a flat map of the shades", () => {
    const [map] = createPalette("blue", shades);
    expect(map).toEqual({ 100: "#eef", 500: "#33f", 900: "#002" });
  });

  it("returns a TailwindCSS palette with prefixed names", () => {
    const [, tailwind] = createPalette("blue", shades);
    expect(tailwind).toEqual({
      "blue-100": "#eef",
      "blue-500": "#33f",
      "blue-900": "#002",
    });
  });

  it("returns the flat list of colors", () => {
    const [, , colors] = createPalette("blue", shades);
    expect(colors).toEqual(["#eef", "#33f", "#002"]);
  });

  it("handles an empty list of shades", () => {
    expect(createPalette("empty", [])).toEqual([{}, {}, []]);
  });

  it("types the map and the TailwindCSS palette keys", () => {
    const [map, tailwind] = createPalette("blue", shades);
    expectTypeOf(map).toEqualTypeOf<{
      "100": "#eef";
      "500": "#33f";
      "900": "#002";
    }>();
    expectTypeOf(tailwind).toEqualTypeOf<
      Record<"blue-100" | "blue-500" | "blue-900", string>
    >();
  });
});
