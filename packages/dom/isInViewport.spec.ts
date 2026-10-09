import { isInViewport } from "./isInViewport";

describe("isInViewport", () => {
  let element: any;

  beforeEach(() => {
    element = document.createElement("div");
    document.body.appendChild(element);
  });

  afterEach(() => {
    document.body.removeChild(element);
    vitest.restoreAllMocks();
  });

  const stubRect = (rect: {
    top: number;
    left: number;
    bottom: number;
    right: number;
  }) => {
    vitest
      .spyOn(element as HTMLElement, "getBoundingClientRect")
      .mockReturnValue({ ...rect } as DOMRect);
  };

  test("returns true when element edges lie exactly on the viewport bounds", () => {
    stubRect({
      top: 0,
      left: 0,
      bottom: window.innerHeight,
      right: window.innerWidth,
    });
    expect(isInViewport(element)).toBe(true);
  });

  test("falls back to the document element size when window size is not available", () => {
    vitest.spyOn(window, "innerHeight", "get").mockReturnValue(0);
    vitest.spyOn(window, "innerWidth", "get").mockReturnValue(0);
    vitest
      .spyOn(document.documentElement, "clientHeight", "get")
      .mockReturnValue(500);
    vitest
      .spyOn(document.documentElement, "clientWidth", "get")
      .mockReturnValue(400);

    stubRect({ top: 10, left: 10, bottom: 450, right: 350 });
    expect(isInViewport(element)).toBe(true);

    stubRect({ top: 10, left: 10, bottom: 550, right: 350 });
    expect(isInViewport(element)).toBe(false);

    stubRect({ top: 10, left: 10, bottom: 450, right: 450 });
    expect(isInViewport(element)).toBe(false);
  });

  test("returns true when element is fully within the viewport", () => {
    element.getBoundingClientRect = vitest.fn(() => ({
      top: 50,
      left: 50,
      bottom: 100,
      right: 100,
    }));
    expect(isInViewport(element)).toBe(true);
  });

  test("returns false when element is partially above the viewport", () => {
    element.getBoundingClientRect = vitest.fn(() => ({
      top: -10,
      left: 50,
      bottom: 100,
      right: 100,
    }));
    expect(isInViewport(element)).toBe(false);
  });

  test("returns false when element is partially to the left of the viewport", () => {
    element.getBoundingClientRect = vitest.fn(() => ({
      top: 50,
      left: -10,
      bottom: 100,
      right: 100,
    }));
    expect(isInViewport(element)).toBe(false);
  });

  test("returns false when element is partially below the viewport", () => {
    element.getBoundingClientRect = vitest.fn(() => ({
      top: window.innerHeight - 10,
      left: 50,
      bottom: window.innerHeight + 10,
      right: 100,
    }));
    expect(isInViewport(element)).toBe(false);
  });

  test("returns false when element is partially to the right of the viewport", () => {
    element.getBoundingClientRect = vitest.fn(() => ({
      top: 50,
      left: window.innerWidth - 10,
      bottom: 100,
      right: window.innerWidth + 10,
    }));
    expect(isInViewport(element)).toBe(false);
  });

  test("returns false when element is completely outside the viewport", () => {
    element.getBoundingClientRect = vitest.fn(() => ({
      top: -100,
      left: -100,
      bottom: -50,
      right: -50,
    }));
    expect(isInViewport(element)).toBe(false);
  });
});
