import { useEffect, useRef, useState } from "react";

export type UseRevealOptions = {
  /**
   * @default "left"
   */
  direction?: "left" | "right";
  /**
   * A number that represents the offset to start the animations, giving `-1`
   * means that the animation will start when the scroll position is at
   * 100% higher than the given element. Giving `2` the animation will starts
   * when the scroll reached two times the height of the given element below
   * the top edge of the element itself
   *
   * @default -2
   */
  offsetStartY?: number;
  /**
   * When 0 it defaults to the same as the offsetStartY
   * @default 0
   */
  offsetEndY?: number;
  /**
   * A value from `0` to `1` representing a proportion of the element width
   * or "all" to make it completely out of the viewport
   * @default "all"
   * */
  offsetStartX?: number | "all";
};

export let useReveal = <T extends HTMLElement = HTMLDivElement>({
  direction = "left",
  offsetStartY = -2,
  offsetEndY = 0,
  offsetStartX = "all",
}: UseRevealOptions) => {
  const ref = useRef<T>(null);
  const [startY, setStartY] = useState(0);
  const [endY, setEndY] = useState(0);
  const [startX, setStartX] = useState(0);

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    const rect = ref.current.getBoundingClientRect();
    // scroll position from top of the window
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const elementHeight = rect.height;

    // rect.top is the distance from the currently visible viewport to the top
    // of the given element
    // so distanceTop is the distance between the top edge of the window and the
    // top edge of the given element
    const elementTop = rect.top;
    const distanceTop = elementTop + scrollTop;
    const offsetTop = offsetStartY ? elementHeight * offsetStartY : 0;
    const offsetBottom = offsetEndY ? elementHeight * offsetEndY : offsetTop;

    // the distance of the element from the top divided by the full height
    // of the window gives back the start position of the given element in
    // a scale from 0 to 1
    const startY = (distanceTop + offsetTop) / document.body.clientHeight;

    // same for the end, we just add the given element height to the first value
    const endY =
      (distanceTop + elementHeight + offsetBottom) / document.body.clientHeight;

    let startX;
    if (offsetStartX === "all") {
      startX = direction === "left" ? -rect.right : rect.left;
    } else {
      startX = rect.width * offsetStartX;
      startX = direction === "left" ? -startX : startX;
    }

    // addMarker(startY + "px");
    // addMarker(endY + "px");

    // console.log("start", startY, "end", endY, "startX", startX)

    setStartY(startY);
    setEndY(endY);
    setStartX(startX);

    // addMarker(startY * 100 + "%", "blue", "fixed");
    // addMarker(endY * 100 + "%", "blue", "fixed");
  }, [
    setStartY,
    setEndY,
    setStartX,
    offsetStartY,
    offsetEndY,
    offsetStartX,
    direction,
  ]);

  return { ref, startY, endY, startX };
};

// function addMarker(top: string, color = "red", position = "absolute") {
//   const div = document.createElement("div");
//   div.setAttribute(
//     "style",
//     `
//     position: ${position};
//     top: ${top};
//     left: 0;
//     right: 0;
//     height: 1px;
//     background: ${color};
//   `
//   );

//   document.body.appendChild(div);
// }

export default useReveal;
