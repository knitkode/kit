import { ApiError } from "./ApiError";
import { createApiResultFail } from "./createApiResultFail";

describe("ApiError", () => {
  it("is an `Error` named `ApiError`", () => {
    const error = new ApiError(createApiResultFail(null, "Not found", 404));

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ApiError);
    expect(error.name).toBe("ApiError");
  });

  it("describes the failed result status and message", () => {
    const error = new ApiError(createApiResultFail(null, "Unauthorized", 401));

    expect(error.message).toBe("Request failed with 401 Unauthorized");
  });

  it("exposes the failed result properties", () => {
    const data = { field: "email", reason: "invalid" };
    const error = new ApiError(createApiResultFail(data, "Bad request", 400));

    expect(error).toMatchObject({
      fail: true,
      data,
      msg: "Bad request",
      status: 400,
    });
  });

  it("can be thrown and caught", () => {
    const throwing = () => {
      throw new ApiError({ fail: true, data: null, msg: "Oops", status: 500 });
    };

    expect(throwing).toThrow(ApiError);
    expect(throwing).toThrow("Request failed with 500 Oops");
  });
});
