/**
 * First value is the `to`, second is `from`, from *which* chars do we translates *to*
 *
 * @category text
 */
export type AccentsSet = [string, string];

/**
 * Accent sets
 *
 * @category text
 * @resources
 * - https://gist.github.com/mathewbyrne/1280286#gistcomment-3498021
 * - https://gist.github.com/eek/9c4887e80b3ede05c0e39fee4dce3747 for usage
 * of [normalize](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize)
 */
export let accentsSets: AccentsSet[] = [
  ["a", "ÀÁÂÃÅÆĀĂĄẠẢẤẦẨẪẬẮẰẲẴẶ"],
  ["ae", "Ä"],
  ["c", "ÇĆĈČ"],
  ["d", "ÐĎĐÞ"],
  ["e", "ÈÉÊËĒĔĖĘĚẸẺẼẾỀỂỄỆ"],
  ["g", "ĜĞĢǴ"],
  ["h", "ĤḦ"],
  ["i", "ÌÍÎÏĨĪĮİỈỊ"],
  ["j", "Ĵ"],
  ["ij", "Ĳ"],
  ["k", "Ķ"],
  ["l", "ĹĻĽŁ"],
  ["m", "Ḿ"],
  ["n", "ÑŃŅŇ"],
  ["o", "ÒÓÔÕØŌŎŐỌỎỐỒỔỖỘỚỜỞỠỢǪǬƠ"],
  ["oe", "ŒÖ"],
  ["p", "ṕ"],
  ["r", "ŔŖŘ"],
  ["s", "ŚŜŞŠ"],
  ["ss", "ß"],
  ["t", "ŢŤ"],
  ["u", "ÙÚÛŨŪŬŮŰŲỤỦỨỪỬỮỰƯ"],
  ["ue", "Ü"],
  ["w", "ẂŴẀẄ"],
  ["x", "ẍ"],
  ["y", "ÝŶŸỲỴỶỸ"],
  ["z", "ŹŻŽ"],
];

export default accentsSets;
