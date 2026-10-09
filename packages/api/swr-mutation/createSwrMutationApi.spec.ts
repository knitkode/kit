import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { SWRConfig } from "swr";
import { createSwrMutationApi } from "./createSwrMutationApi";

// tells React to run effects synchronously inside `act()`
(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

type User = { id: number; name: string };

type Endpoints = {
  users: {
    GET: { ok: User[] };
    POST: { json: { name: string }; query: { notify: boolean }; ok: User };
  };
  "users/{id}": {
    GET: { ok: User };
    PUT: { json: User; ok: User };
    PATCH: { json: Partial<User>; ok: User };
    DELETE: { ok: null };
  };
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

  return result as { current: T };
};

describe("createSwrMutationApi", () => {
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

  it("creates an api client extended with the query and mutation hooks", () => {
    const api = createSwrMutationApi<Endpoints>("test", baseUrl, {
      fetchFn: mockFetch,
    });

    for (const method of [
      "get",
      "post",
      "put",
      "patch",
      "delete",
      "use",
      "usePost",
      "usePut",
      "usePatch",
      "useDelete",
    ]) {
      expect(api).toHaveProperty(method, expect.any(Function));
    }
  });

  it("`use` returns the response data of a GET request", async () => {
    const api = createSwrMutationApi<Endpoints>("test", baseUrl, {
      fetchFn: mockFetch,
    });

    const result = await renderHook(() => {
      // SWR re-renders only for the state it sees being read during the render
      const { data } = api.use("users/{id}", { params: { id: 1 } });
      return { data };
    });
    await act(() => new Promise<void>((resolve) => setTimeout(resolve, 0)));

    expect(result.current.data).toEqual({ id: 1, name: "Ada" });
    expect(mockFetch).toHaveBeenCalledWith(
      `${baseUrl}/users/1`,
      expect.objectContaining({ method: "GET" }),
    );
  });

  it("does not send the mutation until triggered", async () => {
    const api = createSwrMutationApi<Endpoints>("test", baseUrl, {
      fetchFn: mockFetch,
    });

    const result = await renderHook(() => api.usePost("users"));

    expect(mockFetch).not.toHaveBeenCalled();
    expect(result.current.isMutating).toBe(false);
  });

  it("`trigger` sends the request with the given options and returns its data", async () => {
    const api = createSwrMutationApi<Endpoints>("test", baseUrl, {
      fetchFn: mockFetch,
    });
    const result = await renderHook(() => api.usePost("users"));

    let data: unknown;
    await act(async () => {
      data = await result.current.trigger({ json: { name: "Ada" } });
    });

    expect(data).toEqual({ id: 1, name: "Ada" });
    expect(result.current.data).toEqual({ id: 1, name: "Ada" });
    expect(mockFetch).toHaveBeenCalledWith(`${baseUrl}/users`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: '{"name":"Ada"}',
      signal: expect.any(AbortSignal),
    });
  });

  it("`trigger` merges its options over the hook ones", async () => {
    const api = createSwrMutationApi<Endpoints>("test", baseUrl, {
      fetchFn: mockFetch,
    });
    const result = await renderHook(() =>
      api.usePost("users", {
        query: { notify: true },
        json: { name: "default" },
      }),
    );

    await act(async () => {
      await result.current.trigger({ json: { name: "Ada" } });
    });

    expect(mockFetch).toHaveBeenCalledWith(
      `${baseUrl}/users?notify=true`,
      expect.objectContaining({ method: "POST", body: '{"name":"Ada"}' }),
    );
  });

  it.each([
    ["usePut", "PUT"],
    ["usePatch", "PATCH"],
    ["useDelete", "DELETE"],
  ] as const)("`%s` sends a %s request", async (hookName, httpMethod) => {
    const api = createSwrMutationApi<Endpoints>("test", baseUrl, {
      fetchFn: mockFetch,
    });
    const result = await renderHook(() =>
      api[hookName]("users/{id}", { params: { id: 7 } }),
    );

    await act(async () => {
      await result.current.trigger({});
    });

    expect(mockFetch).toHaveBeenCalledWith(
      `${baseUrl}/users/7`,
      expect.objectContaining({ method: httpMethod }),
    );
  });

  it("`trigger` uses the hook options when called without arguments", async () => {
    const api = createSwrMutationApi<Endpoints>("test", baseUrl, {
      fetchFn: mockFetch,
    });
    const result = await renderHook(() =>
      api.useDelete("users/{id}", { params: { id: 3 } }),
    );

    await act(async () => {
      // @ts-expect-error the typed `trigger` requires an argument, at runtime it is optional
      await result.current.trigger();
    });

    expect(mockFetch).toHaveBeenCalledWith(`${baseUrl}/users/3`, {
      method: "DELETE",
      headers: { "content-type": "application/json" },
      signal: expect.any(AbortSignal),
    });
  });

  it("`trigger` rejects with the failed result", async () => {
    const failed = { fail: true, data: { reason: "invalid" }, status: 422 };
    mockFetch.mockResolvedValue(jsonResponse(failed));
    const api = createSwrMutationApi<Endpoints>("test", baseUrl, {
      fetchFn: mockFetch,
    });
    const result = await renderHook(() => api.usePost("users"));

    let error: unknown;
    await act(async () => {
      error = await result.current
        .trigger({ json: { name: "" } })
        .catch((e: unknown) => e);
    });

    expect(error).toEqual(failed);
    expect(result.current.error).toEqual(failed);
  });

  it("passes the SWR mutation config to the hook", async () => {
    const onSuccess = vi.fn();
    const api = createSwrMutationApi<Endpoints>("test", baseUrl, {
      fetchFn: mockFetch,
    });
    const result = await renderHook(() =>
      api.usePost("users", undefined, { onSuccess }),
    );

    await act(async () => {
      await result.current.trigger({ json: { name: "Ada" } });
    });

    expect(onSuccess).toHaveBeenCalledWith(
      { id: 1, name: "Ada" },
      "users",
      expect.anything(),
    );
  });
});
