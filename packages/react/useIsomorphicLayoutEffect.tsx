import { useEffect, useLayoutEffect } from "react";
import { isBrowser } from "@knitkode/utils";

/**
 * @borrows [streamich/react-use](https://github.com/streamich/react-use/blob/master/src/useIsomorphicLayoutEffect.ts)
 */

export let useIsomorphicLayoutEffect = isBrowser ? useLayoutEffect : useEffect;

export default useIsomorphicLayoutEffect;
