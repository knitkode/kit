import {
  defaultBaseSortFn,
  type MatchSorterOptions,
  matchSorter,
} from "./matchSorter";

describe("matchSorter", () => {
  describe("without keys", () => {
    it("filters out the items that do not match", () => {
      expect(matchSorter(["apple", "banana", "grape"], "ap")).toEqual([
        "apple",
        "grape",
      ]);
    });

    it("returns every item sorted alphabetically for an empty value", () => {
      expect(matchSorter(["c", "a", "b"], "")).toEqual(["a", "b", "c"]);
    });

    it("returns an empty array when nothing matches", () => {
      expect(matchSorter(["apple", "banana"], "xyz")).toEqual([]);
      expect(matchSorter([], "a")).toEqual([]);
    });

    it("sorts the items by ranking", () => {
      const items = [
        "aXbXc", // matches (fuzzy)
        "a-b-c", // acronym
        "xabc", // contains
        "x abc", // word starts with
        "abcd", // starts with
        "Abc", // case insensitive equal
        "abc", // case sensitive equal
      ];
      expect(matchSorter(items, "abc")).toEqual([
        "abc",
        "Abc",
        "abcd",
        "x abc",
        "xabc",
        "a-b-c",
        "aXbXc",
      ]);
    });

    it("ranks tighter fuzzy matches first", () => {
      expect(matchSorter(["a___b___c", "a_b_c"], "abc")).toEqual([
        "a_b_c",
        "a___b___c",
      ]);
    });

    it("does not match when the value is longer than the item", () => {
      expect(matchSorter(["ab"], "abc")).toEqual([]);
    });

    it("does not match a single character that is not contained", () => {
      expect(matchSorter(["abc"], "z")).toEqual([]);
    });

    it("does not match when the characters are out of order", () => {
      expect(matchSorter(["cba"], "abc")).toEqual([]);
    });

    it("does not match when the first character is missing", () => {
      expect(matchSorter(["bcd"], "ad")).toEqual([]);
    });

    it("uses the alphabetical order as tie-breaker", () => {
      expect(matchSorter(["xb", "xa", "xc"], "x")).toEqual(["xa", "xb", "xc"]);
    });

    it("stringifies non string items", () => {
      expect(matchSorter([123, 456, 1234], "123")).toEqual([123, 1234]);
    });
  });

  describe("threshold", () => {
    const items = ["abc", "abcd", "xabc", "a-b-c", "aXbXc"];

    it("keeps only the items ranked at least as the given threshold", () => {
      expect(matchSorter(items, "abc", { threshold: 3 })).toEqual([
        "abc",
        "abcd",
        "xabc",
      ]);
      expect(matchSorter(items, "abc", { threshold: 7 })).toEqual(["abc"]);
    });

    it("can include everything with a threshold of 0", () => {
      expect(matchSorter(["a", "b"], "z", { threshold: 0 })).toEqual([
        "a",
        "b",
      ]);
    });
  });

  describe("diacritics", () => {
    it("ignores diacritics by default", () => {
      expect(matchSorter(["café", "tea"], "cafe")).toEqual(["café"]);
    });

    it("keeps diacritics when asked", () => {
      expect(
        matchSorter(["café", "tea"], "cafe", { keepDiacritics: true }),
      ).toEqual([]);
      expect(
        matchSorter(["café", "cafe"], "café", { keepDiacritics: true }),
      ).toEqual(["café"]);
    });
  });

  describe("keys", () => {
    const people = [
      { name: "Janice", email: "jan@example.com" },
      { name: "Fred", email: "fred@example.com" },
      { name: "George", email: "jo@example.com" },
      { name: "Jen", email: "jen@example.com" },
    ];

    it("matches on the given property", () => {
      expect(
        matchSorter(people, "j", { keys: ["name"] }).map((p) => p.name),
      ).toEqual(["Janice", "Jen"]);
    });

    it("matches on multiple properties keeping the best ranking", () => {
      // "jo@example.com" starts with "jo", the other emails only fuzzy match
      expect(
        matchSorter(people, "jo", { keys: ["name", "email"] }).map(
          (p) => p.name,
        ),
      ).toEqual(["George", "Janice", "Jen"]);
      expect(
        matchSorter(people, "jo", { keys: ["name", "email"], threshold: 3 }),
      ).toEqual([people[2]]);
    });

    it("prefers the matches on the first keys for equal rankings", () => {
      const items = [
        { a: "other", b: "match" },
        { a: "match", b: "other" },
      ];
      expect(matchSorter(items, "match", { keys: ["a", "b"] })).toEqual([
        { a: "match", b: "other" },
        { a: "other", b: "match" },
      ]);
      expect(
        matchSorter([...items].reverse(), "match", { keys: ["a", "b"] }),
      ).toEqual([
        { a: "match", b: "other" },
        { a: "other", b: "match" },
      ]);
    });

    it("matches on nested properties", () => {
      const items = [
        { user: { name: "Ann" } },
        { user: { name: "Bob" } },
        { user: null },
        { other: true },
      ];
      expect(
        matchSorter(items as { user?: { name: string } }[], "bo", {
          keys: ["user.name"],
        }),
      ).toEqual([{ user: { name: "Bob" } }]);
    });

    it("prefers an own property named with a dot over a nested path", () => {
      const items = [{ "a.b": "own", a: { b: "nested" } }];
      expect(matchSorter(items, "own", { keys: ["a.b"] })).toEqual(items);
      expect(matchSorter(items, "nested", { keys: ["a.b"] })).toEqual([]);
    });

    it("matches on arrays of strings", () => {
      const items = [
        { tags: ["red", "blue"] },
        { tags: ["green"] },
        { tags: [] },
      ];
      expect(matchSorter(items, "blue", { keys: ["tags"] })).toEqual([
        { tags: ["red", "blue"] },
      ]);
    });

    it("matches on nested arrays of strings", () => {
      const items = [
        { meta: { tags: ["red", "blue"] } },
        { meta: { tags: [] } },
      ];
      expect(matchSorter(items, "red", { keys: ["meta.tags"] })).toEqual([
        { meta: { tags: ["red", "blue"] } },
      ]);
    });

    it("matches with the '*' wildcard", () => {
      const items = [
        { friends: [{ name: "Ann" }, { name: "Bob" }] },
        { friends: [{ name: "Carl" }] },
        { friends: [null, { name: "Bobby" }] },
      ];
      expect(
        matchSorter(
          items as { friends: ({ name: string } | null)[] }[],
          "bob",
          {
            keys: ["friends.*.name"],
          },
        ),
      ).toEqual([items[0], items[2]]);
    });

    it("matches on the values returned by a function key", () => {
      expect(
        matchSorter(people, "example", {
          keys: [(person) => person.email.split("@")[1]],
        }),
      ).toHaveLength(4);
      expect(
        matchSorter(people, "fred", {
          keys: [(person) => [person.name, person.email]],
        }).map((p) => p.name),
      ).toEqual(["Fred"]);
    });

    it("stringifies non string values", () => {
      const items = [{ id: 42 }, { id: 7 }];
      expect(matchSorter(items, "42", { keys: ["id"] })).toEqual([{ id: 42 }]);
    });

    it("skips missing and nullish values", () => {
      const items = [{ name: null }, {}, { name: "Ann" }];
      expect(
        matchSorter(items as { name?: string | null }[], "ann", {
          keys: ["name"],
        }),
      ).toEqual([{ name: "Ann" }]);
    });

    it("skips nullish items", () => {
      expect(
        matchSorter([null, { name: "Ann" }] as { name: string }[], "ann", {
          keys: ["name"],
        }),
      ).toEqual([{ name: "Ann" }]);
    });

    describe("key attributes", () => {
      const items = [{ name: "abc" }, { name: "xabc" }, { name: "aXbXc" }];

      it("supports object keys", () => {
        expect(matchSorter(items, "abc", { keys: [{ key: "name" }] })).toEqual(
          items,
        );
      });

      it("applies a threshold per key", () => {
        expect(
          matchSorter(items, "abc", { keys: [{ key: "name", threshold: 3 }] }),
        ).toEqual([{ name: "abc" }, { name: "xabc" }]);
      });

      it("caps the ranking with maxRanking", () => {
        const list = [{ name: "zabc" }, { name: "abc" }];
        const byIndex = {
          baseSort: (a: { index: number }, b: { index: number }) =>
            a.index - b.index,
        };
        // uncapped: "abc" is an exact match and comes first
        expect(
          matchSorter(list, "abc", { keys: ["name"], ...byIndex }),
        ).toEqual([{ name: "abc" }, { name: "zabc" }]);
        // capped: both rank as CONTAINS so the base sort keeps the given order
        expect(
          matchSorter(list, "abc", {
            keys: [{ key: "name", maxRanking: 3 }],
            ...byIndex,
          }),
        ).toEqual(list);
        expect(
          matchSorter(items, "abc", {
            keys: [{ key: "name", maxRanking: 3 }],
            threshold: 4,
          }),
        ).toEqual([]);
      });

      it("raises the ranking of the matches with minRanking", () => {
        const result = matchSorter(
          [{ name: "aXbXc" }, { name: "xabc" }],
          "abc",
          { keys: [{ key: "name", minRanking: 5 }] },
        );
        // both are raised to STARTS_WITH, then sorted alphabetically
        expect(result).toEqual([{ name: "aXbXc" }, { name: "xabc" }]);
      });

      it("does not raise the ranking of non matches with minRanking", () => {
        expect(
          matchSorter([{ name: "zzz" }], "abc", {
            keys: [{ key: "name", minRanking: 5 }],
          }),
        ).toEqual([]);
      });

      it("supports function keys within object keys", () => {
        expect(
          matchSorter(items, "xabc", {
            keys: [{ key: (item) => item.name, threshold: 6 }],
          }),
        ).toEqual([{ name: "xabc" }]);
      });
    });
  });

  describe("sorting options", () => {
    it("uses the given base sort as tie-breaker", () => {
      expect(
        matchSorter(["xa", "xc", "xb"], "x", {
          baseSort: (a, b) => (a.index < b.index ? -1 : 1),
        }),
      ).toEqual(["xa", "xc", "xb"]);
    });

    it("uses the given sorter", () => {
      const sorter = vi.fn<NonNullable<MatchSorterOptions<string>["sorter"]>>(
        (ranked) => [...ranked].reverse(),
      );
      expect(matchSorter(["abc", "abcd", "xyz"], "abc", { sorter })).toEqual([
        "abcd",
        "abc",
      ]);
      expect(sorter).toHaveBeenCalledTimes(1);
    });

    it("exports the default base sort function", () => {
      const ranked = (rankedValue: string) => ({
        rankedValue,
        rank: 1 as const,
        keyIndex: 0,
        keyThreshold: undefined,
        item: rankedValue,
        index: 0,
      });
      expect(defaultBaseSortFn(ranked("a"), ranked("b"))).toBeLessThan(0);
      expect(defaultBaseSortFn(ranked("b"), ranked("a"))).toBeGreaterThan(0);
      expect(defaultBaseSortFn(ranked("a"), ranked("a"))).toBe(0);
    });
  });

  it("does not mutate the given items", () => {
    const items = ["b", "a"];
    matchSorter(items, "");
    expect(items).toEqual(["b", "a"]);
  });
});
