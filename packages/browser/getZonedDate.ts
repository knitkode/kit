import { toZonedTime } from "date-fns-tz/toZonedTime";
import { isBrowser } from "@koine/utils";

/**
 * It returns a `Date` object from a date `string` adjusted on the user timeZone,
 * if a timeZone is not provided we try getting it from the `Intl` browwser native
 * API. It gracefully falls back returning a _non-timezone-based_ `Date`.
 *
 * @category date
 *
 * @resources
 * - to get the timeZone client side see [this article](https://attacomsian.com/blog/javascript-current-timezone)
 * - for converting the date based on the time zone [date-fns docs](https://date-fns.org/v2.27.0/docs/Time-Zones) and [date-fns-tz docs](https://github.com/marnusw/date-fns-tz)
 *
 * @param dateString A parseable date as string, `Z` is automatically suffixed if not present to correctly get time zone based time from a UTC date.
 * @param timeZone Optionally pass a timeZone (e.g. from user preference or from the server), it falls back trying to read it from the `Intl` browwser native API.
 */
export let getZonedDate = (dateString = "", timeZone?: string) => {
  if (!dateString.endsWith("Z")) dateString += "Z";

  if (!timeZone && isBrowser) {
    try {
      timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch (e) {
      if (process.env["NODE_ENV"] === "development") {
        console.warn(
          "[@koine/browser:getZonedDate] failed reading timeZone, error",
          e,
        );
      }
      // no need to do anything here, it just means `Intl` failed, probably
      // because the browser does not support it
    }
  }

  return timeZone
    ? toZonedTime(new Date(dateString), timeZone)
    : new Date(dateString);
};

export default getZonedDate;
