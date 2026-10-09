import { getZonedDate } from "./getZonedDate";

/**
 * Re-import the module with `@knitkode/utils` reporting a server environment,
 * `isBrowser` is evaluated once when `@knitkode/utils` is loaded.
 */
const importOnServer = async () => {
  vi.resetModules();
  vi.doMock("@knitkode/utils", async (importOriginal) => ({
    ...(await importOriginal<typeof import("@knitkode/utils")>()),
    isBrowser: false,
    isServer: true,
  }));
  return (await import("./getZonedDate")).getZonedDate;
};

/**
 * The zoned `Date` local fields hold the wall clock time of the time zone
 */
const wallClock = (date: Date) => [
  date.getFullYear(),
  date.getMonth() + 1,
  date.getDate(),
  date.getHours(),
  date.getMinutes(),
];

/**
 * Make `Intl.DateTimeFormat()` resolve the given time zone once, the following
 * calls (also the ones made by `date-fns-tz`) use the real implementation
 */
const mockResolvedTimeZoneOnce = (timeZone: string) =>
  vi.spyOn(Intl, "DateTimeFormat").mockImplementationOnce(function () {
    return {
      resolvedOptions: () => ({ timeZone }),
    } as Intl.DateTimeFormat;
  });

describe("getZonedDate", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    vi.doUnmock("@knitkode/utils");
  });

  it("converts the UTC date string to the given time zone", () => {
    expect(
      wallClock(getZonedDate("2024-01-15T12:00:00Z", "Europe/Rome")),
    ).toEqual([2024, 1, 15, 13, 0]);
    expect(
      wallClock(getZonedDate("2024-07-15T12:00:00Z", "Europe/Rome")),
    ).toEqual([2024, 7, 15, 14, 0]);
    expect(
      wallClock(getZonedDate("2024-01-15T22:30:00Z", "Asia/Tokyo")),
    ).toEqual([2024, 1, 16, 7, 30]);
  });

  it("treats date strings without `Z` as UTC", () => {
    expect(
      wallClock(getZonedDate("2024-01-15T12:00:00", "America/New_York")),
    ).toEqual([2024, 1, 15, 7, 0]);
  });

  it("reads the time zone from `Intl` when not given", () => {
    const dateTimeFormat = mockResolvedTimeZoneOnce("Asia/Tokyo");

    expect(wallClock(getZonedDate("2024-01-15T12:00:00"))).toEqual([
      2024, 1, 15, 21, 0,
    ]);
    expect(dateTimeFormat).toHaveBeenCalled();
  });

  it("returns the same instant in the user's own time zone", () => {
    expect(getZonedDate("2024-01-15T12:00:00").getTime()).toBe(
      Date.UTC(2024, 0, 15, 12),
    );
  });

  it("falls back to a non time zone based date when `Intl` fails", () => {
    vi.spyOn(Intl, "DateTimeFormat").mockImplementationOnce(() => {
      throw new Error("Intl not supported");
    });
    const consoleWarn = vi.spyOn(console, "warn").mockImplementation(() => {});

    const date = getZonedDate("2024-01-15T12:00:00");

    expect(date.getTime()).toBe(Date.UTC(2024, 0, 15, 12));
    expect(consoleWarn).not.toHaveBeenCalled();
  });

  it("warns about `Intl` failures in development", () => {
    vi.stubEnv("NODE_ENV", "development");
    const error = new Error("Intl not supported");
    vi.spyOn(Intl, "DateTimeFormat").mockImplementationOnce(() => {
      throw error;
    });
    const consoleWarn = vi.spyOn(console, "warn").mockImplementation(() => {});

    getZonedDate("2024-01-15T12:00:00");

    expect(consoleWarn).toHaveBeenCalledWith(expect.any(String), error);
  });

  it("does not read the time zone from `Intl` on the server", async () => {
    const serverGetZonedDate = await importOnServer();
    const dateTimeFormat = vi.spyOn(Intl, "DateTimeFormat");

    const date = serverGetZonedDate("2024-01-15T12:00:00");

    expect(date.getTime()).toBe(Date.UTC(2024, 0, 15, 12));
    expect(dateTimeFormat).not.toHaveBeenCalled();
  });

  it("still uses the given time zone on the server", async () => {
    const serverGetZonedDate = await importOnServer();

    expect(
      wallClock(serverGetZonedDate("2024-01-15T12:00:00", "Asia/Tokyo")),
    ).toEqual([2024, 1, 15, 21, 0]);
  });
});
