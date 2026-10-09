import { parseURL } from "./parseURL";

describe("parseURL", () => {
  it("parses every part of a full URL", () => {
    const url = "https://example.com:8080/path/to?x=1&y=2#section";
    expect(parseURL(url)).toEqual({
      href: url,
      protocol: "https:",
      host: "example.com:8080",
      hostname: "example.com",
      port: "8080",
      pathname: "/path/to",
      search: "?x=1&y=2",
      hash: "#section",
    });
  });

  it("parses a URL without port, path, search and hash", () => {
    expect(parseURL("http://example.com")).toEqual({
      href: "http://example.com",
      protocol: "http:",
      host: "example.com",
      hostname: "example.com",
      port: undefined,
      pathname: "",
      search: "",
      hash: "",
    });
  });

  it("parses the root path", () => {
    expect(parseURL("https://example.com/")).toMatchObject({
      pathname: "/",
      search: "",
      hash: "",
    });
  });

  it("parses the hash when there is no search", () => {
    expect(parseURL("https://example.com/a#b")).toMatchObject({
      pathname: "/a",
      search: "",
      hash: "#b",
    });
  });

  it.each(["ftp://example.com", "/relative/path", "example.com", ""])(
    "returns null for %j",
    (url) => {
      expect(parseURL(url)).toBeNull();
    },
  );
});
