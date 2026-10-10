import { eachWeekOfInterval } from "date-fns/eachWeekOfInterval";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import { useSwipeable } from "react-swipeable";
import type { KitComponent, KitComponentProps } from "../types";
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
import { getCustomProps, processEventsInView } from "./utils";

export type CalendarDaygridTableBodyCellProps = CalendarViewDayProps & {
  children?: ReactNode;
};

export type CalendarDaygridTableBodyCellDateProps = CalendarViewDayProps & {
  children?: ReactNode;
};

function getView(range: CalendarRange) {
  const [start, end] = range;
  const weeks = eachWeekOfInterval({ start, end }, { weekStartsOn: 1 });

  return {
    month: start.getMonth(),
    weeks,
  };
}

export type KitCalendarDaygridTableProps = {
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

export type CalendarDaygridTableProps = KitComponentProps<
  KitCalendarDaygridTableProps,
  {
    Table?: KitComponent;
    TableHead?: KitComponent;
    TableHeadCell?: KitComponent;
    TableBody?: KitComponent;
    TableBodyCell?: KitComponent<CalendarDaygridTableBodyCellProps>;
    TableBodyCellDate?: KitComponent<CalendarDaygridTableBodyCellDateProps>;
    TableBodyRow?: KitComponent;
  } & CalendarDaygridCellComponents
>;

export let KitCalendarDaygridTable = ({
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
  const restKit = {
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
            <TableHeadCell scope="col" key={day}>
              {day}
            </TableHeadCell>
          ))}
        </tr>
      </TableHead>
      <TableBody>
        {weeksEvents.map((week) => {
          // React wants `key` as its own prop: inside a spread it warns and may drop it
          const { key: weekKey, ...weekProps } = week.props;

          return (
            <TableBodyRow key={weekKey} {...weekProps}>
              {week.days.map((day) => {
                const { key: dayKey, ...dayProps } = day.props;

                return (
                  <TableBodyCell
                    key={dayKey}
                    {...getCustomProps(TableBodyCell, dayProps)}
                  >
                    <TableBodyCellDate
                      {...getCustomProps(TableBodyCellDate, dayProps)}
                    >
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
                        {...restKit}
                      />
                    )}
                  </TableBodyCell>
                );
              })}
            </TableBodyRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
