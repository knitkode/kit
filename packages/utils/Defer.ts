/**
 * @category async
 */
export type Deferred<T> = Promise<T> & {
  resolve: PromiseConstructor["resolve"];
  reject: PromiseConstructor["reject"];
  // then: Promise<T>["then"];
  // catch: Promise<T>["catch"]
  // finally: Promise<T>["finally"]
};

/**
 * @category async
 * @see https://stackoverflow.com/a/37673534/1938970
 * @example
 *
 * ```ts
 * const deferred = Defer();
 * deferred.resolve();
 * deferred.then(handleSuccess, handleError);
 * ```
 */
export function Defer<T>() /* : PromiseConstructor */ {
  // @ts-expect-error nevermind
  const self = this || {};
  const p = (self.promise = new Promise<T>((resolve, reject) => {
    self.resolve = resolve;
    self.reject = reject;
  }));
  self.then = p.then.bind(p);
  self.catch = p.catch.bind(p);
  // if (p.finally) {
  //   self.finally = p.finally.bind(p);
  // }
  return self as Deferred<T>;
}

export default Defer;
