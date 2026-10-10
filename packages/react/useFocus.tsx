import { useRef } from "react";

/**
 * @see https://stackoverflow.com/a/54159564/1938970
 *
 * @example
 * ```tsx
 * const [inputRef, focusInput] = useFocus();
 * const [selectRef, focusSelect] = useFocus<HTMLSelectElement>();
 * ```
 */
export let useFocus = <T extends HTMLElement = HTMLInputElement>() => {
  const elementRef = useRef<T>(null);
  const setFocus = () => {
    elementRef.current && elementRef.current.focus();
  };

  return [elementRef, setFocus] as const;
};

export default useFocus;
