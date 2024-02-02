/**
 * Emit event (use only if the targeted browser supports `CustomEvent`s)
 */
export let emitEvent = (type = "customEvent", detail = {}) => {
  if (typeof window.CustomEvent !== "function") return;

  document.dispatchEvent(
    new CustomEvent(type, {
      bubbles: true,
      detail,
    }),
  );
};
