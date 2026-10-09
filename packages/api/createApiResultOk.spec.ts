import { createApiResultOk } from "./createApiResultOk";

describe("createApiResultOk", () => {
  it("creates an ok result with the given data and message", () => {
    const data = { id: 1, name: "Ada" };

    expect(createApiResultOk(data, "Created")).toEqual({
      ok: true,
      fail: false,
      data,
      msg: "Created",
      status: 200,
    });
  });

  it("defaults to empty data and message", () => {
    expect(createApiResultOk()).toEqual({
      ok: true,
      fail: false,
      data: {},
      msg: "",
      status: 200,
    });
  });

  it("keeps falsy data as it is", () => {
    expect(createApiResultOk(null).data).toBeNull();
    expect(createApiResultOk(0).data).toBe(0);
    expect(createApiResultOk([]).data).toEqual([]);
  });
});
