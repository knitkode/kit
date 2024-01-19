import { type AnyClass, type AnyFunction } from "./getType";
export declare function isType<T extends AnyFunction | AnyClass>(payload: any, type: T): payload is T;
export default isType;
