import { differenceInDays } from "date-fns/differenceInDays";
import { subDays } from "date-fns/subDays";
import { arrayToLookup, isString, isUndefined } from "@koine/utils";
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
};

export let getCalendarsEventsFromGoogle = async ({
  calendars,
  ...options
}: GetCalendarsEventsFromGoogleOptions) => {
  const allEvents: CalendarEventsMap = {};

  await Promise.all(
    calendars.map(async (calendar) => {
      const events = await getCalendarEventsFromGoogle({
        calendar,
        ...options,
      });

      addCalendarEvents(events, allEvents);
    }),
  );

  return allEvents;
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
}: GetCalendarEventsFromGoogleOptions) {
  const events: CalendarEventsMap = {};
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
    calendar.name = calendar.name || data.summary;

    data.items.forEach((googleEvent) => {
      const event = transformCalendarEventFromGoogle(googleEvent, calendar);
      events[event.uid] = event;
    });
  } catch (_e) {
    // if (onError) onError(e);
  }

  return events;
}

function transformCalendarEventFromGoogle(
  event: GoogleEvent,
  calendar: Calendar,
): CalendarEvent {
  const created = new Date(event.created);
  const link = event.htmlLink;
  const title = event.summary;
  const status = event.status;
  const start = new Date(event.start.date || event.start.dateTime);
  let end = new Date(event.end.date || event.end.dateTime);
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
    const to = new Date(end);
    const days = [getEventTimestamp(from)];

    while (differenceInDays(to, from)) {
      // console.log(title, differenceInDays(to, from))
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
