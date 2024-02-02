import { useRef } from "react";

/**
 * @borrows [streamich/react-use](https://github.com/streamich/react-use/blob/master/src/useFirstMountState.ts)
 */
export let useFirstMountState = () => {
  const isFirst = useRef(true);

  if (isFirst.current) {
    isFirst.current = false;

    return true;
  }

  return isFirst.current;
};
