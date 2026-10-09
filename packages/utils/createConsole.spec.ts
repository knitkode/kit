import { createConsole } from "./createConsole";

const methods = ["log", "info", "warn", "error", "debug"] as const;

describe("createConsole", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each(methods)("prints with console.%s and the prefix", (method) => {
    const spy = vi.spyOn(console, method).mockImplementation(() => {});
    createConsole("my-lib")[method]("hello", 1, { a: 1 });

    expect(spy).toHaveBeenCalledWith("\x1b[90m%s\x1b[0mhello", "[my-lib] ", 1, {
      a: 1,
    });
  });

  it("prints an empty prefix when none is given", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    createConsole().log("hello");

    expect(spy).toHaveBeenCalledWith("\x1b[90m%s\x1b[0mhello", "");
  });

  it("prints every standard call", () => {
    const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const logger = createConsole("p");
    logger.warn("same");
    logger.warn("same");

    expect(spy).toHaveBeenCalledTimes(2);
  });

  describe("once", () => {
    it("prints each message only once", () => {
      const spy = vi.spyOn(console, "info").mockImplementation(() => {});
      const logger = createConsole("p");

      logger.info.once("a", 1);
      logger.info.once("b");
      logger.info.once("a", 2);
      logger.info.once("b");

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveBeenNthCalledWith(1, "\x1b[90m%s\x1b[0ma", "[p] ", 1);
      expect(spy).toHaveBeenNthCalledWith(2, "\x1b[90m%s\x1b[0mb", "[p] ");
    });

    it("keeps a separate memory for each method and console", () => {
      const log = vi.spyOn(console, "log").mockImplementation(() => {});
      const error = vi.spyOn(console, "error").mockImplementation(() => {});

      createConsole().log.once("a");
      createConsole().error.once("a");
      createConsole().log.once("a");

      expect(log).toHaveBeenCalledTimes(2);
      expect(error).toHaveBeenCalledTimes(1);
    });
  });

  describe("first", () => {
    it("prints a message only when it differs from the previous one", () => {
      const spy = vi.spyOn(console, "debug").mockImplementation(() => {});
      const logger = createConsole();

      logger.debug.first("a");
      logger.debug.first("a");
      logger.debug.first("b");
      logger.debug.first("a");

      expect(spy.mock.calls.map((args) => args[0])).toEqual([
        "\x1b[90m%s\x1b[0ma",
        "\x1b[90m%s\x1b[0mb",
        "\x1b[90m%s\x1b[0ma",
      ]);
    });
  });
});
