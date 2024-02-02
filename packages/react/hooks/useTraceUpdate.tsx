import { useEffect, useRef } from "react";

/**
 * @see https://stackoverflow.com/a/51082563/9122820
 */
export let useTraceUpdate = (props: any) => {
  const prev = useRef(props);
  useEffect(() => {
    const changedProps = Object.entries(props).reduce((ps, [k, v]) => {
      if (prev.current[k] !== v) {
        // @ts-expect-error Does not matter here...
        ps[k] = [prev.current[k], v];
      }
      return ps;
    }, {});
    if (Object.keys(changedProps).length > 0) {
      console.info(
        "[@koine/react:useTraceUpdate] changed props:",
        changedProps,
      );
    }
    prev.current = props;
  });
};
