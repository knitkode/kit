import {
  decode,
  encode,
  isBrowser,
  isNullOrUndefined,
  noop,
} from "@koine/utils";
import { on } from "@koine/dom";
import { storage } from "./storage";

/**
 * @category storage
 */
export type CreateStorageConfig = Record<string, any>;

/**
 * Utility to create a storage instance to interact with `localStorage` using
 * encrypted (encoded) key/values.
 *
 * @category storage
 */
export let createStorage = <T extends CreateStorageConfig>(
  config: Partial<T>,
  useSessionStorage?: boolean,
) => {
  const client = useSessionStorage ? storage.s : storage.l;

  const keys = Object.keys(config).reduce(
    (map, key) => ({ ...map, [key]: encode(key) }),
    {} as Record<keyof T, string>,
  );

  return {
    /**
     * Get all storage value (it uses `localStorage.get()`).
     *
     * Unparseable values with `JSON.parse()` return their value as it is.
     * On ssr or if the given `key` argument is not found `defaultValue` is
     * returned, otherwise `null`.
     */
    get<TKey extends Extract<keyof T, string>>(
      key: TKey,
      defaultValue?: null | T[TKey],
    ): T[TKey] | null {
      return client.get<T[TKey]>(keys[key] as T[TKey], decode, defaultValue);
    },
    /**
     * Get all storage values (it uses `localStorage.get()`).
     *
     * `undefined` and `null` values are not returned.
     */
    getAll(defaultValues?: Partial<T>): T {
      if (!isBrowser) {
        if (process.env["NODE_ENV"] === "development") {
          console.log(
            `[@koine/utils:createStorage] attempt to use 'getAll' outside of browser.`,
          );
        }
        return {} as T;
      }
      const all = {} as T;
      for (const key in keys) {
        const value = this.get<Extract<keyof T, string>>(key);
        const defaultValue = defaultValues?.[key];

        if (!isNullOrUndefined(value)) {
          all[key] = value;
        } else if (defaultValue) {
          // NOTE: without the assertion typedoc does not compile
          all[key] = defaultValue as T[Extract<keyof T, string>];
        }
      }
      return all;
    },
    /**
     * Set a storage value (it uses `localStorage.set()`).
     *
     * Non-string values are stringified with `JSON.stringify()`
     */
    set<TKey extends Extract<keyof T, string>>(key: TKey, value?: T[TKey]) {
      client.set(keys[key], value, encode);
    },
    /**
     * Set all given storage values (it uses `localStorage.set()`).
     *
     * Non-string values are stringified with `JSON.stringify()`, `undefined`
     * and `null` values are removed from the storage
     */
    setMany(newValues: Partial<T>) {
      if (process.env["NODE_ENV"] === "development") {
        if (!isBrowser) {
          console.log(
            `[@koine/utils:createStorage] attempt to use 'setMany' outside of browser.`,
          );
        }
      }
      if (isBrowser) {
        for (const key in newValues) {
          const value = newValues[key];
          if (!isNullOrUndefined(value)) {
            this.set(key, value);
          } else {
            this.remove(key);
          }
        }
      }
    },
    /**
     * Check if a storage value is _truthy_ (it uses `localStorage.get()`).
     */
    has<TKey extends Extract<keyof T, string>>(key: TKey) {
      return client.has(keys[key]);
    },
    /**
     * Remove a storage value (it uses `localStorage.remove()`).
     */
    remove<TKey extends Extract<keyof T, string>>(key: TKey) {
      client.remove(keys[key]);
    },
    /**
     * Clear all storage values (it uses `localStorage.remove()`).
     */
    clear() {
      if (process.env["NODE_ENV"] === "development") {
        if (!isBrowser) {
          console.log(
            `[@koine/utils:createStorage] attempt to use 'clear' outside of browser.`,
          );
        }
      }

      if (isBrowser) {
        for (const key in keys) {
          client.remove(keys[key]);
        }
      }
    },
    /**
     * Watch a storage value changes, this needs to be executed only in browser
     * context (it uses `window.addEventListener("storage")`).
     *
     * Inspiration from [Multi Tab Logout in React — Redux](https://medium.com/front-end-weekly/multi-tab-logout-in-react-redux-4715f071c7fa)
     */
    watch: <TKey extends keyof T>(
      keyToWatch: TKey,
      onRemoved?: () => void,
      onAdded?: () => void,
    ) => {
      if (!isBrowser) {
        if (process.env["NODE_ENV"] === "development") {
          console.log(
            `[@koine/utils:createStorage] attempt to use 'watch' outside of browser.`,
          );
        }
        return noop;
      }

      const handler = (event: StorageEvent) => {
        const { key, oldValue, newValue } = event;
        if (key === keys[keyToWatch]) {
          if (oldValue && !newValue) {
            onRemoved?.();
          } else if (!oldValue && newValue) {
            onAdded?.();
          }
        }
      };

      const listener = on(window, "storage", handler);
      return listener;
    },
  };
};

export default createStorage;
