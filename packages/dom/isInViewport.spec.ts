
import { isInViewport } from "./isInViewport";

describe("isInViewport", () => {
  let element: any;

  beforeEach(() => {
    element = document.createElement("div");
    document.body.appendChild(element);
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  test("returns true when element is fully within the viewport", () => {
    element.getBoundingClientRect = jest.fn(() => ({
      top: 50,
      left: 50,
      bottom: 100,
      right: 100,
    }));
    expect(isInViewport(element)).toBe(true);
  });

  test("returns false when element is partially above the viewport", () => {
    element.getBoundingClientRect = jest.fn(() => ({
      top: -10,
      left: 50,
      bottom: 100,
      right: 100,
    }));
    expect(isInViewport(element)).toBe(false);
  });

  test("returns false when element is partially to the left of the viewport", () => {
    element.getBoundingClientRect = jest.fn(() => ({
      top: 50,
      left: -10,
      bottom: 100,
      right: 100,
    }));
    expect(isInViewport(element)).toBe(false);
  });

  test("returns false when element is partially below the viewport", () => {
    element.getBoundingClientRect = jest.fn(() => ({
      top: window.innerHeight - 10,
      left: 50,
      bottom: window.innerHeight + 10,
      right: 100,
    }));
    expect(isInViewport(element)).toBe(false);
  });

  test("returns false when element is partially to the right of the viewport", () => {
    element.getBoundingClientRect = jest.fn(() => ({
      top: 50,
      left: window.innerWidth - 10,
      bottom: 100,
      right: window.innerWidth + 10,
    }));
    expect(isInViewport(element)).toBe(false);
  });

  test("returns false when element is completely outside the viewport", () => {
    element.getBoundingClientRect = jest.fn(() => ({
      top: -100,
      left: -100,
      bottom: -50,
      right: -50,
    }));
    expect(isInViewport(element)).toBe(false);
  });
});
