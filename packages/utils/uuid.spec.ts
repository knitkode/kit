import { uuid } from "./uuid";

describe("uuid", () => {
  test("generates a valid UUID in the format xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx", () => {
    const result = uuid();
    const uuidPattern =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    expect(result).toMatch(uuidPattern);
  });

  test("generates unique UUIDs on multiple calls", () => {
    const uuids = new Set();
    for (let i = 0; i < 1000; i++) {
      uuids.add(uuid());
    }
    expect(uuids.size).toBe(1000); // Checks for uniqueness among 1000 calls
  });

  test("generates UUIDs with the correct length of 36 characters", () => {
    const result = uuid();
    expect(result).toHaveLength(36);
  });

  test("contains the correct static characters in positions 14 and 19", () => {
    const result = uuid();
    expect(result[14]).toBe("4"); // UUID version should be 4
    expect(["8", "9", "a", "b"]).toContain(result[19]); // UUID variant should be one of 8, 9, a, or b
  });

  describe("with a stubbed Math.random", () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    test("uses Math.random once per random hex digit", () => {
      const random = vi.spyOn(Math, "random").mockReturnValue(0.5);
      uuid();
      expect(random).toHaveBeenCalledTimes(31);
    });

    test.each([
      [0, "00000000-0000-4000-8000-000000000000"],
      [0.5, "88888888-8888-4888-8888-888888888888"],
      [0.2, "33333333-3333-4333-b333-333333333333"],
      [0.999999, "ffffffff-ffff-4fff-bfff-ffffffffffff"],
    ])("maps Math.random() = %d to %s", (value, expected) => {
      vi.spyOn(Math, "random").mockReturnValue(value);
      expect(uuid()).toBe(expected);
    });
  });
});
