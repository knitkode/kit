import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import {
  CalendarDaygridCell,
  type CalendarDaygridCellEventBtnProps,
  type CalendarDaygridCellEventProps,
  type CalendarDaygridCellProps,
} from "./CalendarDaygridCell";
import type { CalendarEvent, CalendarsMap, CalendarViewEvent } from "./types";

// tells React to run effects synchronously inside `act()`
(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

type ViewEvent = Extract<CalendarViewEvent, { width: number }>;

const calendar = { id: "work", color: "#ff0000", name: "Work" };

const calendarsMap: CalendarsMap = {
  work: { ...calendar, on: true, events: 3 },
};

const makeEvent = (
  uid: string,
  overrides: Partial<ViewEvent> = {},
): ViewEvent => {
  const start = new Date(2026, 9, 5, 9, 5);
  return {
    key: `event.${uid}`,
    top: 0,
    width: 1,
    calendar,
    days: [],
    daysMap: {},
    multi: false,
    allDay: false,
    link: "",
    title: `Event ${uid}`,
    status: "confirmed",
    created: new Date(2026, 8, 1),
    start,
    end: new Date(2026, 9, 5, 10),
    color: calendar.color,
    location: "",
    description: "",
    uid,
    ...overrides,
  };
};

const makePlaceholder = (top: number): CalendarViewEvent => ({
  key: `placeholder.${top}`,
  placeholder: true,
  top,
});

/** Turns the `$` transient props into `data-*` attributes */
const toDomProps = (props: object) =>
  Object.fromEntries(
    Object.entries(props).map(([key, value]) =>
      key.startsWith("$")
        ? [`data-${key.slice(1).toLowerCase()}`, String(value)]
        : [key, value],
    ),
  ) as React.HTMLAttributes<HTMLDivElement>;

const CellEvent = (props: CalendarDaygridCellEventProps) => (
  <div data-part="event" {...toDomProps(props)} />
);

const CellEventBtn = (props: CalendarDaygridCellEventBtnProps) => (
  <div data-part="btn" {...toDomProps(props)} />
);

describe("CalendarDaygridCell", () => {
  let container: HTMLDivElement;
  let root: Root;
  let consoleError: ReturnType<typeof vi.spyOn>;

  const render = (props: Partial<CalendarDaygridCellProps>) => {
    const allProps: CalendarDaygridCellProps = {
      setEventClicked: vi.fn(),
      setEventHovered: vi.fn(),
      view: "month",
      maxEvents: 5,
      events: [],
      calendarsMap,
      CellEvent,
      CellEventBtn,
      ...props,
    };
    act(() => root.render(<CalendarDaygridCell {...allProps} />));
    return allProps;
  };

  const getButtons = () =>
    [...container.querySelectorAll<HTMLElement>('[data-part="btn"]')].filter(
      (btn) => btn.getAttribute("role") === "button",
    );

  beforeEach(() => {
    consoleError = vi.spyOn(console, "error");
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    // no React warnings (keys, unknown DOM props) should be logged
    const errors = [...consoleError.mock.calls];
    consoleError.mockRestore();
    expect(errors).toEqual([]);
  });

  it("renders the start time and the title of timed events", () => {
    render({ events: [makeEvent("a", { title: "Standup" })] });

    const [button] = getButtons();
    const spans = [...(button?.querySelectorAll("span") ?? [])];
    expect(spans.map((span) => span.textContent)).toEqual(["9:05", "Standup"]);
  });

  it("renders only the title of all day events", () => {
    render({ events: [makeEvent("a", { title: "Holiday", allDay: true })] });

    const [button] = getButtons();
    expect(button?.querySelectorAll("span")).toHaveLength(1);
    expect(button?.textContent).toBe("Holiday");
  });

  it("renders the events with button semantics and ellipsed texts", () => {
    render({ events: [makeEvent("a")] });

    const [button] = getButtons();
    expect(button?.style.overflow).toBe("hidden");
    expect(button?.style.whiteSpace).toBe("nowrap");
    expect(button?.style.textOverflow).toBe("ellipsis");
  });

  it("hides only the events of the hidden calendars", () => {
    const home = { id: "home", color: "#0000ff", name: "Home" };
    const events = [
      makeEvent("a", { calendar: home }),
      makeEvent("b", { top: 1 }),
    ];
    render({
      events,
      calendarsMap: { ...calendarsMap, home: { ...home, on: false } },
    });

    expect(getButtons().map((btn) => btn.style.display)).toEqual(["none", ""]);

    // a new render with the visible calendar only
    act(() => root.unmount());
    root = createRoot(container);
    render({ events: [makeEvent("c")] });

    expect(getButtons()[0]?.style.display).toBe("");
    expect(getButtons()[0]?.style.overflow).toBe("hidden");
  });

  it("shows the events of the calendars missing in the map", () => {
    render({ events: [makeEvent("a")], calendarsMap: {} });

    expect(getButtons()).toHaveLength(1);
    expect(getButtons()[0]?.style.display).toBe("");
  });

  it("does not pass the transient props to the default DOM elements", () => {
    render({
      CellEvent: undefined,
      CellEventBtn: undefined,
      eventClicked: makeEvent("a"),
      events: [
        makePlaceholder(0),
        makeEvent("a", { top: 1, isPast: true, $isToday: false }),
        makeEvent("b", { top: 2, isPast: false, $isOutOfRange: true }),
      ],
    });

    expect(container.querySelectorAll('[role="button"]')).toHaveLength(2);
    expect(container.innerHTML).not.toContain("$");
  });

  it("passes the styling props to the event components", () => {
    render({
      view: "week",
      eventClicked: makeEvent("a"),
      events: [
        makeEvent("a", {
          color: "#00ff00",
          isPast: true,
          $isToday: false,
          $isOutOfRange: true,
        }),
        makeEvent("b", { isPast: false, $isToday: true }),
      ],
    });

    const [first, second] = container.querySelectorAll<HTMLElement>(
      '[data-part="event"]',
    );
    expect(first?.dataset).toMatchObject({
      view: "week",
      selected: "true",
      past: "true",
      color: "#00ff00",
      istoday: "false",
      isoutofrange: "true",
    });
    expect(second?.dataset).toMatchObject({
      selected: "false",
      past: "false",
      istoday: "true",
    });
    expect(getButtons()[0]?.dataset).toMatchObject({
      view: "week",
      selected: "true",
    });
  });

  it("renders the placeholders as hidden empty slots", () => {
    render({ events: [makePlaceholder(0), makeEvent("a", { top: 1 })] });

    const [placeholder] = container.querySelectorAll<HTMLElement>(
      '[data-part="event"]',
    );
    expect(placeholder?.dataset["placeholder"]).toBe("true");
    const placeholderBtn =
      placeholder?.querySelector<HTMLElement>('[data-part="btn"]');
    expect(placeholderBtn?.getAttribute("aria-hidden")).toBe("true");
    expect(placeholderBtn?.getAttribute("role")).toBeNull();
    expect(placeholderBtn?.style.visibility).toBe("hidden");
    expect(placeholderBtn?.textContent).toBe(" ");
    expect(getButtons()).toHaveLength(1);
  });

  it("makes the first day of multi-days events as wide as the days it spans", () => {
    render({
      events: [
        makeEvent("a", { multi: true, firstOfMulti: true, width: 3 }),
        makeEvent("b", { multi: true, width: 3, top: 1 }),
      ],
    });

    const [first, following] = container.querySelectorAll<HTMLElement>(
      '[data-part="event"]',
    );
    expect(first?.style.width).toBe("300%");
    expect(first?.style.zIndex).toBe("1");
    expect(first?.style.position).toBe("relative");
    expect(following?.style.width).toBe("100%");
    expect(following?.style.zIndex).toBe("0");
  });

  it("toggles the clicked event", () => {
    const setEventClicked = vi.fn();
    const event = makeEvent("a");
    render({ events: [event], setEventClicked });

    act(() => getButtons()[0]?.click());

    expect(setEventClicked).toHaveBeenCalledTimes(1);
    const update = setEventClicked.mock.calls[0]?.[0] as (
      previous: CalendarEvent | null,
    ) => CalendarEvent | null;
    expect(update(null)).toBe(event);
    expect(update(makeEvent("other"))).toBe(event);
    expect(update(makeEvent("a"))).toBeNull();
  });

  it("sets and resets the hovered event", () => {
    const setEventHovered = vi.fn();
    const event = makeEvent("a");
    render({ events: [event], setEventHovered });
    const button = getButtons()[0];

    act(() => {
      button?.dispatchEvent(
        new MouseEvent("mouseover", {
          bubbles: true,
          relatedTarget: document.body,
        }),
      );
    });
    expect(setEventHovered).toHaveBeenLastCalledWith(event);

    act(() => {
      button?.dispatchEvent(
        new MouseEvent("mouseout", {
          bubbles: true,
          relatedTarget: document.body,
        }),
      );
    });
    expect(setEventHovered).toHaveBeenLastCalledWith(null);
  });

  it("collapses the events beyond `maxEvents` in an expandable overflow", () => {
    const events = ["a", "b", "c", "d", "e"].map((uid, top) =>
      makeEvent(uid, { top }),
    );
    render({ events, maxEvents: 2 });

    expect(getButtons().map((btn) => btn.textContent)).toEqual([
      "9:05Event a",
      "9:05Event b",
    ]);
    const overflow = container.querySelector("svg")?.parentElement;
    expect(overflow?.textContent).toBe("3");

    act(() => overflow?.click());

    expect(getButtons()).toHaveLength(5);
    expect(container.querySelector("svg")).toBeNull();
  });

  it("counts in the overflow the events it hides, not the placeholders", () => {
    // the placeholder takes one of the two visible slots
    const events = [
      makePlaceholder(0),
      ...["a", "b", "c"].map((uid, i) => makeEvent(uid, { top: i + 1 })),
    ];
    render({ events, maxEvents: 2 });

    expect(getButtons().map((btn) => btn.textContent)).toEqual(["9:05Event a"]);
    expect(container.querySelector("svg")?.parentElement?.textContent).toBe(
      "2",
    );
  });

  it("does not render the overflow when the events fit", () => {
    const events = ["a", "b"].map((uid, top) => makeEvent(uid, { top }));
    render({ events, maxEvents: 2 });

    expect(getButtons()).toHaveLength(2);
    expect(container.querySelector("svg")).toBeNull();
  });

  it("renders with the custom components", () => {
    const Title = ({ children }: { children?: React.ReactNode }) => (
      <strong>{children}</strong>
    );
    const Start = ({ children }: { children?: React.ReactNode }) => (
      <time>{children}</time>
    );
    const Cell = ({ children }: { children?: React.ReactNode }) => (
      <ul>{children}</ul>
    );
    render({
      events: [makeEvent("a", { title: "Review" })],
      Cell,
      CellEventTitle: Title,
      CellEventStart: Start,
    });

    expect(container.querySelector("ul")).not.toBeNull();
    expect(container.querySelector("strong")?.textContent).toBe("Review");
    expect(container.querySelector("time")?.textContent).toBe("9:05");
  });
});
