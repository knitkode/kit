export type Deferred<T> = Promise<T> & {
    resolve: PromiseConstructor["resolve"];
    reject: PromiseConstructor["reject"];
};
export declare function Defer<T>(): Deferred<T>;
export default Defer;
