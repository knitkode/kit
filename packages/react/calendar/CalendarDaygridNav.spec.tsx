import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import {
  type CalendarDaygridNavProps,
  type CalendarDaygridNavTitleProps,
  KitCalendarDaygridNav,
} from "./CalendarDaygridNav";

// tells React to run effects synchronously inside `act()`
(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const NavTitle = ({ formatted, range }: CalendarDaygridNavTitleProps) => (
  <h2 data-start={range[0].toDateString()}>{formatted}</h2>
);

const october: CalendarDaygridNavProps["range"] = [
  new Date(2026, 9, 1),
  new Date(2026, 9, 31, 23, 59, 59),
];

// the hook dynamically imports the date-fns locale, preload it so that it
// resolves within the `act()` scopes of the tests
beforeAll(async () => {
  await import("date-fns/locale/en-US");
});

describe("KitCalendarDaygridNav", () => {
  let container: HTMLDivElement;
  let root: Root;
  let consoleError: ReturnType<typeof vi.spyOn>;

  const render = async (props: Partial<CalendarDaygridNavProps>) => {
    const allProps: CalendarDaygridNavProps = {
      locale: "en-US",
      range: october,
      view: "month",
      handlePrev: vi.fn(),
      handleNext: vi.fn(),
      handleToday: vi.fn(),
      handleView: vi.fn(),
      NavTitle,
      ...props,
    };
    await act(async () => root.render(<KitCalendarDaygridNav {...allProps} />));
    // let the date-fns locale dynamic import settle
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
    return allProps;
  };

  const getTitle = () => container.querySelector("h2")?.textContent;

  const getButtons = () => {
    const [prev, next, today, month, week] = [
      ...container.querySelectorAll("nav > div > button"),
    ] as HTMLButtonElement[];
    return { prev, next, today, month, week };
  };

  beforeEach(() => {
    consoleError = vi.spyOn(console, "error");
    container = document.createElement("div");
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    // no React warnings (act, unknown DOM props) should be logged
    const errors = [...consoleError.mock.calls];
    consoleError.mockRestore();
    expect(errors).toEqual([]);
  });

  it("renders the month and the year in month view", async () => {
    await render({});

    expect(getTitle()).toBe("October 2026");
  });

  it("renders the title in the default element", async () => {
    await render({ NavTitle: undefined });
    const title = container.querySelector("nav > div:last-child");

    expect(title?.textContent).toBe("October 2026");
    expect(title?.attributes).toHaveLength(0);
  });

  it("passes the range to the title", async () => {
    await render({});

    expect(container.querySelector("h2")?.dataset["start"]).toBe(
      "Thu Oct 01 2026",
    );
  });

  it("renders the days range within the same month in week view", async () => {
    await render({
      view: "week",
      range: [new Date(2026, 9, 5), new Date(2026, 9, 11, 23, 59, 59)],
    });

    expect(getTitle()).toBe("5-11 October 2026");
  });

  it("renders both months of a week across two months", async () => {
    await render({
      view: "week",
      range: [new Date(2026, 8, 28), new Date(2026, 9, 4, 23, 59, 59)],
    });

    expect(getTitle()).toBe("28 September - 4 October 2026");
  });

  it("renders the prev, next, today and views buttons", async () => {
    await render({});

    expect(container.querySelector("nav")).not.toBeNull();
    expect(container.querySelectorAll("nav > div > button")).toHaveLength(5);
  });

  it("calls the navigation handlers", async () => {
    const props = await render({});
    const { prev, next, today } = getButtons();

    act(() => prev?.click());
    expect(props.handlePrev).toHaveBeenCalledTimes(1);

    act(() => next?.click());
    expect(props.handleNext).toHaveBeenCalledTimes(1);

    act(() => today?.click());
    expect(props.handleToday).toHaveBeenCalledTimes(1);
  });

  it("disables the today button when today is in view", async () => {
    await render({ todayInView: true });
    expect(getButtons().today?.disabled).toBe(true);

    await render({ todayInView: false });
    expect(getButtons().today?.disabled).toBe(false);
  });

  it("switches to the week view from the month view", async () => {
    const props = await render({ view: "month" });
    const { month, week } = getButtons();

    expect(month?.disabled).toBe(true);
    expect(week?.disabled).toBe(false);

    act(() => week?.click());
    expect(props.handleView).toHaveBeenCalledExactlyOnceWith("week");
  });

  it("switches to the month view from the week view", async () => {
    const props = await render({
      view: "week",
      range: [new Date(2026, 9, 5), new Date(2026, 9, 11, 23, 59, 59)],
    });
    const { month, week } = getButtons();

    expect(month?.disabled).toBe(false);
    expect(week?.disabled).toBe(true);

    act(() => month?.click());
    expect(props.handleView).toHaveBeenCalledExactlyOnceWith("month");
  });

  it("renders with the custom components", async () => {
    const Button = (props: { onClick?: () => void; disabled?: boolean }) => (
      <a href="#nav" aria-disabled={props.disabled} onClick={props.onClick}>
        nav
      </a>
    );
    await render({
      NavRoot: ({ children }: { children?: React.ReactNode }) => (
        <header>{children}</header>
      ),
      NavBtns: ({ children }: { children?: React.ReactNode }) => (
        <menu>{children}</menu>
      ),
      NavBtnPrev: Button,
      NavBtnNext: Button,
      NavBtnToday: Button,
      NavBtnViewMonth: Button,
      NavBtnViewWeek: Button,
    });

    expect(container.querySelectorAll("header > menu > a")).toHaveLength(5);
    expect(container.querySelector("header > h2")?.textContent).toBe(
      "October 2026",
    );
  });
});
