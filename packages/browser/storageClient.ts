import { isBrowser, isString } from "@koine/utils";

/**
 * @category storage
 */
export type StorageClientConfig = Record<string, any>;

const methodsMap = { g: "getItem", s: "setItem", r: "removeItem" };

/**
 * Super minifiable `local/session Storage` client creator with SSR safety
 *
 * @category storage
 */
export let storageClient = <
  TConfig extends StorageClientConfig = StorageClientConfig,
>(
  useSessionStorage?: boolean,
) => {
  const nativeMethod = <T extends "g" | "s" | "r">(
    method: T,
    key: string,
    value?: T extends "s" ? string : undefined,
  ) =>
    isBrowser
      ? window[useSessionStorage ? "sessionStorage" : "localStorage"][
          methodsMap[method]
        ](key, value)
      : () => {
          if (process.env["NODE_ENV"] === "development") {
            console.warn(
              `[@koine/utils:storageClient]: ${
                useSessionStorage ? "sessionStorage" : "localStorage"
              } does not exists outside of browser.`,
            );
          }
        };

  const get = <
    TKey extends Extract<keyof TConfig, string>,
    TValue = TConfig[TKey],
  >(
    key: TKey,
    transform?: (value: string) => TValue,
    defaultValue?: null | TValue,
  ) => {
    let value = defaultValue ?? null;

    if (process.env["NODE_ENV"] === "development") {
      if (!isBrowser) {
        console.log(
          `[@koine/utils:storage] called 'get' outside of browser with default value '${JSON.stringify(
            defaultValue,
          )}'.`,
        );
      }
    }

    if (isBrowser) {
      let stored = nativeMethod("g", key);

      if (stored) {
        stored = transform ? transform(stored) : stored;
        try {
          const parsed = JSON.parse(stored);
          if (parsed) value = parsed;
        } catch (_e) {
          value = stored;

          // if (process.env["NODE_ENV"] === "development") {
          //   console.warn(
          //     `[@koine/utils:storage]: 'get' failed to parse stored value as JSON. Plain '${stored}' value is returned.`
          //   );
          // }
        }
      }
    }
    return value;
  };

  const set = <
    TKey extends Extract<keyof TConfig, string>,
    TValue = TConfig[TKey],
  >(
    key: TKey,
    value?: TValue,
    transform: (value: any) => string = (value) => value,
  ) => {
    if (process.env["NODE_ENV"] === "development") {
      if (!isBrowser) {
        console.log(
          `[@koine/utils:storage] called 'set' outside of browser does not work.`,
        );
      }
    }

    if (isBrowser) {
      try {
        const transformedValue = isString(value)
          ? transform(value)
          : transform(JSON.stringify(value));

        nativeMethod("s", key, transformedValue);
      } catch (_e) {
        if (process.env["NODE_ENV"] === "development") {
          console.warn(`[@koine/utils:createStorage]: 'set' error.`, _e);
        }
      }
    }
  };

  const remove = <TKey extends Extract<keyof TConfig, string>>(key: TKey) => {
    if (process.env["NODE_ENV"] === "development") {
      if (!isBrowser) {
        console.log(
          `[@koine/utils:storage] called 'remove' outside of browser does not work.`,
        );
      }
    }

    if (isBrowser) {
      try {
        nativeMethod("r", key);
      } catch (_e) {
        if (process.env["NODE_ENV"] === "development") {
          console.warn(`[@koine/utils:createStorage]: 'remove' error.`, _e);
        }
      }
    }
  };

  const has = <
    TKey extends Extract<keyof TConfig, string>,
    TValue = TConfig[TKey],
  >(
    key: TKey,
    defaultValue?: TValue,
  ) => {
    let value = defaultValue ?? false;

    if (process.env["NODE_ENV"] === "development") {
      if (!isBrowser) {
        console.log(
          `[@koine/utils:storage] called 'has' outside of browser with default value '${JSON.stringify(
            defaultValue,
          )}'.`,
        );
      }
    }

    if (isBrowser) {
      const stored = nativeMethod("g", key);

      value = stored ?? false;
    }
    return value;
  };

  return {
    get,
    set,
    remove,
    has,
  };
};
