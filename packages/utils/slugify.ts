import { accentsSets } from "./accentsSets";
import { removeAccents } from "./removeAccents";

/**
 * Slugify a text
 *
 * - replaces the accented letters
 * - replaces the punctuation with dashes
 *
 * @category text
 *
 * @borrows [mathewbyrne's gist](https://gist.github.com/mathewbyrne/1280286#gistcomment-3498021)
 */
export let slugify = (text: string, separator = "-") =>
  removeAccents(
    text.toString().toLowerCase().trim(),
    accentsSets.concat([["-", "[·/_,:;']"]]),
  )
    .replace(/\s+/g, "-") // replace spaces with -
    .replace(/&/g, "-and-") // replace & with 'and'
    .replace(/[^\w-]+/g, "") // remove all non-word chars
    .replace(/--+/g, "-") // replace multiple - with single -
    .replace(/^-+/, "") // trim - from start of text
    .replace(/-+$/, "") // trim - from end of text
    .replace(/-/g, separator);

export default slugify;
