import type { AccentsSet } from "./accentsSets";
import { removeAccents } from "./removeAccents";

describe("removeAccents", () => {
  it.each([
    ["crème brûlée", "creme brulee"],
    ["façade", "facade"],
    ["mañana", "manana"],
    ["smørrebrød", "smorrebrod"],
    ["żółć", "zolc"],
    ["ăâđêôơư", "aadeoou"],
    ["über", "ueber"],
    ["straße", "strasse"],
    ["œuvre", "oeuvre"],
    ["ĳssel", "ijssel"],
  ])("removes accents from lowercase text: %s", (input, expected) => {
    expect(removeAccents(input)).toBe(expected);
  });

  it("keeps the case of characters that have no accent", () => {
    expect(removeAccents("Crème Brûlée")).toBe("Creme Brulee");
  });

  it.each([
    ["École", "Ecole"],
    ["ÉLAN", "ELAN"],
    ["Çà", "Ca"],
    ["Ärger", "Aerger"],
    ["Über", "Ueber"],
    ["Œuvre", "Oeuvre"],
  ])("keeps the case of the replaced letters: %s", (input, expected) => {
    expect(removeAccents(input)).toBe(expected);
  });

  it("leaves text without accents untouched", () => {
    expect(removeAccents("Hello World 123 !?")).toBe("Hello World 123 !?");
  });

  it("leaves characters outside of the sets untouched", () => {
    expect(removeAccents("世界 👋 Ω")).toBe("世界 👋 Ω");
  });

  it("returns an empty string for empty or missing input", () => {
    expect(removeAccents("")).toBe("");
    expect(removeAccents()).toBe("");
  });

  it("accepts custom accents sets", () => {
    const sets: AccentsSet[] = [["x", "ab"]];
    expect(removeAccents("abcab", sets)).toBe("xxcxx");
    expect(removeAccents("crème", [])).toBe("crème");
  });
});
