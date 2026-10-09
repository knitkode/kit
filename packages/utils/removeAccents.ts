import type { AccentsSet } from "./accentsSets";
import { accentsSets } from "./accentsSets";

/**
 * @category text
 */
export let removeAccents = (text = "", sets: AccentsSet[] = accentsSets) => {
  let len = sets.length;
  while (len--) {
    const [to, from] = sets[len];
    text = text.replace(new RegExp(`[${from}]`, "gi"), (char) =>
      // uppercase letters give a capitalised replacement, `Ä` becomes `Ae`
      char === char.toLowerCase()
        ? to
        : to.charAt(0).toUpperCase() + to.slice(1),
    );
  }
  return text;
};

export default removeAccents;
