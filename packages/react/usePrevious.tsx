import { useState } from "react";

/**
 * @borrows [samselikoff/animated-carousel](https://github.com/samselikoff/2022-06-02-animated-carousel/blob/main/pages/final.jsx)
 */
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
export let usePrevious = <T extends unknown>(state: T, defaulValue: T) => {
  const [tuple, setTuple] = useState([state, defaulValue]);
  if (tuple[1] !== state) {
    setTuple([tuple[1], state]);
  }

  return tuple[0];
};

export default usePrevious;
