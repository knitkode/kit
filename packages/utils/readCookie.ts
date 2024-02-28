let converterRead = (value: string) => {
  if (value[0] === '"') {
    value = value.slice(1, -1);
  }
  return value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
};

/**
 * Read cookie
 *
 * @category cookie
 */
export function readCookie<
  T extends Record<string, unknown> = Record<string, string>,
>(name?: null): T;
export function readCookie<
  T extends Record<string, unknown> = Record<string, string>,
  N extends keyof T = keyof T,
>(name: N): T[N];
export function readCookie<
  T extends Record<string, unknown> = Record<string, string>,
  N extends string = string,
>(name?: N | null): T[N] | T {
  if (typeof document === "undefined") {
    if (process.env["NODE_ENV"] === "development") {
      console.warn("[@koine/utils:readCookie] document is undefined");
    }
    return name ? ("" as T[N]) : ({} as T);
  }

  const cookies = document.cookie ? document.cookie.split("; ") : [];
  const all = {} as T;

  for (let i = 0; i < cookies.length; i++) {
    const parts = cookies[i].split("=");
    const value = parts.slice(1).join("=");

    try {
      const found = decodeURIComponent(parts[0]) as keyof T;
      all[found] = converterRead(value) as T[keyof T];

      if (name === found) {
        break;
      }
    } catch (e) {
      if (process.env["NODE_ENV"] === "development") {
        console.warn("[@koine/utils:readCookie] failed to decode", value);
      }
    }
  }

  return name ? all[name] : all;
}

export default readCookie;
