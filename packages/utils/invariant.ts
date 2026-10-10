/**
 * FIXME: invariant calls do not get tree shaked in minified output of projects
 * using it. Let's not use it internally and not export it from `@knitkode/utils`
 * until we find a tree-shakeable way of doing this. For now just wrapping
 * the logging code into `if (process.env["NODE_ENV"] === "development") {}`
 * works better despite it is more verbose.
 *
 * @resources
 * - https://github.com/alexreardon/tiny-invariant
 * - https://github.com/zertosh/invariant
 * - https://stackoverflow.com/q/39055159/1938970
 *
 * @param condition The condition that, if falsy, will throw the error during development
 * @param message A string or a function that returns a string, `"Invariant failed"` by default
 * @param lib The library name to show in the error message prefix. When `prefix` is also specified it outputs `[lib:prefix]: the message`, otherwise just `[lib]: the message`
 * @param prefix The prefix (e.g. the function name) to show in the error message prefix. When `lib` is also specified it outputs `[lib:prefix]: the message`, otherwise just `[prefix]: the message`
 */
export let invariant: (
  condition: any,
  message?: string | (() => string),
  lib?: string,
  prefix?: string,
) => asserts condition = (condition, message, lib, prefix) => {
  if (process.env["NODE_ENV"] === "development") {
    if (condition) {
      return;
    }

    const msgPrefix = [lib, prefix].filter(Boolean).join(":");

    throw new Error(
      (msgPrefix ? `[${msgPrefix}]: ` : "") +
        ((typeof message === "function" ? message() : message) ||
          "Invariant failed"),
    );
  }
};

export default invariant;
