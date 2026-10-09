import { storage } from "./storage";

describe("storage", () => {
  afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it("exposes a `localStorage` client as `l`", () => {
    storage.l.set("key", { a: 1 });

    expect(localStorage.getItem("key")).toBe('{"a":1}');
    expect(sessionStorage.getItem("key")).toBeNull();
    expect(storage.l.get("key")).toEqual({ a: 1 });
    expect(storage.l.has("key")).toBeTruthy();

    storage.l.remove("key");

    expect(localStorage.getItem("key")).toBeNull();
  });

  it("exposes a `sessionStorage` client as `s`", () => {
    storage.s.set("key", "value");

    expect(sessionStorage.getItem("key")).toBe("value");
    expect(localStorage.getItem("key")).toBeNull();
    expect(storage.s.get("key")).toBe("value");
    expect(storage.s.has("key")).toBeTruthy();

    storage.s.remove("key");

    expect(sessionStorage.getItem("key")).toBeNull();
  });
});
