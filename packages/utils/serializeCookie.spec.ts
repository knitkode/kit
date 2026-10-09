import { vitestSetNodeEnv } from "@knitkode/test/vitest";
import { serializeCookie } from "./serializeCookie";

describe("serializeCookie", () => {
  vitestSetNodeEnv("development");

  test("serializes a simple cookie", () => {
    expect(serializeCookie("foo", "bar")).toBe("foo=bar");
  });

  test("encodes the cookie value", () => {
    expect(serializeCookie("foo", "b@r")).toBe("foo=b%40r");
  });

  test("sets a Max-Age attribute", () => {
    expect(serializeCookie("foo", "bar", { maxAge: 3600 })).toBe(
      "foo=bar; Max-Age=3600",
    );
  });

  test("throws an error for invalid maxAge", () => {
    expect(() => serializeCookie("foo", "bar", { maxAge: NaN })).toThrow(
      TypeError,
    );
  });

  test("sets an Expires attribute from a Date", () => {
    const expires = new Date("2030-01-01T00:00:00Z");
    expect(serializeCookie("foo", "bar", { expires })).toBe(
      `foo=bar; Expires=${expires.toUTCString()}`,
    );
  });

  test("sets a Domain attribute", () => {
    expect(serializeCookie("foo", "bar", { domain: "example.com" })).toBe(
      "foo=bar; Domain=example.com",
    );
  });

  test("throws an error for invalid domain", () => {
    expect(() =>
      serializeCookie("foo", "bar", { domain: "invalid domain" }),
    ).toThrow(TypeError);
  });

  test("sets a Path attribute", () => {
    expect(serializeCookie("foo", "bar", { path: "/home" })).toBe(
      "foo=bar; Path=/home",
    );
  });

  test("sets HttpOnly attribute", () => {
    expect(serializeCookie("foo", "bar", { httpOnly: true })).toBe(
      "foo=bar; HttpOnly",
    );
  });

  test("sets Secure attribute", () => {
    expect(serializeCookie("foo", "bar", { secure: true })).toBe(
      "foo=bar; Secure",
    );
  });

  test("sets SameSite attribute to Strict", () => {
    expect(serializeCookie("foo", "bar", { sameSite: "Strict" })).toBe(
      "foo=bar; SameSite=Strict",
    );
  });

  test("sets SameSite attribute to Lax", () => {
    expect(serializeCookie("foo", "bar", { sameSite: "Lax" })).toBe(
      "foo=bar; SameSite=Lax",
    );
  });

  test("sets SameSite attribute to None", () => {
    expect(serializeCookie("foo", "bar", { sameSite: "None" })).toBe(
      "foo=bar; SameSite=None",
    );
  });

  test("throws an error for invalid name in development", () => {
    expect(() => serializeCookie("invalid;name", "value")).toThrow(TypeError);
  });

  test("encodes the value with the given encode function", () => {
    expect(
      serializeCookie("foo", "bar", { encode: (v) => v.toUpperCase() }),
    ).toBe("foo=BAR");
  });

  test("serializes an empty value", () => {
    expect(serializeCookie("foo", "")).toBe("foo=");
  });

  test("floors the Max-Age attribute", () => {
    expect(serializeCookie("foo", "bar", { maxAge: 10.9 })).toBe(
      "foo=bar; Max-Age=10",
    );
    expect(serializeCookie("foo", "bar", { maxAge: 0 })).toBe(
      "foo=bar; Max-Age=0",
    );
  });

  test("throws an error for an infinite maxAge", () => {
    expect(() =>
      serializeCookie("foo", "bar", { maxAge: Number.POSITIVE_INFINITY }),
    ).toThrow("option maxAge is invalid");
  });

  test("sets an Expires attribute from a number of days", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2030-01-01T00:00:00Z"));
    expect(serializeCookie("foo", "bar", { expires: 2 })).toBe(
      "foo=bar; Expires=Thu, 03 Jan 2030 00:00:00 GMT",
    );
    vi.useRealTimers();
  });

  test("accepts a Domain with a leading dot", () => {
    expect(serializeCookie("foo", "bar", { domain: ".example.com" })).toBe(
      "foo=bar; Domain=.example.com",
    );
  });

  test("throws an error for invalid path", () => {
    expect(() => serializeCookie("foo", "bar", { path: "/a\nb" })).toThrow(
      "option path is invalid",
    );
  });

  test("throws an error for invalid value", () => {
    expect(() => serializeCookie("foo", "a\nb", { encode: (v) => v })).toThrow(
      "argument val is invalid",
    );
  });

  test.each([
    ["lax", "Lax"],
    ["strict", "Strict"],
    ["none", "None"],
  ] as const)("normalises SameSite %s to %s", (sameSite, expected) => {
    expect(serializeCookie("foo", "bar", { sameSite })).toBe(
      `foo=bar; SameSite=${expected}`,
    );
  });

  test("ignores an unknown SameSite value", () => {
    expect(
      // @ts-expect-error testing an invalid value at runtime
      serializeCookie("foo", "bar", { sameSite: "bogus" }),
    ).toBe("foo=bar");
  });

  test("serializes all the attributes in order", () => {
    const expires = new Date("2030-01-01T00:00:00Z");
    expect(
      serializeCookie("foo", "bar", {
        maxAge: 60,
        domain: "example.com",
        path: "/",
        expires,
        httpOnly: true,
        secure: true,
        sameSite: "lax",
      }),
    ).toBe(
      "foo=bar; Max-Age=60; Domain=example.com; Path=/; Expires=Tue, 01 Jan 2030 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax",
    );
  });
});

describe("serializeCookie outside development", () => {
  vitestSetNodeEnv("production");

  test("skips the validation", () => {
    expect(() => serializeCookie("invalid;name", "value")).not.toThrow();
    expect(() =>
      serializeCookie("foo", "bar", { domain: "invalid domain" }),
    ).not.toThrow();
  });

  test("serializes valid cookies the same way", () => {
    expect(
      serializeCookie("foo", "b@r", {
        maxAge: 60,
        domain: "example.com",
        path: "/",
        secure: true,
      }),
    ).toBe("foo=b%40r; Max-Age=60; Domain=example.com; Path=/; Secure");
  });
});
