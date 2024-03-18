import type { AccentsSet } from "./accentsSets";
import { accentsSets } from "./accentsSets";

/**
 * @category text
 */
export let removeAccents = (text = "", sets: AccentsSet[] = accentsSets) => {
  let len = sets.length;
  while (len--) {
    const [to, from] = sets[len];
    text = text.replace(new RegExp(`[${from}]`, "gi"), to);
  }
  return text;
};

export default removeAccents;
