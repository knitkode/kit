import { uuidNumeric } from "./uuidNumeric";

describe("uuidNumeric", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns the current timestamp in milliseconds", () => {
    vi.setSystemTime(new Date("2024-01-01T00:00:00.000Z"));
    expect(uuidNumeric()).toBe(1704067200000);
  });

  it("returns a growing integer as time passes", () => {
    vi.setSystemTime(new Date("2024-01-01T00:00:00.000Z"));
    const first = uuidNumeric();
    vi.advanceTimersByTime(5);
    const second = uuidNumeric();
    expect(Number.isInteger(first)).toBe(true);
    expect(second - first).toBe(5);
  });
});
