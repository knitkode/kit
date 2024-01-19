import { type PlainObject } from "./getType";
export declare function isObjectLike<T extends PlainObject>(payload: any): payload is T;
export default isObjectLike;
