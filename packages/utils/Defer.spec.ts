import { Defer, type Deferred } from "./Defer";

describe("Defer", () => {
  it("supports the documented usage", async () => {
    const handleSuccess = vi.fn();
    const handleError = vi.fn();
    const deferred = Defer();
    deferred.resolve();
    deferred.then(handleSuccess, handleError);

    await deferred.promise;
    expect(handleSuccess).toHaveBeenCalledWith(undefined);
    expect(handleError).not.toHaveBeenCalled();
  });

  it("types the deferred and its promise", () => {
    const deferred = Defer<number>();
    expectTypeOf(deferred).toEqualTypeOf<Deferred<number>>();
    expectTypeOf(deferred.promise).toEqualTypeOf<Promise<number>>();
    expectTypeOf(deferred.resolve)
      .parameter(0)
      .toEqualTypeOf<number | PromiseLike<number>>();
  });

  it("can be called with new", async () => {
    // @ts-expect-error `Defer` is typed as a plain function but supports `new`
    const deferred: Deferred<number> = new Defer<number>();
    deferred.resolve(1);
    await expect(deferred.promise).resolves.toBe(1);
  });

  it("exposes the underlying promise and its resolvers", () => {
    const deferred = Defer<number>();
    expect(deferred.promise).toBeInstanceOf(Promise);
    expect(deferred.resolve).toBeTypeOf("function");
    expect(deferred.reject).toBeTypeOf("function");
    expect(deferred.then).toBeTypeOf("function");
    expect(deferred.catch).toBeTypeOf("function");
  });

  it("resolves from the outside", async () => {
    const deferred = Defer<string>();
    deferred.resolve("done");

    await expect(deferred.promise).resolves.toBe("done");
    await expect(deferred).resolves.toBe("done");
  });

  it("calls the then handlers with the resolved value", async () => {
    const deferred = Defer<number>();
    const chained = deferred.then((value) => value * 2);
    deferred.resolve(21);

    await expect(chained).resolves.toBe(42);
  });

  it("rejects from the outside", async () => {
    const deferred = Defer<unknown>();
    const error = new Error("failed");
    const caught = deferred.catch((reason) => reason);
    deferred.reject(error);

    await expect(caught).resolves.toBe(error);
    await expect(deferred.promise).rejects.toBe(error);
  });

  it("settles only once", async () => {
    const deferred = Defer<number>();
    deferred.resolve(1);
    deferred.resolve(2);
    deferred.reject(3);

    await expect(deferred.promise).resolves.toBe(1);
  });

  it("returns independent deferreds", async () => {
    const a = Defer<string>();
    const b = Defer<string>();
    expect(a).not.toBe(b);

    a.resolve("a");
    b.resolve("b");
    await expect(a.promise).resolves.toBe("a");
    await expect(b.promise).resolves.toBe("b");
  });
});
