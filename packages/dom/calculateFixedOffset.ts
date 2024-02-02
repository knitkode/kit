import { $each } from "./$each";

export let calculateFixedOffset = (selector = "[data-fixed]") => {
  let fixedOffset = 0;

  $each(selector, ($el) => {
    fixedOffset += $el.offsetHeight;
  });

  return fixedOffset;
};
