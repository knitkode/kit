import type { ScreamingSnakeCase } from "type-fest";

/**
 * Convert a string to environment variable name (`FOO_BAR`).
 *
 * @category text
 * @category case
 */
export let changeCaseEnvVarName = <T extends string>(input: T) =>
  input
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, "_")
    .toUpperCase() as ScreamingSnakeCase<T>;

export default changeCaseEnvVarName;
