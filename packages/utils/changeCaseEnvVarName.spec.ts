import { changeCaseEnvVarName } from "./changeCaseEnvVarName";

describe("changeCaseEnvVarName", () => {
  it.each([
    ["", ""],
    ["foo", "FOO"],
    ["fooBar", "FOO_BAR"],
    ["FooBar", "FOO_BAR"],
    ["foo bar", "FOO_BAR"],
    ["foo-bar baz", "FOO_BAR_BAZ"],
    ["my-var.name", "MY_VAR_NAME"],
    ["  my.api_key2Value ", "MY_API_KEY2_VALUE"],
    ["api2Key", "API2_KEY"],
    ["__private__", "PRIVATE"],
    ["ALREADY_SNAKE", "ALREADY_SNAKE"],
    ["version 1.2", "VERSION_1_2"],
    ["next.public/url", "NEXT_PUBLIC_URL"],
  ])("changeCaseEnvVarName(%j) -> %j", (input, expected) => {
    expect(changeCaseEnvVarName(input)).toBe(expected);
  });

  it("only outputs characters valid in env var names", () => {
    expect(changeCaseEnvVarName("a!b@c#d$e%f^g&h*i(j)k")).toMatch(
      /^[A-Z0-9_]+$/,
    );
  });

  it("narrows the return type to the screaming snake case literal", () => {
    expectTypeOf(changeCaseEnvVarName("fooBar")).toEqualTypeOf<"FOO_BAR">();
  });
});
