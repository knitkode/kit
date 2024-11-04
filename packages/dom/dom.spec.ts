import { dom } from "./dom";

describe("dom", () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    // Create a container and some test elements
    container = document.createElement("div");
    container.innerHTML = `
      <div class="my-section:">
        <span id="test-id">Test Element</span>
        <div class="my-item"></div>
      </div>
      <div class="another-section">
        <span class="my-section-2:">Another Element</span>
      </div>
    `;
    document.body.appendChild(container);
  });

  afterEach(() => {
    // Clean up the DOM after each test
    document.body.removeChild(container);
  });

  test("selects element by class with colon", () => {
    const result = dom(".my-section:");
    expect(result).toBeTruthy();
    expect(result.classList.contains("my-section:")).toBe(true);
  });

  test("selects element by id", () => {
    const result = dom("#test-id");
    expect(result).toBeTruthy();
    expect(result.id).toBe("test-id");
  });

  test("selects element by class within a parent element", () => {
    const parent = dom(".my-section:");
    const result = dom(".my-item", parent);
    expect(result).toBeTruthy();
    expect(result.classList.contains("my-item")).toBe(true);
  });

  test("returns null for non-existent element", () => {
    const result = dom(".non-existent-class");
    expect(result).toBeNull();
  });

  test("avoids escaping when avoidEscape is true", () => {
    const result = dom(".my-item", container, true);
    expect(result).toBeTruthy();
    expect(result.classList.contains("my-item")).toBe(true);
  });

  test("selects element with a colon when avoidEscape is false", () => {
    const result = dom(".my-section:", container);
    expect(result).toBeTruthy();
    expect(result.classList.contains("my-section:")).toBe(true);
  });

  test("returns the correct element in a different parent", () => {
    const result = dom(
      ".my-section-2:",
      container.querySelector(".another-section"),
    );
    expect(result.classList.contains("my-section-2:")).toBe(true);
  });
});
