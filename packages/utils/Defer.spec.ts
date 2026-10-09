import { Defer, type Deferred } from "./Defer";

// `Defer` declares a `this` parameter, so TypeScript rejects the plain
// `Defer()` call shown in its JSDoc, and `Deferred` does not type `promise`:
// cast once to the documented call signature.
const defer = Defer as unknown as <T>() => Deferred<T> & {
  promise: Promise<T>;
};

describe("Defer", () => {
  it("exposes the underlying promise and its resolvers", () => {
    const deferred = defer<number>();
    expect(deferred.promise).toBeInstanceOf(Promise);
    expect(deferred.resolve).toBeTypeOf("function");
    expect(deferred.reject).toBeTypeOf("function");
    expect(deferred.then).toBeTypeOf("function");
    expect(deferred.catch).toBeTypeOf("function");
  });

  it("resolves from the outside", async () => {
    const deferred = defer<string>();
    deferred.resolve("done");

    await expect(deferred.promise).resolves.toBe("done");
    await expect(deferred).resolves.toBe("done");
  });

  it("calls the then handlers with the resolved value", async () => {
    const deferred = defer<number>();
    const chained = deferred.then((value) => value * 2);
    deferred.resolve(21);

    await expect(chained).resolves.toBe(42);
  });

  it("rejects from the outside", async () => {
    const deferred = defer<unknown>();
    const error = new Error("failed");
    const caught = deferred.catch((reason) => reason);
    deferred.reject(error);

    await expect(caught).resolves.toBe(error);
    await expect(deferred.promise).rejects.toBe(error);
  });

  it("settles only once", async () => {
    const deferred = defer<number>();
    deferred.resolve(1);
    deferred.resolve(2);
    deferred.reject(3);

    await expect(deferred.promise).resolves.toBe(1);
  });

  it("returns independent deferreds", async () => {
    const a = defer<string>();
    const b = defer<string>();
    expect(a).not.toBe(b);

    a.resolve("a");
    b.resolve("b");
    await expect(a.promise).resolves.toBe("a");
    await expect(b.promise).resolves.toBe("b");
  });
});
