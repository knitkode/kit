describe("uid", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("generates incremental ids with the default prefix", async () => {
    const { uid } = await import("./uid");
    expect(uid()).toBe("id-1");
    expect(uid()).toBe("id-2");
    expect(uid()).toBe("id-3");
  });

  it("uses the given prefix and shares the counter across prefixes", async () => {
    const { uid } = await import("./uid");
    expect(uid("button")).toBe("button-1");
    expect(uid("input")).toBe("input-2");
    expect(uid()).toBe("id-3");
  });

  it("supports an empty prefix", async () => {
    const { uid } = await import("./uid");
    expect(uid("")).toBe("-1");
  });

  it("never returns the same id twice", async () => {
    const { uid } = await import("./uid");
    const ids = new Set(Array.from({ length: 100 }, () => uid()));
    expect(ids.size).toBe(100);
  });
});
