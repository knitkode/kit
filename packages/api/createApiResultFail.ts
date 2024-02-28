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

export let createApiResultFail = <T>(
  data: T = {} as T,
  msg?: string,
  status?: number,
): Api.ResultFail<T> => ({
  fail: true,
  data,
  msg: msg || "",
  status: status || 404,
});

export default createApiResultFail;
