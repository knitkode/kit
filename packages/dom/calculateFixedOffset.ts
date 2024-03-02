import { domEach } from "./domEach";

export let calculateFixedOffset = (selector = "[data-fixed]") => {
  let fixedOffset = 0;

  domEach(selector, ($el) => {
    fixedOffset += $el.offsetHeight;
  });

  return fixedOffset;
};

export default calculateFixedOffset;
