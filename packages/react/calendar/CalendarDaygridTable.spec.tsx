import { act, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import type {
  CalendarDaygridCellEventBtnProps,
  CalendarDaygridCellEventProps,
} from "./CalendarDaygridCell";
import {
  type CalendarDaygridTableBodyCellDateProps,
  type CalendarDaygridTableBodyCellProps,
  type CalendarDaygridTableProps,
  KitCalendarDaygridTable,
} from "./CalendarDaygridTable";
import type { CalendarEvent, CalendarEventsMap, CalendarsMap } from "./types";

// tells React to run effects synchronously inside `act()`
(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

/**
 * Spies the React warnings, the returned function restores the console and
 * returns them
 */
const spyWarnings = () => {
  const spies = [vi.spyOn(console, "error"), vi.spyOn(console, "warn")];
  return () => {
    const calls = spies.flatMap((spy) => [...spy.mock.calls]);
    for (const spy of spies) spy.mockRestore();
    return calls;
  };
};

// the hook dynamically imports the date-fns locale, preload it so that it
// resolves within the `act()` scopes of the tests
beforeAll(async () => {
  await import("date-fns/locale/en-US");
});

describe("KitCalendarDaygridTable", () => {
  it("renders the month weeks and days without React warnings", async () => {
    const getWarnings = spyWarnings();
    const container = document.createElement("div");
    const root = createRoot(container);

    await act(async () => {
      root.render(
        <KitCalendarDaygridTable
          locale="en"
          events={{}}
          view="month"
          // October 2026 spans 5 weeks starting on Monday
          range={[new Date(2026, 9, 1), new Date(2026, 9, 31)]}
          handlePrev={() => {}}
          handleNext={() => {}}
          setEventClicked={() => {}}
          setEventHovered={() => {}}
          calendarsMap={{}}
        />,
      );
    });

    expect(container.querySelectorAll("tbody tr")).toHaveLength(5);
    expect(container.querySelectorAll("tbody td")).toHaveLength(35);
    // the `$` transient props are not passed to the default DOM elements
    expect(container.innerHTML).not.toContain("$");

    act(() => root.unmount());
    expect(getWarnings()).toEqual([]);
  });

  describe("with events", () => {
    const calendar = { id: "work", color: "#ff0000", name: "Work" };
    const calendarsMap: CalendarsMap = {
      work: { ...calendar, on: true, events: 0 },
    };
    // the Monday starting the October 2026 month view
    const firstMonday = new Date(2026, 8, 28);

    const toTimestamp = (date: Date) => {
      const copy = new Date(date);
      copy.setHours(0, 0, 0, 0);
      return copy.getTime() / 1000;
    };

    const makeEvent = (
      title: string,
      start: Date,
      end: Date,
      { allDay = true, created = new Date(2026, 8, 1) } = {},
    ): CalendarEvent => {
      const days: number[] = [];
      for (
        const date = new Date(start);
        toTimestamp(date) <= toTimestamp(end);
        date.setDate(date.getDate() + 1)
      ) {
        days.push(toTimestamp(date));
      }
      return {
        calendar,
        created,
        link: "",
        title,
        status: "confirmed",
        start,
        end,
        days,
        daysMap: Object.fromEntries(days.map((day) => [day, 1] as const)),
        multi: days.length > 1,
        color: calendar.color,
        allDay,
        location: "",
        description: "",
        uid: title,
      };
    };

    const toEventsMap = (...events: CalendarEvent[]): CalendarEventsMap =>
      Object.fromEntries(events.map((event) => [event.uid, event]));

    /** Turns the `$` transient props into `data-*` attributes */
    const toDomProps = (props: object) =>
      Object.fromEntries(
        Object.entries(props).map(([key, value]) =>
          key.startsWith("$")
            ? [`data-${key.slice(1).toLowerCase()}`, String(value)]
            : [key, value],
        ),
      ) as React.HTMLAttributes<HTMLElement>;

    const components = {
      TableBodyCell: (props: CalendarDaygridTableBodyCellProps) => (
        <td {...toDomProps(props)} />
      ),
      TableBodyCellDate: (props: CalendarDaygridTableBodyCellDateProps) => (
        <div data-part="date" {...toDomProps(props)} />
      ),
      CellEvent: (props: CalendarDaygridCellEventProps) => (
        <div data-part="event" {...toDomProps(props)} />
      ),
      CellEventBtn: (props: CalendarDaygridCellEventBtnProps) => (
        <div data-part="btn" {...toDomProps(props)} />
      ),
      CellEventTitle: ({ children }: { children?: ReactNode }) => (
        <span data-part="title">{children}</span>
      ),
    };

    let container: HTMLDivElement;
    let root: Root;
    let getWarnings: ReturnType<typeof spyWarnings>;

    const render = async (props: Partial<CalendarDaygridTableProps> = {}) => {
      const allProps: CalendarDaygridTableProps = {
        locale: "en-US",
        events: {},
        view: "month",
        range: [new Date(2026, 9, 1), new Date(2026, 9, 31, 23, 59, 59)],
        handlePrev: () => {},
        handleNext: () => {},
        setEventClicked: vi.fn(),
        setEventHovered: vi.fn(),
        calendarsMap,
        ...components,
        ...props,
      };
      await act(async () =>
        root.render(<KitCalendarDaygridTable {...allProps} />),
      );
      // let the date-fns locale dynamic import settle
      await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
      return allProps;
    };

    const getCells = () => [
      ...container.querySelectorAll<HTMLElement>("tbody td"),
    ];

    /** The cell of the given October 2026 day in the month view */
    const getCell = (date: number) => {
      const index = Math.round(
        (new Date(2026, 9, date).getTime() - firstMonday.getTime()) / 864e5,
      );
      return getCells()[index];
    };

    /** The titles of the events in the cell, `_` for the placeholders */
    const getCellEvents = (cell?: HTMLElement) =>
      [
        ...(cell?.querySelectorAll<HTMLElement>('[data-part="event"]') ?? []),
      ].map((event) =>
        event.dataset["placeholder"] === "true"
          ? "_"
          : event.querySelector('[data-part="title"]')?.textContent,
      );

    const getCellEvent = (date: number, title: string) =>
      [
        ...(getCell(date)?.querySelectorAll<HTMLElement>(
          '[data-part="event"]',
        ) ?? []),
      ].find(
        (event) =>
          event.querySelector('[data-part="title"]')?.textContent === title,
      );

    beforeEach(() => {
      vi.useFakeTimers({ toFake: ["Date"], now: new Date(2026, 9, 15, 12) });
      getWarnings = spyWarnings();
      container = document.createElement("div");
      document.body.append(container);
      root = createRoot(container);
    });

    afterEach(() => {
      act(() => root.unmount());
      container.remove();
      vi.useRealTimers();
      // no React warnings (keys, act, unknown DOM props) should be logged
      expect(getWarnings()).toEqual([]);
    });

    it("renders the abbreviated week days of the locale from Monday", async () => {
      await render();

      expect(
        [...container.querySelectorAll("thead th")].map((th) => th.textContent),
      ).toEqual(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);
    });

    it("scopes the head cells to their column", async () => {
      await render();

      expect(
        [...container.querySelectorAll("thead th")].map((th) =>
          th.getAttribute("scope"),
        ),
      ).toEqual(Array(7).fill("col"));
    });

    it("renders the given day labels", async () => {
      const dayLabels = ["L", "M", "X", "J", "V", "S", "D"];
      await render({ dayLabels });

      expect(
        [...container.querySelectorAll("thead th")].map((th) => th.textContent),
      ).toEqual(dayLabels);
    });

    it("renders the date of each day", async () => {
      await render();
      const dates = getCells().map(
        (cell) => cell.querySelector('[data-part="date"]')?.textContent,
      );

      expect(dates.slice(0, 7)).toEqual(["28", "29", "30", "1", "2", "3", "4"]);
      expect(dates.slice(-7)).toEqual([
        "26",
        "27",
        "28",
        "29",
        "30",
        "31",
        "1",
      ]);
    });

    it("flags today and the days out of the month", async () => {
      await render();
      const cells = getCells();

      expect(
        cells.filter((cell) => cell.dataset["istoday"] === "true"),
      ).toEqual([getCell(15)]);
      expect(
        cells
          .filter((cell) => cell.dataset["isoutofrange"] === "true")
          .map((cell) => cell.textContent),
      ).toEqual(["28", "29", "30", "1"]);
      expect(
        getCell(15)?.querySelector<HTMLElement>('[data-part="date"]')?.dataset,
      ).toMatchObject({ istoday: "true", isoutofrange: "false" });
    });

    it("renders a single row without out of range days in week view", async () => {
      await render({
        view: "week",
        range: [new Date(2026, 8, 28), new Date(2026, 9, 4, 23, 59, 59)],
      });

      expect(container.querySelectorAll("tbody tr")).toHaveLength(1);
      expect(
        getCells().map((cell) => [
          cell.textContent,
          cell.dataset["isoutofrange"],
        ]),
      ).toEqual([
        ["28", "false"],
        ["29", "false"],
        ["30", "false"],
        ["1", "false"],
        ["2", "false"],
        ["3", "false"],
        ["4", "false"],
      ]);
    });

    it("renders the events in the cells of their days", async () => {
      await render({
        events: toEventsMap(
          makeEvent("Review", new Date(2026, 9, 6), new Date(2026, 9, 6)),
        ),
      });

      expect(getCellEvents(getCell(6))).toEqual(["Review"]);
      expect(
        getCells().filter((cell) => getCellEvents(cell).length > 0),
      ).toEqual([getCell(6)]);
    });

    it("re-renders when the events change", async () => {
      await render();
      expect(getCellEvents(getCell(6))).toEqual([]);

      await render({
        events: toEventsMap(
          makeEvent("Review", new Date(2026, 9, 6), new Date(2026, 9, 6)),
        ),
      });

      expect(getCellEvents(getCell(6))).toEqual(["Review"]);
    });

    it("renders the timed events with their start time", async () => {
      await render({
        events: toEventsMap(
          makeEvent(
            "Standup",
            new Date(2026, 9, 6, 9, 30),
            new Date(2026, 9, 6, 10),
            { allDay: false },
          ),
        ),
      });

      expect(getCell(6)?.querySelector('[data-part="btn"]')?.textContent).toBe(
        "9:30Standup",
      );
    });

    it("sorts the events: multi days first, then all day, then by start", async () => {
      await render({
        events: toEventsMap(
          makeEvent(
            "Late",
            new Date(2026, 9, 6, 18),
            new Date(2026, 9, 6, 19),
            { allDay: false },
          ),
          makeEvent("Early", new Date(2026, 9, 6, 8), new Date(2026, 9, 6, 9), {
            allDay: false,
          }),
          makeEvent("Holiday", new Date(2026, 9, 6), new Date(2026, 9, 6)),
          makeEvent("Trip", new Date(2026, 9, 6), new Date(2026, 9, 7)),
        ),
      });

      expect(getCellEvents(getCell(6))).toEqual([
        "Trip",
        "Holiday",
        "Early",
        "Late",
      ]);
    });

    it("sorts the events starting together by creation date", async () => {
      const start = new Date(2026, 9, 6, 9);
      const end = new Date(2026, 9, 6, 10);
      await render({
        events: toEventsMap(
          makeEvent("Second", start, end, {
            allDay: false,
            created: new Date(2026, 8, 2),
          }),
          makeEvent("First", start, end, {
            allDay: false,
            created: new Date(2026, 8, 1),
          }),
        ),
      });

      expect(getCellEvents(getCell(6))).toEqual(["First", "Second"]);
    });

    it("spans the multi days events across their days within the week", async () => {
      await render({
        events: toEventsMap(
          makeEvent("Trip", new Date(2026, 9, 6), new Date(2026, 9, 8)),
        ),
      });

      const first = getCellEvent(6, "Trip");
      expect(first?.style.width).toBe("300%");
      expect(first?.style.zIndex).toBe("1");
      for (const date of [7, 8]) {
        expect(getCellEvent(date, "Trip")?.style.width).toBe("100%");
        expect(getCellEvent(date, "Trip")?.style.zIndex).toBe("0");
      }
      expect(getCellEvents(getCell(9))).toEqual([]);
    });

    it("restarts the multi days events crossing a week on Monday", async () => {
      // from Saturday 10 to Tuesday 13
      await render({
        events: toEventsMap(
          makeEvent("Trip", new Date(2026, 9, 10), new Date(2026, 9, 13)),
        ),
      });

      expect(getCellEvent(10, "Trip")?.style.width).toBe("200%");
      expect(getCellEvent(11, "Trip")?.style.width).toBe("100%");
      expect(getCellEvent(12, "Trip")?.style.width).toBe("200%");
      expect(getCellEvent(12, "Trip")?.style.zIndex).toBe("1");
      expect(getCellEvent(13, "Trip")?.style.width).toBe("100%");
    });

    it("keeps the multi days events on the same row filling the gaps with placeholders", async () => {
      await render({
        events: toEventsMap(
          makeEvent("Short", new Date(2026, 9, 6), new Date(2026, 9, 7)),
          makeEvent("Long", new Date(2026, 9, 6), new Date(2026, 9, 8), {
            created: new Date(2026, 8, 2),
          }),
        ),
      });

      expect(getCellEvents(getCell(6))).toEqual(["Short", "Long"]);
      expect(getCellEvents(getCell(7))).toEqual(["Short", "Long"]);
      expect(getCellEvents(getCell(8))).toEqual(["_", "Long"]);
    });

    it("keeps the rows of the multi days events started on a previous day", async () => {
      // the timed event starts on Monday along with "Long", "Short" starts the
      // day after: it must not take the row of the timed event
      await render({
        events: toEventsMap(
          makeEvent("Long", new Date(2026, 9, 5), new Date(2026, 9, 7)),
          makeEvent("Short", new Date(2026, 9, 6), new Date(2026, 9, 7)),
          makeEvent(
            "Timed",
            new Date(2026, 9, 5, 10),
            new Date(2026, 9, 7, 10),
            { allDay: false },
          ),
        ),
      });

      expect(getCellEvents(getCell(5))).toEqual(["Long", "Timed"]);
      expect(getCellEvents(getCell(6))).toEqual(["Long", "Timed", "Short"]);
      expect(getCellEvents(getCell(7))).toEqual(["Long", "Timed", "Short"]);
      expect(getCellEvent(5, "Timed")?.style.width).toBe("300%");
      expect(getCellEvent(6, "Short")?.style.width).toBe("200%");
    });

    it("keeps a multi days event on the first row", async () => {
      // "Holiday" sorts before "Timed" (all day), but starts the day after
      await render({
        events: toEventsMap(
          makeEvent(
            "Timed",
            new Date(2026, 9, 5, 10),
            new Date(2026, 9, 6, 10),
            { allDay: false },
          ),
          makeEvent("Holiday", new Date(2026, 9, 6), new Date(2026, 9, 7)),
        ),
      });

      expect(getCellEvents(getCell(5))).toEqual(["Timed"]);
      expect(getCellEvents(getCell(6))).toEqual(["Timed", "Holiday"]);
      expect(getCellEvents(getCell(7))).toEqual(["_", "Holiday"]);
    });

    it("flags the past events", async () => {
      await render({
        events: toEventsMap(
          makeEvent("Past", new Date(2026, 9, 6), new Date(2026, 9, 6, 23)),
          makeEvent("Future", new Date(2026, 9, 20), new Date(2026, 9, 20)),
        ),
      });

      expect(getCellEvent(6, "Past")?.dataset["past"]).toBe("true");
      expect(getCellEvent(20, "Future")?.dataset["past"]).toBe("false");
    });

    it("passes the day flags and the view to the events", async () => {
      await render({
        events: toEventsMap(
          makeEvent("Today", new Date(2026, 9, 15), new Date(2026, 9, 15)),
          makeEvent("Before", new Date(2026, 8, 29), new Date(2026, 8, 29)),
        ),
      });

      expect(getCellEvent(15, "Today")?.dataset).toMatchObject({
        view: "month",
        istoday: "true",
        isoutofrange: "false",
      });
      expect(
        getCells()[1]?.querySelector<HTMLElement>('[data-part="event"]')
          ?.dataset,
      ).toMatchObject({ istoday: "false", isoutofrange: "true" });
    });

    it("selects the clicked event", async () => {
      const review = makeEvent(
        "Review",
        new Date(2026, 9, 6),
        new Date(2026, 9, 6),
      );
      const setEventClicked = vi.fn();
      await render({ events: toEventsMap(review), setEventClicked });

      act(() =>
        getCell(6)?.querySelector<HTMLElement>('[role="button"]')?.click(),
      );
      expect(setEventClicked).toHaveBeenCalledTimes(1);

      await render({
        events: toEventsMap(review),
        setEventClicked,
        eventClicked: review,
      });
      expect(getCellEvent(6, "Review")?.dataset["selected"]).toBe("true");
    });

    it("collapses the events beyond `maxEvents`", async () => {
      await render({
        maxEvents: 1,
        events: toEventsMap(
          makeEvent("A", new Date(2026, 9, 6, 8), new Date(2026, 9, 6, 9)),
          makeEvent("B", new Date(2026, 9, 6, 10), new Date(2026, 9, 6, 11)),
          makeEvent("C", new Date(2026, 9, 6, 12), new Date(2026, 9, 6, 13)),
        ),
      });

      expect(getCellEvents(getCell(6))).toEqual(["A"]);
      expect(getCell(6)?.querySelector("svg")?.parentElement?.textContent).toBe(
        "2",
      );
    });

    it("renders the events with the default components without React warnings", async () => {
      const review = makeEvent(
        "Review",
        new Date(2026, 9, 6),
        new Date(2026, 9, 6),
      );
      await render({
        TableBodyCell: undefined,
        TableBodyCellDate: undefined,
        CellEvent: undefined,
        CellEventBtn: undefined,
        CellEventTitle: undefined,
        eventClicked: review,
        events: toEventsMap(
          review,
          makeEvent("Trip", new Date(2026, 9, 14), new Date(2026, 9, 16)),
          makeEvent(
            "Late",
            new Date(2026, 9, 20, 18),
            new Date(2026, 9, 20, 19),
            { allDay: false },
          ),
        ),
      });

      expect(
        [...container.querySelectorAll('[role="button"]')].map(
          (btn) => btn.textContent,
        ),
      ).toEqual(["Review", "Trip", "Trip", "Trip", "18:00Late"]);
      // the `$` transient props are not passed to the default DOM elements
      expect(container.innerHTML).not.toContain("$");
    });

    it("renders the events without the calendars map", async () => {
      await render({
        calendarsMap: undefined,
        events: toEventsMap(
          makeEvent("Review", new Date(2026, 9, 6), new Date(2026, 9, 6)),
        ),
      });

      expect(getCellEvents(getCell(6))).toEqual(["Review"]);
      expect(
        getCell(6)?.querySelector<HTMLElement>('[role="button"]')?.style
          .display,
      ).toBe("");
    });

    it("renders with the custom table components", async () => {
      await render({
        Table: ({ children }: { children?: ReactNode }) => (
          <table data-part="table">{children}</table>
        ),
        TableHead: ({ children }: { children?: ReactNode }) => (
          <thead data-part="head">{children}</thead>
        ),
        TableHeadCell: ({ children }: { children?: ReactNode }) => (
          <th data-part="head-cell">{children}</th>
        ),
        TableBody: ({ children }: { children?: ReactNode }) => (
          <tbody data-part="body">{children}</tbody>
        ),
        TableBodyRow: ({ children }: { children?: ReactNode }) => (
          <tr data-part="row">{children}</tr>
        ),
      });

      expect(container.querySelector('[data-part="table"]')).not.toBeNull();
      expect(
        container.querySelectorAll('[data-part="head-cell"]'),
      ).toHaveLength(7);
      expect(
        container.querySelectorAll('[data-part="body"] > [data-part="row"]'),
      ).toHaveLength(5);
    });
  });
});
