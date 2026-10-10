import { useCallback, useEffect, useReducer, useState } from "react";
import type { KitCalendarDaygridNavProps } from "./CalendarDaygridNav";
import type { KitCalendarDaygridTableProps } from "./CalendarDaygridTable";
import type { KitCalendarLegendProps } from "./CalendarLegend";
import { getCalendarsEventsFromGoogle } from "./calendar-api-google";
import type {
  CalendarEvent,
  CalendarEventsMap,
  CalendarRange,
  Calendars,
  CalendarsMap,
  CalendarView,
} from "./types";
import {
  getEndDate,
  getNextDate,
  getPrevDate,
  getStartDate,
  isTodayInView,
} from "./utils";

export type UseCalendarProps = {
  /** The locale to format with `date-fns` */
  locale: string;
  /** Calendars infos to use */
  calendars: Calendars;
  /** Fall back to `process.env.GOOGLE_CALENDAR_API_KEY */
  apiKey?: string;
  /**
   * The key is the event `uid`, they are shown along with the ones loaded from
   * the calendars
   */
  events?: CalendarEventsMap;
  /** It defaults to the first of the current month */
  start?: Date;
  /** It defaults to the last day of the current month */
  end?: Date;
  /**
   * The calendar view
   * @default "month"
   */
  view?: CalendarView;
  /**
   * The default is the time zone of the calendar
   * @see https://developers.google.com/calendar/api/v3/reference/events/list
   */
  timeZone?: string;
  /** Called with the error of each calendar whose events could not be loaded */
  onError?: (e: any) => void;
};

export type UseCalendarReturn = ReturnType<typeof useCalendar>;

export type CalendarsUpdateActionEvents = {
  type: "events";
  payload: Record<string, number>;
};

export type CalendarsUpdateActionVisibility = {
  type: "visibility";
  payload: string | string[];
};

export type CalendarsUpdateActionNames = {
  type: "names";
  payload: Record<string, string>;
};

export type CalendarsUpdateAction =
  | CalendarsUpdateActionEvents
  | CalendarsUpdateActionVisibility
  | CalendarsUpdateActionNames;

export let useCalendar = ({
  locale,
  apiKey,
  calendars,
  events: initialEvents,
  start: initialStart,
  end: initialEnd,
  view: initialView = "month",
  timeZone = "",
  onError,
}: UseCalendarProps) => {
  const [view, setView] = useState(initialView);
  const start = initialStart || getStartDate(new Date(), view);
  const end = initialEnd || getEndDate(start, view);
  const [range, setRange] = useState<CalendarRange>([start, end]);
  const [todayInView, setTodayInView] = useState(isTodayInView(start, end));
  const [events, setEvents] = useState(initialEvents || {});
  const [eventHovered, setEventHovered] = useState<CalendarEvent | null>(null);
  const [eventClicked, setEventClicked] = useState<CalendarEvent | null>(null);

  const [calendarsMap, updateCalendars] = useReducer(
    (state: CalendarsMap, action: CalendarsUpdateAction) => {
      const { type } = action;

      switch (type) {
        case "events": {
          const events = action.payload;
          return Object.entries(state).reduce((map, [id, calendar]) => {
            map[id] = {
              ...calendar,
              events: events[id] || 0,
            };
            return map;
          }, {} as CalendarsMap);
        }

        case "names": {
          const names = action.payload;
          return Object.entries(state).reduce((map, [id, calendar]) => {
            map[id] = {
              ...calendar,
              name: names[id] || calendar.name,
            };
            return map;
          }, {} as CalendarsMap);
        }

        case "visibility": {
          const visible = action.payload;
          if (typeof visible === "string") {
            return {
              ...state,
              [visible]: {
                ...state[visible],
                on: !state[visible].on,
              },
            };
          } else {
            return Object.entries(state).reduce((map, [id, calendar]) => {
              map[id] = {
                ...calendar,
                on: visible.indexOf(id) > -1,
              };
              return map;
            }, {} as CalendarsMap);
          }
        }

        default:
          return state;
      }
    },
    // initial state
    calendars.reduce((map, calendar) => {
      map[calendar.id] = {
        ...calendar,
        name: calendar.name || "",
        on: true,
        events: 0,
      };
      return map;
    }, {} as CalendarsMap),
  );

  const toggleCalendarVisibility = useCallback(
    (idOrIds: string | string[]) => {
      updateCalendars({ type: "visibility", payload: idOrIds });
    },
    [updateCalendars],
  );

  const updateCalendarsBasedOnEvents = useCallback(
    (events: CalendarEventsMap) => {
      const payload: CalendarsUpdateActionEvents["payload"] = {};

      for (const uid in events) {
        const { id } = events[uid].calendar;
        payload[id] = payload[id] || 0;
        payload[id]++;
      }

      updateCalendars({ type: "events", payload });
    },
    [],
  );

  const loadCalendars = useCallback(
    async (
      calendars: UseCalendarProps["calendars"],
      start: Date,
      end: Date,
    ) => {
      const [newEvents, names] = await getCalendarsEventsFromGoogle({
        apiKey,
        calendars,
        timeZone,
        start,
        end,
        onError,
      });

      updateCalendars({ type: "names", payload: names });
      // keep the given events along with the loaded ones
      setEvents({ ...initialEvents, ...newEvents });
    },
    [setEvents, apiKey, timeZone, onError, initialEvents],
  );

  const handleToday = useCallback(() => {
    const [start, end] = range;
    const newStart = getStartDate(new Date(), view);
    const newEnd = getEndDate(newStart, view);
    setRange([newStart, newEnd]);

    // reset event only if we are not on the current view already
    if (
      start.getTime() !== newStart.getTime() ||
      end.getTime() !== newEnd.getTime()
    ) {
      setEventClicked(null);
      setEventHovered(null);
    }
  }, [view, range]);

  const handlePrev = useCallback(() => {
    setRange(([start]) => {
      const newStart = getPrevDate(start, view);
      const newEnd = getEndDate(newStart, view);
      return [newStart, newEnd];
    });
    setEventClicked(null);
    setEventHovered(null);
  }, [view]);

  const handleNext = useCallback(() => {
    setRange(([start]) => {
      const newStart = getNextDate(start, view);
      const newEnd = getEndDate(newStart, view);
      return [newStart, newEnd];
    });
    setEventClicked(null);
    setEventHovered(null);
  }, [view]);

  const handleView = useCallback(
    (newView: CalendarView) => {
      // from the displayed range: the week where it starts or the month where
      // it ends (the month of the week's Sunday), so that switching from a
      // month to the week view and back shows the same month
      const newStart = getStartDate(range[newView === "week" ? 0 : 1], newView);
      const newEnd = getEndDate(newStart, newView);
      setRange([newStart, newEnd]);
      setView(newView);
      setEventClicked(null);
      setEventHovered(null);
    },
    [range],
  );

  useEffect(() => {
    const [start, end] = range;
    loadCalendars(calendars, start, end);
    setTodayInView(isTodayInView(start, end));
  }, [range]);

  useEffect(() => {
    if (events) {
      updateCalendarsBasedOnEvents(events);
    }
  }, [events, updateCalendarsBasedOnEvents]);

  // when toggling a calendar we also remove the clicked event if that belongs
  // to a now hidden calendar
  useEffect(() => {
    if (eventClicked) {
      if (calendarsMap[eventClicked.calendar.id]?.on === false) {
        setEventClicked(null);
      }
    }
  }, [calendarsMap, eventClicked, setEventClicked]);

  return {
    view,
    eventClicked,
    setEventClicked,
    eventHovered,
    setEventHovered,
    getDaygridNavProps: (): KitCalendarDaygridNavProps => ({
      locale,
      handlePrev,
      handleNext,
      handleToday,
      handleView,
      todayInView,
      range,
      view,
    }),
    getDaygridTableProps: (): KitCalendarDaygridTableProps => ({
      locale,
      events,
      eventClicked,
      setEventClicked,
      eventHovered,
      setEventHovered,
      handlePrev,
      handleNext,
      calendarsMap,
      range,
      view,
    }),
    getLegendProps: (): KitCalendarLegendProps => ({
      calendarsMap,
      toggleCalendarVisibility,
    }),
  };
};
