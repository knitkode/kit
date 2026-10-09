import { encode } from "@knitkode/utils";
import { createStorage } from "./createStorage";

type Config = {
  token: string;
  user: { id: number; name: string };
  count: number;
};

const config: Config = { token: "", user: { id: 0, name: "" }, count: 0 };

/**
 * Re-import the module with `@knitkode/utils` reporting a server environment,
 * `isBrowser` is evaluated once when `@knitkode/utils` is loaded.
 */
const importOnServer = async () => {
  vi.resetModules();
  vi.doMock("@knitkode/utils", async (importOriginal) => ({
    ...(await importOriginal<typeof import("@knitkode/utils")>()),
    isBrowser: false,
    isServer: true,
  }));
  return (await import("./createStorage")).createStorage;
};

const dispatchStorageEvent = (init: StorageEventInit) => {
  window.dispatchEvent(new StorageEvent("storage", init));
};

describe("createStorage", () => {
  afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    vi.doUnmock("@knitkode/utils");
  });

  describe("set / get", () => {
    it("stores both keys and values encoded", () => {
      const storage = createStorage<Config>(config);

      storage.set("token", "abc");

      // "token" and "abc" char codes, three digits each
      expect(localStorage.getItem("116111107101110")).toBe("097098099");
      expect(localStorage.getItem("token")).toBeNull();
    });

    it("round trips strings, numbers and objects", () => {
      const storage = createStorage<Config>(config);
      const user = { id: 1, name: "Ada Lovelace" };

      storage.set("token", "secret-token");
      storage.set("user", user);
      storage.set("count", 3);

      expect(storage.get("token")).toBe("secret-token");
      expect(storage.get("user")).toEqual(user);
      expect(storage.get("count")).toBe(3);
    });

    it("returns null or the given default value for missing keys", () => {
      const storage = createStorage<Config>(config);

      expect(storage.get("token")).toBeNull();
      expect(storage.get("token", "fallback")).toBe("fallback");
    });

    it("uses `sessionStorage` when `useSessionStorage` is true", () => {
      const storage = createStorage<Config>(config, true);

      storage.set("token", "abc");

      expect(sessionStorage.getItem(encode("token"))).toBe(encode("abc"));
      expect(localStorage.length).toBe(0);
      expect(storage.get("token")).toBe("abc");
    });

    it("keeps separate values for local and session storages", () => {
      const local = createStorage<Config>(config);
      const session = createStorage<Config>(config, true);

      local.set("token", "local");
      session.set("token", "session");

      expect(local.get("token")).toBe("local");
      expect(session.get("token")).toBe("session");
    });
  });

  describe("getAll", () => {
    it("returns the stored values and the defaults of the missing ones", () => {
      const storage = createStorage<Config>(config);
      storage.set("token", "abc");

      expect(storage.getAll({ count: 5 })).toEqual({ token: "abc", count: 5 });
    });

    it("prefers stored values over the defaults", () => {
      const storage = createStorage<Config>(config);
      storage.set("count", 2);

      expect(storage.getAll({ count: 5 })).toEqual({ count: 2 });
    });

    it("omits missing values without default", () => {
      const storage = createStorage<Config>(config);

      expect(storage.getAll()).toEqual({});
    });
  });

  describe("setMany", () => {
    it("sets all the given values", () => {
      const storage = createStorage<Config>(config);
      const user = { id: 2, name: "Grace" };

      storage.setMany({ token: "abc", user });

      expect(storage.get("token")).toBe("abc");
      expect(storage.get("user")).toEqual(user);
    });

    it("removes the null and undefined values", () => {
      const storage = createStorage<Config>(config);
      storage.setMany({ token: "abc", count: 1 });

      storage.setMany({
        // @ts-expect-error null removes the value from the storage at runtime
        token: null,
        count: undefined,
      });

      expect(storage.has("token")).toBe(false);
      expect(storage.has("count")).toBe(false);
      expect(localStorage.length).toBe(0);
    });
  });

  describe("has", () => {
    it("is truthy only for stored keys", () => {
      const storage = createStorage<Config>(config);
      storage.set("token", "abc");

      expect(storage.has("token")).toBeTruthy();
      expect(storage.has("user")).toBe(false);
    });
  });

  describe("remove", () => {
    it("removes a single value", () => {
      const storage = createStorage<Config>(config);
      storage.setMany({ token: "abc", count: 1 });

      storage.remove("token");

      expect(storage.get("token")).toBeNull();
      expect(storage.get("count")).toBe(1);
    });
  });

  describe("clear", () => {
    it("removes all the configured keys and nothing else", () => {
      const storage = createStorage<Config>(config);
      storage.setMany({ token: "abc", count: 1, user: { id: 1, name: "A" } });
      localStorage.setItem("unrelated", "value");

      storage.clear();

      expect(storage.getAll()).toEqual({});
      expect(localStorage.getItem("unrelated")).toBe("value");
      expect(localStorage.length).toBe(1);
    });
  });

  describe("watch", () => {
    it("calls `onAdded` when the watched key gets a value", () => {
      const storage = createStorage<Config>(config);
      const onRemoved = vi.fn();
      const onAdded = vi.fn();
      const unwatch = storage.watch("token", onRemoved, onAdded);

      dispatchStorageEvent({
        key: encode("token"),
        oldValue: null,
        newValue: encode("abc"),
      });

      expect(onAdded).toHaveBeenCalledTimes(1);
      expect(onRemoved).not.toHaveBeenCalled();
      unwatch();
    });

    it("calls `onRemoved` when the watched key loses its value", () => {
      const storage = createStorage<Config>(config);
      const onRemoved = vi.fn();
      const onAdded = vi.fn();
      const unwatch = storage.watch("token", onRemoved, onAdded);

      dispatchStorageEvent({
        key: encode("token"),
        oldValue: encode("abc"),
        newValue: null,
      });

      expect(onRemoved).toHaveBeenCalledTimes(1);
      expect(onAdded).not.toHaveBeenCalled();
      unwatch();
    });

    it("ignores value updates and other keys", () => {
      const storage = createStorage<Config>(config);
      const onRemoved = vi.fn();
      const onAdded = vi.fn();
      const unwatch = storage.watch("token", onRemoved, onAdded);

      dispatchStorageEvent({
        key: encode("token"),
        oldValue: encode("abc"),
        newValue: encode("def"),
      });
      dispatchStorageEvent({
        key: encode("count"),
        oldValue: null,
        newValue: encode("1"),
      });
      dispatchStorageEvent({ key: "token", oldValue: null, newValue: "abc" });

      expect(onRemoved).not.toHaveBeenCalled();
      expect(onAdded).not.toHaveBeenCalled();
      unwatch();
    });

    it("works without callbacks", () => {
      const storage = createStorage<Config>(config);
      const unwatch = storage.watch("token");

      expect(() => {
        dispatchStorageEvent({
          key: encode("token"),
          oldValue: null,
          newValue: "x",
        });
        dispatchStorageEvent({
          key: encode("token"),
          oldValue: "x",
          newValue: null,
        });
      }).not.toThrow();
      unwatch();
    });

    it("returns a function that stops watching", () => {
      const storage = createStorage<Config>(config);
      const onAdded = vi.fn();
      const unwatch = storage.watch("token", undefined, onAdded);

      unwatch();
      dispatchStorageEvent({
        key: encode("token"),
        oldValue: null,
        newValue: encode("abc"),
      });

      expect(onAdded).not.toHaveBeenCalled();
    });
  });

  it("does not log in the browser in development", () => {
    vi.stubEnv("NODE_ENV", "development");
    const consoleLog = vi.spyOn(console, "log").mockImplementation(() => {});
    const storage = createStorage<Config>(config);

    storage.setMany({ token: "abc" });
    expect(storage.getAll()).toEqual({ token: "abc" });
    storage.clear();
    storage.watch("token")();

    expect(localStorage.length).toBe(0);
    expect(consoleLog).not.toHaveBeenCalled();
  });

  describe("outside of the browser", () => {
    it("`get` returns the default value", async () => {
      const serverCreateStorage = await importOnServer();
      localStorage.setItem(encode("token"), encode("abc"));
      const storage = serverCreateStorage<Config>(config);

      expect(storage.get("token")).toBeNull();
      expect(storage.get("token", "fallback")).toBe("fallback");
    });

    it("`getAll` returns an empty object", async () => {
      const serverCreateStorage = await importOnServer();
      localStorage.setItem(encode("token"), encode("abc"));
      const storage = serverCreateStorage<Config>(config);

      expect(storage.getAll({ count: 1 })).toEqual({});
    });

    it("`setMany` and `clear` do not touch the storage", async () => {
      const serverCreateStorage = await importOnServer();
      localStorage.setItem(encode("count"), encode("1"));
      const storage = serverCreateStorage<Config>(config);

      storage.setMany({ token: "abc" });
      storage.clear();

      expect(localStorage.getItem(encode("token"))).toBeNull();
      expect(localStorage.getItem(encode("count"))).toBe(encode("1"));
    });

    it("`watch` returns a no-op without listening", async () => {
      const serverCreateStorage = await importOnServer();
      const addEventListener = vi.spyOn(window, "addEventListener");
      const storage = serverCreateStorage<Config>(config);

      const unwatch = storage.watch("token", vi.fn(), vi.fn());

      expect(unwatch).toBeTypeOf("function");
      expect(() => unwatch()).not.toThrow();
      expect(addEventListener).not.toHaveBeenCalled();
    });

    it("logs the unsupported calls in development", async () => {
      vi.stubEnv("NODE_ENV", "development");
      const serverCreateStorage = await importOnServer();
      const consoleLog = vi.spyOn(console, "log").mockImplementation(() => {});
      const storage = serverCreateStorage<Config>(config);

      storage.getAll();
      storage.setMany({ token: "abc" });
      storage.clear();
      storage.watch("token");

      const messages = consoleLog.mock.calls.map(([msg]) => String(msg));
      expect(messages).toEqual([
        expect.stringContaining("'getAll'"),
        expect.stringContaining("'setMany'"),
        expect.stringContaining("'clear'"),
        expect.stringContaining("'watch'"),
      ]);
    });

    it("does not log outside of development", async () => {
      const serverCreateStorage = await importOnServer();
      const consoleLog = vi.spyOn(console, "log").mockImplementation(() => {});
      const storage = serverCreateStorage<Config>(config);

      storage.getAll();
      storage.setMany({ token: "abc" });
      storage.clear();
      storage.watch("token");

      expect(consoleLog).not.toHaveBeenCalled();
    });
  });

  describe("falsy values", () => {
    it("returns stored falsy values", () => {
      const storage = createStorage<Config>(config);
      storage.set("count", 0);

      expect(storage.get("count")).toBe(0);
      expect(storage.getAll()).toEqual({ count: 0 });
    });

    it("applies falsy defaults to the missing values", () => {
      const storage = createStorage<Config>(config);

      expect(storage.getAll({ count: 0, token: "" })).toEqual({
        count: 0,
        token: "",
      });
    });
  });
});
