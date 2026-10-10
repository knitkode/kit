import { addDays } from "date-fns/addDays";
import { addMonths } from "date-fns/addMonths";
import { addWeeks } from "date-fns/addWeeks";
import { endOfMonth } from "date-fns/endOfMonth";
import { endOfWeek } from "date-fns/endOfWeek";
import { isWithinInterval } from "date-fns/isWithinInterval";
import { startOfWeek } from "date-fns/startOfWeek";
import { subMonths } from "date-fns/subMonths";
import { subWeeks } from "date-fns/subWeeks";
import type {
  CalendarEvent,
  CalendarEventsMap,
  CalendarView,
  CalendarViewDay,
  CalendarViewWeek,
  CalendarViewWeeks,
} from "./types";

export let getEventTimestamp = (dateLike: number | Date | string): number => {
  const date = new Date(dateLike);
  date.setHours(0, 0, 0, 0);
  return date.valueOf() / 1000;
};

export let getDisplayTime = (date: Date): string =>
  date.getHours() +
  ":" +
  "0".repeat(2 - date.getMinutes().toString().length) +
  date.getMinutes();

export let getStartDate = (date: Date, view: CalendarView) => {
  // copy the date not to mutate the given one, and reset the milliseconds too
  // so that the start of the same view always compares equal
  date = new Date(date);
  date.setHours(0, 0, 0, 0);

  if (view === "month") {
    date.setDate(1);
  } else if (view === "week") {
    date = startOfWeek(date, { weekStartsOn: 1 });
  }
  return date;
};

export let getEndDate = (start: Date, view: CalendarView) => {
  let end = start;
  if (view === "month") {
    end = endOfMonth(start);
  } else if (view === "week") {
    end = endOfWeek(start, { weekStartsOn: 1 });
  }
  end.setHours(23, 59, 59);
  return end;
};

export let getPrevDate = (date: Date, view: CalendarView) =>
  view === "month" ? subMonths(date, 1) : subWeeks(date, 1);

export let getNextDate = (date: Date, view: CalendarView) =>
  view === "month" ? addMonths(date, 1) : addWeeks(date, 1);

export let isTodayInView = (start: Date, end: Date) =>
  isWithinInterval(new Date(), { start, end });

/**
 * The given props are meant for custom components only: the default components
 * are plain DOM tags (`"div"`, `"td"`...) and do not get them, e.g. the `$`
 * prefixed (transient) props React would warn about
 */
export let getCustomProps = <T extends object>(component: unknown, props: T) =>
  (typeof component === "string" ? {} : props) as T;

export let mergeCalendarEvents = (
  first: CalendarEventsMap,
  second: CalendarEventsMap,
) => {
  const all: CalendarEventsMap = {};
  addCalendarEvents(first, all);
  addCalendarEvents(second, all);
  return all;
};

export let addCalendarEvents = (
  toAdd: CalendarEventsMap,
  toExtend: CalendarEventsMap,
) => {
  for (const id in toAdd) {
    const event = toAdd[id];
    toExtend[id] = event;
  }
  return toExtend;
};

let getSortedEvents = (events: CalendarEventsMap) => {
  const output = [];

  for (const uid in events) {
    output.push(events[uid]);
  }

  // sort events first multi, then all day then by start then by created date
  output.sort((a, b) => {
    const multi = Number(b.multi) - Number(a.multi);
    const allDay = Number(b.allDay) - Number(a.allDay);
    const start = a.start.getTime() - b.start.getTime();
    const created = a.created.getTime() - b.created.getTime();

    return multi || allDay || start || created;
  });

  return output;
};

export let processEventsInView = (
  eventsMap: CalendarEventsMap,
  calendarView: CalendarView,
  month: number,
  weeks: Date[],
) => {
  const eventsList = getSortedEvents(eventsMap);
  const todayDate = new Date();
  const todayTimestamp = getEventTimestamp(todayDate);
  const startedAtTopMap: Record<CalendarEvent["uid"], number> = {};
  const viewWeeks: CalendarViewWeeks = [];

  for (let weekIdx = 0; weekIdx < weeks.length; weekIdx++) {
    const viewWeek: CalendarViewWeek = {
      props: { key: `week.${weekIdx}` },
      days: [],
    };
    const weekStartDate = weeks[weekIdx];
    const weekStartDay = weekStartDate.getDate();
    const weekStartTimestamp = getEventTimestamp(new Date(weekStartDate));
    const weekEndTimestamp = getEventTimestamp(
      addDays(new Date(weekStartDate), 6),
    );

    for (let dayNumber = 0; dayNumber < 7; dayNumber++) {
      const dayDate = new Date(
        new Date(weekStartDate).setDate(weekStartDay + dayNumber),
      );
      const dayTimestamp = getEventTimestamp(dayDate);
      const $isToday = todayTimestamp === dayTimestamp;
      const $isOutOfRange =
        calendarView === "month" && dayDate.getMonth() !== month;
      const contextualProps = {
        $isToday,
        $isOutOfRange,
      };
      const viewDay: CalendarViewDay = {
        props: { key: `day.${dayTimestamp}`, ...contextualProps },
        timestamp: dayTimestamp + "",
        label: dayDate.getDate() + "",
        events: [],
      };

      // the events of the day, first the multi days events already placed on
      // a previous day: their row is taken by the chip spanning from there
      const dayEvents = eventsList
        .filter((event) => event.daysMap[dayTimestamp])
        .sort(
          (a, b) => +(b.uid in startedAtTopMap) - +(a.uid in startedAtTopMap),
        );
      // the slots (rows) of the day taken by an event
      const verticalSlots: 1[] = [];

      for (const event of dayEvents) {
        let width = 1;
        let firstOfMulti;

        // only for multi days events:
        if (event.multi) {
          // filter out the days outside of the current week view to avoid
          // making a multi-days event chip wider than the week row or shorter
          // than it should be (when event spans across weeks)
          width = event.days.filter(
            (t) => t >= weekStartTimestamp && t <= weekEndTimestamp,
          ).length;

          // flag the first day of multi-days events, consider that an event
          // might start in a day earlier (hence outside) of the current
          // week/month view, so we always check for Mondays (dayNumber === 0)
          if (event.days.indexOf(dayTimestamp) === 0 || dayNumber === 0) {
            firstOfMulti = true;
          }
        }

        // if we already have the information on when the event has been
        // vertically positioned use that index, if free, otherwise look for a
        // free slot and use its index as `top`
        let top = startedAtTopMap[event.uid];
        if (top == null || verticalSlots[top]) {
          top = 0;
          while (verticalSlots[top]) top++;
        }

        // now mark the slot as busy
        verticalSlots[top] = 1;

        // store the slot vertical position consistently for multi-days events
        if (firstOfMulti) {
          startedAtTopMap[event.uid] = top;
        }

        // push the event, they will be sorted later
        viewDay.events.push({
          key: `event.${dayTimestamp}-${top}`,
          ...contextualProps,
          ...event,
          isPast: todayDate > event.end,
          firstOfMulti,
          top,
          width,
        });
      }

      // fill the empty slots with events' placeholders
      for (let i = 0; i < verticalSlots.length; i++) {
        if (!verticalSlots[i]) {
          viewDay.events.push({
            key: `event.${dayTimestamp}-${i}}`,
            placeholder: true,
            top: i,
          });
        }
      }

      // sort events and events placeholders by top position
      viewDay.events.sort((a, b) => a.top - b.top);

      viewWeek.days.push(viewDay);
    }

    viewWeeks.push(viewWeek);
  }

  return viewWeeks;
};
