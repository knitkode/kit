import { vitestSetNodeEnv } from "@koine/test/vitest";
import { createApi } from "./createApi";

describe("createApi", () => {
  const apiName = "testApi";
  const baseUrl = "https://api.example.com";
  const mockFetch = vitest.fn();

  beforeEach(() => {
    mockFetch.mockReset();
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

  test("applies request processor if provided", async () => {
    const processReq = vitest.fn(() => ["modified-url", {}, {}, {}, {}]);
    const api = createApi(apiName, baseUrl, {
      fetchFn: mockFetch,
      processReq,
    });
    await api.get("test-endpoint");
    expect(processReq).toHaveBeenCalled();
    expect(mockFetch).toHaveBeenCalledWith("modified-url", expect.any(Object));
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
      processRes,
    });
    const result = await api.get("test-endpoint");
    expect(processRes).toHaveBeenCalled();
    expect(result).toEqual({ ok: true, data: { value: "ok" } });
  });

  test("handles errors with processErr if provided", async () => {
    const errorMessage = "Network error";
    const processErr = vitest.fn(() =>
      Promise.resolve({ ok: false, data: null, fail: true, msg: errorMessage }),
    );
    const api = createApi(apiName, baseUrl, {
      fetchFn: mockFetch,
      processErr,
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

  // test("throws error if throwErr is true and request fails", async () => {
  //   const api = createApi(apiName, baseUrl, {
  //     fetchFn: mockFetch,
  //     throwErr: true,
  //   });
  //   mockFetch.mockRejectedValue(new Error("Test error"));

  //   // await expect(api.get("test-endpoint")).rejects.toThrow();
  //   await expect(api.get("test-endpoint")).rejects.toMatchInlineSnapshot(`{
  //     "data": null,
  //     "fail": true,
  //     "msg": "Test error",
  //     "ok": false,
  //     "status": 100,
  //   }`);
  // });

  describe("development mode", () => {
    vitestSetNodeEnv("development");

    test("logs request and response in development mode", async () => {
      console.info = vitest.fn();
      const api = createApi(apiName, baseUrl, { fetchFn: mockFetch });
      mockFetch.mockResolvedValue({
        json: () => ({ data: "ok" }),
        status: 200,
        statusText: "OK",
      });
      await api.get("test-endpoint");
      expect(console.info).toHaveBeenCalled();
    });
  });
});
