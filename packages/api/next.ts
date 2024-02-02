import type { NextApiResponse } from "next";
import { NextResponse } from "next/server";
import { createApiResultFail, createApiResultOk } from "./index";

export let nextApiResponse = {
  ok<T>(data: T, msg?: string) {
    return NextResponse.json(createApiResultOk(data, msg));
  },
  fail<T>(data: T, msg?: string, status?: number) {
    return NextResponse.json(createApiResultFail(data, msg, status));
  },
};

export let nextApiResponse12 = (nextRes: NextApiResponse) => ({
  ok<T>(data: T, msg?: string) {
    nextRes.status(200).json(createApiResultOk(data, msg));
  },
  fail<T>(data: T, msg?: string, status?: number) {
    nextRes.status(status || 404).json(createApiResultFail(data, msg, status));
  },
});
