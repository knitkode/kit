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
});
