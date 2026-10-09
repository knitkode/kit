import { setVendorCSS } from "./setVendorCSS";

describe("setVendorCSS", () => {
  let el: HTMLDivElement;
  let style: Record<string, unknown>;

  beforeEach(() => {
    el = document.createElement("div");
    style = el.style as unknown as Record<string, unknown>;
  });

  test("sets the unprefixed property", () => {
    setVendorCSS(el, "transform", "rotate(45deg)");

    expect(el.style.transform).toBe("rotate(45deg)");
  });

  test("sets the vendor prefixed properties", () => {
    setVendorCSS(el, "transform", "rotate(45deg)");

    expect(style["webkitTransform"]).toBe("rotate(45deg)");
    expect(style["mozTransform"]).toBe("rotate(45deg)");
    expect(style["msTransform"]).toBe("rotate(45deg)");
    expect(style["oTransform"]).toBe("rotate(45deg)");
  });

  test("capitalizes camelCased properties after the prefix", () => {
    setVendorCSS(el, "transitionDuration", "2s");

    expect(el.style.transitionDuration).toBe("2s");
    expect(style["webkitTransitionDuration"]).toBe("2s");
    expect(style["oTransitionDuration"]).toBe("2s");
  });

  test("accepts numeric values", () => {
    setVendorCSS(el, "opacity", 0.5);

    expect(el.style.opacity).toBe("0.5");
  });
});
