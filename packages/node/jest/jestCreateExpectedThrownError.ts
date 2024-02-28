import { log } from "console";

/**
 *
 * @see https://stackoverflow.com/a/41407246/1938970
 *
 * @usage
 * ```ts
 * const err = jestCreateExpectedThrownError("@org/pkg", "fnName");
 *
 * // @ts-expect-error test wrong implementation
 * err(() => fnName("wrong arguments implementation"));
 * ```
 */
export const jestCreateExpectedThrownError =
  (pkgName: string, fnName: string) =>
  (expectFn: () => ReturnType<jest.Expect>) => {
    try {
      expectFn().toThrow(new RegExp(`\\[${pkgName}\\]::${fnName}, .*`, "g"));
    } catch (e) {
      log(
        "\x1b[32m",
        "   ✓",
        "\x1b[0m",
        "throw",
        "\x1b[2m",
        (e as Error).message.replace(`[${pkgName}]::${fnName}, `, ""),
      );
    }
  };

export default jestCreateExpectedThrownError;
