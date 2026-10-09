import {
  capitalCaseTransformFactory,
  lowerFactory,
  pascalCaseTransformFactory,
  split,
  splitPrefixSuffix,
  splitSeparateNumbers,
  upperFactory,
} from "./changeCaseHelpers";

const lower = (input: string) => input.toLowerCase();
const upper = (input: string) => input.toUpperCase();

describe("split", () => {
  it.each([
    ["", []],
    ["   ", []],
    ["___", []],
    ["test", ["test"]],
    ["test string", ["test", "string"]],
    ["Test String", ["Test", "String"]],
    ["TestV2", ["Test", "V2"]],
    ["_foo_bar_", ["foo", "bar"]],
    ["foo-bar.baz/qux", ["foo", "bar", "baz", "qux"]],
    ["  foo   bar  ", ["foo", "bar"]],
    ["testString", ["test", "String"]],
    ["TESTString", ["TEST", "String"]],
    ["TEST_STRING", ["TEST", "STRING"]],
    ["XMLHttpRequest", ["XML", "Http", "Request"]],
    ["version 1.2.10", ["version", "1", "2", "10"]],
    ["foo2bar", ["foo2bar"]],
    ["Ārvaigžņu Kārtība", ["Ārvaigžņu", "Kārtība"]],
  ])("split(%j) -> %j", (input, expected) => {
    expect(split(input)).toEqual(expected);
  });
});

describe("splitSeparateNumbers", () => {
  it.each([
    ["", []],
    ["test", ["test"]],
    ["test1", ["test", "1"]],
    ["1test", ["1", "test"]],
    ["foo2bar", ["foo", "2", "bar"]],
    ["TestV2", ["Test", "V", "2"]],
    ["ID123", ["ID", "123"]],
    ["aNumber2in", ["a", "Number", "2", "in"]],
    ["version 1.2.10", ["version", "1", "2", "10"]],
  ])("splitSeparateNumbers(%j) -> %j", (input, expected) => {
    expect(splitSeparateNumbers(input)).toEqual(expected);
  });
});

describe("lowerFactory", () => {
  it("uses the host locale when no locale is given", () => {
    expect(lowerFactory(undefined)("HELLO")).toBe("hello");
  });

  it("uses the given locale", () => {
    expect(lowerFactory("tr")("TITLE")).toBe("tıtle");
    expect(lowerFactory(["tr", "en"])("TITLE")).toBe("tıtle");
  });

  it("ignores the locale when it is false", () => {
    expect(lowerFactory(false)("TITLE")).toBe("title");
  });
});

describe("upperFactory", () => {
  it("uses the host locale when no locale is given", () => {
    expect(upperFactory(undefined)("hello")).toBe("HELLO");
  });

  it("uses the given locale", () => {
    expect(upperFactory("tr")("istanbul")).toBe("İSTANBUL");
    expect(upperFactory(["tr", "en"])("istanbul")).toBe("İSTANBUL");
  });

  it("ignores the locale when it is false", () => {
    expect(upperFactory(false)("istanbul")).toBe("ISTANBUL");
  });
});

describe("capitalCaseTransformFactory", () => {
  const transform = capitalCaseTransformFactory(lower, upper);

  it.each([
    ["hello", "Hello"],
    ["hELLO", "Hello"],
    ["HELLO", "Hello"],
    ["h", "H"],
    ["2nd", "2nd"],
    ["élan", "Élan"],
  ])("transforms %j to %j", (input, expected) => {
    expect(transform(input)).toBe(expected);
  });
});

describe("pascalCaseTransformFactory", () => {
  const transform = pascalCaseTransformFactory(lower, upper);

  it("capitalises the first letter and lowercases the rest", () => {
    expect(transform("hELLO", 0)).toBe("Hello");
    expect(transform("WORLD", 1)).toBe("World");
  });

  it("prefixes words starting with a digit with an underscore after the first word", () => {
    expect(transform("2nd", 1)).toBe("_2nd");
    expect(transform("10", 3)).toBe("_10");
  });

  it("does not prefix the first word when it starts with a digit", () => {
    expect(transform("2nd", 0)).toBe("2nd");
  });
});

describe("splitPrefixSuffix", () => {
  it("splits words with no prefix or suffix by default", () => {
    expect(splitPrefixSuffix("__foo bar__")).toEqual(["", ["foo", "bar"], ""]);
  });

  it("extracts the given prefix and suffix characters", () => {
    expect(
      splitPrefixSuffix("__foo bar__", {
        prefixCharacters: "_",
        suffixCharacters: "_",
      }),
    ).toEqual(["__", ["foo", "bar"], "__"]);
  });

  it("supports multiple prefix and suffix characters", () => {
    expect(
      splitPrefixSuffix("$_fooBar!?", {
        prefixCharacters: "_$",
        suffixCharacters: "?!",
      }),
    ).toEqual(["$_", ["foo", "Bar"], "!?"]);
  });

  it("assigns an input made only of prefix characters to the prefix", () => {
    expect(
      splitPrefixSuffix("____", {
        prefixCharacters: "_",
        suffixCharacters: "_",
      }),
    ).toEqual(["____", [], ""]);
  });

  it("uses the given split function", () => {
    expect(
      splitPrefixSuffix("a|b c", { split: (value) => value.split("|") }),
    ).toEqual(["", ["a", "b c"], ""]);
  });

  it("separates numbers when asked to", () => {
    expect(splitPrefixSuffix("foo2bar", { separateNumbers: true })).toEqual([
      "",
      ["foo", "2", "bar"],
      "",
    ]);
  });

  it("prefers the split function over separateNumbers", () => {
    expect(
      splitPrefixSuffix("foo2bar", {
        separateNumbers: true,
        split: (value) => [value],
      }),
    ).toEqual(["", ["foo2bar"], ""]);
  });

  it("returns empty parts for an empty input", () => {
    expect(splitPrefixSuffix("")).toEqual(["", [], ""]);
  });
});
