import { vitestSetNodeEnv } from "@koine/test/vitest";
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
});
