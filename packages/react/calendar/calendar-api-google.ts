import { differenceInCalendarDays } from "date-fns/differenceInCalendarDays";
import { subDays } from "date-fns/subDays";
import { arrayToLookup, isString, isUndefined } from "@knitkode/utils";
import type {
  Calendar,
  CalendarEvent,
  CalendarEventsMap,
  Calendars,
} from "./types";
import { addCalendarEvents, getEventTimestamp } from "./utils";

/**
 * Google event as it comes from Google's API
 */
type GoogleEvent = {
  created: string;
  description?: string;
  end: GoogleDate;
  etag: string;
  htmlLink: string;
  iCalUID: string;
  id: string;
  kind: string;
  location: string;
  start: GoogleDate;
  status: string;
  summary: string;
};

/**
 * Google calendar as it comes from Google's API
 */
type GoogleCalendar = {
  etag: string;
  kind: string;
  summary: string;
  update: string;
  timeZone: string;
  accessRole: string;
  defaultReminders: object[];
  nextSyncToken: string;
  items: GoogleEvent[];
  /** Instead of the calendar, e.g. when the API key or the calendar id is wrong */
  error?: object;
};

/**
 * Google event's date as it comes from Google's API
 */
type GoogleDate = {
  dateTime: string;
  /** When the event is "all day" we have `date` instead of `dateTime` */
  date?: string;
};

const baseURL = "https://www.googleapis.com/calendar/v3/calendars/";

type GetCalendarsEventsFromGoogleOptions = {
  /** Fall back to `process.env.GOOGLE_CALENDAR_API_KEY */
  apiKey?: string;
  /** Start gethering events from date */
  start: Date;
  /** End gethering events at date */
  end: Date;
  /**
   * The default is the time zone of the calendar
   * @see https://developers.google.com/calendar/api/v3/reference/events/list
   */
  timeZone?: string;
  /** The calendars settings */
  calendars: Calendars;
  /** Called with the error of each calendar whose events could not be loaded */
  onError?: (e: any) => void;
};

/**
 * Gets the events of all the calendars and the calendars names (the given
 * `name` or the remote `summary`), the given calendars are not mutated
 */

export let getCalendarsEventsFromGoogle = async ({
  calendars,
  ...options
}: GetCalendarsEventsFromGoogleOptions) => {
  const allEvents: CalendarEventsMap = {};
  const names: Record<Calendar["id"], string> = {};

  await Promise.all(
    calendars.map(async (calendar) => {
      const [events, name] = await getCalendarEventsFromGoogle({
        calendar,
        ...options,
      });

      if (name) names[calendar.id] = name;
      addCalendarEvents(events, allEvents);
    }),
  );

  return [allEvents, names] as const;
};

type GetCalendarEventsFromGoogleOptions = Omit<
  GetCalendarsEventsFromGoogleOptions,
  "calendars"
> & {
  /** The calendar settings */
  calendar: Calendar;
};

async function getCalendarEventsFromGoogle({
  apiKey,
  calendar,
  timeZone = "",
  start,
  end,
  onError,
}: GetCalendarEventsFromGoogleOptions) {
  const events: CalendarEventsMap = {};
  let name = calendar.name;
  const params = new URLSearchParams({
    calendarId: calendar.id,
    timeZone,
    singleEvents: "true",
    maxAttendees: "1",
    maxResults: "9999",
    sanitizeHtml: "true",
    timeMin: start.toISOString(),
    timeMax: end.toISOString(),
    key: apiKey || process.env["GOOGLE_CALENDAR_API_KEY"] || "",
  }).toString();
  const url = baseURL + calendar.id + "/events?" + params;

  try {
    const response = await fetch(url, { method: "GET" });
    const data = (await response.json()) as GoogleCalendar;
    if (data.error) throw data.error;
    name ||= data.summary;
    // the events get a copy of the calendar with its name
    calendar = { ...calendar, name };

    data.items.forEach((googleEvent) => {
      const event = transformCalendarEventFromGoogle(googleEvent, calendar);
      events[event.uid] = event;
    });
  } catch (e) {
    if (onError) onError(e);
  }

  return [events, name] as const;
}

/**
 * All day events have a `date` without time: a local date, which `new Date`
 * would read as UTC (the day before in the timezones west of UTC)
 */
let getDate = ({ date, dateTime }: GoogleDate) =>
  new Date(date ? date + "T00:00" : dateTime);

function transformCalendarEventFromGoogle(
  event: GoogleEvent,
  calendar: Calendar,
): CalendarEvent {
  const created = new Date(event.created);
  const link = event.htmlLink;
  const title = event.summary;
  const status = event.status;
  const start = getDate(event.start);
  let end = getDate(event.end);
  const color = calendar.color;
  const allDay = isUndefined(event.end.dateTime) && isString(event.end.date);
  const location = event.location || "";
  const description = event.description || ""; // FIXME: he.decode(event.description || '');
  const uid = created.getTime() + "" + start.getTime();

  // multi-days all day events has as end date the date after to what we actually
  // mean, hence we subtract one day. @see https://support.google.com/calendar/thread/10074544/google-calendar-all-day-events-are-showing-up-as-a-24-hr-event-across-time-zones?hl=en
  if (allDay && end > start) {
    end = subDays(end, 1);
    end.setHours(23, 59, 59);
  }
  const days = getDays();
  const daysMap = arrayToLookup(days);
  const multi = days.length > 1;

  function getDays() {
    const from = new Date(start);
    // count the calendar days, the end is exclusive: an event ending at
    // midnight does not take the day after
    const to = new Date(end.getTime() - 1);
    const days = [getEventTimestamp(from)];

    while (differenceInCalendarDays(to, from) > 0) {
      from.setDate(from.getDate() + 1);
      days.push(getEventTimestamp(from));
    }
    return days;
  }

  return {
    calendar,
    created,
    link,
    title,
    status,
    start,
    end,
    days,
    daysMap,
    multi,
    color,
    allDay,
    location,
    description,
    uid,
  };
}
