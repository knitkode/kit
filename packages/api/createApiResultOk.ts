import type { Api } from "./types";

export let createApiResultOk = <T>(
  data: T = {} as T,
  msg?: string,
): Api.ResultOk<T> => ({
  ok: true,
  fail: false,
  data,
  msg: msg || "",
  status: 200,
});

export default createApiResultOk;
