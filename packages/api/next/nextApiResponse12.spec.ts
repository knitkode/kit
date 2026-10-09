import type { NextApiResponse } from "next";
import { nextApiResponse12 } from "./nextApiResponse12";

const createMockResponse = () => {
  const res = {
    status: vi.fn(() => res),
    json: vi.fn(),
  };
  return res;
};

describe("nextApiResponse12", () => {
  it("`ok` responds with a 200 ok result", () => {
    const res = createMockResponse();
    const data = { id: 1 };

    nextApiResponse12(res as unknown as NextApiResponse).ok(data, "Done");

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      ok: true,
      fail: false,
      data,
      msg: "Done",
      status: 200,
    });
  });

  it("`ok` defaults the message to an empty string", () => {
    const res = createMockResponse();

    nextApiResponse12(res as unknown as NextApiResponse).ok([1, 2]);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ data: [1, 2], msg: "" }),
    );
  });

  it("`fail` responds with the given status and a failed result", () => {
    const res = createMockResponse();
    const data = { field: "email" };

    nextApiResponse12(res as unknown as NextApiResponse).fail(
      data,
      "Invalid email",
      422,
    );

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({
      fail: true,
      data,
      msg: "Invalid email",
      status: 422,
    });
  });

  it("`fail` defaults to a 404 status", () => {
    const res = createMockResponse();

    nextApiResponse12(res as unknown as NextApiResponse).fail(null);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      fail: true,
      data: null,
      msg: "",
      status: 404,
    });
  });
});
