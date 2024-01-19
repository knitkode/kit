import { type AnyQueryParams } from "./location";
export declare function mergeUrlQueryParams<T extends AnyQueryParams>(oldParams?: NonNullable<AnyQueryParams>, newParams?: NonNullable<AnyQueryParams>): T;
export default mergeUrlQueryParams;
