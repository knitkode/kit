import { useRef } from "react";

/**
 * @see https://stackoverflow.com/a/54159564/1938970
 */
export let useFocus = () => {
  const elementRef = useRef<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  >(null);
  const setFocus = () => {
    elementRef.current && elementRef.current.focus();
  };

  return [elementRef, setFocus];
};

export default useFocus;
