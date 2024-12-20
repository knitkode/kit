import { getVisualBackgroundColor } from "./getVisualBackgroundColor";

describe("getVisualBackgroundColor", () => {
  let element: HTMLDivElement;

  beforeEach(() => {
    // Create a basic DOM structure for testing
    document.body.innerHTML = `
      <div class="parent" style="background-color: red;">
        <div class="child" style="background-color: rgba(0, 0, 0, 0);">
          <div class="grandchild" style="background-color: blue;"></div>
        </div>
      </div>
    `;
    element = document.querySelector(".child") as HTMLDivElement;
  });

  afterEach(() => {
    // Clean up the DOM after each test
    document.body.innerHTML = "";
  });

  test("returns the background color of the element if it is solid", () => {
    const solidElement = document.createElement("div");
    solidElement.style.backgroundColor = "green";
    document.body.appendChild(solidElement);

    const result = getVisualBackgroundColor(solidElement);
    expect(result).toBe("rgb(0, 128, 0)");

    document.body.removeChild(solidElement);
  });

  test("returns the background color of the parent if the element is transparent", () => {
    const result = getVisualBackgroundColor(element);
    expect(result).toBe("rgb(255, 0, 0)");
  });

  test("returns the background color of the grandparent if the immediate parent is transparent", () => {
    const grandchild = document.querySelector(".grandchild") as HTMLDivElement;
    grandchild.style.backgroundColor = "";
    const result = getVisualBackgroundColor(grandchild);
    expect(result).toBe("rgb(255, 0, 0)");
  });

  test("returns #fff if there are no parents with a solid background", () => {
    const transparentElement = document.createElement("div");
    transparentElement.style.backgroundColor = "rgba(0, 0, 0, 0)";
    document.body.appendChild(transparentElement);

    const result = getVisualBackgroundColor(transparentElement);
    expect(result).toBe("#fff");

    document.body.removeChild(transparentElement);
  });

  test("returns #fff if the element is null", () => {
    const result = getVisualBackgroundColor(null);
    expect(result).toBe("#fff");
  });
});
