import { isUndefined, noop } from "@koine/utils";

/**
 * @category analytics-google
 *
 * If you like you could add to your globals `.d.ts` types:
 *
 * ```ts
 * declare interface Window {
 *   gtag: <T extends unknown[]>(...args: T) => void;
 * }
 * ```
 */
export let gtag = <T extends unknown[]>(...args: T) => {
  // @ts-expect-error nevermind
  !isUndefined(window) && !isUndefined(window.gtag)
    ? // @ts-expect-error nevermind
      window.gtag(...args)
    : noop();
};

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

// declare interface Window {
//   gtag: (...args: Record<string, unknown>[]) => Record<string, unknown>;
// }

export default gtag;
