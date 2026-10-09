import {
  swcCreateTransform,
  swcCreateTransforms,
  swcTransformsKit,
} from "./swc";

/**
 * Apply a transform the way SWC `modularizeImports` does: match the import
 * source against the key regex and fill the `transform` template
 */
const applyTransform = (
  transforms: Record<string, { transform: string }>,
  source: string,
  member: string,
) => {
  for (const [pattern, { transform }] of Object.entries(transforms)) {
    const matches = new RegExp(`^${pattern}$`).exec(source);
    if (matches) {
      return transform
        .replace("{{member}}", member)
        .replace("{{ matches.[1] }}", matches[1] ?? "");
    }
  }
  return null;
};

describe("swcCreateTransform", () => {
  it("transforms the imports of flat libraries to root level paths", () => {
    expect(swcCreateTransform({ path: "@org/utils", flat: true })).toEqual({
      "@org/utils": { transform: "@org/utils/{{member}}" },
    });
  });

  it("transforms the imports of nested libraries keeping their sub path", () => {
    expect(swcCreateTransform({ path: "@org/ui" })).toEqual({
      "@org/ui": { transform: "@org/ui/{{member}}" },
      "@org/ui/(((\\$*\\w*)?/?)*)": {
        transform: "@org/ui/{{ matches.[1] }}/{{member}}",
      },
    });
    expect(swcCreateTransform({ path: "@org/ui", flat: false })).toEqual(
      swcCreateTransform({ path: "@org/ui" }),
    );
  });

  it("produces a pattern capturing the import sub path", () => {
    const transforms = swcCreateTransform({ path: "@org/ui" });

    expect(applyTransform(transforms, "@org/ui/forms", "Input")).toBe(
      "@org/ui/forms/Input",
    );
    expect(applyTransform(transforms, "@org/ui/forms/fields", "Input")).toBe(
      "@org/ui/forms/fields/Input",
    );
    expect(applyTransform(transforms, "@org/other", "Input")).toBeNull();
  });

  it("transforms root imports of nested libraries without a double slash", () => {
    const transforms = swcCreateTransform({ path: "@org/ui" });

    expect(applyTransform(transforms, "@org/ui", "Button")).toBe(
      "@org/ui/Button",
    );
    expect(applyTransform(transforms, "@org/uix", "Button")).toBeNull();
  });

  it("produces a flat pattern matching only the library root", () => {
    const transforms = swcCreateTransform({ path: "@org/utils", flat: true });

    expect(applyTransform(transforms, "@org/utils", "slugify")).toBe(
      "@org/utils/slugify",
    );
    expect(applyTransform(transforms, "@org/utils/nested", "x")).toBeNull();
  });
});

describe("swcCreateTransforms", () => {
  it("merges the transforms of all the given libraries", () => {
    expect(
      swcCreateTransforms([
        { path: "@org/utils", flat: true },
        { path: "@org/ui" },
      ] as const),
    ).toEqual({
      "@org/utils": { transform: "@org/utils/{{member}}" },
      "@org/ui": { transform: "@org/ui/{{member}}" },
      "@org/ui/(((\\$*\\w*)?/?)*)": {
        transform: "@org/ui/{{ matches.[1] }}/{{member}}",
      },
    });
  });

  it("returns an empty object without libraries", () => {
    expect(swcCreateTransforms([])).toEqual({});
  });
});

describe("swcTransformsKit", () => {
  it("contains the transforms of all the `@knitkode/*` libraries", () => {
    expect(swcTransformsKit).toEqual({
      "@knitkode/api": { transform: "@knitkode/api/{{member}}" },
      "@knitkode/browser": { transform: "@knitkode/browser/{{member}}" },
      "@knitkode/dom": { transform: "@knitkode/dom/{{member}}" },
      "@knitkode/node": { transform: "@knitkode/node/{{member}}" },
      "@knitkode/react": { transform: "@knitkode/react/{{member}}" },
      "@knitkode/utils": { transform: "@knitkode/utils/{{member}}" },
    });
  });

  it("maps flat library imports to their modules", () => {
    expect(applyTransform(swcTransformsKit, "@knitkode/utils", "slugify")).toBe(
      "@knitkode/utils/slugify",
    );
  });

  it("leaves sub path imports alone, they are entry points already", () => {
    expect(
      applyTransform(
        swcTransformsKit,
        "@knitkode/react/calendar",
        "useCalendar",
      ),
    ).toBeNull();
    expect(applyTransform(swcTransformsKit, "@knitkode/api", "createApi")).toBe(
      "@knitkode/api/createApi",
    );
  });
});
