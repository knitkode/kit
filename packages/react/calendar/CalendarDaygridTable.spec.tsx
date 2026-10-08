import { act } from "react";
import { createRoot } from "react-dom/client";
import { KitCalendarDaygridTable } from "./CalendarDaygridTable";

// tells React to run effects synchronously inside `act()`
(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

describe("KitCalendarDaygridTable", () => {
  it("renders the month weeks and days without React key warnings", async () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
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

    const keyWarnings = consoleError.mock.calls.filter((args) =>
      args.some((arg) => String(arg).includes("key")),
    );
    expect(keyWarnings).toEqual([]);

    act(() => root.unmount());
    consoleError.mockRestore();
  });
});
