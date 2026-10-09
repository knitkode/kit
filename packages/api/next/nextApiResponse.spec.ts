import { NextResponse } from "next/server";
import { nextApiResponse } from "./nextApiResponse";

describe("nextApiResponse", () => {
  it("`ok` returns a 200 JSON response with an ok result", async () => {
    const data = { id: 1 };

    const response = nextApiResponse.ok(data, "Done");

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("application/json");
    expect(await response.json()).toEqual({
      ok: true,
      fail: false,
      data,
      msg: "Done",
      status: 200,
    });
  });

  it("`ok` defaults the message to an empty string", async () => {
    const response = nextApiResponse.ok([1, 2]);

    expect(await response.json()).toMatchObject({ data: [1, 2], msg: "" });
  });

  it("`fail` returns a JSON response with a failed result", async () => {
    const data = { field: "email" };

    const response = nextApiResponse.fail(data, "Invalid email", 422);

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.headers.get("content-type")).toContain("application/json");
    expect(await response.json()).toEqual({
      fail: true,
      data,
      msg: "Invalid email",
      status: 422,
    });
  });

  it("`fail` defaults the result status to 404", async () => {
    const response = nextApiResponse.fail(null);

    expect(await response.json()).toEqual({
      fail: true,
      data: null,
      msg: "",
      status: 404,
    });
  });
});
