import { useEffect, useRef } from "react";

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
export let usePreviousRef = <T extends unknown>(value: T) => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};
