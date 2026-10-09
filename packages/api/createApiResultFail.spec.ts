import { createApiResultFail } from "./createApiResultFail";

describe("createApiResultFail", () => {
  it("creates a failed result with the given data, message and status", () => {
    const data = { field: "email" };

    expect(createApiResultFail(data, "Bad request", 400)).toEqual({
      fail: true,
      data,
      msg: "Bad request",
      status: 400,
    });
  });

  it("defaults to empty data and message and to a 404 status", () => {
    expect(createApiResultFail()).toEqual({
      fail: true,
      data: {},
      msg: "",
      status: 404,
    });
  });

  it("defaults the status to 404 when only the message is given", () => {
    expect(createApiResultFail(null, "Not found")).toEqual({
      fail: true,
      data: null,
      msg: "Not found",
      status: 404,
    });
  });
});
