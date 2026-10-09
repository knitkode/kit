import { getMediaQueryWidthTailwindScreens } from "./getMediaQueryWidthTailwindScreens";

describe("getMediaQueryWidthTailwindScreens", () => {
  it("creates the TailwindCSS screens for every breakpoint and resolver", () => {
    expect(
      getMediaQueryWidthTailwindScreens({ sm: 640, md: 768, lg: 1024 }),
    ).toEqual({
      "@sm": { raw: "(min-width: 640px)" },
      "@min-sm": { raw: "(min-width: 640px)" },
      "@up-sm": { raw: "(min-width: 640px)" },
      "@max-sm": { raw: "(max-width: 639.98px)" },
      "@down-sm": { raw: "(max-width: 767.98px)" },
      "@between-sm_md": {
        raw: "(min-width: 640px) and (max-width: 767.98px)",
      },
      "@only-sm": { raw: "(min-width: 640px) and (max-width: 767.98px)" },
      "@md": { raw: "(min-width: 768px)" },
      "@min-md": { raw: "(min-width: 768px)" },
      "@up-md": { raw: "(min-width: 768px)" },
      "@max-md": { raw: "(max-width: 767.98px)" },
      "@down-md": { raw: "(max-width: 1023.98px)" },
      "@between-md_lg": {
        raw: "(min-width: 768px) and (max-width: 1023.98px)",
      },
      "@only-md": { raw: "(min-width: 768px) and (max-width: 1023.98px)" },
      "@lg": { raw: "(min-width: 1024px)" },
      "@min-lg": { raw: "(min-width: 1024px)" },
      "@up-lg": { raw: "(min-width: 1024px)" },
      "@max-lg": { raw: "(max-width: 1023.98px)" },
      "@only-lg": { raw: "(min-width: 1024px)" },
    });
  });

  it("skips 'down' and 'between' for the largest breakpoint", () => {
    const screens = getMediaQueryWidthTailwindScreens({ sm: 640, md: 768 });
    expect(screens).not.toHaveProperty("@down-md");
    expect(
      Object.keys(screens).some((key) => key.startsWith("@between-md")),
    ).toBe(false);
  });

  it("returns an empty object without breakpoints", () => {
    expect(getMediaQueryWidthTailwindScreens({})).toEqual({});
  });
});
