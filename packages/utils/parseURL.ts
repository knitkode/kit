/**
 * Solution without DOM or specific env native methods
 *
 * @category location
 * @see https://stackoverflow.com/a/21553982/1938970
 */
export let parseURL = (url: string) => {
  const match = url.match(
    /^(https?:)\/\/(([^:/?#]*)(?::([0-9]+))?)([/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/,
  );
  return (
    match && {
      href: url,
      protocol: match[1],
      host: match[2],
      hostname: match[3],
      port: match[4],
      pathname: match[5],
      search: match[6],
      hash: match[7],
    }
  );
};
