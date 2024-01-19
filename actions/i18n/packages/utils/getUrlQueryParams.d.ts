import { type AnyQueryParams } from "./location";
export declare function getUrlQueryParams<T extends NonNullable<AnyQueryParams>>(url?: string): T;
export default getUrlQueryParams;
