import { NextResponse } from "next/server";
import { createApiResultFail } from "../createApiResultFail";
import { createApiResultOk } from "../createApiResultOk";

export let nextApiResponse = {
  ok<T>(data: T, msg?: string) {
    return NextResponse.json(createApiResultOk(data, msg));
  },
  fail<T>(data: T, msg?: string, status?: number) {
    return NextResponse.json(createApiResultFail(data, msg, status));
  },
};

export default nextApiResponse;
