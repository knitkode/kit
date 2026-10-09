import { vitestSetNodeEnv } from "@knitkode/test/vitest";
import { createApi } from "./createApi";
import type { Api } from "./types";

// the processors are generic, the mocks below only need to match at runtime
type Processors = Required<Api.ClientOptions>;

/**
 * Minimal `Response` mock, `createApi` only reads its JSON body
 */
const jsonResponse = (body: unknown) => ({ json: () => Promise.resolve(body) });

const okResult = <T>(data: T) => ({ ok: true, data, msg: "OK", status: 200 });

const failResult = <T>(data: T) => ({
  fail: true,
  data,
  msg: "Not Found",
  status: 404,
});

describe("createApi", () => {
  const apiName = "testApi";
  const baseUrl = "https://api.example.com";
  const mockFetch = vitest.fn();

  beforeEach(() => {
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  test("creates API client with all methods", () => {
    const api = createApi(apiName, baseUrl, { fetchFn: mockFetch });
    expect(api).toHaveProperty("get");
    expect(api).toHaveProperty("post");
    expect(api).toHaveProperty("put");
    expect(api).toHaveProperty("patch");
    expect(api).toHaveProperty("delete");
  });

  test("sends request with correct method and URL", async () => {
    mockFetch.mockResolvedValue({ json: () => ({ data: "ok" }) });
    const api = createApi(apiName, baseUrl, { fetchFn: mockFetch });
    await api.get("test-endpoint");
    expect(mockFetch).toHaveBeenCalledWith(
      `${baseUrl}/test-endpoint`,
      expect.objectContaining({ method: "GET" }),
    );
  });

  test.each([
    ["post", "POST"],
    ["put", "PUT"],
    ["patch", "PATCH"],
    ["delete", "DELETE"],
  ] as const)("`%s` sends a %s request", async (method, httpMethod) => {
    mockFetch.mockResolvedValue(jsonResponse(okResult(null)));
    const api = createApi(apiName, baseUrl, { fetchFn: mockFetch });

    // every method shares the same implementation and signature
    await (api[method] as typeof api.post)("test-endpoint");

    expect(mockFetch).toHaveBeenCalledWith(
      `${baseUrl}/test-endpoint`,
      expect.objectContaining({ method: httpMethod }),
    );
  });

  test("works with a relative base URL", async () => {
    mockFetch.mockResolvedValue(jsonResponse(okResult(null)));
    const api = createApi(apiName, "/api", { fetchFn: mockFetch });

    await api.get("users");

    expect(mockFetch).toHaveBeenCalledWith("/api/users", expect.anything());
  });

  test("uses the global `fetch` by default", async () => {
    const globalFetch = vi.fn().mockResolvedValue(jsonResponse(okResult(1)));
    vi.stubGlobal("fetch", globalFetch);
    const api = createApi(apiName, baseUrl);

    const result = await api.get("test-endpoint");

    expect(globalFetch).toHaveBeenCalledWith(
      `${baseUrl}/test-endpoint`,
      expect.objectContaining({ method: "GET" }),
    );
    expect(result).toEqual(okResult(1));
  });

  test("uses the request level `fetchFn` over the client one", async () => {
    const requestFetch = vi.fn().mockResolvedValue(jsonResponse(okResult(1)));
    const api = createApi(apiName, baseUrl, { fetchFn: mockFetch });

    await api.get("test-endpoint", { fetchFn: requestFetch });

    expect(requestFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  test("returns the parsed JSON response", async () => {
    const result = okResult({ id: 1, name: "Ada" });
    mockFetch.mockResolvedValue(jsonResponse(result));
    const api = createApi(apiName, baseUrl, { fetchFn: mockFetch });

    expect(await api.get("users/1")).toEqual(result);
  });

  test("returns failed results from the server as they are", async () => {
    const result = failResult({ reason: "missing" });
    mockFetch.mockResolvedValue(jsonResponse(result));
    const api = createApi(apiName, baseUrl, { fetchFn: mockFetch });

    expect(await api.get("users/1")).toEqual(result);
  });

  test("sends JSON content type header by default", async () => {
    const api = createApi(apiName, baseUrl, { fetchFn: mockFetch });

    await api.get("test-endpoint");

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: { "content-type": "application/json" },
      }),
    );
  });

  test("adds headers and options from default and request-specific options", async () => {
    const headers = { Authorization: "Bearer test-token" };
    const api = createApi(apiName, baseUrl, { fetchFn: mockFetch, headers });
    await api.get("test-endpoint", {
      headers: { "X-Custom-Header": "custom" },
    });
    expect(mockFetch).toHaveBeenCalledWith(
      `${baseUrl}/test-endpoint`,
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer test-token",
          "X-Custom-Header": "custom",
        }),
      }),
    );
  });

  test("passes the `request` options to `fetch`", async () => {
    const api = createApi(apiName, baseUrl, {
      fetchFn: mockFetch,
      request: { credentials: "include", cache: "no-store" },
    });

    await api.get("test-endpoint");
    await api.get("test-endpoint", { request: { credentials: "omit" } });

    expect(mockFetch.mock.calls[0]?.[1]).toMatchObject({
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });
    expect(mockFetch.mock.calls[1]?.[1]).toMatchObject({
      method: "GET",
      credentials: "omit",
    });
    expect(mockFetch.mock.calls[1]?.[1]).not.toHaveProperty("cache");
  });

  test("attaches query params correctly", async () => {
    const api = createApi<{
      "test-endpoint": { GET: { query: { search: string; page: number } } };
    }>(apiName, baseUrl, { fetchFn: mockFetch });
    const query = { search: "test", page: 2 };
    await api.get("test-endpoint", { query });
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("?search=test&page=2"),
      expect.anything(),
    );
  });

  test("encodes query params and skips the nullish ones", async () => {
    const api = createApi<{
      search: {
        GET: { query: { q: string; tags: string[]; page?: number | null } };
      };
    }>(apiName, baseUrl, { fetchFn: mockFetch });

    await api.get("search", {
      query: { q: "a b&c", tags: ["x", "y"], page: null },
    });

    expect(mockFetch).toHaveBeenCalledWith(
      `${baseUrl}/search?q=a%20b%26c&tags=x&tags=y`,
      expect.anything(),
    );
  });

  test("interpolates the endpoint URL params", async () => {
    const api = createApi<{
      "users/{userId}/posts/{postId}": { GET: { ok: { title: string } } };
    }>(apiName, baseUrl, { fetchFn: mockFetch });

    await api.get("users/{userId}/posts/{postId}", {
      params: { userId: 12, postId: "abc" },
    });

    expect(mockFetch).toHaveBeenCalledWith(
      `${baseUrl}/users/12/posts/abc`,
      expect.anything(),
    );
  });

  test("interpolates the URL params before appending the query", async () => {
    const api = createApi<{
      "users/{id}": { GET: { query: { fields: string } } };
    }>(apiName, baseUrl, { fetchFn: mockFetch });

    await api.get("users/{id}", { params: { id: 1 }, query: { fields: "id" } });

    expect(mockFetch).toHaveBeenCalledWith(
      `${baseUrl}/users/1?fields=id`,
      expect.anything(),
    );
  });

  test("sends JSON body with non-GET requests", async () => {
    const api = createApi<{
      "test-endpoint": { POST: { json: { key: string } } };
    }>(apiName, baseUrl, { fetchFn: mockFetch });
    const json = { key: "value" };
    await api.post("test-endpoint", { json });
    expect(mockFetch).toHaveBeenCalledWith(
      `${baseUrl}/test-endpoint`,
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify(json),
      }),
    );
  });

  test("does not send a body without `json`", async () => {
    const api = createApi(apiName, baseUrl, { fetchFn: mockFetch });

    await api.post("test-endpoint");

    expect(mockFetch.mock.calls[0]?.[1]).not.toHaveProperty("body");
  });

  test("applies request processor if provided", async () => {
    const processReq = vitest.fn(() => ["modified-url", {}, {}, {}, {}]);
    const api = createApi(apiName, baseUrl, {
      fetchFn: mockFetch,
      processReq: processReq as unknown as Processors["processReq"],
    });
    await api.get("test-endpoint");
    expect(processReq).toHaveBeenCalled();
    expect(mockFetch).toHaveBeenCalledWith("modified-url", expect.any(Object));
  });

  test("passes the request data to the request processor", async () => {
    const processReq = vi.fn<Processors["processReq"]>(
      (_method, url, query, json, params, requestInit) => [
        url,
        query,
        json,
        params,
        requestInit,
      ],
    );
    const api = createApi<{
      "items/{id}": { PUT: { query: { a: number }; json: { b: number } } };
    }>(apiName, baseUrl, { fetchFn: mockFetch, processReq });

    await api.put("items/{id}", {
      params: { id: "1" },
      query: { a: 1 },
      json: { b: 2 },
    });

    expect(processReq).toHaveBeenCalledWith(
      "put",
      `${baseUrl}/items/{id}`,
      { a: 1 },
      { b: 2 },
      { id: "1" },
      expect.objectContaining({ method: "PUT" }),
    );
    expect(mockFetch).toHaveBeenCalledWith(
      `${baseUrl}/items/1?a=1`,
      expect.objectContaining({ body: '{"b":2}' }),
    );
  });

  test("uses the query, json, params and request init returned by the request processor", async () => {
    const processReq: Processors["processReq"] = (_method, url) => [
      `${url}/{id}`,
      { page: 3 },
      { processed: true },
      { id: "99" },
      { method: "PATCH", headers: { "x-processed": "1" } },
    ];
    const api = createApi<{
      items: { POST: { json: { original: boolean } } };
    }>(apiName, baseUrl, { fetchFn: mockFetch, processReq });

    await api.post("items", { json: { original: true } });

    expect(mockFetch).toHaveBeenCalledWith(`${baseUrl}/items/99?page=3`, {
      method: "PATCH",
      headers: { "x-processed": "1" },
      body: '{"processed":true}',
      signal: expect.any(AbortSignal),
    });
  });

  test("applies the request level processor after the client level one", async () => {
    const calls: string[] = [];
    const processReqBase: Processors["processReq"] = (
      _method,
      url,
      query,
      json,
      params,
      requestInit,
    ) => {
      calls.push(`client:${url}`);
      return [`${url}/client`, query, json, params, requestInit];
    };
    const api = createApi(apiName, baseUrl, {
      fetchFn: mockFetch,
      processReq: processReqBase,
    });

    await api.get("test-endpoint", {
      processReq: (_method, url, query, json, params, requestInit) => {
        calls.push(`request:${url}`);
        return [`${url}/request`, query, json, params, requestInit];
      },
    });

    expect(calls).toEqual([
      `client:${baseUrl}/test-endpoint`,
      `request:${baseUrl}/test-endpoint/client`,
    ]);
    expect(mockFetch).toHaveBeenCalledWith(
      `${baseUrl}/test-endpoint/client/request`,
      expect.anything(),
    );
  });

  test("applies response processor if provided", async () => {
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve({ value: "ok" }),
    });
    const processRes = vitest.fn(async (response: Response) => {
      const data = await response.json();
      return { ok: true, data };
    });
    const api = createApi(apiName, baseUrl, {
      fetchFn: mockFetch,
      processRes: processRes as unknown as Processors["processRes"],
    });
    const result = await api.get("test-endpoint");
    expect(processRes).toHaveBeenCalled();
    expect(result).toEqual({ ok: true, data: { value: "ok" } });
  });

  test("passes the response and the request options to the response processor", async () => {
    const response = jsonResponse({ value: "ok" });
    mockFetch.mockResolvedValue(response);
    const processRes = vi.fn(async () => okResult("processed"));
    const api = createApi<{
      "test-endpoint": { GET: { query: { a: number } } };
    }>(apiName, baseUrl, {
      fetchFn: mockFetch,
      processRes: processRes as unknown as Processors["processRes"],
    });
    const options = { query: { a: 1 } };

    await api.get("test-endpoint", options);
    await api.get("test-endpoint");

    expect(processRes).toHaveBeenNthCalledWith(1, response, options);
    expect(processRes).toHaveBeenNthCalledWith(2, response, {});
  });

  test("uses the request level response processor over the client one", async () => {
    mockFetch.mockResolvedValue(jsonResponse({ value: "ok" }));
    const processResBase = vi.fn(async () => okResult("client"));
    const processRes = vi.fn(async () => okResult("request"));
    const api = createApi(apiName, baseUrl, {
      fetchFn: mockFetch,
      processRes: processResBase as unknown as Processors["processRes"],
    });

    const result = await api.get("test-endpoint", {
      processRes: processRes as unknown as Processors["processRes"],
    });

    expect(result).toEqual(okResult("request"));
    expect(processResBase).not.toHaveBeenCalled();
  });

  test("handles errors with processErr if provided", async () => {
    const errorMessage = "Network error";
    const processErr = vitest.fn(() =>
      Promise.resolve({ ok: false, data: null, fail: true, msg: errorMessage }),
    );
    const api = createApi(apiName, baseUrl, {
      fetchFn: mockFetch,
      processErr: processErr as unknown as Processors["processErr"],
    });
    mockFetch.mockRejectedValue(new Error(errorMessage));
    const result = await api.get("test-endpoint");
    expect(processErr).toHaveBeenCalled();
    expect(result).toEqual({
      ok: false,
      data: null,
      fail: true,
      msg: errorMessage,
    });
  });

  test("passes the error message and the request options to the error processor", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));
    const processErr = vi.fn(async () => failResult(null));
    const api = createApi<{
      "test-endpoint": { GET: { query: { a: number } } };
    }>(apiName, baseUrl, { fetchFn: mockFetch });
    const options = {
      query: { a: 1 },
      processErr: processErr as unknown as Processors["processErr"],
    };

    await api.get("test-endpoint", options);

    expect(processErr).toHaveBeenCalledWith("Network error", options);
  });

  test("does not call the error processor on successful responses", async () => {
    mockFetch.mockResolvedValue(jsonResponse(okResult(1)));
    const processErr = vi.fn();
    const api = createApi(apiName, baseUrl, {
      fetchFn: mockFetch,
      processErr: processErr as unknown as Processors["processErr"],
    });

    await api.get("test-endpoint");

    expect(processErr).not.toHaveBeenCalled();
  });

  test("returns a normalised failed result on network errors", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));
    const api = createApi(apiName, baseUrl, { fetchFn: mockFetch });

    expect(await api.get("test-endpoint")).toEqual({
      data: null,
      msg: "Network error",
      status: 100,
      fail: true,
      ok: false,
    });
  });

  test("uses thrown strings as failed result message", async () => {
    mockFetch.mockRejectedValue("Offline");
    const api = createApi(apiName, baseUrl, { fetchFn: mockFetch });

    expect(await api.get("test-endpoint")).toMatchObject({
      msg: "Offline",
      status: 100,
      fail: true,
    });
  });

  test("returns a normalised failed result when the response is not JSON", async () => {
    mockFetch.mockResolvedValue({
      json: () => Promise.reject(new SyntaxError("Unexpected token <")),
    });
    const api = createApi(apiName, baseUrl, { fetchFn: mockFetch });

    expect(await api.get("test-endpoint")).toEqual({
      data: null,
      msg: "Unexpected token <",
      status: 100,
      fail: true,
      ok: false,
    });
  });

  test("returns a normalised failed result when the response processor throws", async () => {
    mockFetch.mockResolvedValue(jsonResponse(okResult(1)));
    const api = createApi(apiName, baseUrl, {
      fetchFn: mockFetch,
      processRes: (async () => {
        throw new Error("Invalid shape");
      }) as Processors["processRes"],
    });

    expect(await api.get("test-endpoint")).toMatchObject({
      msg: "Invalid shape",
      status: 100,
      fail: true,
    });
  });

  describe("throwErr", () => {
    test("throws the normalised failed result on network errors", async () => {
      mockFetch.mockRejectedValue(new Error("Test error"));
      const api = createApi(apiName, baseUrl, {
        fetchFn: mockFetch,
        throwErr: true,
      });

      await expect(api.get("test-endpoint")).rejects.toEqual({
        data: null,
        fail: true,
        msg: "Test error",
        ok: false,
        status: 100,
      });
    });

    test("throws failed results returned by the server", async () => {
      const result = failResult({ reason: "missing" });
      mockFetch.mockResolvedValue(jsonResponse(result));
      const api = createApi(apiName, baseUrl, {
        fetchFn: mockFetch,
        throwErr: true,
      });

      await expect(api.get("test-endpoint")).rejects.toEqual(result);
    });

    test("returns ok results", async () => {
      mockFetch.mockResolvedValue(jsonResponse(okResult(1)));
      const api = createApi(apiName, baseUrl, {
        fetchFn: mockFetch,
        throwErr: true,
      });

      expect(await api.get("test-endpoint")).toEqual(okResult(1));
    });

    test("can be enabled and disabled at the request level", async () => {
      mockFetch.mockRejectedValue(new Error("Test error"));
      const api = createApi(apiName, baseUrl, { fetchFn: mockFetch });
      const throwingApi = createApi(apiName, baseUrl, {
        fetchFn: mockFetch,
        throwErr: true,
      });

      await expect(
        api.get("test-endpoint", { throwErr: true }),
      ).rejects.toMatchObject({ fail: true });
      await expect(
        throwingApi.get("test-endpoint", { throwErr: false }),
      ).resolves.toMatchObject({ fail: true });
    });
  });

  describe("timeout", () => {
    /**
     * A `fetch` that never settles unless its request is aborted
     */
    const hangingFetch = (_url: string, init?: RequestInit) =>
      new Promise((_resolve, reject) => {
        init?.signal?.addEventListener("abort", () =>
          reject(new Error("The operation was aborted")),
        );
      });

    test("aborts the request after 10 seconds by default", async () => {
      vi.useFakeTimers();
      mockFetch.mockImplementation(hangingFetch);
      const api = createApi(apiName, baseUrl, { fetchFn: mockFetch });

      const promise = api.get("test-endpoint");
      await vi.advanceTimersByTimeAsync(9999);
      expect(mockFetch.mock.calls[0]?.[1].signal.aborted).toBe(false);
      await vi.advanceTimersByTimeAsync(1);

      expect(await promise).toEqual({
        data: null,
        msg: "The operation was aborted",
        status: 100,
        fail: true,
        ok: false,
      });
    });

    test("uses the client and request level timeouts", async () => {
      vi.useFakeTimers();
      mockFetch.mockImplementation(hangingFetch);
      const api = createApi(apiName, baseUrl, {
        fetchFn: mockFetch,
        timeout: 500,
      });

      const clientPromise = api.get("test-endpoint");
      const requestPromise = api.get("test-endpoint", { timeout: 2000 });
      await vi.advanceTimersByTimeAsync(500);

      expect(await clientPromise).toMatchObject({ fail: true, status: 100 });
      expect(mockFetch.mock.calls[1]?.[1].signal.aborted).toBe(false);

      await vi.advanceTimersByTimeAsync(1500);
      expect(await requestPromise).toMatchObject({ fail: true, status: 100 });
    });

    test("clears the timeout when the response arrives", async () => {
      vi.useFakeTimers();
      mockFetch.mockResolvedValue(jsonResponse(okResult(1)));
      const api = createApi(apiName, baseUrl, { fetchFn: mockFetch });

      await api.get("test-endpoint");

      expect(vi.getTimerCount()).toBe(0);
      expect(mockFetch.mock.calls[0]?.[1].signal.aborted).toBe(false);
    });

    test.each([false, null, 0] as const)(
      "does not abort the request when it is `%s`",
      async (timeout) => {
        vi.useFakeTimers();
        mockFetch.mockResolvedValue(jsonResponse(okResult(1)));
        const api = createApi(apiName, baseUrl, {
          fetchFn: mockFetch,
          timeout,
        });

        await api.get("test-endpoint");

        expect(mockFetch.mock.calls[0]?.[1]).not.toHaveProperty("signal");
        expect(vi.getTimerCount()).toBe(0);
      },
    );
  });

  describe("development mode", () => {
    vitestSetNodeEnv("development");

    test("logs request and response in development mode", async () => {
      const consoleInfo = vi
        .spyOn(console, "info")
        .mockImplementation(() => {});
      const api = createApi(apiName, baseUrl, { fetchFn: mockFetch, log: 1 });
      mockFetch.mockResolvedValue({
        json: () => ({ data: "ok" }),
        status: 200,
        statusText: "OK",
      });
      await api.get("test-endpoint");
      expect(consoleInfo).toHaveBeenCalled();
    });

    test("logs ok results with a green dot", async () => {
      const consoleInfo = vi
        .spyOn(console, "info")
        .mockImplementation(() => {});
      mockFetch.mockResolvedValue(jsonResponse(okResult(1)));
      const api = createApi(apiName, baseUrl, { fetchFn: mockFetch, log: 1 });

      await api.get("test-endpoint");

      expect(consoleInfo).toHaveBeenCalledWith(
        `🟢 200: api[${apiName}] GET ${baseUrl}/test-endpoint`,
      );
    });

    test("logs failed results with a red dot", async () => {
      const consoleInfo = vi
        .spyOn(console, "info")
        .mockImplementation(() => {});
      mockFetch.mockRejectedValue(new Error("Network error"));
      const api = createApi(apiName, baseUrl, { fetchFn: mockFetch });

      await api.post("test-endpoint", { log: 1 });

      expect(consoleInfo).toHaveBeenCalledWith(
        `🔴 100: api[${apiName}] POST ${baseUrl}/test-endpoint`,
      );
    });

    test("does not log with the default log level", async () => {
      const consoleInfo = vi
        .spyOn(console, "info")
        .mockImplementation(() => {});
      mockFetch.mockResolvedValue(jsonResponse(okResult(1)));
      const api = createApi(apiName, baseUrl, { fetchFn: mockFetch });

      await api.get("test-endpoint");

      expect(consoleInfo).not.toHaveBeenCalled();
    });
  });

  test("does not log outside of development mode", async () => {
    const consoleInfo = vi.spyOn(console, "info").mockImplementation(() => {});
    mockFetch.mockResolvedValue(jsonResponse(okResult(1)));
    const api = createApi(apiName, baseUrl, { fetchFn: mockFetch, log: 1 });

    await api.get("test-endpoint");

    expect(consoleInfo).not.toHaveBeenCalled();
  });

  test("joins the base URL and the endpoint with a single slash", async () => {
    mockFetch.mockResolvedValue({ json: () => ({}) });
    const api = createApi(apiName, `${baseUrl}/`, { fetchFn: mockFetch });

    await api.get("/users");
    await api.get("users");

    expect(mockFetch).toHaveBeenNthCalledWith(
      1,
      `${baseUrl}/users`,
      expect.anything(),
    );
    expect(mockFetch).toHaveBeenNthCalledWith(
      2,
      `${baseUrl}/users`,
      expect.anything(),
    );
  });

  test("lets request headers override the client ones", async () => {
    mockFetch.mockResolvedValue({ json: () => ({}) });
    const api = createApi(apiName, baseUrl, {
      fetchFn: mockFetch,
      headers: { "x-header": "client", "content-type": "text/plain" },
    });

    await api.get("users", { headers: { "x-header": "request" } });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          "x-header": "request",
          "content-type": "text/plain",
        }),
      }),
    );
  });
});
