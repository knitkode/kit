import { eachWeekOfInterval } from "date-fns/eachWeekOfInterval";
import { useEffect, useMemo, useState } from "react";
import { useSwipeable } from "react-swipeable";
import type { KoineComponent, KoineComponentProps } from "../types";
import {
  CalendarDaygridCell,
  type CalendarDaygridCellComponents,
  type CalendarDaygridCellProps,
} from "./CalendarDaygridCell";
import type {
  CalendarEventsMap,
  CalendarRange,
  CalendarView,
  CalendarViewDayProps,
  CalendarViewWeeks,
} from "./types";
import { useDateLocale } from "./useDateLocale";
import { processEventsInView } from "./utils";

export type CalendarDaygridTableBodyCellProps = CalendarViewDayProps;

export type CalendarDaygridTableBodyCellDateProps = CalendarViewDayProps;

function getView(range: CalendarRange) {
  const [start, end] = range;
  const weeks = eachWeekOfInterval({ start, end }, { weekStartsOn: 1 });

  return {
    month: start.getMonth(),
    weeks,
  };
}

export type KoineCalendarDaygridTableProps = {
  maxEvents?: CalendarDaygridCellProps["maxEvents"];
  locale: string;
  events: CalendarEventsMap;
  handlePrev: () => any;
  handleNext: () => any;
  view: CalendarView;
  range: CalendarRange;
  dayLabels?: string[];
} & Pick<
  CalendarDaygridCellProps,
  | "eventClicked"
  | "setEventClicked"
  | "eventHovered"
  | "setEventHovered"
  | "calendarsMap"
>;

export type CalendarDaygridTableProps = KoineComponentProps<
  KoineCalendarDaygridTableProps,
  {
    Table?: KoineComponent;
    TableHead?: KoineComponent;
    TableHeadCell?: KoineComponent;
    TableBody?: KoineComponent;
    TableBodyCell?: KoineComponent<CalendarDaygridTableBodyCellProps>;
    TableBodyCellDate?: KoineComponent<CalendarDaygridTableBodyCellDateProps>;
    TableBodyRow?: KoineComponent;
  } & CalendarDaygridCellComponents
>;

export let KoineCalendarDaygridTable = ({
  locale: localeCode,
  handlePrev,
  handleNext,
  events,
  dayLabels,
  view,
  range,
  eventClicked,
  setEventClicked,
  eventHovered,
  setEventHovered,
  calendarsMap = {},
  maxEvents = 5,
  Table = "table",
  TableHead = "thead",
  TableHeadCell = "th",
  TableBody = "tbody",
  TableBodyRow = "tr",
  TableBodyCell = "td",
  TableBodyCellDate = "div",
  Cell,
  CellOverflow,
  CellEvent,
  CellEventBtn,
  CellEventTitle,
  CellEventStart,
}: // ...props
CalendarDaygridTableProps) => {
  const restKoine = {
    Cell,
    CellOverflow,
    CellEvent,
    CellEventBtn,
    CellEventTitle,
    CellEventStart,
  };
  const [days, setDays] = useState(dayLabels || [0, 1, 2, 3, 4, 5, 6]);
  const [weeksEvents, setWeeksEvents] = useState<CalendarViewWeeks>([]);
  // const [days, setDays] = useState(dayLabels || [...Array(7).keys()]);
  const locale = useDateLocale(localeCode);
  const { month, weeks } = useMemo(() => getView(range), [range]);
  const swipeableHandlers = useSwipeable({
    onSwipedLeft: handleNext,
    onSwipedRight: handlePrev,
  });

  useEffect(() => {
    setWeeksEvents(processEventsInView(events, view, month, weeks));
  }, [events, view, month, weeks]);

  useEffect(() => {
    if (locale && locale.localize && !dayLabels) {
      setDays(
        [1, 2, 3, 4, 5, 6, 0].map(
          // @ts-expect-error nevermind
          (i) => locale.localize.day(i, { width: "abbreviated" }),
        ),
      );
    }
  }, [locale, dayLabels]);

  return (
    <Table {...swipeableHandlers}>
      <TableHead>
        <tr>
          {days.map((day) => (
            <TableHeadCell scope="column" key={day}>
              {day}
            </TableHeadCell>
          ))}
        </tr>
      </TableHead>
      <TableBody>
        {weeksEvents.map((week, i) => (
          <TableBodyRow {...week.props}>
            {week.days.map((day) => (
              <TableBodyCell {...day.props}>
                <TableBodyCellDate {...day.props}>
                  {day.label}
                </TableBodyCellDate>
                {day.events.length > 0 && (
                  <CalendarDaygridCell
                    {...{
                      eventClicked,
                      setEventClicked,
                      eventHovered,
                      setEventHovered,
                      view,
                      maxEvents,
                      events: day.events,
                      timestamp: day.timestamp,
                      calendarsMap,
                    }}
                    {...restKoine}
                  />
                )}
              </TableBodyCell>
            ))}
          </TableBodyRow>
        ))}
      </TableBody>
    </Table>
  );
};
