import { getMediaQueryWidthResolvers } from "./getMediaQueryWidthResolvers";

describe("getMediaQueryWidthResolvers", () => {
  const { min, max, up, down, between, only } = getMediaQueryWidthResolvers({
    sm: 640,
    md: 768,
    lg: 1024,
  });

  it.each([
    ["sm", "(min-width: 640px)"],
    ["md", "(min-width: 768px)"],
    ["lg", "(min-width: 1024px)"],
  ] as const)("min(%s) returns %s", (br, expected) => {
    expect(min(br)).toBe(expected);
    expect(up(br)).toBe(expected);
  });

  it.each([
    ["sm", "(max-width: 639.98px)"],
    ["md", "(max-width: 767.98px)"],
    ["lg", "(max-width: 1023.98px)"],
  ] as const)("max(%s) returns %s", (br, expected) => {
    expect(max(br)).toBe(expected);
  });

  it("down() uses the next breakpoint", () => {
    expect(down("sm")).toBe("(max-width: 767.98px)");
    expect(down("md")).toBe("(max-width: 1023.98px)");
  });

  it("down() returns undefined for the largest breakpoint", () => {
    expect(down("lg")).toBeUndefined();
  });

  it("between() spans the two given breakpoints", () => {
    expect(between("sm", "lg")).toBe(
      "(min-width: 640px) and (max-width: 1023.98px)",
    );
  });

  it("between() defaults to the next breakpoint", () => {
    expect(between("sm")).toBe("(min-width: 640px) and (max-width: 767.98px)");
  });

  it("between() falls back to min() for the largest breakpoint", () => {
    expect(between("lg")).toBe("(min-width: 1024px)");
  });

  it("only() spans the breakpoint range", () => {
    expect(only("sm")).toBe("(min-width: 640px) and (max-width: 767.98px)");
    expect(only("md")).toBe("(min-width: 768px) and (max-width: 1023.98px)");
    expect(only("lg")).toBe("(min-width: 1024px)");
  });

  it("sorts the breakpoints by value", () => {
    const mq = getMediaQueryWidthResolvers({ lg: 1024, sm: 640, md: 768 });
    expect(down("sm")).toBe(mq.down("sm"));
    expect(mq.only("sm")).toBe("(min-width: 640px) and (max-width: 767.98px)");
    expect(mq.down("lg")).toBeUndefined();
  });

  it("adds an 'xs' breakpoint at 0 by default", () => {
    const mq = getMediaQueryWidthResolvers({ sm: 640 } as {
      xs?: number;
      sm: number;
    });
    expect(mq.min("xs")).toBe("(min-width: 0px)");
    expect(mq.only("xs")).toBe("(min-width: 0px) and (max-width: 639.98px)");
    expect(mq.down("xs")).toBe("(max-width: 639.98px)");
  });

  it("lets the 'xs' breakpoint be customised", () => {
    const mq = getMediaQueryWidthResolvers({ xs: 320, sm: 640 });
    expect(mq.min("xs")).toBe("(min-width: 320px)");
  });
});
