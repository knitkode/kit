import { format } from "date-fns/format";
import type { KitComponent, KitComponentProps } from "../types";
import type { CalendarRange, CalendarView } from "./types";
import { useDateLocale } from "./useDateLocale";

export type KitCalendarDaygridNavProps = {
  locale: string;
  range: CalendarRange;
  view: CalendarView;
  todayInView?: boolean;
  handlePrev: () => any;
  handleNext: () => any;
  handleToday: () => any;
  handleView: (view: CalendarView) => any;
};

export type CalendarDaygridNavTitleProps = {
  range: CalendarRange;
  formatted: string;
};

export type CalendarDaygridNavProps = KitComponentProps<
  KitCalendarDaygridNavProps,
  {
    NavRoot?: KitComponent;
    NavTitle?: KitComponent<CalendarDaygridNavTitleProps>;
    NavBtns?: KitComponent;
    NavBtnPrev?: KitComponent;
    NavBtnNext?: KitComponent;
    NavBtnToday?: KitComponent;
    NavBtnViewMonth?: KitComponent;
    NavBtnViewWeek?: KitComponent;
  }
>;

export let KitCalendarDaygridNav = ({
  range,
  view,
  todayInView,
  handlePrev,
  handleNext,
  handleToday,
  handleView,
  locale: localeCode,
  NavRoot = "nav",
  NavTitle = "div",
  NavBtns = "div",
  NavBtnPrev = "button",
  NavBtnNext = "button",
  NavBtnToday = "button",
  NavBtnViewMonth = "button",
  NavBtnViewWeek = "button",
}: CalendarDaygridNavProps) => {
  const [start, end] = range;
  const locale = useDateLocale(localeCode);

  const opts = { locale };
  let formatted = "";

  if (view === "month") {
    formatted = format(start, "MMMM yyyy", opts);
  }
  if (view === "week") {
    const inSameMonth = start.getMonth() === end.getMonth();
    if (inSameMonth) {
      formatted = format(start, "# MMMM yyyy", opts).replace(
        "#",
        `${start.getDate()}-${end.getDate()}`,
      );
    } else {
      formatted = `${format(start, "d MMMM", opts)} - ${format(
        end,
        "d MMMM yyyy",
        opts,
      )}`;
    }
  }

  return (
    <NavRoot>
      <NavBtns>
        <NavBtnPrev onClick={handlePrev} />
        <NavBtnNext onClick={handleNext} />
        <NavBtnToday onClick={handleToday} disabled={todayInView} />
        <NavBtnViewMonth
          onClick={() => handleView("month")}
          disabled={view === "month"}
        />
        <NavBtnViewWeek
          onClick={() => handleView("week")}
          disabled={view === "week"}
        />
      </NavBtns>
      <NavTitle range={range} formatted={formatted} />
    </NavRoot>
  );
};
