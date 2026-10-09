import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import type { CalendarEvent } from "./types";
import {
  type UseCalendarProps,
  type UseCalendarReturn,
  useCalendar,
} from "./useCalendar";

// tells React to run effects synchronously inside `act()`
(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

type GoogleEventInput = {
  summary?: string;
  created?: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
  location?: string;
  description?: string;
};

const googleEvent = (event: GoogleEventInput) => ({
  created: "2026-09-01T08:00:00Z",
  etag: "etag",
  htmlLink: "https://calendar.google.com/event?eid=1",
  iCalUID: "uid@google.com",
  id: "id",
  kind: "calendar#event",
  location: "",
  status: "confirmed",
  summary: "Event",
  ...event,
});

/** Google calendar API responses keyed by calendar id */
let responses: Record<string, ReturnType<typeof googleEvent>[]> = {};

const fetchMock = vi.fn(async (url: string, _init?: RequestInit) => {
  const calendarId = new URL(url).searchParams.get("calendarId") ?? "";
  return {
    json: async () => ({
      summary: `Remote ${calendarId}`,
      items: responses[calendarId] ?? [],
    }),
  };
});

const getRequestParams = (call = 0) =>
  new URL(fetchMock.mock.calls[call]?.[0] ?? "").searchParams;

const day = (year: number, month: number, date: number) =>
  new Date(year, month, date).getTime() / 1000;

const calendars = [
  { id: "work", color: "#ff0000", name: "Work" },
  { id: "home", color: "#0000ff", name: "Home" },
];

describe("useCalendar", () => {
  let root: Root;
  let latest: UseCalendarReturn | undefined;

  const Probe = (props: UseCalendarProps) => {
    latest = useCalendar(props);
    return null;
  };

  /** lets the (mocked) Google requests settle */
  const flush = () =>
    act(() => new Promise((resolve) => setTimeout(resolve, 0)));

  const render = async (props: Partial<UseCalendarProps> = {}) => {
    await act(async () =>
      root.render(
        <Probe locale="en-US" calendars={calendars} apiKey="key" {...props} />,
      ),
    );
    await flush();
  };

  const calendar = () => {
    if (!latest) throw new Error("useCalendar did not render");
    return latest;
  };

  const nav = () => calendar().getDaygridNavProps();

  const run = async (fn: () => void) => {
    act(fn);
    await flush();
  };

  const eventByTitle = (title: string) => {
    const event = Object.values(calendar().getDaygridTableProps().events).find(
      (event) => event.title === title,
    );
    if (!event) throw new Error(`no event "${title}"`);
    return event;
  };

  beforeEach(() => {
    // all day events dates are parsed as UTC, keep the timezone deterministic
    vi.stubEnv("TZ", "UTC");
    vi.useFakeTimers({ toFake: ["Date"], now: new Date(2026, 9, 15, 10) });
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockClear();
    responses = {};
    latest = undefined;
    root = createRoot(document.createElement("div"));
  });

  afterEach(() => {
    act(() => root.unmount());
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  describe("range", () => {
    it("defaults to the current month in month view", async () => {
      await render();
      const { range, view, todayInView } = nav();

      expect(view).toBe("month");
      expect(calendar().view).toBe("month");
      expect(range[0]).toEqual(new Date(2026, 9, 1, 0, 0, 0));
      expect(range[1].getTime()).toBe(
        new Date(2026, 9, 31, 23, 59, 59, 999).getTime(),
      );
      expect(todayInView).toBe(true);
    });

    it("defaults to the current week (from Monday) in week view", async () => {
      await render({ view: "week" });
      const { range, view } = nav();

      expect(view).toBe("week");
      expect(range[0]).toEqual(new Date(2026, 9, 12));
      expect(range[1].getTime()).toBe(
        new Date(2026, 9, 18, 23, 59, 59, 999).getTime(),
      );
    });

    it("uses the given start and end", async () => {
      const start = new Date(2026, 0, 1);
      const end = new Date(2026, 0, 31, 23, 59, 59);
      await render({ start, end });

      expect(nav().range).toEqual([start, end]);
      expect(nav().todayInView).toBe(false);
    });

    it("moves to the next and previous months", async () => {
      await render();

      await run(() => nav().handleNext());
      expect(nav().range[0]).toEqual(new Date(2026, 10, 1));
      expect(nav().range[1].getTime()).toBe(
        new Date(2026, 10, 30, 23, 59, 59, 999).getTime(),
      );
      expect(nav().todayInView).toBe(false);

      await run(() => nav().handlePrev());
      await run(() => nav().handlePrev());
      expect(nav().range[0]).toEqual(new Date(2026, 8, 1));
      expect(nav().range[1].getTime()).toBe(
        new Date(2026, 8, 30, 23, 59, 59, 999).getTime(),
      );
    });

    it("moves to the next and previous weeks", async () => {
      await render({ view: "week" });

      await run(() => nav().handleNext());
      expect(nav().range[0]).toEqual(new Date(2026, 9, 19));
      expect(nav().range[1].getDate()).toBe(25);

      await run(() => nav().handlePrev());
      await run(() => nav().handlePrev());
      expect(nav().range[0]).toEqual(new Date(2026, 9, 5));
      expect(nav().range[1].getDate()).toBe(11);
    });

    it("goes back to the current month", async () => {
      await render();
      await run(() => nav().handleNext());
      await run(() => nav().handleNext());

      await run(() => nav().handleToday());

      expect(nav().range[0]).toEqual(new Date(2026, 9, 1));
      expect(nav().todayInView).toBe(true);
    });

    it("switches between the month and the week views", async () => {
      await render();

      await run(() => nav().handleView("week"));
      expect(calendar().view).toBe("week");
      expect(nav().range[0]).toEqual(new Date(2026, 8, 28));
      expect(nav().range[1].getDate()).toBe(4);

      await run(() => nav().handleView("month"));
      expect(calendar().view).toBe("month");
      expect(nav().range[0]).toEqual(new Date(2026, 9, 1));
    });
  });

  describe("google events", () => {
    it("requests the events of each calendar within the range", async () => {
      await render({ timeZone: "Europe/Rome" });

      expect(fetchMock).toHaveBeenCalledTimes(2);
      const [url, init] = fetchMock.mock.calls[0] ?? [];
      expect(url).toMatch(
        /^https:\/\/www\.googleapis\.com\/calendar\/v3\/calendars\/work\/events\?/,
      );
      expect(init).toEqual({ method: "GET" });
      expect(Object.fromEntries(getRequestParams(0))).toEqual({
        calendarId: "work",
        timeZone: "Europe/Rome",
        singleEvents: "true",
        maxAttendees: "1",
        maxResults: "9999",
        sanitizeHtml: "true",
        timeMin: new Date(2026, 9, 1).toISOString(),
        timeMax: new Date(2026, 9, 31, 23, 59, 59, 999).toISOString(),
        key: "key",
      });
      expect(getRequestParams(1).get("calendarId")).toBe("home");
    });

    it("falls back to the GOOGLE_CALENDAR_API_KEY env variable", async () => {
      vi.stubEnv("GOOGLE_CALENDAR_API_KEY", "env-key");

      await render({ apiKey: undefined });

      expect(getRequestParams().get("key")).toBe("env-key");
    });

    it("requests the events again when the range changes", async () => {
      await render({ calendars: [calendars[0]] });

      await run(() => nav().handleNext());

      expect(fetchMock).toHaveBeenCalledTimes(2);
      expect(getRequestParams(1).get("timeMin")).toBe(
        new Date(2026, 10, 1).toISOString(),
      );
    });

    it("maps the timed events", async () => {
      responses = {
        work: [
          googleEvent({
            summary: "Standup",
            created: "2026-09-01T08:00:00Z",
            start: { dateTime: "2026-10-05T09:30:00Z" },
            end: { dateTime: "2026-10-05T10:00:00Z" },
            location: "Room 1",
            description: "Daily sync",
          }),
        ],
      };

      await render();
      const event = eventByTitle("Standup");
      const start = new Date("2026-10-05T09:30:00Z");

      expect(event).toEqual({
        calendar: calendars[0],
        created: new Date("2026-09-01T08:00:00Z"),
        link: "https://calendar.google.com/event?eid=1",
        title: "Standup",
        status: "confirmed",
        start,
        end: new Date("2026-10-05T10:00:00Z"),
        days: [day(2026, 9, 5)],
        daysMap: { [day(2026, 9, 5)]: 1 },
        multi: false,
        color: "#ff0000",
        allDay: false,
        location: "Room 1",
        description: "Daily sync",
        uid: `${new Date("2026-09-01T08:00:00Z").getTime()}${start.getTime()}`,
      });
      expect(calendar().getDaygridTableProps().events).toEqual({
        [event.uid]: event,
      });
    });

    it("maps the all day events ending on the day they start", async () => {
      responses = {
        work: [
          googleEvent({
            summary: "Holiday",
            start: { date: "2026-10-05" },
            end: { date: "2026-10-06" },
          }),
        ],
      };

      await render();
      const event = eventByTitle("Holiday");

      expect(event.allDay).toBe(true);
      expect(event.multi).toBe(false);
      expect(event.days).toEqual([day(2026, 9, 5)]);
      expect(event.end).toEqual(new Date(2026, 9, 5, 23, 59, 59));
      expect(event.location).toBe("");
      expect(event.description).toBe("");
    });

    it("maps the multi days events", async () => {
      responses = {
        work: [
          googleEvent({
            summary: "Trip",
            start: { date: "2026-10-05" },
            end: { date: "2026-10-08" },
          }),
          googleEvent({
            summary: "Conference",
            created: "2026-09-02T08:00:00Z",
            start: { dateTime: "2026-10-12T09:00:00Z" },
            end: { dateTime: "2026-10-13T18:00:00Z" },
          }),
        ],
      };

      await render();
      const trip = eventByTitle("Trip");
      const conference = eventByTitle("Conference");

      expect(trip.multi).toBe(true);
      expect(trip.days).toEqual([
        day(2026, 9, 5),
        day(2026, 9, 6),
        day(2026, 9, 7),
      ]);
      expect(trip.end).toEqual(new Date(2026, 9, 7, 23, 59, 59));
      expect(conference.allDay).toBe(false);
      expect(conference.multi).toBe(true);
      expect(conference.days).toEqual([day(2026, 9, 12), day(2026, 9, 13)]);
    });

    it("merges the events of all the calendars", async () => {
      responses = {
        work: [
          googleEvent({
            summary: "Standup",
            start: { dateTime: "2026-10-05T09:30:00Z" },
            end: { dateTime: "2026-10-05T10:00:00Z" },
          }),
        ],
        home: [
          googleEvent({
            summary: "Dinner",
            start: { dateTime: "2026-10-05T19:30:00Z" },
            end: { dateTime: "2026-10-05T21:00:00Z" },
          }),
        ],
      };

      await render();

      expect(eventByTitle("Standup").calendar.id).toBe("work");
      expect(eventByTitle("Dinner").calendar.id).toBe("home");
      expect(eventByTitle("Dinner").color).toBe("#0000ff");
    });

    it("keeps the events empty when the request fails", async () => {
      fetchMock.mockRejectedValueOnce(new Error("offline"));

      await render({ calendars: [calendars[0]] });

      expect(calendar().getDaygridTableProps().events).toEqual({});
    });
  });

  describe("calendars", () => {
    it("builds the calendars map with all the calendars visible", async () => {
      await render();

      expect(calendar().getLegendProps().calendarsMap).toEqual({
        work: { ...calendars[0], on: true, events: 0 },
        home: { ...calendars[1], on: true, events: 0 },
      });
    });

    it("counts the events of each calendar", async () => {
      responses = {
        work: [
          googleEvent({
            created: "2026-09-01T08:00:00Z",
            start: { dateTime: "2026-10-05T09:30:00Z" },
            end: { dateTime: "2026-10-05T10:00:00Z" },
          }),
          googleEvent({
            created: "2026-09-02T08:00:00Z",
            start: { dateTime: "2026-10-06T09:30:00Z" },
            end: { dateTime: "2026-10-06T10:00:00Z" },
          }),
        ],
      };

      await render();
      const { calendarsMap } = calendar().getLegendProps();

      expect(calendarsMap["work"]?.events).toBe(2);
      expect(calendarsMap["home"]?.events).toBe(0);
    });

    it("toggles the visibility of a calendar", async () => {
      await render();

      act(() => calendar().getLegendProps().toggleCalendarVisibility("work"));
      expect(calendar().getLegendProps().calendarsMap["work"]?.on).toBe(false);
      expect(calendar().getLegendProps().calendarsMap["home"]?.on).toBe(true);

      act(() => calendar().getLegendProps().toggleCalendarVisibility("work"));
      expect(calendar().getLegendProps().calendarsMap["work"]?.on).toBe(true);
    });

    it("shows only the given calendars", async () => {
      await render();
      const { toggleCalendarVisibility } = calendar().getLegendProps();

      // @ts-expect-error the legend props type only the single id signature
      act(() => toggleCalendarVisibility(["home"]));

      const { calendarsMap } = calendar().getLegendProps();
      expect(calendarsMap["work"]?.on).toBe(false);
      expect(calendarsMap["home"]?.on).toBe(true);
    });
  });

  describe("clicked and hovered events", () => {
    const withStandup = () => {
      responses = {
        work: [
          googleEvent({
            summary: "Standup",
            start: { dateTime: "2026-10-05T09:30:00Z" },
            end: { dateTime: "2026-10-05T10:00:00Z" },
          }),
        ],
      };
    };

    const select = (event: CalendarEvent) =>
      act(() => {
        calendar().setEventClicked(event);
        calendar().setEventHovered(event);
      });

    it("stores the clicked and hovered events", async () => {
      withStandup();
      await render();
      const standup = eventByTitle("Standup");

      select(standup);

      expect(calendar().eventClicked).toBe(standup);
      expect(calendar().eventHovered).toBe(standup);
      expect(calendar().getDaygridTableProps()).toMatchObject({
        eventClicked: standup,
        eventHovered: standup,
      });
    });

    it.each([["handleNext"], ["handlePrev"]] as const)(
      "resets them on %s",
      async (handler) => {
        withStandup();
        await render();
        select(eventByTitle("Standup"));

        await run(() => nav()[handler]());

        expect(calendar().eventClicked).toBeNull();
        expect(calendar().eventHovered).toBeNull();
      },
    );

    it("resets them when going back to today from another month", async () => {
      withStandup();
      await render();
      const standup = eventByTitle("Standup");
      await run(() => nav().handleNext());
      select(standup);

      await run(() => nav().handleToday());

      expect(calendar().eventClicked).toBeNull();
      expect(calendar().eventHovered).toBeNull();
    });

    it("resets them when switching view", async () => {
      withStandup();
      await render();
      select(eventByTitle("Standup"));

      await run(() => nav().handleView("week"));

      expect(calendar().eventClicked).toBeNull();
      expect(calendar().eventHovered).toBeNull();
    });

    it("resets the clicked event when its calendar gets hidden", async () => {
      withStandup();
      await render();
      select(eventByTitle("Standup"));

      act(() => calendar().getLegendProps().toggleCalendarVisibility("home"));
      expect(calendar().eventClicked).not.toBeNull();

      act(() => calendar().getLegendProps().toggleCalendarVisibility("work"));
      expect(calendar().eventClicked).toBeNull();
    });
  });

  describe("props getters", () => {
    it("returns the props for the nav, the table and the legend", async () => {
      await render({ locale: "en-GB" });
      const { getDaygridNavProps, getDaygridTableProps, getLegendProps } =
        calendar();
      const navProps = getDaygridNavProps();

      expect(navProps).toMatchObject({
        locale: "en-GB",
        view: "month",
        todayInView: true,
      });
      expect(getDaygridTableProps()).toMatchObject({
        locale: "en-GB",
        view: "month",
        range: navProps.range,
        events: {},
        eventClicked: null,
        eventHovered: null,
        handlePrev: navProps.handlePrev,
        handleNext: navProps.handleNext,
        calendarsMap: getLegendProps().calendarsMap,
      });
      expect(Object.keys(getLegendProps())).toEqual([
        "calendarsMap",
        "toggleCalendarVisibility",
      ]);
    });
  });
});
