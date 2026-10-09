import { type AccentsSet, accentsSets } from "./accentsSets";

describe("accentsSets", () => {
  it("is a non-empty list of [to, from] string pairs", () => {
    expect(accentsSets.length).toBeGreaterThan(0);
    for (const set of accentsSets) {
      expect(set).toHaveLength(2);
      expect(typeof set[0]).toBe("string");
      expect(typeof set[1]).toBe("string");
      expect(set[1].length).toBeGreaterThan(0);
    }
  });

  it("only translates to lowercase ascii letters", () => {
    for (const [to] of accentsSets) {
      expect(to).toMatch(/^[a-z]+$/);
    }
  });

  it("never lists the same source character in two sets", () => {
    const seen = new Map<string, string>();
    for (const [to, from] of accentsSets) {
      for (const char of from) {
        expect(seen.get(char), `"${char}" mapped twice`).toBeUndefined();
        seen.set(char, to);
      }
    }
  });

  it.each<AccentsSet>([
    ["a", "À"],
    ["ae", "Ä"],
    ["c", "Ç"],
    ["e", "É"],
    ["n", "Ñ"],
    ["o", "Ø"],
    ["oe", "Ö"],
    ["oe", "Œ"],
    ["ss", "ß"],
    ["u", "Ù"],
    ["ue", "Ü"],
    ["ij", "Ĳ"],
  ])("translates to %s the character %s", (to, char) => {
    const set = accentsSets.find(([, from]) => from.includes(char));
    expect(set?.[0]).toBe(to);
  });
});
