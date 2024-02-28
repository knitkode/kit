import { listenUrlSearch } from "./listenUrlSearch";

/**
 * @category events
 * @category navigation
 * @category events
 */
export let listenUrlSearchParams = (
  paramName: string,
  handler: (paramNewValue: string | null) => void,
) =>
  listenUrlSearch((prevSearch, newSearch) => {
    const prevParams = new URLSearchParams(prevSearch);
    const newParams = new URLSearchParams(newSearch);
    const newValue = newParams.get(paramName);

    if (prevParams.get(paramName) !== newValue) {
      handler(newValue);
    }
  });

export default listenUrlSearchParams;
