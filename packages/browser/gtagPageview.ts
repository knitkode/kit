import { gtag } from "./gtag";

export type GtmPageviewArgs = [
  page_path?: string,
  page_title?: string,
  page_location?: string,
  // send_to?: string
];

/**
 * @category analytics-google
 */
export let gtagPageview = (...args: GtmPageviewArgs) =>
  gtag("event", "page_view", {
    page_path: args[0] || location.pathname,
    page_title: args[1] || document.title,
    page_location: args[2] || location.href,
    // send_to: '<GA_MEASUREMENT_ID>'
  });

// export type GtmEventArgs = [
//   eventCategory?: string,
//   eventAction?: string,
//   eventLabel?: string,
//   eventValue?: string
// ];

// export const event = (...args: GtmEventArgs) => {
//   if (!isUndefined(window) && !isUndefined(window.gtag)) {
//     window.gtag("send", "event", ...args);
//   }
// };
