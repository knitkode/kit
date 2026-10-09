import { storageClient } from "./storageClient";

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
  return (await import("./storageClient")).storageClient;
};

describe("storageClient", () => {
  afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    vi.doUnmock("@knitkode/utils");
  });

  describe("get", () => {
    it("returns null when the key is not stored", () => {
      expect(storageClient().get("missing")).toBeNull();
    });

    it("returns the default value when the key is not stored", () => {
      expect(storageClient().get("missing", undefined, "fallback")).toBe(
        "fallback",
      );
    });

    it("returns JSON parsed values", () => {
      localStorage.setItem("object", '{"a":1,"b":[1,2]}');
      localStorage.setItem("number", "42");
      localStorage.setItem("boolean", "true");

      const client = storageClient();

      expect(client.get("object")).toEqual({ a: 1, b: [1, 2] });
      expect(client.get("number")).toBe(42);
      expect(client.get("boolean")).toBe(true);
    });

    it("returns values that are not valid JSON as they are", () => {
      localStorage.setItem("plain", "hello world");

      expect(storageClient().get("plain")).toBe("hello world");
    });

    it("transforms the stored value before parsing it", () => {
      localStorage.setItem("reversed", '}1:"a"{');
      const reverse = vi.fn((value: string) =>
        value.split("").reverse().join(""),
      );

      expect(storageClient().get("reversed", reverse)).toEqual({ a: 1 });
      expect(reverse).toHaveBeenCalledWith('}1:"a"{');
    });

    it("does not call the transform when the key is not stored", () => {
      const transform = vi.fn((value: string) => value);

      storageClient().get("missing", transform);

      expect(transform).not.toHaveBeenCalled();
    });

    it("reads from `sessionStorage` when `useSessionStorage` is true", () => {
      localStorage.setItem("key", "local");
      sessionStorage.setItem("key", "session");

      expect(storageClient(true).get("key")).toBe("session");
      expect(storageClient(false).get("key")).toBe("local");
    });
  });

  describe("set", () => {
    it("stores strings as they are", () => {
      storageClient().set("key", "hello");

      expect(localStorage.getItem("key")).toBe("hello");
    });

    it("stores non string values stringified with JSON.stringify", () => {
      const client = storageClient();

      client.set("object", { a: 1 });
      client.set("array", [1, "2"]);
      client.set("number", 7);
      client.set("boolean", true);

      expect(localStorage.getItem("object")).toBe('{"a":1}');
      expect(localStorage.getItem("array")).toBe('[1,"2"]');
      expect(localStorage.getItem("number")).toBe("7");
      expect(localStorage.getItem("boolean")).toBe("true");
    });

    it("transforms the (stringified) value before storing it", () => {
      const client = storageClient();

      client.set("string", "abc", (value: string) => value.toUpperCase());
      client.set("object", { a: "b" }, (value: string) => `<${value}>`);

      expect(localStorage.getItem("string")).toBe("ABC");
      expect(localStorage.getItem("object")).toBe('<{"a":"b"}>');
    });

    it("round trips values with `get`", () => {
      const client = storageClient();
      const user = { id: 3, name: "Ada", roles: ["admin"] };

      client.set("user", user);

      expect(client.get("user")).toEqual(user);
    });

    it("writes to `sessionStorage` when `useSessionStorage` is true", () => {
      storageClient(true).set("key", "value");

      expect(sessionStorage.getItem("key")).toBe("value");
      expect(localStorage.getItem("key")).toBeNull();
    });

    it("swallows errors thrown by the storage", () => {
      vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
        throw new Error("QuotaExceededError");
      });
      const consoleWarn = vi
        .spyOn(console, "warn")
        .mockImplementation(() => {});

      expect(() => storageClient().set("key", "value")).not.toThrow();
      expect(consoleWarn).not.toHaveBeenCalled();
    });

    it("warns about storage errors in development", () => {
      vi.stubEnv("NODE_ENV", "development");
      const error = new Error("QuotaExceededError");
      vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
        throw error;
      });
      const consoleWarn = vi
        .spyOn(console, "warn")
        .mockImplementation(() => {});

      storageClient().set("key", "value");

      expect(consoleWarn).toHaveBeenCalledWith(expect.any(String), error);
    });
  });

  describe("remove", () => {
    it("removes the stored value", () => {
      localStorage.setItem("key", "value");
      localStorage.setItem("other", "value");

      storageClient().remove("key");

      expect(localStorage.getItem("key")).toBeNull();
      expect(localStorage.getItem("other")).toBe("value");
    });

    it("removes from `sessionStorage` when `useSessionStorage` is true", () => {
      localStorage.setItem("key", "local");
      sessionStorage.setItem("key", "session");

      storageClient(true).remove("key");

      expect(sessionStorage.getItem("key")).toBeNull();
      expect(localStorage.getItem("key")).toBe("local");
    });

    it("swallows errors thrown by the storage", () => {
      vi.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {
        throw new Error("SecurityError");
      });
      const consoleWarn = vi
        .spyOn(console, "warn")
        .mockImplementation(() => {});

      expect(() => storageClient().remove("key")).not.toThrow();
      expect(consoleWarn).not.toHaveBeenCalled();
    });

    it("warns about storage errors in development", () => {
      vi.stubEnv("NODE_ENV", "development");
      const error = new Error("SecurityError");
      vi.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {
        throw error;
      });
      const consoleWarn = vi
        .spyOn(console, "warn")
        .mockImplementation(() => {});

      storageClient().remove("key");

      expect(consoleWarn).toHaveBeenCalledWith(expect.any(String), error);
    });
  });

  describe("has", () => {
    it("is truthy when the key is stored", () => {
      localStorage.setItem("key", "value");

      expect(storageClient().has("key")).toBeTruthy();
    });

    it("is false when the key is not stored", () => {
      expect(storageClient().has("missing")).toBe(false);
    });

    it("checks `sessionStorage` when `useSessionStorage` is true", () => {
      sessionStorage.setItem("key", "value");

      expect(storageClient(true).has("key")).toBeTruthy();
      expect(storageClient().has("key")).toBe(false);
    });
  });

  it("does not log in the browser in development", () => {
    vi.stubEnv("NODE_ENV", "development");
    const consoleLog = vi.spyOn(console, "log").mockImplementation(() => {});
    const client = storageClient();

    client.set("key", "value");
    expect(client.get("key")).toBe("value");
    expect(client.has("key")).toBeTruthy();
    client.remove("key");

    expect(localStorage.getItem("key")).toBeNull();
    expect(consoleLog).not.toHaveBeenCalled();
  });

  describe("outside of the browser", () => {
    it("`get` returns the default value or null", async () => {
      const serverStorageClient = await importOnServer();
      localStorage.setItem("key", "value");
      const client = serverStorageClient();

      expect(client.get("key")).toBeNull();
      expect(client.get("key", undefined, "fallback")).toBe("fallback");
    });

    it("`set` and `remove` do not touch the storage", async () => {
      const serverStorageClient = await importOnServer();
      localStorage.setItem("existing", "value");
      const client = serverStorageClient();

      client.set("key", "value");
      client.remove("existing");

      expect(localStorage.getItem("key")).toBeNull();
      expect(localStorage.getItem("existing")).toBe("value");
    });

    it("`has` returns the default value or false", async () => {
      const serverStorageClient = await importOnServer();
      localStorage.setItem("key", "value");
      const client = serverStorageClient();

      expect(client.has("key")).toBe(false);
      expect(client.has("key", "fallback")).toBe("fallback");
    });

    it("logs every call in development", async () => {
      vi.stubEnv("NODE_ENV", "development");
      const serverStorageClient = await importOnServer();
      const consoleLog = vi.spyOn(console, "log").mockImplementation(() => {});
      const client = serverStorageClient();

      client.get("key", undefined, "fallback");
      client.set("key", "value");
      client.remove("key");
      client.has("key");

      expect(consoleLog).toHaveBeenCalledTimes(4);
      expect(consoleLog.mock.calls[0]?.[0]).toContain('"fallback"');
    });

    it("does not log outside of development", async () => {
      const serverStorageClient = await importOnServer();
      const consoleLog = vi.spyOn(console, "log").mockImplementation(() => {});
      const client = serverStorageClient();

      client.get("key");
      client.set("key", "value");
      client.remove("key");
      client.has("key");

      expect(consoleLog).not.toHaveBeenCalled();
    });
  });

  describe("falsy values", () => {
    it.each([
      ["zero", 0],
      ["false", false],
      ["an empty string", ""],
      ["null", null],
    ])("returns a stored %s", (_label, value) => {
      const client = storageClient();
      client.set("key", value);

      expect(client.get("key", undefined, "default")).toBe(value);
    });
  });
});
