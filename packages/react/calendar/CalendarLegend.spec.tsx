import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import {
  type CalendarLegendItemProps,
  type CalendarLegendProps,
  KitCalendarLegend,
} from "./CalendarLegend";
import type { CalendarsMap } from "./types";

// tells React to run effects synchronously inside `act()`
(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const calendarsMap: CalendarsMap = {
  work: { id: "work", color: "#ff0000", name: "Work", on: true, events: 4 },
  home: { id: "home", color: "#0000ff", name: "Home", on: false, events: 0 },
};

/** Consumes the `$` transient props instead of leaking them to the DOM */
const LegendItem = ({
  $color,
  $empty,
  disabled,
  ...props
}: CalendarLegendItemProps) => (
  <div
    data-part="item"
    data-color={$color}
    data-empty={String($empty)}
    aria-disabled={disabled}
    {...props}
  />
);

describe("KitCalendarLegend", () => {
  let container: HTMLDivElement;
  let root: Root;
  let consoleError: ReturnType<typeof vi.spyOn>;

  const render = (props: Partial<CalendarLegendProps>) =>
    act(() =>
      root.render(
        <KitCalendarLegend
          calendarsMap={calendarsMap}
          toggleCalendarVisibility={() => {}}
          LegendItem={LegendItem}
          {...props}
        />,
      ),
    );

  const getItems = () => [
    ...container.querySelectorAll<HTMLElement>('[data-part="item"]'),
  ];

  beforeEach(() => {
    consoleError = vi.spyOn(console, "error");
    container = document.createElement("div");
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    // no React warnings (keys, unknown DOM props) should be logged
    expect(consoleError).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });

  it("renders one item per calendar with its status, name and events count", () => {
    render({});

    const items = getItems().map((item) =>
      [...item.querySelectorAll("span")].map((span) => span.textContent),
    );
    expect(items).toEqual([
      ["⬤", "Work", "4"],
      ["⭘", "Home", "0"],
    ]);
  });

  it("passes the color and the empty state to the items", () => {
    render({});

    const [work, home] = getItems();
    expect({ ...work?.dataset }).toMatchObject({
      color: "#ff0000",
      empty: "false",
    });
    expect(work?.getAttribute("aria-disabled")).toBe("false");
    expect({ ...home?.dataset }).toMatchObject({
      color: "#0000ff",
      empty: "true",
    });
    expect(home?.getAttribute("aria-disabled")).toBe("true");
  });

  it("toggles the visibility of the clicked calendar", () => {
    const toggleCalendarVisibility = vi.fn();
    render({ toggleCalendarVisibility });

    act(() => getItems()[0]?.click());

    expect(toggleCalendarVisibility).toHaveBeenCalledExactlyOnceWith("work");
  });

  it("renders nothing without calendars", () => {
    render({ calendarsMap: {} });

    expect(container.innerHTML).toBe("");
  });

  it("renders with the custom components", () => {
    render({
      LegendItemStatus: ({ children }: { children?: React.ReactNode }) => (
        <i>{children}</i>
      ),
      LegendItemLabel: ({ children }: { children?: React.ReactNode }) => (
        <b>{children}</b>
      ),
      LegendItemEvents: ({ children }: { children?: React.ReactNode }) => (
        <small>{children}</small>
      ),
    });

    expect(
      [...container.querySelectorAll("b")].map((b) => b.textContent),
    ).toEqual(["Work", "Home"]);
    expect(
      [...container.querySelectorAll("small")].map((s) => s.textContent),
    ).toEqual(["4", "0"]);
    expect(container.querySelectorAll("i")).toHaveLength(2);
  });
});
