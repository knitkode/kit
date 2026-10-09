import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { SWRConfig } from "swr";
import { createSwrApi } from "./createSwrApi";

// tells React to run effects synchronously inside `act()`
(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

type Endpoints = {
  users: { GET: { query: { page: number }; ok: { id: number }[] } };
  "users/{id}": { GET: { ok: { id: number; name: string } } };
};

const baseUrl = "https://api.example.com";

/**
 * Minimal `Response` mock, `createApi` only reads its JSON body
 */
const jsonResponse = (body: unknown) => ({ json: () => Promise.resolve(body) });

const roots: Root[] = [];

/**
 * Render a hook within an isolated SWR cache and keep its last returned value
 */
const renderHook = async <T>(useHook: () => T) => {
  const result: { current?: T } = {};
  const Probe = () => {
    result.current = useHook();
    return null;
  };
  const root = createRoot(document.createElement("div"));
  roots.push(root);

  await act(async () => {
    root.render(
      createElement(
        SWRConfig,
        {
          value: {
            provider: () => new Map(),
            dedupingInterval: 0,
            shouldRetryOnError: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
          },
        },
        createElement(Probe),
      ),
    );
  });

  return result;
};

/**
 * SWR re-renders only for the state it sees being read during the render
 */
const readState = <TData, TError>(swr: {
  data?: TData;
  error?: TError;
  isLoading: boolean;
}) => ({ data: swr.data, error: swr.error, isLoading: swr.isLoading });

/**
 * Let the mocked requests settle and flush the resulting React updates
 */
const waitForAssertion = async (assertion: () => void) => {
  for (let i = 0; ; i++) {
    await act(() => new Promise<void>((resolve) => setTimeout(resolve, 0)));
    try {
      assertion();
      return;
    } catch (error) {
      if (i >= 20) throw error;
    }
  }
};

describe("createSwrApi", () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    mockFetch.mockReset();
    mockFetch.mockResolvedValue(
      jsonResponse({ ok: true, data: { id: 1, name: "Ada" }, status: 200 }),
    );
  });

  afterEach(async () => {
    for (const root of roots.splice(0)) await act(() => root.unmount());
  });

  it("creates an api client extended with the `use` hook", () => {
    const api = createSwrApi<Endpoints>("test", baseUrl, {
      fetchFn: mockFetch,
    });

    for (const method of ["get", "post", "put", "patch", "delete", "use"]) {
      expect(api).toHaveProperty(method, expect.any(Function));
    }
  });

  it("keeps the api client methods working", async () => {
    const api = createSwrApi<Endpoints>("test", baseUrl, {
      fetchFn: mockFetch,
    });

    expect(await api.get("users/{id}", { params: { id: 1 } })).toEqual({
      ok: true,
      data: { id: 1, name: "Ada" },
      status: 200,
    });
  });

  it("`use` returns the response data of a GET request", async () => {
    const api = createSwrApi<Endpoints>("test", baseUrl, {
      fetchFn: mockFetch,
    });

    const result = await renderHook(() =>
      readState(api.use("users/{id}", { params: { id: 1 } })),
    );

    await waitForAssertion(() => {
      expect(result.current?.data).toEqual({ id: 1, name: "Ada" });
    });
    expect(result.current?.error).toBeUndefined();
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      `${baseUrl}/users/1`,
      expect.objectContaining({ method: "GET" }),
    );
  });

  it("`use` fetches endpoints without options", async () => {
    mockFetch.mockResolvedValue(
      jsonResponse({ ok: true, data: [{ id: 1 }], status: 200 }),
    );
    const api = createSwrApi<Endpoints>("test", baseUrl, {
      fetchFn: mockFetch,
    });

    const result = await renderHook(() => readState(api.use("users")));

    await waitForAssertion(() => {
      expect(result.current?.data).toEqual([{ id: 1 }]);
    });
    expect(mockFetch).toHaveBeenCalledWith(
      `${baseUrl}/users`,
      expect.anything(),
    );
  });

  it("`use` passes the options to the request", async () => {
    const api = createSwrApi<Endpoints>("test", baseUrl, {
      fetchFn: mockFetch,
    });

    await renderHook(() =>
      readState(
        api.use("users", {
          query: { page: 2 },
          headers: { authorization: "token" },
        }),
      ),
    );

    await waitForAssertion(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        `${baseUrl}/users?page=2`,
        expect.objectContaining({
          headers: expect.objectContaining({ authorization: "token" }),
        }),
      );
    });
  });

  it("`use` returns the failed result as error", async () => {
    const failed = { fail: true, data: { reason: "missing" }, status: 404 };
    mockFetch.mockResolvedValue(jsonResponse(failed));
    const api = createSwrApi<Endpoints>("test", baseUrl, {
      fetchFn: mockFetch,
    });

    const result = await renderHook(() =>
      readState(api.use("users/{id}", { params: { id: 2 } })),
    );

    await waitForAssertion(() => {
      expect(result.current?.error).toEqual(failed);
    });
    expect(result.current?.data).toBeUndefined();
  });

  it.each([
    ["false", false],
    ["a function returning false", () => false],
  ])("`use` does not fetch when `when` is %s", async (_name, when) => {
    const api = createSwrApi<Endpoints>("test", baseUrl, {
      fetchFn: mockFetch,
    });

    const result = await renderHook(() =>
      readState(api.use("users/{id}", { params: { id: 1 } }, { when })),
    );
    await waitForAssertion(() => {
      expect(result.current?.isLoading).toBe(false);
    });

    expect(mockFetch).not.toHaveBeenCalled();
    expect(result.current?.data).toBeUndefined();
  });

  it.each([
    ["true", true],
    ["a function returning true", () => true],
  ])("`use` fetches when `when` is %s", async (_name, when) => {
    const api = createSwrApi<Endpoints>("test", baseUrl, {
      fetchFn: mockFetch,
    });

    const result = await renderHook(() =>
      readState(api.use("users/{id}", { params: { id: 1 } }, { when })),
    );

    await waitForAssertion(() => {
      expect(result.current?.data).toEqual({ id: 1, name: "Ada" });
    });
  });

  it("`use` merges the default SWR config with the hook one", async () => {
    const api = createSwrApi<Endpoints>(
      "test",
      baseUrl,
      { fetchFn: mockFetch },
      { when: false, fallbackData: { id: 0, name: "fallback" } },
    );

    const disabled = await renderHook(() =>
      readState(api.use("users/{id}", { params: { id: 1 } })),
    );
    await waitForAssertion(() => {
      expect(disabled.current?.data).toEqual({ id: 0, name: "fallback" });
    });
    expect(mockFetch).not.toHaveBeenCalled();

    const enabled = await renderHook(() =>
      readState(api.use("users/{id}", { params: { id: 1 } }, { when: true })),
    );
    await waitForAssertion(() => {
      expect(enabled.current?.data).toEqual({ id: 1, name: "Ada" });
    });
  });
});
