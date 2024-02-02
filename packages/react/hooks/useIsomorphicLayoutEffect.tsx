import { useEffect, useLayoutEffect } from "react";
import { isBrowser } from "@koine/utils";

/**
 * @borrows [streamich/react-use](https://github.com/streamich/react-use/blob/master/src/useIsomorphicLayoutEffect.ts)
 */

export let useIsomorphicLayoutEffect = isBrowser ? useLayoutEffect : useEffect;
